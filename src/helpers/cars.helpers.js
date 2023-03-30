const { Markup } = require('telegraf');
const { parse } = require('node-html-parser');
const { rootCarsLink, dataFromHtmlRegExp } = require('../constants');
const axios = require('axios');
const fs = require('fs');

const linkRoot = 'https://www.olx.pl';

const generateButtons = ({
    buttons, handler, div = 6, returnButton, bot
}) => {
    const inlineButtons = buttons.reduce((acc, button, index) => {
        const currentArray = Math.floor(index/div);
        if(acc[currentArray]) {
            acc[currentArray].push(Markup.button.callback(button.value, button.id));
        } else {
            acc[currentArray] = [(Markup.button.callback(button.value, button.id))];
        }
        bot.action(button.id, (ctx) => handler(ctx, button?.args));
        return acc;
    }, []);
    if(returnButton) {
        inlineButtons.push([returnButton]);
    };
    return inlineButtons;
};

const rootApiUrl = 'https://www.olx.pl/api/v1';
const offersUrl = rootApiUrl + '/offers';

const requestUrl = ({ brand, city, model }) =>{
    const params = new URLSearchParams({
        'filter_enum_model%5D%5B0%5D': model,
        category_id: brand,
    });
    
    // const urlFilterModel = model ? `filter_enum_model%5D%5B0%5D=${model}` : '';
    // const brandValue = brand ? `category_id=${brand}` + '/' : '';
    // const cityValue = city ? city + '/' : '';
    return `${offersUrl}?${params.toString()}`
};

const mapFilterData = (data, categories) => data.reduce((acc, brand) => {
    const id = brand.options[0].categories[0];
    if(categories.some(category => category.id === id)) {
        acc[id] = brand.values;
    }
    return acc;
}, {});

async function getCarsLinks(url, cars = []) {
    const html = await axios.get(url).then(res => res.data);
    const dataObject = html.match(dataFromHtmlRegExp)[0];
    const parseObject = JSON.parse(JSON.parse(dataObject));
    fs.writeFileSync(__dirname+'/test.json', JSON.stringify(parseObject, null, 2));
    const parsedHtml = parse(html);
    const links = parsedHtml.querySelectorAll('.css-rc5s2u');
    const linksUrl = links.map(link => transformLink(link));
    const { newLinks, updatedLinksCache } = checkCache(linksUrl, cars);
    return {
        newLinks,
        updatedLinksCache
    };
}

function checkCache(links, currentCars) {
    const newLinks = links.reduce((acc, link) => {
        if(!currentCars?.includes(link)) {
            acc.push(link);
            currentCars?.push(link);
        }
        return acc;
    }, []);

    const updatedLinksCache = currentCars?.filter(link => links.includes(link)) || [];

    return {
        newLinks,
        updatedLinksCache
    }
};

const transformLink = (link) => 
    /http|www/gi.test(link.attributes.href) ? link.attributes.href : linkRoot + link.attributes.href; 

module.exports = {
    generateButtons,
    requestUrl,
    mapFilterData,
    getCarsLinks
}