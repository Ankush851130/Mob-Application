import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';
import { RoommateBalance } from '../context/ExpenseContext';

interface RoommateCardProps {
  item: RoommateBalance;
  onSettlePress: () => void;
}

export const RoommateCard: React.FC<RoommateCardProps> = ({ item, onSettlePress }) => {
  const { user, netBalance, breakdown } = item;
  const isOwedToMe = netBalance > 0;
  const isSettled = netBalance === 0;

  const handleRemind = () => {
    Alert.alert(
      'Payment Reminder Sent! 💬',
      `Sent a payment reminder to ${user.name} for ₹${Math.abs(netBalance).toFixed(2)}.`
    );
  };

  return (
    <View style={[styles.card, Theme.shadows.card]}>
      {/* Top Profile & Amount Row */}
      <View style={styles.topRow}>
        <View style={styles.userGroup}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userColumn}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              {!isSettled && (
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isOwedToMe ? Colors.balancePositive : Colors.balanceNegative },
                  ]}
                />
              )}
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.amountColumn}>
          <Text style={styles.statusLabel}>
            {isSettled ? 'Settled' : isOwedToMe ? 'Owes you' : 'You owe'}
          </Text>
          <Text
            style={[
              styles.amountText,
              isSettled
                ? styles.textSettled
                : isOwedToMe
                ? styles.textPositive
                : styles.textNegative,
            ]}
          >
            {isSettled ? '₹0.00' : `${isOwedToMe ? '+' : '-'}₹${Math.abs(netBalance).toFixed(2)}`}
          </Text>
        </View>
      </View>

      {/* Expense breakdown pill tag */}
      <View style={styles.breakdownBox}>
        <Ionicons name="receipt-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.breakdownText} numberOfLines={1}>
          {breakdown}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.remindBtn} onPress={handleRemind}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.balancePositive} />
          <Text style={styles.remindBtnText}>Remind</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settleBtn} onPress={onSettlePress}>
          <Ionicons name="card-outline" size={16} color={Colors.onPrimary} />
          <Text style={styles.settleBtnText}>Settle Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
  },
  userColumn: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  userEmail: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
  amountColumn: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statusLabel: {
    ...Typography.labelCaps,
    color: Colors.textSecondary,
  },
  amountText: {
    ...Typography.headlineMd,
  },
  textPositive: {
    color: Colors.balancePositive,
  },
  textNegative: {
    color: Colors.balanceNegative,
  },
  textSettled: {
    color: Colors.textMuted,
  },
  breakdownBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  remindBtn: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  remindBtnText: {
    ...Typography.labelMd,
    color: Colors.balancePositive,
  },
  settleBtn: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.balancePositive,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  settleBtnText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
});
