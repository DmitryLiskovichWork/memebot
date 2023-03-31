const { API_KEY } = require('../constants');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
};

function filterImagesByText(list, text) {
    return list.filter((item) => item.text.includes(text.toLowerCase().split` `.join``));
};

function generateImageFullUrl(path) {
    return `https://api.telegram.org/file/bot${API_KEY}/${path}`;
}

function generateListArticles(list=[]) {
    return list.map((item, index) => ({
        type: 'photo',
        id: index,
        photo_url: item.url,
        thumbnail_url: item.url,
    }))
}

function generateMediaGroup({
    isMine,
    data,
    ctx,
    markdownToShowImages
}) {
    const deleteMessage =  (image) => `Your image ID is "${image.id}", you can use the ID to delete the image "/delete ${image.id}" to delete \n`;
    const tagsMessage = (image) => `Here some tags to find the image throw the bot: ${image.tags}`;
    const mediaGroup = data.map(image => ({ 
        media: image.url,
        type: 'photo',
        caption: `${isMine ? deleteMessage(image) : ''}${tagsMessage(image)}`
    }));

    if(!mediaGroup.length) {
        ctx.reply("Ops, you don't have any images, you can add your images or check global images", markdownToShowImages);
        return mediaGroup;
    }

    return mediaGroup;
}

Array.prototype.splitByDivider = function(divider = 10) {
    return this.reduce((acc, item, index) => {
        const currentDivider = Math.floor(index/divider);
        if(acc[currentDivider]?.length) {
            acc[currentDivider].push(item);
        } else {
            acc[currentDivider] = [item];
        }
        return acc;
    }, [])
}

module.exports = {
    getRandomIntInclusive,
    filterImagesByText,
    generateListArticles,
    generateImageFullUrl,
    generateMediaGroup,
}