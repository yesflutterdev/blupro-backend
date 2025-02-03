const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const authRouter = require('./routes/auth');
const feedRouter = require('./routes/feed');
const activityRouter = require('./routes/activity');
const connectRouter = require('./routes/connect');
const chatRouter = require('./routes/chat');
const swaggerUi = require('swagger-ui-express');


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Be more specific in production
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(chatRouter);
app.use(feedRouter);
app.use(activityRouter);
app.use(connectRouter);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const DB = "mongodb+srv://noone:Noone410.@cluster0.ygc0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set('strictQuery', false);

mongoose.connect(DB).then(() => {
  console.log("Connection Successful to DB");
}).catch((e) => {
  console.log(e);
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("send-message", async ({ roomId, sender, text, mediaUrl }) => {
    try {
      const Message = require("./models/Message");
      const Room = require("./models/Room");
  
      const newMessage = new Message({ roomId, sender, text, mediaUrl });
      await newMessage.save();
      console.log("------"+ newMessage)
  
      await Room.findByIdAndUpdate(roomId, {
        lastMessage: text,
        lastMessageTime: newMessage.createdAt,
      });
  
      io.to(roomId).emit("receive-message", newMessage);
    } catch (error) {
      console.error("Error handling send-message event:", error.message);
    }
  });  

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Change app.listen to httpServer.listen
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
