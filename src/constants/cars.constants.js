const { Markup } = require('telegraf');

const rootCarsLink = 'https://www.olx.pl/motoryzacja/samochody/';
const dataFromHtmlRegExp = /(?<=window.__PRERENDERED_STATE__=).+\}"/g;

const mainButtons = Markup.inlineKeyboard([
    [
        Markup.button.callback('Select brand', 'select-brand'),
        Markup.button.callback('Select model', 'select-model'),
        Markup.button.callback('Select city', 'select-city'),
    ],
    [
        Markup.button.callback('Search and get new', 'search'),
    ]
]);

module.exports = {
    rootCarsLink,
    dataFromHtmlRegExp,
    mainButtons
}