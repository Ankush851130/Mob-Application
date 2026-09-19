const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdBy: { type: String, required: true },
  members: [{
    id: String,
    name: String,
    avatar: String,
    pushToken: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
