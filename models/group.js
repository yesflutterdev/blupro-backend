const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    autherName: {
        type: String,
        required: true,
    },
    autherImage: {
        type: String,
    },
    media: String,
    isVideo: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
       
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
           
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


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    bannerImage: {
        type: String,
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    category: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    posts: [postSchema], 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

groupSchema.virtual('membersCount').get(function() {
    return this.members.length;
});

groupSchema.set('toJSON', { virtuals: true });
groupSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Group', groupSchema);
