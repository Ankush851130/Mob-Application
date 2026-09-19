import { MOCK_USERS, User } from './mockUsers';

export interface Group {
  id: string;
  name: string;
  code: string;
  members: User[];
  monthlyTotal: number;
  totalBills: number;
}

export const MOCK_GROUP: Group = {
  id: 'g1',
  name: 'Flat 302 (Green Acres)',
  code: 'ROOM-302',
  members: MOCK_USERS,
  monthlyTotal: 14250,
  totalBills: 24,
};
