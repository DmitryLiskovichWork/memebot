const { Schema } = require('mongoose');

const UserImageSchema = new Schema({
    url: String,
    text: String,
    tags: String,
    id: String
})

module.exports = {
    UserImageSchema
}