const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    data: {type: Buffer, required: true},
    name: {type: String, required: true},
    mime: {type: String, required: true}
});

module.exports = mongoose.model('Image', ImageSchema);