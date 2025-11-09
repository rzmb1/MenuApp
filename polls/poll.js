const mongoose = require('mongoose');
const { Schema } = mongoose;
const { dishSchema } =require('../menuplans/menuplan');

const pollSchema = new Schema({
    menuplan: mongoose.ObjectId,
    dishes: [dishSchema],
    //votes: [String],
    open: Boolean,
    endDate: String
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = { Poll };
