export interface User {
  id: string;
  name: string;
  isCurrentUser?: boolean;
  avatar: string;
  email: string;
  phone: string;
  room: string;
  pushToken?: string;
}

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Ankush',
  isCurrentUser: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'ankush@flatledger.app',
  phone: '+91 98765 43210',
  room: 'Room 302',
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'u2',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'rahul@example.com',
    phone: '+91 98123 45678',
    room: 'Room 302',
  },
  {
    id: 'u3',
    name: 'Aman Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'aman@example.com',
    phone: '+91 97123 45678',
    room: 'Room 302',
  },
  {
    id: 'u4',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    email: 'priya@example.com',
    phone: '+91 96123 45678',
    room: 'Room 302',
  },
];
