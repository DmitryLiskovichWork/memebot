const globalConstants = require('./global.constants');
const carsConstants = require('./cars.constants');

module.exports = {
    ...globalConstants,
    ...carsConstants
}