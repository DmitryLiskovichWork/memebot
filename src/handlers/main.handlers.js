const { filterImagesByText, generateListArticles, generateImageFullUrl } = require('../helpers');
const { getTagsByImagePath } = require('../AI_Module');
const { startMarkUp } = require('../constants');
const { DBInstance } = require('../DB_Logic');

function handleStart(ctx) {
    ctx.reply(startMarkUp);
}

const handelInlineChange = async (ctx) => {
    const chatId = ctx.inlineQuery.from.id;
    const query = ctx.inlineQuery.query;
    const images = await DBInstance.getImages({id: chatId})
    const globalImages = await DBInstance.getImages({isGlobal: true});

    if(query.startsWith('global')) {
        const newQuery = query.replace('global', '');
        const articles = generateListArticles(newQuery.length ? filterImagesByText(globalImages, newQuery) : globalImages);
        ctx.answerInlineQuery(articles);
        return;
    }

    if(query.startsWith('delete')) {
        const newQuery = query.replace('delete', '');
        const filteredImages = filterImagesByText(images, newQuery)
        const articles = generateListArticles(filteredImages);
        ctx.answerInlineQuery(articles);
        return;
    }

    if(query && images?.length) {
        const filteredImages = filterImagesByText(images, query)
        const articles = generateListArticles(filteredImages);
        ctx.answerInlineQuery(articles);
    } else {
        const articles = generateListArticles(images);
        ctx.answerInlineQuery(articles);
    }
}

const handleChosenInline = (ctx) => {
    const chatId = ctx.chosenInlineResult.from.id;
    // console.log(ctx)
    // botData.id = chatId;
    // botData[chatId] = [];
}

const handleMessage = async (ctx) => {
    const chatId = ctx.message.from.id;
    const text = ctx?.message?.caption;
    const photos = ctx?.message?.photo;

    const myImages = await DBInstance.getImages({id: chatId});

    if(!text) {
        ctx.sendMessage('You should enter caption for image to use the text for searching');
        return;
    }

    if(myImages && myImages.some(item => item.text === text)) {
        ctx.sendMessage('The caption already used for the image, please use another one');
        return;
    }

    if(!photos?.length) {
        ctx.sendMessage('You should attach photo you want to add');
        return;
    }

    const lastPhoto = photos[photos.length - 1];
    const photoUrl = lastPhoto.file_id;
    const lastPhotoId = lastPhoto.file_unique_id;

    const fileInfo = await ctx.telegram.getFile(photoUrl);
    const fullPathToImage = generateImageFullUrl(fileInfo.file_path);
    const tagsStorage = {};

    try {
        const { labels: tags } = await getTagsByImagePath(fullPathToImage);
        const textForSearch = (text.split` `.join`` + tags.join``).toLowerCase();
        const hashTags = tags.map(item => `#${item.replace(' ', '-')}`).join`, `;
        tagsStorage.textForSearch = textForSearch;
        tagsStorage.hashTags = hashTags;
    } catch (e) {
        console.log(e);
        tagsStorage.textForSearch = '';
        tagsStorage.hashTags = '';
    }
    
    const newImageData = { url: photoUrl, text: tagsStorage.textForSearch, tags: tagsStorage.hashTags, id: lastPhotoId };

    DBInstance.addImage({
        id: chatId,
        newImage: newImageData
    });

    ctx.sendMessage('Everything done, your image has been added. By the way, here a list of tags for the image - ' + tagsStorage.hashTags);
}

module.exports = {
    handelInlineChange,
    handleMessage,
    handleChosenInline,
    handleStart
}