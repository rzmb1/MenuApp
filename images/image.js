const mongoose = require('mongoose');
const { Schema } = mongoose;
const imageSchema = new Schema({
    image: mongoose.Mixed
});
const Image = mongoose.model('Image', imageSchema);
module.exports = { Image};