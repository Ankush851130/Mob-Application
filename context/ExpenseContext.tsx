import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_EXPENSES, Expense, SplitShare } from '../data/mockExpenses';
import { MOCK_USERS, CURRENT_USER, User } from '../data/mockUsers';
import { apiService, getSocket } from '../services/api';
import { registerForPushNotificationsAsync } from '../services/notifications';

export interface RoommateBalance {
  user: User;
  netBalance: number; // positive = owes current user, negative = current user owes them
  breakdown: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  users: User[];
  currentUser: User;
  roomCode: string;
  roomName: string;
  joinFlatRoom: (code: string) => Promise<boolean>;
  createFlatRoom: (name: string) => Promise<string>;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  recordSettlement: (fromUserId: string, toUserId: string, amount: number) => void;
  youOweTotal: number;
  youAreOwedTotal: number;
  netBalanceTotal: number;
  roommateBalances: RoommateBalance[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser] = useState<User>(CURRENT_USER);
  const [roomCode, setRoomCode] = useState<string>('FLAT302');
  const [roomName, setRoomName] = useState<string>('Apartment 302 Roommates');

  // Socket.io Listener & Push Token Registration
  useEffect(() => {
    const socket = getSocket();

    socket.emit('join_room', roomCode);

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        currentUser.pushToken = token;
        apiService.joinRoom(roomCode, { ...currentUser, pushToken: token }).catch(console.warn);
      }
    });

    const handleExpenseAdded = (newExpense: Expense) => {
      setExpenses((prev) => {
        if (prev.some((e) => e.id === newExpense.id)) return prev;
        return [newExpense, ...prev];
      });
    };

    socket.on('expense:added', handleExpenseAdded);

    return () => {
      socket.off('expense:added', handleExpenseAdded);
    };
  }, [roomCode]);

  const joinFlatRoom = async (code: string): Promise<boolean> => {
    try {
      const res = await apiService.joinRoom(code, currentUser);
      if (res.success && res.room) {
        setRoomCode(res.room.code);
        setRoomName(res.room.name);
        if (res.expenses && res.expenses.length > 0) {
          setExpenses(res.expenses);
        }
        if (res.room.members && res.room.members.length > 0) {
          setUsers(res.room.members);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.warn('API Join room fallback to local:', e);
      setRoomCode(code.toUpperCase());
      return true;
    }
  };

  const createFlatRoom = async (name: string): Promise<string> => {
    try {
      const res = await apiService.createRoom(name, currentUser);
      if (res.success && res.room) {
        setRoomCode(res.room.code);
        setRoomName(res.room.name);
        return res.room.code;
      }
    } catch (e) {
      console.warn('API Create room fallback:', e);
    }
    const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(fallbackCode);
    setRoomName(name);
    return fallbackCode;
  };

  const addExpense = (newExpData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...newExpData,
      id: `e_${Date.now()}`,
    };

    // Update local state instantly
    setExpenses((prev) => [newExpense, ...prev]);

    // Broadcast to Node.js backend & Socket.io for roommates
    apiService.addExpense({ ...newExpense, roomCode }).catch((err) => {
      console.warn('Backend sync warning (running local offline mode):', err.message);
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const recordSettlement = (fromUserId: string, toUserId: string, amount: number) => {
    const fromUser = users.find((u) => u.id === fromUserId);
    const toUser = users.find((u) => u.id === toUserId);

    if (!fromUser || !toUser) return;

    const settlementExpense: Expense = {
      id: `settle_${Date.now()}`,
      title: `Settlement: ${fromUser.name} paid ${toUser.name}`,
      category: 'Other',
      categoryEmoji: '💸',
      amount: amount,
      paidById: fromUserId,
      paidByName: fromUser.name,
      date: new Date().toISOString().split('T')[0],
      displayDate: 'TODAY',
      splits: [
        { userId: toUserId, userName: toUser.name, amount: amount }
      ],
      notes: 'Direct settlement payment',
    };

    setExpenses((prev) => [settlementExpense, ...prev]);

    apiService.recordSettlement(roomCode, settlementExpense).catch((err) => {
      console.warn('Backend settlement sync warning:', err.message);
    });
  };

  // Calculate dynamic balances relative to current user
  const { youOweTotal, youAreOwedTotal, netBalanceTotal, roommateBalances } = useMemo(() => {
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
      const user = users.find((u) => u.id === userId)!;
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
        joinFlatRoom,
        createFlatRoom,
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
