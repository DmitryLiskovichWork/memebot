const { botData, saveDataToFile } = require('../data');

function handleDelete(ctx) {
    const chatId = ctx.chat.id;
    const commandQuery = ctx.message.text.replace('/delete ', '');

    if(botData[chatId]) {
        const deletedImages = botData[chatId].filter(image => !commandQuery.includes(image.id));
        const deletedGlobalImages = botData.global.filter(image => !commandQuery.includes(image.id));

        if(deletedImages.length === botData[chatId].length) {
            ctx.reply("Sorry, the image you try to delete is not found");
            return;
        }

        botData[chatId] = deletedImages;
        botData.global = deletedGlobalImages;
        saveDataToFile(botData);

        ctx.reply("The image/images was/were deleted, tank you");
    }
}

module.exports = {
    handleDelete
}