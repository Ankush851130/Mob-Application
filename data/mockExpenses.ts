import { MOCK_USERS, CURRENT_USER, User } from './mockUsers';

export interface SplitShare {
  userId: string;
  userName: string;
  amount: number;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Utilities' | 'Groceries' | 'Internet' | 'Food & Dining' | 'Rent' | 'Other';
  categoryEmoji: string;
  amount: number;
  paidById: string;
  paidByName: string;
  date: string;
  displayDate: string;
  splits: SplitShare[];
  notes?: string;
}

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'e1',
    title: 'March Electricity Bill',
    category: 'Utilities',
    categoryEmoji: '⚡',
    amount: 1800,
    paidById: CURRENT_USER.id,
    paidByName: CURRENT_USER.name,
    date: '2025-03-26',
    displayDate: 'TODAY, 26 MAR',
    splits: [
      { userId: 'u1', userName: 'Ankush', amount: 450 },
      { userId: 'u2', userName: 'Rahul Sharma', amount: 450 },
      { userId: 'u3', userName: 'Aman Verma', amount: 450 },
      { userId: 'u4', userName: 'Priya Patel', amount: 450 },
    ],
    notes: 'Torrent Power bill for March 2025',
  },
  {
    id: 'e2',
    title: 'Weekly Grocery Haul',
    category: 'Groceries',
    categoryEmoji: '🛒',
    amount: 2400,
    paidById: 'u2', // Rahul
    paidByName: 'Rahul Sharma',
    date: '2025-03-25',
    displayDate: 'YESTERDAY, 25 MAR',
    splits: [
      { userId: 'u1', userName: 'Ankush', amount: 600 },
      { userId: 'u2', userName: 'Rahul Sharma', amount: 600 },
      { userId: 'u3', userName: 'Aman Verma', amount: 600 },
      { userId: 'u4', userName: 'Priya Patel', amount: 600 },
    ],
    notes: 'Vegetables, milk, snacks & household items',
  },
  {
    id: 'e3',
    title: 'Airtel Fiber 1Gbps WiFi',
    category: 'Internet',
    categoryEmoji: '📶',
    amount: 1200,
    paidById: CURRENT_USER.id,
    paidByName: CURRENT_USER.name,
    date: '2025-03-22',
    displayDate: '22 MAR 2025',
    splits: [
      { userId: 'u1', userName: 'Ankush', amount: 300 },
      { userId: 'u2', userName: 'Rahul Sharma', amount: 300 },
      { userId: 'u3', userName: 'Aman Verma', amount: 300 },
      { userId: 'u4', userName: 'Priya Patel', amount: 300 },
    ],
    notes: 'Unlimited fiber internet monthly bill',
  },
  {
    id: 'e4',
    title: 'Swiggy Weekend Pizza Party',
    category: 'Food & Dining',
    categoryEmoji: '🍕',
    amount: 1500,
    paidById: 'u3', // Aman
    paidByName: 'Aman Verma',
    date: '2025-03-20',
    displayDate: '20 MAR 2025',
    splits: [
      { userId: 'u1', userName: 'Ankush', amount: 500 },
      { userId: 'u2', userName: 'Rahul Sharma', amount: 500 },
      { userId: 'u3', userName: 'Aman Verma', amount: 500 },
    ],
    notes: 'Dominoes large pizzas + drinks',
  },
  {
    id: 'e5',
    title: '20L Mineral Water Cans (5x)',
    category: 'Utilities',
    categoryEmoji: '💧',
    amount: 450,
    paidById: CURRENT_USER.id,
    paidByName: CURRENT_USER.name,
    date: '2025-03-18',
    displayDate: '18 MAR 2025',
    splits: [
      { userId: 'u1', userName: 'Ankush', amount: 112.5 },
      { userId: 'u2', userName: 'Rahul Sharma', amount: 112.5 },
      { userId: 'u3', userName: 'Aman Verma', amount: 112.5 },
      { userId: 'u4', userName: 'Priya Patel', amount: 112.5 },
    ],
    notes: 'Bisleri water delivery for kitchen',
  },
  {
    id: 'e6',
    title: 'House Maid & Cleaning Salary',
    category: 'Rent',
    categoryEmoji: '🧹',
    amount: 4000,
    paidById: 'u4', // Priya
    paidByName: 'Priya Patel',
    date: '2025-03-01',
    displayDate: '01 MAR 2025',
    splits: [
      { userId: 'u1', userName: 'Ankush', amount: 1000 },
      { userId: 'u2', userName: 'Rahul Sharma', amount: 1000 },
      { userId: 'u3', userName: 'Aman Verma', amount: 1000 },
      { userId: 'u4', userName: 'Priya Patel', amount: 1000 },
    ],
    notes: 'Monthly cleaning & cooking maid fee',
  },
];
