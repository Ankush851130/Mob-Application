import { io, Socket } from 'socket.io-client';
import { Expense } from '../data/mockExpenses';
import { User } from '../data/mockUsers';

// Production Live Backend Server URL on Render
export const SERVER_URL = 'https://mob-application.onrender.com';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
};

export const apiService = {
  async createRoom(roomName: string, user: User) {
    const res = await fetch(`${SERVER_URL}/api/rooms/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, user }),
    });
    return await res.json();
  },

  async joinRoom(code: string, user: User) {
    const res = await fetch(`${SERVER_URL}/api/rooms/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, user }),
    });
    return await res.json();
  },

  async fetchRoomExpenses(code: string) {
    const res = await fetch(`${SERVER_URL}/api/rooms/${code}`);
    return await res.json();
  },

  async addExpense(expense: Expense & { roomCode: string }) {
    const res = await fetch(`${SERVER_URL}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    return await res.json();
  },

  async recordSettlement(roomCode: string, settlementExpense: Expense) {
    const res = await fetch(`${SERVER_URL}/api/settlements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, settlementExpense }),
    });
    return await res.json();
  },
};
