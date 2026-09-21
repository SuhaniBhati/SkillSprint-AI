const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required']
    }
}, { timestamps: true }
);

const tokenBlacklistModel = mongoose.model('blacklisttokens', tokenBlacklistSchema);

module.exports = tokenBlacklistModel;