import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';
import { useExpenses } from '../context/ExpenseContext';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'GPay / PhonePe / UPI', icon: 'qr-code-outline' },
  { id: 'cash', label: 'Cash Payment', icon: 'cash-outline' },
  { id: 'bank', label: 'Bank Transfer', icon: 'card-outline' },
];

export default function SettleUpScreen() {
  const router = useRouter();
  const { users, currentUser, recordSettlement, roommateBalances, roomCode } = useExpenses();

  const activeUserId = currentUser?.id || '';
  const otherUsers = users.filter((u) => u.id !== activeUserId);

  const [selectedPayeeId, setSelectedPayeeId] = useState(otherUsers[0]?.id || '');
  const [amount, setAmount] = useState('300');
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const selectedPayee = users.find((u) => u.id === selectedPayeeId) || otherUsers[0];

  const handleRecord = () => {
    if (!currentUser) {
      Alert.alert('Authentication Error', 'You must be signed in.');
      return;
    }
    if (!selectedPayee) {
      Alert.alert('Selection Error', 'Please select a roommate to settle payment with.');
      return;
    }

    const parsedAmount = parseFloat(amount) || 0;
    if (parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a settlement amount greater than 0.');
      return;
    }

    // Record settlement: Current user pays selectedPayee
    recordSettlement(currentUser.id, selectedPayee.id, parsedAmount);

    Alert.alert(
      'Settlement Recorded! 🎉',
      `Payment of ₹${parsedAmount} to ${selectedPayee.name} has been saved.`
    );
    router.back();
  };

  if (otherUsers.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
            <Text style={styles.headerBtnText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settle Up Debts</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyCardContainer}>
          <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Other Roommates Yet</Text>
          <Text style={styles.emptySub}>
            Share your Room Key <Text style={{ fontWeight: 'bold' }}>{roomCode}</Text> with your flatmates so they can join this room.
          </Text>
          <TouchableOpacity style={styles.inviteBtn} onPress={() => router.push('/roommates')}>
            <Text style={styles.inviteBtnText}>Share Room Key ({roomCode})</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Modal Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={Colors.textSecondary} />
          <Text style={styles.headerBtnText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settle Up Debts</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleRecord}>
          <Text style={[styles.headerBtnText, styles.recordText]}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Select Payee */}
        <View style={styles.section}>
          <Text style={styles.labelCaps}>SELECT ROOMMATE</Text>
          <View style={styles.payeeGrid}>
            {otherUsers.map((u) => {
              const balanceItem = roommateBalances.find((b) => b.user.id === u.id);
              const isSelected = u.id === selectedPayeeId;
              return (
                <TouchableOpacity
                  key={u.id}
                  style={[
                    styles.payeeCard,
                    isSelected ? styles.payeeCardSelected : styles.payeeCardUnselected,
                  ]}
                  onPress={() => {
                    setSelectedPayeeId(u.id);
                    if (balanceItem && balanceItem.netBalance < 0) {
                      setAmount(Math.abs(balanceItem.netBalance).toString());
                    }
                  }}
                >
                  <Image source={{ uri: u.avatar }} style={styles.payeeAvatar} />
                  <Text style={styles.payeeName} numberOfLines={1}>
                    {u.name}
                  </Text>
                  <Text style={styles.payeeSubtext}>
                    {balanceItem && balanceItem.netBalance < 0
                      ? `You owe ₹${Math.abs(balanceItem.netBalance)}`
                      : 'Clear debts'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Amount Input */}
        <View style={[styles.amountCard, Theme.shadows.card]}>
          <Text style={styles.labelCaps}>SETTLEMENT AMOUNT</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
            />
          </View>
          <Text style={styles.amountSubtext}>Paying to {selectedPayee?.name || 'Roommate'}</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.labelCaps}>PAYMENT METHOD</Text>
          <View style={styles.methodsCard}>
            {PAYMENT_METHODS.map((m) => {
              const isSelected = selectedMethod === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.methodRow, isSelected && styles.methodRowSelected]}
                  onPress={() => setSelectedMethod(m.id)}
                >
                  <Ionicons
                    name={m.icon as any}
                    size={20}
                    color={isSelected ? Colors.balancePositive : Colors.textMuted}
                  />
                  <Text style={styles.methodLabel}>{m.label}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.balancePositive} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Record CTA */}
        <TouchableOpacity style={[styles.confirmBtn, Theme.shadows.glow]} onPress={handleRecord}>
          <Ionicons name="checkmark-done" size={20} color={Colors.onPrimary} />
          <Text style={styles.confirmBtnText}>Record Payment Settlement</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    height: 54,
    paddingHorizontal: Spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDelicate,
    backgroundColor: Colors.surfaceCard,
  },
  headerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerBtnText: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
  },
  headerTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  recordText: {
    color: Colors.balancePositive,
    fontFamily: Typography.headlineSm.fontFamily,
  },
  scrollContent: {
    padding: Spacing.marginMobile,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  section: {
    gap: 6,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
  },
  payeeGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  payeeCard: {
    flex: 1,
    padding: 12,
    borderRadius: Radius.xl,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
  },
  payeeCardSelected: {
    backgroundColor: Colors.balancePositiveBg,
    borderColor: Colors.balancePositive,
  },
  payeeCardUnselected: {
    backgroundColor: Colors.surfaceCard,
    borderColor: Colors.borderDelicate,
  },
  payeeAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
  },
  payeeName: {
    ...Typography.labelMd,
    color: Colors.textPrimary,
  },
  payeeSubtext: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
    fontSize: 9,
  },
  amountCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencySymbol: {
    ...Typography.currencyDisplay,
    color: Colors.balancePositive,
  },
  amountInput: {
    ...Typography.currencyDisplay,
    fontSize: 40,
    color: Colors.textPrimary,
    minWidth: 120,
    textAlign: 'center',
  },
  amountSubtext: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
  methodsCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: 12,
    borderRadius: Radius.xl,
  },
  methodRowSelected: {
    backgroundColor: Colors.surfaceSubtle,
  },
  methodLabel: {
    ...Typography.bodyLg,
    color: Colors.textPrimary,
    flex: 1,
  },
  confirmBtn: {
    height: 52,
    backgroundColor: Colors.balancePositive,
    borderRadius: Radius.r2xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  confirmBtnText: {
    ...Typography.headlineSm,
    color: Colors.onPrimary,
  },
  emptyCardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
  },
  emptySub: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  inviteBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.balancePositive,
    borderRadius: Radius.xl,
    marginTop: 8,
  },
  inviteBtnText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
});
