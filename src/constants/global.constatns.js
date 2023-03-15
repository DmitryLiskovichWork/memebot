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
]

module.exports = {
    inlineResponse,
    imageResponseTemplate,
    API_KEY,
    AI_API_KEY
}