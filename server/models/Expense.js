const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  roomCode: { type: String, required: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryEmoji: { type: String, required: true },
  amount: { type: Number, required: true },
  paidById: { type: String, required: true },
  paidByName: { type: String, required: true },
  date: { type: String, required: true },
  displayDate: { type: String, required: true },
  splits: [splitSchema],
  splitType: { type: String, default: 'equal' }, // 'equal' | 'custom' | 'percentage'
  isSettlement: { type: Boolean, default: false },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);

