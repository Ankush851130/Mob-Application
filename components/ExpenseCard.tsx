import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';
import { Expense } from '../data/mockExpenses';
import { CURRENT_USER } from '../data/mockUsers';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  const isPaidByMe = expense.paidById === CURRENT_USER.id;
  const mySplit = expense.splits.find((s) => s.userId === CURRENT_USER.id);
  const myShare = mySplit ? mySplit.amount : 0;

  // If I paid: Others owe me (Total - myShare)
  // If someone else paid: I owe myShare
  const netImpact = isPaidByMe ? expense.amount - myShare : -myShare;
  const isPositive = netImpact >= 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, Theme.shadows.subtle]}
    >
      <View style={styles.leftRow}>
        <View style={styles.emojiAvatar}>
          <Text style={styles.emoji}>{expense.categoryEmoji || '💸'}</Text>
        </View>

        <View style={styles.detailsColumn}>
          <Text style={styles.title} numberOfLines={1}>
            {expense.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {isPaidByMe ? 'You paid' : `Paid by ${expense.paidByName}`} • {expense.displayDate}
          </Text>
        </View>
      </View>

      <View style={styles.rightColumn}>
        <Text style={styles.totalAmount}>₹{expense.amount}</Text>
        <Text style={[styles.netTag, isPositive ? styles.textPositive : styles.textNegative]}>
          {isPositive ? `+₹${netImpact.toFixed(0)}` : `-₹${Math.abs(netImpact).toFixed(0)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  emojiAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  detailsColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.bodyLg,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 2,
  },
  totalAmount: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  netTag: {
    ...Typography.labelCaps,
  },
  textPositive: {
    color: Colors.balancePositive,
  },
  textNegative: {
    color: Colors.balanceNegative,
  },
});
