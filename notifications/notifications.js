const mongoose = require('mongoose');
const { Schema } = mongoose;
const notificationSchema = new Schema({
    _idUser: mongoose.ObjectId,
    title: String,
    text: String,
    read: Boolean,
    timeCreated: Date,
    priority: String,
    link: String
});
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = { Image: Notification};

module.exports = { Notification};