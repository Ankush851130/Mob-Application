import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import Theme from '../../constants/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CategoryChip } from '../../components/CategoryChip';
import { ExpenseCard } from '../../components/ExpenseCard';
import { EmptyState } from '../../components/EmptyState';
import { useExpenses } from '../../context/ExpenseContext';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Utilities', label: 'Utilities', emoji: '⚡' },
  { id: 'Groceries', label: 'Groceries', emoji: '🛒' },
  { id: 'Internet', label: 'WiFi', emoji: '📶' },
  { id: 'Food & Dining', label: 'Food', emoji: '🍕' },
  { id: 'my_paid', label: 'Paid by me', emoji: '👤' },
];

export default function ExpensesScreen() {
  const router = useRouter();
  const { expenses, currentUser, roomCode } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeUserId = currentUser?.id || '';

  // Filter expenses based on search and category
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.paidByName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'my_paid') return exp.paidById === activeUserId;
      return exp.category === selectedCategory;
    });
  }, [expenses, searchQuery, selectedCategory, activeUserId]);

  const { categoryStats, totalMonthlySpend } = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const map: Record<string, { amount: number; color: string; label: string }> = {
      'Groceries': { amount: 0, color: Colors.primary, label: 'Groceries' },
      'Utilities': { amount: 0, color: Colors.categoryUtilities, label: 'Utils' },
      'Internet': { amount: 0, color: Colors.categoryWifi, label: 'WiFi' },
      'Food & Dining': { amount: 0, color: Colors.balanceNegative, label: 'Food' },
      'Rent': { amount: 0, color: '#8E44AD', label: 'Rent' },
      'Other': { amount: 0, color: Colors.textMuted, label: 'Other' },
    };

    expenses.forEach((e) => {
      const catKey = map[e.category] ? e.category : 'Other';
      map[catKey].amount += e.amount;
    });

    const stats = Object.keys(map)
      .map((k) => ({
        key: k,
        label: map[k].label,
        color: map[k].color,
        amount: map[k].amount,
        pct: total > 0 ? Math.round((map[k].amount / total) * 100) : 0,
      }))
      .filter((item) => item.pct > 0);

    return { categoryStats: stats, totalMonthlySpend: total };
  }, [expenses]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={`Expenses • ${roomCode || 'Flat'}`}
        onNotificationPress={() => router.push('/activity')}
        onProfilePress={() => router.push('/profile')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, category, or roommate..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Pills Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              emoji={cat.emoji}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>

        {/* Monthly Household Overview Banner */}
        <View style={[styles.overviewCard, Theme.shadows.subtle]}>
          <View style={styles.overviewTopRow}>
            <View>
              <Text style={styles.labelCaps}>HOUSEHOLD OVERVIEW</Text>
              <Text style={styles.monthTitle}>Household Spend • {expenses.length} bills</Text>
            </View>
            <View style={styles.spendColumn}>
              <Text style={styles.spendAmount}>₹{totalMonthlySpend.toLocaleString('en-IN')}</Text>
              <Text style={styles.spendLabel}>total spend</Text>
            </View>
          </View>

          {/* Spend Distribution Mini Bar */}
          <View style={styles.barContainer}>
            {categoryStats.length > 0 ? (
              categoryStats.map((item) => (
                <View
                  key={item.key}
                  style={[styles.barSegment, { width: `${item.pct}%`, backgroundColor: item.color }]}
                />
              ))
            ) : (
              <View style={[styles.barSegment, { width: '100%', backgroundColor: Colors.surfaceContainer }]} />
            )}
          </View>

          {/* Dynamic Mini Legend */}
          <View style={styles.legendRow}>
            {categoryStats.map((item) => (
              <View key={item.key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label} {item.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Grouped Expenses List */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>All Transactions</Text>
          <Text style={styles.countText}>{filteredExpenses.length} items</Text>
        </View>

        {filteredExpenses.length === 0 ? (
          <EmptyState
            title="No Expenses Found"
            message="Try searching for a different keyword or category filter."
          />
        ) : (
          filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onPress={() => router.push(`/expense/${expense.id}`)}
            />
          ))
        )}
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
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    paddingBottom: 90,
    gap: Spacing.md,
  },
  searchContainer: {
    height: 48,
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.borderDelicate,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  chipsScroll: {
    paddingVertical: 2,
  },
  overviewCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
  },
  overviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
  },
  monthTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  spendColumn: {
    alignItems: 'flex-end',
  },
  spendAmount: {
    ...Typography.headlineMd,
    color: Colors.balancePositive,
  },
  spendLabel: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceContainer,
    flexDirection: 'row',
    overflow: 'hidden',
    gap: 2,
  },
  barSegment: {
    height: '100%',
    borderRadius: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
    fontSize: 9,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  listHeaderTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  countText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
});
