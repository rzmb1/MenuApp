const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({
    poll: {
        type: Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    choices: {
        vorspeise: { type: String, required: false },
        hauptspeise: { type: String, required: false },
        nachspeise: { type: String, required: false }
    }
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = { Vote };