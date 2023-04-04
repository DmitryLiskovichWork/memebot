require('dotenv').config();

const API_KEY = process.env.API_KEY;
const AI_API_KEY = process.env.AI_API_KEY;

const imageResponseTemplate = [
    {
        type: 'photo',
        id: 2,
        photo_url: 'AgACAgIAAxkBAAMiZBBpgOYv0A87Hyp4eljeQcXWFS4AArjDMRtAX4BI9S41va3UAXsBAAMCAAN5AAMvBA',
        thumbnail_url: 'AgACAgIAAxkBAAMiZBBpgOYv0A87Hyp4eljeQcXWFS4AArjDMRtAX4BI9S41va3UAXsBAAMCAAN5AAMvBA',
    }
]

const inlineResponse = [
    {
        type: 'article',
        id: '1',
        title: 'Start saving images',
        message_text: 'Now the chat is using for send image from bot'
    },
];

const startMarkUp = `Welcome to a meme bot. The bot can store your memes or you can aslo see memes from other guys.

You can use next commands:
/show - to show your images or images from other guys
/delete id - you can use the command to delete image buy ID (you can delete only your images)

To add a new image, just load the image in bot and add a caption, the caption you can use to finde you image.

You can use the bot in chat with your friends, just start with bot name and you will see you images.
If you wanna see images from other guys you have to add "global" after name of the bot.
For search just type any text after the bot name.`

module.exports = {
    inlineResponse,
    imageResponseTemplate,
    API_KEY,
    AI_API_KEY,
    startMarkUp
}