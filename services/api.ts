import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { Expense } from '../data/mockExpenses';
import { User } from '../data/mockUsers';

const getBackendUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (__DEV__ && Constants.expoConfig?.hostUri) {
    const hostIp = Constants.expoConfig.hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:5000`;
    }
  }
  return 'https://mob-application.onrender.com';
};

export const SERVER_URL = getBackendUrl();

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      timeout: 15000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

async function safeFetch(url: string, options: RequestInit = {}, timeoutMs = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || `HTTP Error ${res.status}` };
    }
    return data;
  } catch (err: any) {
    clearTimeout(timer);
    console.warn(`API SafeFetch Warning (${url}):`, err?.message || err);
    return { success: false, error: err?.message || 'Network request failed' };
  }
}

export interface ActivityNotification {
  id: string;
  roomCode: string;
  type: string;
  title: string;
  body: string;
  actorId?: string;
  actorName?: string;
  categoryEmoji?: string;
  createdAt: string;
}

export const apiService = {
  async createRoom(roomName: string, user: User) {
    return await safeFetch(`${SERVER_URL}/api/rooms/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, user }),
    });
  },

  async joinRoom(code: string, user: User) {
    return await safeFetch(`${SERVER_URL}/api/rooms/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, user }),
    });
  },

  async fetchRoomExpenses(code: string, userId: string) {
    return await safeFetch(`${SERVER_URL}/api/rooms/${code}?userId=${encodeURIComponent(userId)}`, {
      headers: { 'x-user-id': userId },
    });
  },

  async fetchRoomNotifications(code: string, userId: string) {
    return await safeFetch(`${SERVER_URL}/api/rooms/${code}/notifications?userId=${encodeURIComponent(userId)}`, {
      headers: { 'x-user-id': userId },
    });
  },

  async addExpense(expense: Expense & { roomCode: string }) {
    return await safeFetch(`${SERVER_URL}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
  },

  async registerUser(name: string, email: string) {
    return await safeFetch(`${SERVER_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
  },

  async loginUser(email: string) {
    return await safeFetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  },

  async recordSettlement(roomCode: string, settlementExpense: Expense, userId: string) {
    return await safeFetch(`${SERVER_URL}/api/settlements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, settlementExpense, userId }),
    });
  },
};
