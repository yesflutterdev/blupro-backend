const express = require("express");
const Room = require("../models/Room");
const Message = require("../models/Message");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *     Message:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *         sender:
 *           type: string
 *         text:
 *           type: string
 */

/**
 * @swagger
 * /chat/room:
 *   post:
 *     summary: Create or get a chat room for two users
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user1
 *               - user2
 *             properties:
 *               user1:
 *                 type: string
 *               user2:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room details
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /chat/message:
 *   post:
 *     summary: Send a message in a chat room
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - sender
 *               - text
 *             properties:
 *               roomId:
 *                 type: string
 *               sender:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /chat/messages/{roomId}:
 *   get:
 *     summary: Get all messages in a room
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /chat/rooms/{userId}:
 *   get:
 *     summary: Get all rooms for a user
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of rooms
 *       500:
 *         description: Server error
 */

// room for two users
router.post("/chat/room", async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    
    let room = await Room.findOne({ participants: { $all: [user1, user2] } });
    if (!room) {
      room = new Room({ participants: [user1, user2] });
      await room.save();
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

router.get("/chat/messages/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 }); 
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});


router.get("/chat/rooms/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const rooms = await Room.find({ participants: userId });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

router.post("/chat/message", async (req, res) => {
  const { roomId, sender, text, mediaUrl } = req.body;

  try {

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const message = new Message({ roomId, sender, text, mediaUrl });
    await message.save();

    room.lastMessage = text;
    room.lastMessageTime = message.createdAt;
    await room.save();

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});


module.exports = router;
