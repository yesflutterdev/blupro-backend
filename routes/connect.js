const express = require('express');
const router = express.Router();
const Group = require('../models/group');
const User = require('../models/user');
const mongoose = require("mongoose");

// GET /connect/groups - Fetch all groups
router.get('/group/allGroups', async (req, res) => {

    try {
        const groups = await Group.find()
            .populate('members', 'name email image')
            .select('-posts');  // Exclude posts for performance

        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /connect/groupMembers - Fetch group members
router.get('/group/groupMembers', async (req, res) => {
    try {
        const { groupId } = req.query;
        if (!groupId) {
            return res.status(400).json({ message: 'Group ID is required' });
        }

        const group = await Group.findById(groupId)
            .populate('members', 'name email image')
            .select('members');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json(group.members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /connect/groupPosts - Fetch group posts
router.get('/group/groupPosts', async (req, res) => {
    try {
        const { groupId } = req.query;
        if (!groupId) {
            return res.status(400).json({ message: 'Group ID is required' });
        }

        const group = await Group.findById(groupId)
            .populate('posts.createdBy', 'name email image')
            .populate('posts.likes', 'name email')
            .populate('posts.comments.userId', 'name email image')
            .select('posts');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json(group.posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /connect/groups - Create a new group
router.post('/group/createGroup', async (req, res) => {
    try {
        const { name, about, type, category, createdBy } = req.body;

        const group = new Group({
            name,
            about,
            type,
            category,
            members: [createdBy]  // Add creator as first member
        });

        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /connect/groups/:groupId/join - Join a group
router.post('/group/joinGroups/:groupId/join', async (req, res) => {
    try {
        const { userId } = req.body;
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ message: 'User is already a member' });
        }
        console.log(userId);
        group.members.push(userId);
        await group.save();

        res.json({ message: 'Joined group successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /connect/groups/:groupId/leave - Leave a group
router.post('/group/leaveGroups/:groupId/leave', async (req, res) => {
    try {
        const { userId } = req.body;
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const memberIndex = group.members.indexOf(userId);
        if (memberIndex === -1) {
            return res.status(400).json({ message: 'User is not a member' });
        }

        group.members.splice(memberIndex, 1);
        await group.save();

        res.json({ message: 'Left group successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /connect/groups/:groupId/posts - Create a post in a group
router.post('/group/groupPost/:groupId/createPost', async (req, res) => {
    try {
        const { title, description, media, isVideo, createdBy, autherName, autherImage } = req.body;
        console.log({
            title,
            description,
            media,
            isVideo,
            createdBy,
            autherName,
            autherImage
        });
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.members.includes(createdBy)) {
            return res.status(403).json({ message: 'Only members can post' });
        }

        group.posts.unshift({
            title,
            description,
            autherName,
            autherImage,
            media,
            isVideo,
            createdBy
        });

        await group.save();
        res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /connect/groups/:groupId/posts/:postId/like - Like/unlike a group post
router.post('/group/likeDislikeGroupPost/:groupId/posts/:postId/like', async (req, res) => {
    try {
        // console.log("Inside here");
        const { userId } = req.body;
        // console.log(`Params: groupId=${req.params.groupId}, postId=${req.params.postId}`);
        // console.log(`Body: userId=${userId}`);

        const group = await Group.findById(req.params.groupId);

        if (!group) {
            console.log("Group not found");
            return res.status(404).json({ message: 'Group not found' });
        }

        console.log("Group found:", group);

        const post = group.posts.id(req.params.postId);

        if (!post) {
            console.log(`Post with ID ${req.params.postId} not found in group ${req.params.groupId}`);
            return res.status(404).json({ message: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(userId);
        }

        await group.save();
        res.json({ message: 'Post like updated successfully' });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: error.message });
    }
});

// POST /connect/groups/:groupId/posts/:postId/comment - Comment on a group post
router.post('/group/commentGroupPost/:groupId/posts/:postId/comment', async (req, res) => {
    try {
        const { userId, text, userName, userImage } = req.body;
        const group = await Group.findById(req.params.groupId);
        console.log(req.params.groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const post = group.posts.id(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            userId,
            text,
            userName,
            userImage
        });

        await group.save();
        res.json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/group/users/getUsersByIds', async (req, res) => {
    try {
        const { userIds } = req.body;

        if (!userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ message: 'userIds must be an array' });
        }

        const validUserIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validUserIds.length === 0) {
            return res.status(400).json({ message: 'No valid user IDs provided' });
        }

        const users = await User.find({ _id: { $in: validUserIds } });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router; 