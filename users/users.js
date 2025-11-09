const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema({
    oid: { type: 'string', index: { unique: true, partialFilterExpression: {oid: {$type: "string"}}}}, // No duplicates, except for null 
    lastname: String,
    firstname: String,
    email: { type: 'string', unique: true },
    roles:[String]
});
const User = mongoose.model('User', userSchema);
module.exports = {User};