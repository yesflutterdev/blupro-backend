const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    media: {
        type: String,
    },
    isVideo: {
        type: Boolean,
        default: false,
    },
    externalLink: {
        type: String,
    },
    isLive: {
        type: Boolean,
        default: false,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    likes: [{
        type: String,
        required: true,
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

module.exports = mongoose.model('Activity', activitySchema); 