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
import { Typography, FontFamily } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';
import { CategoryChip } from '../components/CategoryChip';
import { useExpenses } from '../context/ExpenseContext';

const QUICK_TAGS = [
  { label: '⚡ Electricity', category: 'Utilities' as const, emoji: '⚡' },
  { label: '🛒 Groceries', category: 'Groceries' as const, emoji: '🛒' },
  { label: '📶 WiFi', category: 'Internet' as const, emoji: '📶' },
  { label: '🍕 Dinner', category: 'Food & Dining' as const, emoji: '🍕' },
  { label: '💧 Water', category: 'Utilities' as const, emoji: '💧' },
  { label: '🧹 Maid', category: 'Rent' as const, emoji: '🧹' },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const { users, currentUser, addExpense, roomCode } = useExpenses();

  const [amount, setAmount] = useState('1800');
  const [title, setTitle] = useState('Electricity Bill');
  const [selectedCategory, setSelectedCategory] = useState<'Utilities' | 'Groceries' | 'Internet' | 'Food & Dining' | 'Rent' | 'Other'>('Utilities');
  const [categoryEmoji, setCategoryEmoji] = useState('⚡');
  const [paidById, setPaidById] = useState(currentUser.id);
  const [showPayerDropdown, setShowPayerDropdown] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(users.map((u) => u.id));

  const paidByUser = users.find((u) => u.id === paidById) || currentUser;
  const numParticipants = selectedUserIds.length || 1;
  const parsedAmount = parseFloat(amount) || 0;
  const equalShare = parsedAmount / numParticipants;

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      if (selectedUserIds.length === 1) {
        Alert.alert('Selection Error', 'At least 1 roommate must be included in the split.');
        return;
      }
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleSelectQuickTag = (tagLabel: string, category: any, emoji: string) => {
    setTitle(tagLabel.replace(/^[^\s]+\s/, ''));
    setSelectedCategory(category);
    setCategoryEmoji(emoji);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter an expense title.');
      return;
    }
    if (parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid expense amount greater than 0.');
      return;
    }

    const splits = selectedUserIds.map((uId) => {
      const u = users.find((usr) => usr.id === uId)!;
      return {
        userId: uId,
        userName: u.name,
        amount: equalShare,
      };
    });

    addExpense({
      title: title.trim(),
      category: selectedCategory,
      categoryEmoji,
      amount: parsedAmount,
      paidById,
      paidByName: paidByUser.name,
      date: new Date().toISOString().split('T')[0],
      displayDate: 'TODAY',
      splits,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Modal Navigation Header */}
      <View style={styles.topModalHeader}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={Colors.textSecondary} />
          <Text style={styles.headerBtnText}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.splittingPill}>
          <Ionicons name="flash" size={14} color={Colors.balancePositive} />
          <Text style={styles.splittingText}>Splitting {roomCode}</Text>
        </View>

        <TouchableOpacity style={styles.headerBtn} onPress={handleSave}>
          <Text style={[styles.headerBtnText, styles.saveText]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Amount Input Card */}
        <View style={[styles.card, Theme.shadows.card]}>
          <Text style={styles.labelCaps}>EXPENSE AMOUNT</Text>

          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <Text style={styles.subtext}>INR • Auto-divided among flatmates</Text>

          {/* Title Input */}
          <View style={styles.titleInputContainer}>
            <Ionicons name="create-outline" size={20} color={Colors.textMuted} />
            <TextInput
              style={styles.titleInput}
              placeholder="What's this for? (e.g. WiFi, Groceries)"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
            {title.length > 0 && (
              <TouchableOpacity onPress={() => setTitle('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Suggester Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            {QUICK_TAGS.map((tag, idx) => (
              <CategoryChip
                key={idx}
                label={tag.label}
                onPress={() => handleSelectQuickTag(tag.label, tag.category, tag.emoji)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Paid By Selector */}
        <View style={styles.sectionContainer}>
          <Text style={styles.labelCaps}>PAID BY</Text>
          <TouchableOpacity
            style={styles.payerSelector}
            onPress={() => setShowPayerDropdown(!showPayerDropdown)}
          >
            <Image source={{ uri: paidByUser.avatar }} style={styles.payerAvatar} />
            <View style={styles.payerInfo}>
              <Text style={styles.payerName}>
                {paidByUser.name} {paidByUser.id === currentUser.id ? '(You)' : ''}
              </Text>
              <Text style={styles.payerSubtext}>100% upfront</Text>
            </View>
            <Ionicons
              name={showPayerDropdown ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>

          {showPayerDropdown && (
            <View style={styles.dropdownCard}>
              {users.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPaidById(u.id);
                    setShowPayerDropdown(false);
                  }}
                >
                  <Image source={{ uri: u.avatar }} style={styles.smallAvatar} />
                  <Text style={styles.dropdownText}>
                    {u.name} {u.id === currentUser.id ? '(You)' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Split Breakdown Checklist */}
        <View style={styles.sectionContainer}>
          <View style={styles.splitHeader}>
            <Text style={styles.labelCaps}>SPLIT EQUALLY ({numParticipants} MEMBERS)</Text>
            <Text style={styles.shareBadge}>₹{equalShare.toFixed(2)} / person</Text>
          </View>

          <View style={[styles.checklistCard, Theme.shadows.subtle]}>
            {users.map((u) => {
              const isSelected = selectedUserIds.includes(u.id);
              return (
                <TouchableOpacity
                  key={u.id}
                  style={styles.checkRow}
                  onPress={() => handleToggleUser(u.id)}
                >
                  <Image source={{ uri: u.avatar }} style={styles.smallAvatar} />
                  <Text style={styles.checkName}>
                    {u.name} {u.id === currentUser.id ? '(You)' : ''}
                  </Text>

                  {isSelected && (
                    <Text style={styles.shareText}>₹{equalShare.toFixed(2)}</Text>
                  )}

                  <View
                    style={[
                      styles.checkbox,
                      isSelected ? styles.checkboxChecked : styles.checkboxUnchecked,
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color={Colors.onPrimary} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom Save Action Button */}
        <TouchableOpacity style={[styles.saveBtn, Theme.shadows.glow]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Expense</Text>
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
  topModalHeader: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerBtnText: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
  },
  saveText: {
    color: Colors.balancePositive,
    fontFamily: FontFamily.semiBold,
  },
  splittingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.balancePositiveBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  splittingText: {
    ...Typography.labelSm,
    color: Colors.balancePositive,
  },
  scrollContent: {
    padding: Spacing.marginMobile,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.xs,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: 4,
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
  subtext: {
    ...Typography.bodySm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  titleInputContainer: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  titleInput: {
    flex: 1,
    ...Typography.bodyLg,
    color: Colors.textPrimary,
  },
  chipsRow: {
    marginTop: Spacing.xs,
    width: '100%',
  },
  sectionContainer: {
    gap: 6,
  },
  payerSelector: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDelicate,
  },
  payerAvatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
  },
  payerInfo: {
    flex: 1,
  },
  payerName: {
    ...Typography.labelMd,
    color: Colors.textPrimary,
  },
  payerSubtext: {
    ...Typography.labelCaps,
    color: Colors.balancePositive,
    fontSize: 10,
  },
  dropdownCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.xl,
    padding: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderDelicate,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: 8,
    borderRadius: Radius.lg,
  },
  dropdownText: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shareBadge: {
    ...Typography.labelSm,
    color: Colors.balancePositive,
  },
  checklistCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: 8,
    borderRadius: Radius.lg,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
  },
  checkName: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    flex: 1,
  },
  shareText: {
    ...Typography.labelSm,
    color: Colors.textSecondary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.balancePositive,
  },
  checkboxUnchecked: {
    borderWidth: 1.5,
    borderColor: Colors.borderDelicate,
  },
  saveBtn: {
    height: 52,
    backgroundColor: Colors.balancePositive,
    borderRadius: Radius.r2xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  saveBtnText: {
    ...Typography.headlineSm,
    color: Colors.onPrimary,
  },
});
