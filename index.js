const { Telegraf } = require('telegraf');

console.log(process.env.API_KEY)

const bot = new Telegraf(process.env.API_KEY);
bot.start((ctx) => ctx.reply('Welcome'));
bot.on('message', (ctx) => {
    console.log(ctx);
})
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));