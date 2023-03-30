const globalHelpers = require('./global.helpers');
const carsHelpers = require('./cars.helpers');

module.exports = {
    ...globalHelpers,
    ...carsHelpers
}