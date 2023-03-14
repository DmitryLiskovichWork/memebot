const { Telegraf } = require('telegraf');
const { handelInlineChange, handleMessage, handleChosenInline } = require('./src');
require('dotenv').config();

const bot = new Telegraf(process.env.API_KEY);
bot.start((ctx) => ctx.reply('Welcome'));
//Handlers
bot.on('inline_query', handelInlineChange);
bot.on('message', handleMessage)
// bot.on('chosen_inline_result', handleChosenInline);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));