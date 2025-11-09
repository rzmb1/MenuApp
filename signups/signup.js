const mongoose = require('mongoose');
const { Schema } = mongoose;
const signupSchema = new Schema({
    _idUser: mongoose.ObjectId,
    day: String,
    dish: {
      _id:mongoose.ObjectId,
      image: mongoose.ObjectId,
      name: String,
      tags:[String]
    },
    rating: Number,
    comment: String
},{timestamps: true});
const Signup = mongoose.model('Signup', signupSchema);

module.exports = { Signup};