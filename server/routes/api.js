const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

// Helper to send Expo push notifications to roommates
async function sendPushNotification(pushTokens, title, body, data = {}) {
  const messages = [];
  for (let token of pushTokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.warn(`Push token ${token} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: token,
      sound: 'default',
      title,
      body,
      data,
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error('Error sending push notifications chunk:', error);
    }
  }
}

// 1. User Register & Login
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, avatar, pushToken } = req.body;
    const id = `u_${Date.now()}`;
    const newUser = new User({
      id,
      name,
      email,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      pushToken,
    });
    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Create a new Flat Room
router.post('/rooms/create', async (req, res) => {
  try {
    const { roomName, user } = req.body;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newRoom = new Room({
      code,
      name: roomName || 'My Flat',
      createdBy: user.id,
      members: [user],
    });

    await newRoom.save();
    res.status(201).json({ success: true, room: newRoom });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Join an existing Flat Room using Code
router.post('/rooms/join', async (req, res) => {
  try {
    const { code, user } = req.body;
    const room = await Room.findOne({ code: code.toUpperCase() });

    if (!room) {
      return res.status(404).json({ success: false, error: 'Flat Room Code not found!' });
    }

    const existingIndex = room.members.findIndex((m) => m.id === user.id);
    if (existingIndex === -1) {
      room.members.push(user);
    } else {
      room.members[existingIndex] = user;
    }

    await room.save();
    const expenses = await Expense.find({ roomCode: room.code }).sort({ createdAt: -1 });

    res.json({ success: true, room, expenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get Room Details & Expenses
router.get('/rooms/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const room = await Room.findOne({ code });
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    const expenses = await Expense.find({ roomCode: code }).sort({ createdAt: -1 });
    res.json({ success: true, room, expenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Add Expense & Broadcast Push Notification
router.post('/expenses', async (req, res) => {
  try {
    const expenseData = req.body;
    const newExpense = new Expense(expenseData);
    await newExpense.save();

    const room = await Room.findOne({ code: expenseData.roomCode });
    if (room) {
      const otherRoommates = room.members.filter((m) => m.id !== expenseData.paidById);
      const pushTokens = otherRoommates.map((m) => m.pushToken).filter(Boolean);

      if (pushTokens.length > 0) {
        sendPushNotification(
          pushTokens,
          `💸 New Expense: ${expenseData.title}`,
          `${expenseData.paidByName} added ₹${expenseData.amount} for ${expenseData.title}`,
          { expenseId: newExpense.id, type: 'EXPENSE_ADDED' }
        );
      }
    }

    const io = req.app.get('io');
    if (io) {
      io.to(expenseData.roomCode).emit('expense:added', newExpense);
    }

    res.status(201).json({ success: true, expense: newExpense });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Delete Expense & Broadcast Event
router.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { roomCode } = req.query;

    await Expense.deleteOne({ id });

    const io = req.app.get('io');
    if (io && roomCode) {
      io.to(roomCode).emit('expense:deleted', { id });
    }

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Record Settlement & Broadcast Notification
router.post('/settlements', async (req, res) => {
  try {
    const { roomCode, settlementExpense } = req.body;
    const newSettlement = new Expense(settlementExpense);
    await newSettlement.save();

    const room = await Room.findOne({ code: roomCode });
    if (room) {
      const otherRoommates = room.members.filter((m) => m.id !== settlementExpense.paidById);
      const pushTokens = otherRoommates.map((m) => m.pushToken).filter(Boolean);

      if (pushTokens.length > 0) {
        sendPushNotification(
          pushTokens,
          `✅ Settlement Recorded`,
          `${settlementExpense.paidByName} settled ₹${settlementExpense.amount}`,
          { type: 'SETTLEMENT_RECORDED' }
        );
      }
    }

    const io = req.app.get('io');
    if (io) {
      io.to(roomCode).emit('expense:added', newSettlement);
    }

    res.status(201).json({ success: true, settlement: newSettlement });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
