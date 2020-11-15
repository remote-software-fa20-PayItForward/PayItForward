const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    data: {type: Buffer, requred: true}
});

module.exports = mongoose.model('Image', ImageSchema);