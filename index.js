const { BOT } = require('./botconfig');
const {
    handelInlineChange,
    handleMessage,
    handleChosenInline,
    handleShowImages,
    handleShowMyImages,
    handleDelete,
    handleShowAllImages,
    handelCarSubscribe,
    handelCarUnsubscribe,
    handleMainButtons,
    handleStart
} = require('./src');

BOT.start(handleStart);

//Bot commands
BOT.command('delete', handleDelete);
BOT.command('show', handleShowImages);
BOT.command('getcars', handelCarSubscribe);
BOT.command('stopgetcars', handelCarUnsubscribe);
BOT.command('cars', handleMainButtons);

//Bot handlers
BOT.on('inline_query', handelInlineChange);
BOT.on('message', handleMessage)

BOT.action('show-my-images', handleShowMyImages)
BOT.action('show-all-images', handleShowAllImages)
BOT.on('chosen_inline_result', handleChosenInline);

BOT.launch();

process.once('SIGINT', () => BOT.stop('SIGINT'));
process.once('SIGTERM', () => BOT.stop('SIGTERM'));