const { imageResponseTemplate } = require('../constants');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
};

function filterImagesByText(list, text) {
    return list.filter((item) => item.text.includes(text));
};

function generateListArticles(list) {
    return list.map((item, index) => ({
        type: 'photo',
        id: index,
        photo_url: item.url,
        thumbnail_url: item.url,
    }))
}

module.exports = {
    getRandomIntInclusive,
    filterImagesByText,
    generateListArticles
}