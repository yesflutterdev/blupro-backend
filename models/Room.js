const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    participants: [{  type: String, required: true }],
    lastMessage: { type: String, default: "" },
    lastMessageTime: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
