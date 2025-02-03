const express = require('express');
const router = express.Router();
const Feed = require('../models/feed');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get all feed posts
 *     tags: [Feed]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of feed posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/feed',  async (req, res) => {
    console.log('Inside /feed route');
    try {
        const feeds = await Feed.find()
            .sort({ createdAt: -1 })
            .populate('author', 'name image')
            .populate('likes', 'name email')
            .populate('comments.userId', 'name email image');
        res.json(feeds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /feed/likeDislike:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Feed]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - postId
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               postId:
 *                 type: string
 *                 description: Post ID
 *     responses:
 *       200:
 *         description: Like/unlike successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post('/likeDislikeFeed', async (req, res) => {
    try {
        const { id, postId } = req.body;
        if (!id || !postId) {
            return res.status(400).json({ message: 'User ID and Post ID are required' });
        }

        const post = await Feed.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(id);
        if (likeIndex > -1) {
            // User has already liked the post, so unlike it
            post.likes.splice(likeIndex, 1);
        } else {
            // User hasn't liked the post, so add like
            post.likes.push(id);
        }

        await post.save();
        res.json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /feed/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Feed]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     $ref: '#/components/schemas/User'
 *                   text:
 *                     type: string
 *                   userName:
 *                     type: string
 *                   userImage:
 *                     type: string
 *       400:
 *         description: Post ID is required
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get('/comments', async (req, res) => {
    try {
        const { postId } = req.query;
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        const post = await Feed.findById(postId)
            .populate('comments.userId', 'name email image');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /feed/addComment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Feed]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - postId
 *               - text
 *               - userName
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               postId:
 *                 type: string
 *                 description: Post ID
 *               text:
 *                 type: string
 *                 description: Comment text
 *               userName:
 *                 type: string
 *                 description: Name of the commenter
 *               userImage:
 *                 type: string
 *                 description: Profile image of the commenter
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         description: Required fields missing
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post('/addComment', async (req, res) => {
    try {
        const { id, postId, text, userName, userImage } = req.body;
        if (!id || !postId || !text || !userName) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const post = await Feed.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            userId: id,
            text,
            userName,
            userImage
        });

        await post.save();
        res.json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 