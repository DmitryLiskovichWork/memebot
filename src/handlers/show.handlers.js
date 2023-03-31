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
    const mediaGroup = generateMediaGroup({ isMine: true, data: botData[chatId], markdownToShowImages, ctx})

    const splitedGroupe = mediaGroup.splitByDivider(10);
    splitedGroupe.forEach(group => {
        ctx.replyWithMediaGroup(group);
    });
}

function handleShowAllImages(ctx) {
    const mediaGroup = generateMediaGroup({isMine: false, data: botData.global, markdownToShowImages, ctx})

    const splitedGroupe = mediaGroup.splitByDivider(10);
    splitedGroupe.forEach(group => {
        ctx.replyWithMediaGroup(group);
    });
}

module.exports = {
    handleShowImages,
    handleShowMyImages,
    handleShowAllImages
}