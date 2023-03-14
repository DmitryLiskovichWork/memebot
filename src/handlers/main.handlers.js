const { filterImagesByText, generateListArticles, generateImageFullUrl } = require('../helpers');
// const { getTagsByImagePath } = require('../AI_Module');
const Clarifai = require('clarifai');
const fs = require('fs');
require('dotenv').config();

const aiApp = new Clarifai.App({
    apiKey: process.env.AI_API_KEY
});

const cacheBot = JSON.parse(fs.readFileSync(__dirname + '/storage.json'));

const handelInlineChange = (ctx) => {
    const chatId = ctx.inlineQuery.from.id;
    const query = ctx.inlineQuery.query;
    const images = cacheBot[chatId];
    const globalImages = cacheBot.global || [];
    if(query.startsWith('global')) {
        const newQuery = query.replace('global', '');
        const articles = generateListArticles(newQuery.length ? filterImagesByText(globalImages, newQuery) : globalImages);
        ctx.answerInlineQuery(articles);
        return;
    }
    if(query && images?.length) {
        const filteredImages = filterImagesByText(images, query)
        const articles = generateListArticles(filteredImages);
        ctx.answerInlineQuery(articles);
    } else {
        const articles = generateListArticles(images);
        ctx.answerInlineQuery(articles);
    }
}

const handleChosenInline = (ctx) => {
    const chatId = ctx.chosenInlineResult.from.id;
    cacheBot.id = chatId;
    cacheBot[chatId] = [];
}

const handleMessage = async (ctx) => {
    const chatId = ctx.message.from.id;
    const text = ctx?.message?.caption;
    const photos = ctx?.message?.photo;
    if(!text) {
        ctx.sendMessage('You should enter caption for image to use the text for searching');
    }
    if(cacheBot[chatId] && cacheBot[chatId].some(item => item.text === text)) {
        ctx.sendMessage('The caption already used for the image, please use another one', {
            parse_mode: 'HTML',
            disable_notification: true,
            disable_web_page_preview: true,
            reply_to_message_id: ctx.message.message_id,
        });
        return undefined;
    }
    if(photos?.length && text) {
        const lastPhoto = photos[photos.length - 1];
        const photoUrl = lastPhoto.file_id;
        const fileInfo = await ctx.telegram.getFile(photoUrl);
        const fullPath = generateImageFullUrl(fileInfo.file_path);
        const aiPredict = await aiApp.models.predict(Clarifai.GENERAL_MODEL, fullPath)
        // const test = await getTagsByImagePath(fullPath);
        // console.log(test);
        const tags = aiPredict.outputs[0].data.concepts.map(concept => concept.name);
        const textWithTags = (text.split` `.join`` + tags.join``).toLowerCase();
        cacheBot[chatId] = [...(cacheBot[chatId] || []), { url: photoUrl, text: textWithTags }]
        cacheBot.global = [...(cacheBot[chatId] || []), { url: photoUrl, text: textWithTags }];
        fs.writeFile(__dirname + '/storage.json', JSON.stringify(cacheBot), () => {})
        ctx.sendMessage('Everything done, your image has been added. By the way, here a list of tags for the image - ' 
            + tags.map(item => `#${item.replace(' ', '-')}`).join`, `);
    }
}

module.exports = {
    handelInlineChange,
    handleMessage,
    handleChosenInline
}