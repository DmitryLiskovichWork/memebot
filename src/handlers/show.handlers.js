const { Markup } = require('telegraf');
const { botData } = require('../data');
const { generateMediaGroup } = require('../helpers');

const markdownToShowImages = Markup.inlineKeyboard([
    Markup.button.callback('Show all images', 'show-all-images'),
    Markup.button.callback('Show my images', 'show-my-images'),
]);

function handleShowImages(ctx) {
    ctx.reply('Select option to show images and delete if you want', markdownToShowImages)
}

function handleShowMyImages(ctx) {
    const chatId = ctx.callbackQuery.from.id;
    const mediaGroup = generateMediaGroup({chatId, isMine: true, botData, markdownToShowImages, ctx})

    mediaGroup.splice(10);
    ctx.replyWithMediaGroup(mediaGroup, markdownToShowImages);
}

function handleShowAllImages(ctx) {
    const chatId = ctx.callbackQuery.from.id;
    const mediaGroup = generateMediaGroup({chatId, isMine: false, botData, markdownToShowImages, ctx})

    mediaGroup.splice(10);
    ctx.replyWithMediaGroup(mediaGroup, markdownToShowImages);
}

module.exports = {
    handleShowImages,
    handleShowMyImages,
    handleShowAllImages
}