const { filterImagesByText, generateListArticles } = require('../helpers');
const { inlineResponse } = require('../constants');
const fs = require('fs');

const cacheBot = JSON.parse(fs.readFileSync(__dirname + '/storage.json'));

const handelInlineChange = (ctx) => {
    const chatId = ctx.inlineQuery.from.id;
    const query = ctx.inlineQuery.query;
    const images = cacheBot[chatId];
    const globalImages = cacheBot.global || [];
    console.log(globalImages)
    if(query.startsWith('global')) {
        const newQuery = query.replace('global', '');
        const articles = generateListArticles(newQuery.length ? filterImagesByText(globalImages, newQuery) : globalImages);
        ctx.answerInlineQuery(articles, { cache_time: 0 });
        return;
    }

    if(query && images?.length) {
        const filteredImages = filterImagesByText(images, query)
        const articles = generateListArticles(filteredImages);
        ctx.answerInlineQuery(articles, { cache_time: 0 });
    } else {
        const articles = generateListArticles(images);
        ctx.answerInlineQuery(articles, { cache_time: 0 });
    }
}

const handleChosenInline = (ctx) => {
    const chatId = ctx.chosenInlineResult.from.id;
    cacheBot.id = chatId;
    cacheBot[chatId] = [];
}

const handleMessage = (ctx) => {
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
        cacheBot[chatId] = [...(cacheBot[chatId] || []), { url: photoUrl, text }]
        cacheBot.global = [...(cacheBot[chatId] || []), { url: photoUrl, text }];
        fs.writeFile(__dirname + '/storage.json', JSON.stringify(cacheBot), () => {})
    }
    console.log(cacheBot);
}

module.exports = {
    handelInlineChange,
    handleMessage,
    handleChosenInline
}