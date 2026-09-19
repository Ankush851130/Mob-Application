import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';

interface BalanceCardProps {
  netBalance: number;
  youOwe: number;
  youAreOwed: number;
  onAddExpensePress?: () => void;
  onSettleUpPress?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  netBalance,
  youOwe,
  youAreOwed,
  onAddExpensePress,
  onSettleUpPress,
}) => {
  const isPositive = netBalance >= 0;

  return (
    <View style={[styles.card, Theme.shadows.card]}>
      {/* Top Status Header */}
      <View style={styles.topRow}>
        <View style={styles.statusPillGroup}>
          <Text style={styles.labelCaps}>YOUR NET BALANCE</Text>
          <View style={[styles.statusPill, isPositive ? styles.pillPositive : styles.pillNegative]}>
            <Text style={[styles.statusText, isPositive ? styles.textPositive : styles.textNegative]}>
              {isPositive ? 'All Clear' : 'Debt Outstanding'}
            </Text>
          </View>
        </View>
        <Text style={[styles.subtitle, isPositive ? styles.textPositive : styles.textNegative]}>
          {isPositive ? 'Overall owed to you' : 'Overall you owe'}
        </Text>
      </View>

      {/* Main Currency Display */}
      <View style={styles.currencyRow}>
        <Text style={[styles.currencyText, isPositive ? styles.textPositive : styles.textNegative]}>
          {isPositive ? '+' : '-'}₹{Math.abs(netBalance).toFixed(2)}
        </Text>
        <Text style={styles.currencySubtext}>net balance</Text>
      </View>

      {/* Split Sub-cards: You Owe vs You Are Owed */}
      <View style={styles.gridRow}>
        {/* You Owe Sub-card */}
        <View style={[styles.subCard, styles.subCardOwe]}>
          <View style={styles.subCardHeader}>
            <View style={[styles.dot, { backgroundColor: Colors.balanceNegative }]} />
            <Text style={styles.subCardLabel}>You Owe</Text>
          </View>
          <Text style={[styles.subCardAmount, { color: Colors.balanceNegative }]}>
            ₹{youOwe.toFixed(2)}
          </Text>
        </View>

        {/* You Are Owed Sub-card */}
        <View style={[styles.subCard, styles.subCardOwed]}>
          <View style={styles.subCardHeader}>
            <View style={[styles.dot, { backgroundColor: Colors.balancePositive }]} />
            <Text style={styles.subCardLabel}>You Are Owed</Text>
          </View>
          <Text style={[styles.subCardAmount, { color: Colors.balancePositive }]}>
            ₹{youAreOwed.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.actionBtn, styles.primaryActionBtn, Theme.shadows.glow]}
          onPress={onAddExpensePress}
        >
          <Ionicons name="add-circle" size={20} color={Colors.onPrimary} />
          <Text style={styles.primaryActionText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.actionBtn, styles.secondaryActionBtn]}
          onPress={onSettleUpPress}
        >
          <Ionicons name="checkmark-done-circle-outline" size={20} color={Colors.balancePositive} />
          <Text style={styles.secondaryActionText}>Settle Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  statusPillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.textSecondary,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  pillPositive: {
    backgroundColor: Colors.balancePositiveBg,
  },
  pillNegative: {
    backgroundColor: Colors.balanceNegativeBg,
  },
  statusText: {
    ...Typography.labelCaps,
    fontSize: 10,
  },
  subtitle: {
    ...Typography.bodySm,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: Spacing.xs,
  },
  currencyText: {
    ...Typography.currencyDisplay,
  },
  currencySubtext: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
  textPositive: {
    color: Colors.balancePositive,
  },
  textNegative: {
    color: Colors.balanceNegative,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  subCard: {
    flex: 1,
    padding: 12,
    borderRadius: Radius.lg,
    gap: 4,
  },
  subCardOwe: {
    backgroundColor: Colors.balanceNegativeBg,
  },
  subCardOwed: {
    backgroundColor: Colors.balancePositiveBg,
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subCardLabel: {
    ...Typography.labelSm,
    color: Colors.textSecondary,
  },
  subCardAmount: {
    ...Typography.headlineSm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.r2xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryActionBtn: {
    backgroundColor: Colors.balancePositive,
  },
  primaryActionText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
  secondaryActionBtn: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderDelicate,
  },
  secondaryActionText: {
    ...Typography.labelMd,
    color: Colors.balancePositive,
  },
});
