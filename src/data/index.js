const fs = require('fs');

const botData = JSON.parse(fs.readFileSync(__dirname + '/storage.json'));

function saveDataToFile(data) {
    fs.writeFile(__dirname + '/storage.json', JSON.stringify(data), () => {})
}

const carsData = JSON.parse(fs.readFileSync(__dirname + '/cars.json'));

function saveCarsToFile(data) {
    fs.writeFile(__dirname + '/cars.json', JSON.stringify(data), () => {})
}

const userInfoData = JSON.parse(fs.readFileSync(__dirname + '/usersInfo.json'));

function saveUserInfo(data) {
    fs.writeFile(__dirname + '/usersInfo.json', JSON.stringify(data, null, 2), () => {})
}

const carsInfoData = JSON.parse(fs.readFileSync(__dirname + '/carsInfo.json'));

function saveCarsInfo(data) {
    fs.writeFile(__dirname + '/carsInfo.json', JSON.stringify(data, null, 2), () => {})
}

const citiesData = JSON.parse(fs.readFileSync(__dirname + '/cities.json'));

function saveCitiesInfo(data) {
    fs.writeFile(__dirname + '/cities.json', JSON.stringify(data, null, 2), () => {})
}

module.exports = {
    botData,
    saveDataToFile,
    carsData,
    saveCarsToFile,
    userInfoData,
    saveUserInfo,
    carsInfoData,
    saveCarsInfo,
    citiesData,
    saveCitiesInfo
}