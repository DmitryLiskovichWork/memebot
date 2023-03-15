const { Telegraf } = require('telegraf');
const { API_KEY } = require('./src/constants');

const BOT = new Telegraf(API_KEY);

module.exports = { BOT }