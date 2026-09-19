import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import { Expense } from '../data/mockExpenses';

interface ActivityItemProps {
  expense: Expense;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ expense }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>{expense.categoryEmoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.boldText}>{expense.paidByName}</Text> added "{expense.title}"
        </Text>
        <Text style={styles.time}>{expense.displayDate} • ₹{expense.amount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  boldText: {
    ...Typography.headlineSm,
    fontSize: 14,
  },
  time: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
});
