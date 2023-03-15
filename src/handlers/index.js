const mainHandlers = require('./main.handlers');
const startHandlers = require('./show.handlers');
const handleDelete = require('./delete.handlers');

module.exports = {
    ...mainHandlers,
    ...startHandlers,
    ...handleDelete
}