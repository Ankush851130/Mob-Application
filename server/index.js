require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Attach io to app so routes can broadcast events
app.set('io', io);

// API Routes
app.use('/api', apiRoutes);

// MongoDB connection with fallback in-memory mode
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flatledger';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB database successfully.'))
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning (Running in memory/cache fallback mode):', err.message);
  });

// Socket.io Real-time connection management
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Roommates join their flat room WebSocket channel
  socket.on('join_room', (roomCode) => {
    if (roomCode) {
      socket.join(roomCode.toUpperCase());
      console.log(`🏠 Socket ${socket.id} joined room: ${roomCode.toUpperCase()}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 FlatLedger Node.js Express server running on port ${PORT}`);
});
