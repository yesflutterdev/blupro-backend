const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true, },
  sender: { type: String, required: true }, 
  text: { type: String }, 
  mediaUrl: { type: String },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
