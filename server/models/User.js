const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pushToken: { type: String, default: null },
  roomId: { type: String, default: null },
  rooms: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

