const mainHandlers = require('./main.handlers');
const startHandlers = require('./show.handlers');
const handleDelete = require('./delete.handlers');
const carSubscribe = require('./carSubscribe.handlers');

module.exports = {
    ...mainHandlers,
    ...startHandlers,
    ...handleDelete,
    ...carSubscribe
}