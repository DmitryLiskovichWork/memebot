const axios = require('axios');
const { Markup } = require('telegraf');
const { BOT } = require('../../botconfig');
const { generateButtons, requestUrl, mapFilterData, getCarsLinks } = require('../helpers');
const { rootCarsLink, dataFromHtmlRegExp, mainButtons } = require('../constants');
const { carsInfoData, saveCarsInfo, userInfoData, saveUserInfo, citiesData  } = require('../data');

const userInfo = userInfoData;

const carsInfo = carsInfoData;
carsInfo.citiesList = citiesData;
carsInfo.regionList = citiesData.regions;

const userInfoTemplate = {
    brand: null,
    model: null,
    city: null,
    modelSearch: null,
    cars: {}
}

const returnToMainButton = Markup.button.callback('Return back to main', 'return-back');

BOT.action('select-brand', handleCarsBrand);
BOT.action('select-model', handleCarModel);
BOT.action('select-city', handleRegion);
BOT.action('search', handleFindCars);
BOT.action('return-back', handelGoToMain);
BOT.action('skipp-city-select', skippCity);

async function handleMainButtons(ctx) {
    const userId = ctx.message.from.id;
    if(!userInfo[userId]) {
        userInfo[userId] = { ...userInfoTemplate };
    }
    await getCarsData(userId);
    handelGoToMain(ctx);
}

function handelGoToMain(ctx) {
    ctx.reply('Hi, set settings for search (better to start with car brand)', mainButtons)
}

async function getCarsData() {
    const carsHtml = await axios.get(rootCarsLink).then(res => res.data);
    const dataObject = carsHtml.match(dataFromHtmlRegExp)[0];
    const parseObject = JSON.parse(JSON.parse(dataObject));
    const fullBrandsList = parseObject?.categories?.list;
    const carsCategories = fullBrandsList['84']?.children.map(id => fullBrandsList[id]);
    const filters = parseObject?.listing?.filters?.data;
    const carModels = mapFilterData(filters.filter_enum_model, carsCategories);

    carsInfo.brandsList = carsCategories;
    carsInfo.modelsList = carModels;
    // saveCarsInfo(carsInfo);
}

async function handleCarsBrand(ctx) {
    const parsedModels = carsInfo.brandsList.map(category => ({ value: category.name, id: category.id.toString() }));
    const buttons = generateButtons({
        buttons: parsedModels,
        handler: handleSelectCarBrand,
        div: 4,
        returnButton: returnToMainButton,
        bot: BOT,
    });
    ctx.reply("Please, select car brand", Markup.inlineKeyboard(buttons));
}

async function handleCarModel(ctx) {
    const userId = ctx.callbackQuery.from.id;
    const searchObj = userInfo[userId];
    if(searchObj.brand?.id) {
        const currentBrand = carsInfo.modelsList[searchObj.brand.id];
        const parsedModels = currentBrand.map(category => ({ value: category.label, id: category.label, args: category.value }));
        const buttons = generateButtons({
            buttons: parsedModels,
            handler: handleSelectModel,
            div: 4,
            returnButton: returnToMainButton,
            bot: BOT,
        });
        ctx.reply("Please, select car model", Markup.inlineKeyboard(buttons));
    } else {
        ctx.reply(`Please, select car brand first`, mainButtons);
    }
}

async function handleRegion(ctx) {
    const parsedRegions = carsInfo.regionList.map(category => ({ value: category, id: category }));
    const buttons = generateButtons({
        buttons: parsedRegions,
        handler: handleSelectRegion,
        div: 4,
        returnButton: returnToMainButton,
        bot: BOT,
    });
    ctx.reply("Please, select region", Markup.inlineKeyboard(buttons));
}

async function handleSelectCarBrand(ctx) {
    const uesrId = ctx.callbackQuery.from.id;
    const searchObj = userInfo[uesrId];
    const brandId = ctx.callbackQuery.data;
    const brand = carsInfo.brandsList.find(brand => brand.id === +brandId);
    searchObj.brand = brand;
    searchObj.model = null;
    searchObj.modelSearch = null;
    ctx.reply(`Cool, You have selected ${brand.name} car brand, lets proceed or go back to search`);
    handleCarModel(ctx);
    // saveUserInfo(userInfo);
}

async function handleSelectModel(ctx, modelval) {
    const userId = ctx.callbackQuery.from.id;
    const searchObj = userInfo[userId];
    const model = ctx.callbackQuery.data;
    searchObj.model = model;
    searchObj.modelSearch = modelval;
    ctx.reply(`Cool, You have selected ${model} model, lets proceed or go back to search`);
    handleRegion(ctx);
    // saveUserInfo(userInfo);
}

async function handleSelectRegion(ctx) {
    const userId = ctx.callbackQuery.from.id;
    const searchObj = userInfo[userId];
    const region = ctx.callbackQuery.data;
    searchObj.city = region;
    const citiesList = carsInfo.citiesList[region];
    const parsedCities = citiesList.map(category => ({ value: category.city, id: category.city }));
    const buttons = generateButtons({
        buttons: parsedCities,
        handler: handleSelectCity,
        div: 4,
        returnButton: returnToMainButton,
        bot: BOT,
    });
    ctx.reply("Please, select city or press skipp to use region only", Markup.inlineKeyboard([...buttons, [
        Markup.button.callback('Skipp city select', 'skipp-city-select'),
    ]]));
};

function skippCity(ctx) {
    const userId = ctx.callbackQuery.from.id;
    const currentUserInfo = userInfo[userId];
    ctx.reply(`Cool, You have selected ${currentUserInfo.region} region, lets proceed or start search`, mainButtons);
    // saveUserInfo(userInfo);
}

async function handleSelectCity(ctx) {
    const userId = ctx.callbackQuery.from.id;
    const searchObj = userInfo[userId];
    const city = ctx.callbackQuery.data;
    searchObj.city = city;
    ctx.reply(`Cool, You have selected ${city} city, lets proceed or start search`, mainButtons);
    // saveUserInfo(userInfo);
}

async function getCarLinks(ctx, url, userId, timerId) {
    const cars = userInfo[userId]?.cars[timerId];
    const {newLinks, updatedLinksCache} = await getCarsLinks(url, cars);
    const currentUserInfo = userInfo[userId];
    if(timerId && currentUserInfo) {
        currentUserInfo.cars[timerId] = updatedLinksCache;
        saveUserInfo(currentUserInfo);
    }
    if(newLinks.length) {
        ctx.reply(`I found for you ${newLinks.length} cars`);
        // newLinks.forEach(link => ctx.reply(link));
    }
}

async function handleFindCars(ctx) {
    const userId = ctx.callbackQuery.from.id;
    const currentUserInfo = userInfo[userId];
    const url = requestUrl({
        brand: currentUserInfo?.brand?.normalizedName || '',
        city: currentUserInfo?.city ? currentUserInfo.city.toLowerCase().split` `.join`-` : '',
        model: currentUserInfo?.modelSearch || ''
    })
    const searchTitile = currentUserInfo?.brand ? `${currentUserInfo.brand.name} ${currentUserInfo.model || ''}` : 'all';
    ctx.reply(`Now I'm looking for new ${searchTitile} cars for you`);
    requestTimer = setInterval(() => getCarLinks(ctx, url, userId, requestTimer), 30000);
    getCarLinks(ctx, url, userId, requestTimer);
}

module.exports = {
    handleMainButtons
}
