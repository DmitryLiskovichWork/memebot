const handlers = require('./handlers');
const carsHandlers = require('./carsLogic');

module.exports = {
    ...handlers,
    ...carsHandlers
}