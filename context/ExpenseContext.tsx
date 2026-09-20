import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../data/mockExpenses';
import { User } from '../data/mockUsers';
import { apiService, getSocket, disconnectSocket, ActivityNotification } from '../services/api';
import { registerForPushNotificationsAsync } from '../services/notifications';

export interface RoommateBalance {
  user: User;
  netBalance: number; // positive = owes current user, negative = current user owes them
  breakdown: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  users: User[];
  currentUser: User | null;
  roomCode: string;
  roomName: string;
  notifications: ActivityNotification[];
  isLoaded: boolean;
  joinFlatRoom: (code: string) => Promise<{ success: boolean; error?: string }>;
  createFlatRoom: (name: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  registerUser: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  loginUser: (email: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  recordSettlement: (fromUserId: string, toUserId: string, amount: number) => void;
  youOweTotal: number;
  youAreOwedTotal: number;
  netBalanceTotal: number;
  roommateBalances: RoommateBalance[];
}

const STORAGE_KEY_USER = 'FLATLEDGER_USER_SESSION_V1';
const STORAGE_KEY_ROOM = 'FLATLEDGER_ROOM_CODE_V1';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomCode, setRoomCode] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load session from AsyncStorage on app launch
  useEffect(() => {
    async function loadSavedSession() {
      try {
        const savedUserJson = await AsyncStorage.getItem(STORAGE_KEY_USER);
        const savedRoomCode = await AsyncStorage.getItem(STORAGE_KEY_ROOM);

        if (savedUserJson) {
          const userObj: User = JSON.parse(savedUserJson);
          setCurrentUser(userObj);

          const targetRoomCode = savedRoomCode || userObj.roomId || '';
          if (targetRoomCode) {
            setRoomCode(targetRoomCode);
            const res = await apiService.fetchRoomExpenses(targetRoomCode, userObj.id);
            if (res && res.success) {
              setExpenses(res.expenses || []);
              if (res.room) {
                setRoomName(res.room.name || '');
                setUsers(res.room.members || []);
              }
              if (res.notifications) {
                setNotifications(res.notifications || []);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Error restoring session from AsyncStorage:', e);
      } finally {
        setIsLoaded(true);
      }
    }

    loadSavedSession();
  }, []);

  // Sync WebSocket and Push Notifications when roomCode & currentUser change
  useEffect(() => {
    if (!roomCode || !currentUser) return;

    let socket: any = null;
    let isMounted = true;

    // Fetch initial room details & notifications
    apiService.fetchRoomExpenses(roomCode, currentUser.id)
      .then((res) => {
        if (isMounted && res && res.success) {
          setExpenses(res.expenses || []);
          if (res.room) {
            setRoomName(res.room.name || '');
            setUsers(res.room.members || []);
          }
          if (res.notifications) {
            setNotifications(res.notifications || []);
          }
        }
      })
      .catch((err) => console.warn('Room sync error:', err));

    try {
      socket = getSocket();
      socket.emit('join_room', roomCode.toUpperCase());

      registerForPushNotificationsAsync()
        .then((token) => {
          if (token && currentUser) {
            currentUser.pushToken = token;
            apiService.joinRoom(roomCode, { ...currentUser, pushToken: token }).catch(console.warn);
          }
        })
        .catch((err) => console.warn('Push token error:', err));

      const handleExpenseAdded = (newExpense: Expense) => {
        setExpenses((prev) => {
          if (prev.some((e) => e.id === newExpense.id)) return prev;
          return [newExpense, ...prev];
        });
      };

      const handleNotificationAdded = (newNotif: ActivityNotification) => {
        setNotifications((prev) => {
          if (prev.some((n) => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev];
        });
      };

      socket.on('expense:added', handleExpenseAdded);
      socket.on('notification:added', handleNotificationAdded);

      return () => {
        isMounted = false;
        if (socket) {
          socket.off('expense:added', handleExpenseAdded);
          socket.off('notification:added', handleNotificationAdded);
        }
      };
    } catch (e) {
      console.warn('Socket connection warning:', e);
    }
  }, [roomCode, currentUser?.id]);

  const registerUser = async (name: string, email: string) => {
    try {
      const res = await apiService.registerUser(name, email);
      if (res && res.success && res.user) {
        // Clear old user & room state for complete account isolation!
        setExpenses([]);
        setUsers([]);
        setNotifications([]);
        setRoomCode('');
        setRoomName('');

        setCurrentUser(res.user);
        await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
        await AsyncStorage.removeItem(STORAGE_KEY_ROOM);
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error during registration.' };
    }
  };

  const loginUser = async (email: string) => {
    try {
      const res = await apiService.loginUser(email);
      if (res && res.success && res.user) {
        // Reset state for new logged-in account
        setExpenses([]);
        setUsers([]);
        setNotifications([]);

        const loggedInUser: User = res.user;
        setCurrentUser(loggedInUser);
        await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedInUser));

        if (loggedInUser.roomId) {
          setRoomCode(loggedInUser.roomId);
          await AsyncStorage.setItem(STORAGE_KEY_ROOM, loggedInUser.roomId);

          const roomRes = await apiService.fetchRoomExpenses(loggedInUser.roomId, loggedInUser.id);
          if (roomRes && roomRes.success) {
            setExpenses(roomRes.expenses || []);
            if (roomRes.room) {
              setRoomName(roomRes.room.name || '');
              setUsers(roomRes.room.members || []);
            }
            if (roomRes.notifications) {
              setNotifications(roomRes.notifications || []);
            }
          }
        } else {
          setRoomCode('');
          setRoomName('');
          await AsyncStorage.removeItem(STORAGE_KEY_ROOM);
        }

        return { success: true };
      }
      return { success: false, error: res.error || 'Sign in failed.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error during sign in.' };
    }
  };

  const logoutUser = async () => {
    try {
      disconnectSocket();
      setCurrentUser(null);
      setRoomCode('');
      setRoomName('');
      setExpenses([]);
      setUsers([]);
      setNotifications([]);
      await AsyncStorage.removeItem(STORAGE_KEY_USER);
      await AsyncStorage.removeItem(STORAGE_KEY_ROOM);
    } catch (e) {
      console.warn('Logout cleanup error:', e);
    }
  };

  const joinFlatRoom = async (code: string) => {
    if (!currentUser) {
      return { success: false, error: 'User is not authenticated.' };
    }

    const cleanCode = code.trim().toUpperCase();

    try {
      const res = await apiService.joinRoom(cleanCode, currentUser);
      if (res && res.success && res.room) {
        setRoomCode(res.room.code);
        setRoomName(res.room.name);
        setUsers(res.room.members || []);
        setExpenses(res.expenses || []);
        setNotifications(res.notifications || []);

        const updatedUser = { ...currentUser, roomId: res.room.code };
        setCurrentUser(updatedUser);
        await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
        await AsyncStorage.setItem(STORAGE_KEY_ROOM, res.room.code);

        return { success: true };
      }
      return { success: false, error: res.error || 'Invalid room key.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error joining flat room.' };
    }
  };

  const createFlatRoom = async (name: string) => {
    if (!currentUser) {
      return { success: false, error: 'User is not authenticated.' };
    }

    try {
      const res = await apiService.createRoom(name, currentUser);
      if (res && res.success && res.room) {
        setRoomCode(res.room.code);
        setRoomName(res.room.name);
        setUsers(res.room.members || [currentUser]);
        setExpenses([]);
        setNotifications([]);

        const updatedUser = { ...currentUser, roomId: res.room.code };
        setCurrentUser(updatedUser);
        await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
        await AsyncStorage.setItem(STORAGE_KEY_ROOM, res.room.code);

        return { success: true, code: res.room.code };
      }
      return { success: false, error: res.error || 'Could not create room.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error creating flat room.' };
    }
  };

  const addExpense = (newExpData: Omit<Expense, 'id'>) => {
    if (!currentUser || !roomCode) return;

    const newExpense: Expense = {
      ...newExpData,
      id: `e_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    apiService.addExpense({ ...newExpense, roomCode }).catch((err) => {
      console.warn('Backend expense sync error:', err.message);
    });
  };

  const deleteExpense = (id: string) => {
    if (!currentUser || !roomCode) return;
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const recordSettlement = (fromUserId: string, toUserId: string, amount: number) => {
    if (!currentUser || !roomCode) return;

    const fromUser = users.find((u) => u.id === fromUserId) || currentUser;
    const toUser = users.find((u) => u.id === toUserId);

    if (!toUser) return;

    const settlementExpense: Expense = {
      id: `settle_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `Settlement: ${fromUser.name} paid ${toUser.name}`,
      category: 'Other',
      categoryEmoji: '🤝',
      amount: amount,
      paidById: fromUserId,
      paidByName: fromUser.name,
      date: new Date().toISOString().split('T')[0],
      displayDate: 'TODAY',
      splits: [
        { userId: toUserId, userName: toUser.name, amount: amount }
      ],
      isSettlement: true,
      notes: 'Direct payment settlement',
    };

    setExpenses((prev) => [settlementExpense, ...prev]);

    apiService.recordSettlement(roomCode, settlementExpense, currentUser.id).catch((err) => {
      console.warn('Backend settlement sync error:', err.message);
    });
  };

  // Calculate dynamic roommate balances relative to currentUser
  const { youOweTotal, youAreOwedTotal, netBalanceTotal, roommateBalances } = useMemo(() => {
    if (!currentUser) {
      return { youOweTotal: 0, youAreOwedTotal: 0, netBalanceTotal: 0, roommateBalances: [] };
    }

    const userNetMap: Record<string, { net: number; titles: string[] }> = {};

    users.forEach((u) => {
      if (u.id !== currentUser.id) {
        userNetMap[u.id] = { net: 0, titles: [] };
      }
    });

    expenses.forEach((exp) => {
      const paidById = exp.paidById;

      exp.splits.forEach((split) => {
        const splitUserId = split.userId;
        const shareAmount = split.amount;

        if (paidById === currentUser.id && splitUserId !== currentUser.id) {
          if (userNetMap[splitUserId]) {
            userNetMap[splitUserId].net += shareAmount;
            userNetMap[splitUserId].titles.push(`${exp.title} (+₹${shareAmount})`);
          }
        } else if (paidById !== currentUser.id && splitUserId === currentUser.id) {
          if (userNetMap[paidById]) {
            userNetMap[paidById].net -= shareAmount;
            userNetMap[paidById].titles.push(`${exp.title} (-₹${shareAmount})`);
          }
        }
      });
    });

    let youOwe = 0;
    let youAreOwed = 0;

    const balances: RoommateBalance[] = Object.keys(userNetMap).map((userId) => {
      const user = users.find((u) => u.id === userId) || {
        id: userId,
        name: 'Roommate',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        email: '',
      };

      const net = userNetMap[userId].net;
      const titles = userNetMap[userId].titles;

      if (net > 0) {
        youAreOwed += net;
      } else if (net < 0) {
        youOwe += Math.abs(net);
      }

      return {
        user,
        netBalance: net,
        breakdown: titles.slice(0, 2).join(', ') || 'No active splits',
      };
    });

    return {
      youOweTotal: youOwe,
      youAreOwedTotal: youAreOwed,
      netBalanceTotal: youAreOwed - youOwe,
      roommateBalances: balances,
    };
  }, [expenses, users, currentUser]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        users,
        currentUser,
        roomCode,
        roomName,
        notifications,
        isLoaded,
        joinFlatRoom,
        createFlatRoom,
        registerUser,
        loginUser,
        logoutUser,
        addExpense,
        deleteExpense,
        recordSettlement,
        youOweTotal,
        youAreOwedTotal,
        netBalanceTotal,
        roommateBalances,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
