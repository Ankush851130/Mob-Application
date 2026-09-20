const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

// In-memory fallback stores when MongoDB is offline
const inMemoryUsers = [
  {
    id: 'u1',
    name: 'Ankush',
    email: 'ankush@flatledger.app',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+91 98765 43210',
    room: 'Room 302',
  },
  {
    id: 'u2',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+91 98123 45678',
    room: 'Room 302',
  },
  {
    id: 'u3',
    name: 'Aman Verma',
    email: 'aman@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '+91 97123 45678',
    room: 'Room 302',
  },
  {
    id: 'u4',
    name: 'Priya Patel',
    email: 'priya@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '+91 96123 45678',
    room: 'Room 302',
  },
];

const inMemoryRooms = [
  {
    code: 'FLAT302',
    name: 'Apartment 302 Roommates',
    createdBy: 'u1',
    members: inMemoryUsers,
  },
];

const inMemoryExpenses = [];

// Helper to check DB connection status
const isDbConnected = () => mongoose.connection.readyState === 1;

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
  const { name, email, avatar, pushToken } = req.body;
  const id = `u_${Date.now()}`;
  const newUser = {
    id,
    name: name || 'Roommate',
    email: email || `user_${Date.now()}@flatledger.app`,
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    pushToken,
  };

  if (isDbConnected()) {
    try {
      const dbUser = new User(newUser);
      await dbUser.save();
      return res.status(201).json({ success: true, user: dbUser });
    } catch (err) {
      console.warn('DB Register fallback:', err.message);
    }
  }

  inMemoryUsers.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

router.post('/auth/login', async (req, res) => {
  const { email } = req.body;
  if (isDbConnected()) {
    try {
      let user = await User.findOne({ email });
      if (user) return res.json({ success: true, user });
    } catch (err) {
      console.warn('DB Login fallback:', err.message);
    }
  }

  let found = inMemoryUsers.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!found) {
    found = {
      id: `u_${Date.now()}`,
      name: email ? email.split('@')[0] : 'Roommate',
      email: email || 'user@flatledger.app',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    inMemoryUsers.push(found);
  }
  res.json({ success: true, user: found });
});

// 2. Create a new Flat Room
router.post('/rooms/create', async (req, res) => {
  const { roomName, user } = req.body;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const roomData = {
    code,
    name: roomName || 'My Flat',
    createdBy: user?.id || 'u1',
    members: user ? [user] : inMemoryUsers.slice(0, 1),
  };

  if (isDbConnected()) {
    try {
      const newRoom = new Room(roomData);
      await newRoom.save();
      return res.status(201).json({ success: true, room: newRoom });
    } catch (err) {
      console.warn('DB Room create fallback:', err.message);
    }
  }

  inMemoryRooms.push(roomData);
  res.status(201).json({ success: true, room: roomData });
});

// 3. Join an existing Flat Room using Code
router.post('/rooms/join', async (req, res) => {
  const { code, user } = req.body;
  const cleanCode = (code || 'FLAT302').toUpperCase();

  if (isDbConnected()) {
    try {
      const room = await Room.findOne({ code: cleanCode });
      if (room) {
        if (user) {
          const existingIndex = room.members.findIndex((m) => m.id === user.id);
          if (existingIndex === -1) {
            room.members.push(user);
          } else {
            room.members[existingIndex] = user;
          }
          await room.save();
        }
        const expenses = await Expense.find({ roomCode: room.code }).sort({ createdAt: -1 });
        return res.json({ success: true, room, expenses });
      }
    } catch (err) {
      console.warn('DB Join room fallback:', err.message);
    }
  }

  let room = inMemoryRooms.find((r) => r.code === cleanCode);
  if (!room) {
    room = {
      code: cleanCode,
      name: `Apartment ${cleanCode}`,
      createdBy: user?.id || 'u1',
      members: user ? [user] : inMemoryUsers,
    };
    inMemoryRooms.push(room);
  } else if (user) {
    const idx = room.members.findIndex((m) => m.id === user.id);
    if (idx === -1) room.members.push(user);
    else room.members[idx] = user;
  }

  const expenses = inMemoryExpenses.filter((e) => e.roomCode === cleanCode);
  res.json({ success: true, room, expenses });
});

// 4. Get Room Details & Expenses
router.get('/rooms/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();

  if (isDbConnected()) {
    try {
      const room = await Room.findOne({ code });
      if (room) {
        const expenses = await Expense.find({ roomCode: code }).sort({ createdAt: -1 });
        return res.json({ success: true, room, expenses });
      }
    } catch (err) {
      console.warn('DB Fetch room fallback:', err.message);
    }
  }

  let room = inMemoryRooms.find((r) => r.code === code);
  if (!room) {
    room = {
      code,
      name: `Flat ${code}`,
      createdBy: 'u1',
      members: inMemoryUsers,
    };
    inMemoryRooms.push(room);
  }

  const expenses = inMemoryExpenses.filter((e) => e.roomCode === code);
  res.json({ success: true, room, expenses });
});

// 5. Add Expense & Broadcast Push Notification
router.post('/expenses', async (req, res) => {
  const expenseData = req.body;
  const newExpense = {
    ...expenseData,
    id: expenseData.id || `e_${Date.now()}`,
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const dbExpense = new Expense(newExpense);
      await dbExpense.save();
    } catch (err) {
      console.warn('DB Add expense fallback:', err.message);
    }
  }

  inMemoryExpenses.unshift(newExpense);

  const room = inMemoryRooms.find((r) => r.code === expenseData.roomCode);
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
  if (io && expenseData.roomCode) {
    io.to(expenseData.roomCode).emit('expense:added', newExpense);
  }

  res.status(201).json({ success: true, expense: newExpense });
});

// 6. Delete Expense & Broadcast Event
router.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { roomCode } = req.query;

  if (isDbConnected()) {
    try {
      await Expense.deleteOne({ id });
    } catch (err) {
      console.warn('DB Delete expense fallback:', err.message);
    }
  }

  const idx = inMemoryExpenses.findIndex((e) => e.id === id);
  if (idx !== -1) {
    inMemoryExpenses.splice(idx, 1);
  }

  const io = req.app.get('io');
  if (io && roomCode) {
    io.to(roomCode).emit('expense:deleted', { id });
  }

  res.json({ success: true, message: 'Expense deleted successfully' });
});

// 7. Record Settlement & Broadcast Notification
router.post('/settlements', async (req, res) => {
  const { roomCode, settlementExpense } = req.body;
  const newSettlement = {
    ...settlementExpense,
    id: settlementExpense.id || `settle_${Date.now()}`,
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const dbSettlement = new Expense(newSettlement);
      await dbSettlement.save();
    } catch (err) {
      console.warn('DB Record settlement fallback:', err.message);
    }
  }

  inMemoryExpenses.unshift(newSettlement);

  const io = req.app.get('io');
  if (io && roomCode) {
    io.to(roomCode).emit('expense:added', newSettlement);
  }

  res.status(201).json({ success: true, settlement: newSettlement });
});

module.exports = router;
