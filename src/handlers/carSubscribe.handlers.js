const axios = require('axios');
const { parse } = require('node-html-parser');
const { carsData, saveCarsToFile } = require('../data');

let linksCache = carsData;
let requestTimer;

const linkRoot = 'https://www.olx.pl';
const requestUrl = 'https://www.olx.pl/motoryzacja/samochody/peugeot/warszawa/?search%5Bdist%5D=15&search%5Bfilter_enum_model%5D%5B0%5D=307-cc';

async function getPeugeots() {
    const html = await axios.get(requestUrl).then(res => res.data);
    const parsedHtml = parse(html);
    const links = parsedHtml.querySelectorAll('.css-rc5s2u');
    const linksUrl = links.map(link => transformLink(link));
    const { newLinks, updatedLinksCache } = checkCache(linksUrl);
    linksCache = updatedLinksCache;
    saveCarsToFile(updatedLinksCache);
    return newLinks;
}

const transformLink = (link) => 
    /http|www/gi.test(link.attributes.href) ? link.attributes.href : linkRoot + link.attributes.href; 

function checkCache(links) {
    const newLinks = links.reduce((acc, link) => {
        if(!linksCache.includes(link)) {
            acc.push(link);
            linksCache.push(link);
        }
        return acc;
    }, []);

    const updatedLinksCache = linksCache.filter(link => links.includes(link));

    return {
        newLinks,
        updatedLinksCache
    }
};

async function getCarLinks(ctx) {
    const newLinks = await getPeugeots();
    if(newLinks.length) {
        ctx.reply(`I found for you ${newLinks.length} cars`);
        newLinks.forEach(link => ctx.reply(link));
    }
}

function handelCarSubscribe(ctx) {
    ctx.reply(`Now I'm checnking if there are any new cars by your parameters`);
    getCarLinks(ctx);
    requestTimer = setInterval(() => getCarLinks(ctx), 300000);
} 

async function handelCarUnsubscribe(ctx) {
    if(requestTimer) {
        clearInterval(requestTimer);
        requestTimer = undefined;
        ctx.reply(`I stop watching for your cars. Thank you.`)
    } else {
        ctx.reply(`You didn't start watching`);
    }
} 

module.exports = {
    handelCarSubscribe,
    handelCarUnsubscribe
}