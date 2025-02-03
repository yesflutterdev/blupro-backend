const express = require('express');
const router = express.Router();
const Activity = require('../models/activity');
const auth = require('../middleware/auth');

// GET /activity - Fetch all activities
router.get('/activity', async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ startTime: 1 })
            .populate('author', 'name image')
            .populate('likes', 'name email')
            .populate('comments.userId', 'name email image');
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /activity/:id - Fetch single activity
router.get('/activities/:id', auth, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
            .populate('likes', 'name email')
            .populate('comments.userId', 'name email image');
        
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /activity/likeDislike - Like or dislike an activity
router.post('/likeDislikeActivity', async (req, res) => {
    try {
        const { id, activityId } = req.body;
        if (!id || !activityId) {
            return res.status(400).json({ message: 'User ID and Activity ID are required' });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        const likeIndex = activity.likes.indexOf(id);
        if (likeIndex > -1) {
            // User has already liked the activity, so unlike it
            activity.likes.splice(likeIndex, 1);
        } else {
            // User hasn't liked the activity, so add like
            activity.likes.push(id);
        }

        await activity.save();
        res.json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /activity/comments/:activityId - Get comments for an activity
router.get('/comments/:activityId', auth, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.activityId)
            .populate('comments.userId', 'name email image');
        
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.json(activity.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /activity/addComment - Add a comment to an activity
router.post('/addCommentActivity', async (req, res) => {
    try {
        const { id, activityId, text, userName, userImage } = req.body;
        if (!id || !activityId || !text || !userName) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        activity.comments.push({
            userId: id,
            text,
            userName,
            userImage
        });

        await activity.save();
        res.json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 