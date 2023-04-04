const { Markup } = require('telegraf');
const { generateMediaGroup } = require('../helpers');
const { DBInstance } = require('../DB_Logic');

const markdownToShowImages = Markup.inlineKeyboard([
    Markup.button.callback('Show all images', 'show-all-images'),
    Markup.button.callback('Show my images', 'show-my-images'),
]);

function handleShowImages(ctx) {
    ctx.reply('Select option to show images and delete if you want', markdownToShowImages)
}

async function handleShowMyImages(ctx) {
    const chatId = ctx.callbackQuery.from.id;
    const images = await DBInstance.getImages({
        id: chatId
    });
    const mediaGroup = generateMediaGroup({ isMine: true, data: images, markdownToShowImages, ctx})

    const splitedGroupe = mediaGroup.splitByDivider(10);
    splitedGroupe.forEach(group => {
        ctx.replyWithMediaGroup(group);
    });
}

async function handleShowAllImages(ctx) {
    const images = await DBInstance.getImages({
        isGlobal: true
    });
    const mediaGroup = generateMediaGroup({isMine: false, data: images, markdownToShowImages, ctx})

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