const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  roomCode: { type: String, required: true, index: true },
  type: { type: String, required: true }, // 'EXPENSE_ADDED', 'SETTLEMENT', 'MEMBER_JOINED', 'SYSTEM'
  title: { type: String, required: true },
  body: { type: String, required: true },
  actorId: { type: String },
  actorName: { type: String },
  categoryEmoji: { type: String, default: '🔔' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
