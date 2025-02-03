const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    tags: {
        type: [String],
    },
    media: {
        type: String,
        required: true,
    },
    isVideo: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: String,
    }],
    comments: [{
        userId: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        userImage: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feed', feedSchema); 