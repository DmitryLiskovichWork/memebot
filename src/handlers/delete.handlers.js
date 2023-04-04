const { DBInstance } = require('../DB_Logic');

async function handleDelete(ctx) {
    const chatId = ctx.chat.id;
    const commandQuery = ctx.message.text.replace('/delete ', '');

    const isDeleted = await DBInstance.deleteImage({ imageId: commandQuery, userId: chatId });

    if(isDeleted) {
        ctx.reply("The image was deleted, tank you");
    } else {
        ctx.reply("Sorry, the image you try to delete is not found");
    }
}

module.exports = {
    handleDelete
}