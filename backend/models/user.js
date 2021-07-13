const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const postSchema= mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    imagePath : { type: String, required: true }
});

postSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Post", postSchema);