import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import Theme from '../../constants/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useExpenses } from '../../context/ExpenseContext';

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { expenses, deleteExpense } = useExpenses();

  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Expense Details" showBack onBackPress={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Expense not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExpense(expense.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Expense Details"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Details Card */}
        <View style={[styles.card, Theme.shadows.card]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryEmoji}>{expense.categoryEmoji}</Text>
            <Text style={styles.categoryText}>{expense.category}</Text>
          </View>

          <Text style={styles.title}>{expense.title}</Text>
          <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Paid by <Text style={styles.boldText}>{expense.paidByName}</Text></Text>
            <Text style={styles.metaDate}>{expense.displayDate}</Text>
          </View>

          {expense.notes ? (
            <View style={styles.notesBox}>
              <Ionicons name="document-text-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.notesText}>{expense.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Split Breakdown */}
        <View style={styles.section}>
          <Text style={styles.labelCaps}>SPLIT BREAKDOWN</Text>
          <View style={[styles.splitsCard, Theme.shadows.subtle]}>
            {expense.splits.map((split, idx) => (
              <View key={idx} style={styles.splitRow}>
                <View style={styles.userDotRow}>
                  <View style={styles.userDot} />
                  <Text style={styles.userName}>{split.userName}</Text>
                </View>
                <Text style={styles.userShare}>₹{split.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Delete Expense Action */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={styles.deleteBtnText}>Delete Expense</Text>
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
  scrollContent: {
    padding: Spacing.marginMobile,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.bodyLg,
    color: Colors.textMuted,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    ...Typography.labelSm,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  amount: {
    ...Typography.currencyDisplay,
    color: Colors.balancePositive,
    marginVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaLabel: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
  },
  boldText: {
    color: Colors.textPrimary,
    fontFamily: Typography.headlineSm.fontFamily,
  },
  metaDate: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
  notesBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginTop: 4,
  },
  notesText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    flex: 1,
  },
  section: {
    gap: 6,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
  },
  splitsCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: 12,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.balancePositive,
  },
  userName: {
    ...Typography.bodyLg,
    color: Colors.textPrimary,
  },
  userShare: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  deleteBtn: {
    height: 48,
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.errorContainer,
    marginTop: Spacing.sm,
  },
  deleteBtnText: {
    ...Typography.labelMd,
    color: Colors.error,
  },
});
