const fs = require('fs');

const botData = JSON.parse(fs.readFileSync(__dirname + '/storage.json'));

function saveDataToFile(data) {
    fs.writeFile(__dirname + '/storage.json', JSON.stringify(data), () => {})
}

module.exports = {
    botData,
    saveDataToFile
}