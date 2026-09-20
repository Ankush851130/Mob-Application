const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

// In-memory fallback stores when MongoDB is offline (Starts CLEAN without hardcoded rooms/users)
const inMemoryUsers = [];
const inMemoryRooms = [];
const inMemoryExpenses = [];
const inMemoryNotifications = [];

// Helper to check DB connection status
const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to generate unique 6-character room key (e.g. AB12CD)
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper to send Expo push notifications to roommates
async function sendPushNotification(pushTokens, title, body, data = {}) {
  const messages = [];
  for (let token of pushTokens) {
    if (!Expo.isExpoPushToken(token)) {
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

// Helper to create & broadcast a room activity notification
async function createRoomNotification(app, { roomCode, type, title, body, actorId, actorName, categoryEmoji }) {
  const notif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    roomCode: roomCode.toUpperCase(),
    type,
    title,
    body,
    actorId,
    actorName,
    categoryEmoji: categoryEmoji || '🔔',
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const dbNotif = new Notification(notif);
      await dbNotif.save();
    } catch (e) {
      console.warn('DB notification save fallback:', e.message);
    }
  }
  inMemoryNotifications.unshift(notif);

  const io = app.get('io');
  if (io && roomCode) {
    io.to(roomCode.toUpperCase()).emit('notification:added', notif);
  }

  return notif;
}

// 1. User Register
router.post('/auth/register', async (req, res) => {
  const { name, email, avatar, pushToken } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if user already exists
  if (isDbConnected()) {
    try {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this email already exists. Please log in.' });
      }
    } catch (e) {
      console.warn('DB check existing user error:', e.message);
    }
  } else {
    const existingMemory = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingMemory) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists. Please log in.' });
    }
  }

  const id = `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newUser = {
    id,
    name: name ? name.trim() : 'Roommate',
    email: cleanEmail,
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    pushToken: pushToken || null,
    roomId: null,
    rooms: [],
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

// 2. User Login
router.post('/auth/login', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (isDbConnected()) {
    try {
      let user = await User.findOne({ email: cleanEmail });
      if (user) {
        return res.json({ success: true, user });
      } else {
        return res.status(404).json({ success: false, error: 'No account found with this email. Please create an account.' });
      }
    } catch (err) {
      console.warn('DB Login fallback:', err.message);
    }
  }

  let found = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (found) {
    return res.json({ success: true, user: found });
  }

  return res.status(404).json({ success: false, error: 'No account found with this email. Please create an account.' });
});

// 3. Create a new Flat Room
router.post('/rooms/create', async (req, res) => {
  const { roomName, user } = req.body;

  if (!user || !user.id) {
    return res.status(401).json({ success: false, error: 'User must be logged in to create a room.' });
  }

  let code = generateRoomCode();

  // Ensure code is unique
  if (isDbConnected()) {
    try {
      let attempts = 0;
      while (await Room.findOne({ code }) && attempts < 10) {
        code = generateRoomCode();
        attempts++;
      }
    } catch (e) {
      console.warn('Room code check warning:', e.message);
    }
  } else {
    while (inMemoryRooms.some((r) => r.code === code)) {
      code = generateRoomCode();
    }
  }

  const memberObj = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    pushToken: user.pushToken || null,
  };

  const roomData = {
    code,
    name: roomName ? roomName.trim() : 'My Flat',
    createdBy: user.id,
    members: [memberObj],
  };

  if (isDbConnected()) {
    try {
      const newRoom = new Room(roomData);
      await newRoom.save();

      // Update user active roomId and rooms list
      await User.findOneAndUpdate(
        { id: user.id },
        { roomId: code, $addToSet: { rooms: code } }
      );
    } catch (err) {
      console.warn('DB Room create fallback:', err.message);
    }
  }

  inMemoryRooms.push(roomData);

  // Update inMemory user if exists
  const memUser = inMemoryUsers.find((u) => u.id === user.id);
  if (memUser) {
    memUser.roomId = code;
    if (!memUser.rooms) memUser.rooms = [];
    if (!memUser.rooms.includes(code)) memUser.rooms.push(code);
  }

  // Create initial room notification
  await createRoomNotification(req.app, {
    roomCode: code,
    type: 'SYSTEM',
    title: 'Room Created 🏡',
    body: `${user.name} created flat room "${roomData.name}"`,
    actorId: user.id,
    actorName: user.name,
    categoryEmoji: '🏡',
  });

  res.status(201).json({ success: true, room: roomData, expenses: [] });
});

// 4. Join an existing Flat Room using Code
router.post('/rooms/join', async (req, res) => {
  const { code, user } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, error: 'Room Key is required.' });
  }

  if (!user || !user.id) {
    return res.status(401).json({ success: false, error: 'User must be logged in to join a room.' });
  }

  const cleanCode = code.trim().toUpperCase();

  let targetRoom = null;
  let roomExpenses = [];
  let roomNotifs = [];

  if (isDbConnected()) {
    try {
      targetRoom = await Room.findOne({ code: cleanCode });
      if (!targetRoom) {
        return res.status(404).json({ success: false, error: `Invalid Room Key: "${cleanCode}". Room does not exist.` });
      }

      // Add user to room members if not present
      const memberIndex = targetRoom.members.findIndex((m) => m.id === user.id);
      const memberObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        pushToken: user.pushToken || null,
      };

      if (memberIndex === -1) {
        targetRoom.members.push(memberObj);
        await targetRoom.save();

        // Add activity notification
        await createRoomNotification(req.app, {
          roomCode: cleanCode,
          type: 'MEMBER_JOINED',
          title: 'New Member Joined 👋',
          body: `${user.name} joined the room!`,
          actorId: user.id,
          actorName: user.name,
          categoryEmoji: '👋',
        });
      } else {
        targetRoom.members[memberIndex] = memberObj;
        await targetRoom.save();
      }

      // Update User document
      await User.findOneAndUpdate(
        { id: user.id },
        { roomId: cleanCode, $addToSet: { rooms: cleanCode } }
      );

      roomExpenses = await Expense.find({ roomCode: cleanCode }).sort({ createdAt: -1 });
      roomNotifs = await Notification.find({ roomCode: cleanCode }).sort({ createdAt: -1 });

      return res.json({ success: true, room: targetRoom, expenses: roomExpenses, notifications: roomNotifs });
    } catch (err) {
      console.warn('DB Join room error:', err.message);
    }
  }

  targetRoom = inMemoryRooms.find((r) => r.code === cleanCode);

  if (!targetRoom) {
    return res.status(404).json({ success: false, error: `Invalid Room Key: "${cleanCode}". Room does not exist.` });
  }

  const memberIdx = targetRoom.members.findIndex((m) => m.id === user.id);
  const memberObj = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    pushToken: user.pushToken || null,
  };

  if (memberIdx === -1) {
    targetRoom.members.push(memberObj);
    await createRoomNotification(req.app, {
      roomCode: cleanCode,
      type: 'MEMBER_JOINED',
      title: 'New Member Joined 👋',
      body: `${user.name} joined the room!`,
      actorId: user.id,
      actorName: user.name,
      categoryEmoji: '👋',
    });
  } else {
    targetRoom.members[memberIdx] = memberObj;
  }

  const memUser = inMemoryUsers.find((u) => u.id === user.id);
  if (memUser) {
    memUser.roomId = cleanCode;
    if (!memUser.rooms) memUser.rooms = [];
    if (!memUser.rooms.includes(cleanCode)) memUser.rooms.push(cleanCode);
  }

  roomExpenses = inMemoryExpenses.filter((e) => e.roomCode === cleanCode);
  roomNotifs = inMemoryNotifications.filter((n) => n.roomCode === cleanCode);

  res.json({ success: true, room: targetRoom, expenses: roomExpenses, notifications: roomNotifs });
});

// 5. Get Room Details & Expenses (with Authorization check)
router.get('/rooms/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();
  const userId = req.query.userId || req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ success: false, error: 'User ID is required for authorization.' });
  }

  let room = null;
  let roomExpenses = [];
  let roomNotifs = [];

  if (isDbConnected()) {
    try {
      room = await Room.findOne({ code });
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found.' });
      }

      // Authorization Check: User must be a member of the room
      const isMember = room.members.some((m) => m.id === userId);
      if (!isMember) {
        return res.status(403).json({ success: false, error: 'Unauthorized: You are not a member of this room.' });
      }

      roomExpenses = await Expense.find({ roomCode: code }).sort({ createdAt: -1 });
      roomNotifs = await Notification.find({ roomCode: code }).sort({ createdAt: -1 });

      return res.json({ success: true, room, expenses: roomExpenses, notifications: roomNotifs });
    } catch (err) {
      console.warn('DB Fetch room fallback:', err.message);
    }
  }

  room = inMemoryRooms.find((r) => r.code === code);
  if (!room) {
    return res.status(404).json({ success: false, error: 'Room not found.' });
  }

  const isMember = room.members.some((m) => m.id === userId);
  if (!isMember) {
    return res.status(403).json({ success: false, error: 'Unauthorized: You are not a member of this room.' });
  }

  roomExpenses = inMemoryExpenses.filter((e) => e.roomCode === code);
  roomNotifs = inMemoryNotifications.filter((n) => n.roomCode === code);

  res.json({ success: true, room, expenses: roomExpenses, notifications: roomNotifs });
});

// 6. Add Expense & Broadcast Notification
router.post('/expenses', async (req, res) => {
  const expenseData = req.body;
  const { roomCode, paidById, title, amount, paidByName, categoryEmoji } = expenseData;

  if (!roomCode || !paidById) {
    return res.status(400).json({ success: false, error: 'roomCode and paidById are required.' });
  }

  const cleanCode = roomCode.toUpperCase();

  // Verify membership authorization
  let room = null;
  if (isDbConnected()) {
    try {
      room = await Room.findOne({ code: cleanCode });
    } catch (e) {
      console.warn('Room auth check warning:', e.message);
    }
  }
  if (!room) {
    room = inMemoryRooms.find((r) => r.code === cleanCode);
  }

  if (!room) {
    return res.status(404).json({ success: false, error: 'Room not found.' });
  }

  const isMember = room.members.some((m) => m.id === paidById);
  if (!isMember) {
    return res.status(403).json({ success: false, error: 'Unauthorized: You are not a member of this room.' });
  }

  const newExpense = {
    ...expenseData,
    roomCode: cleanCode,
    id: expenseData.id || `e_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
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

  // Send push notification to roommates
  const otherRoommates = room.members.filter((m) => m.id !== paidById);
  const pushTokens = otherRoommates.map((m) => m.pushToken).filter(Boolean);

  if (pushTokens.length > 0) {
    sendPushNotification(
      pushTokens,
      `💸 New Expense: ${title}`,
      `${paidByName} added ₹${amount} for ${title}`,
      { expenseId: newExpense.id, type: 'EXPENSE_ADDED', roomCode: cleanCode }
    );
  }

  // Record room activity notification
  await createRoomNotification(req.app, {
    roomCode: cleanCode,
    type: 'EXPENSE_ADDED',
    title: `${paidByName} logged ₹${amount}`,
    body: `${title} (${expenseData.category || 'Expense'})`,
    actorId: paidById,
    actorName: paidByName,
    categoryEmoji: categoryEmoji || '💸',
  });

  const io = req.app.get('io');
  if (io && cleanCode) {
    io.to(cleanCode).emit('expense:added', newExpense);
  }

  res.status(201).json({ success: true, expense: newExpense });
});

// 7. Delete Expense
router.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { roomCode, userId } = req.query;

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
    io.to(roomCode.toUpperCase()).emit('expense:deleted', { id });
  }

  res.json({ success: true, message: 'Expense deleted successfully' });
});

// 8. Record Settlement & Broadcast Notification
router.post('/settlements', async (req, res) => {
  const { roomCode, settlementExpense, userId } = req.body;

  if (!roomCode || !settlementExpense) {
    return res.status(400).json({ success: false, error: 'roomCode and settlementExpense are required.' });
  }

  const cleanCode = roomCode.toUpperCase();
  const paidById = settlementExpense.paidById;

  // Authorization check
  let room = null;
  if (isDbConnected()) {
    try {
      room = await Room.findOne({ code: cleanCode });
    } catch (e) {}
  }
  if (!room) {
    room = inMemoryRooms.find((r) => r.code === cleanCode);
  }

  if (!room) {
    return res.status(404).json({ success: false, error: 'Room not found.' });
  }

  const isMember = room.members.some((m) => m.id === paidById);
  if (!isMember) {
    return res.status(403).json({ success: false, error: 'Unauthorized: You are not a member of this room.' });
  }

  const newSettlement = {
    ...settlementExpense,
    roomCode: cleanCode,
    isSettlement: true,
    id: settlementExpense.id || `settle_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
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

  // Record activity notification
  const payeeName = newSettlement.splits && newSettlement.splits[0] ? newSettlement.splits[0].userName : 'Roommate';
  await createRoomNotification(req.app, {
    roomCode: cleanCode,
    type: 'SETTLEMENT',
    title: `Payment Settlement 🤝`,
    body: `${newSettlement.paidByName} settled ₹${newSettlement.amount} with ${payeeName}`,
    actorId: paidById,
    actorName: newSettlement.paidByName,
    categoryEmoji: '🤝',
  });

  const io = req.app.get('io');
  if (io && cleanCode) {
    io.to(cleanCode).emit('expense:added', newSettlement);
  }

  res.status(201).json({ success: true, settlement: newSettlement });
});

// 9. Fetch Notifications for Room
router.get('/rooms/:code/notifications', async (req, res) => {
  const code = req.params.code.toUpperCase();
  const userId = req.query.userId || req.headers['x-user-id'];

  let notifs = [];

  if (isDbConnected()) {
    try {
      notifs = await Notification.find({ roomCode: code }).sort({ createdAt: -1 });
      return res.json({ success: true, notifications: notifs });
    } catch (e) {}
  }

  notifs = inMemoryNotifications.filter((n) => n.roomCode === code);
  res.json({ success: true, notifications: notifs });
});

module.exports = router;
