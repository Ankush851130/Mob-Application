import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { ScreenHeader } from '../../components/ScreenHeader';
import { BalanceCard } from '../../components/BalanceCard';
import { RoommateCard } from '../../components/RoommateCard';
import { ExpenseCard } from '../../components/ExpenseCard';
import { useExpenses } from '../../context/ExpenseContext';

export default function HomeScreen() {
  const router = useRouter();
  const {
    currentUser,
    expenses,
    youOweTotal,
    youAreOwedTotal,
    netBalanceTotal,
    roommateBalances,
  } = useExpenses();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        onNotificationPress={() => router.push('/activity')}
        onProfilePress={() => router.push('/profile')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Banner */}
        <View style={styles.greetingContainer}>
          <View style={styles.greetingTextColumn}>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingTitle}>Good morning, {currentUser.name}</Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
            <Text style={styles.greetingSubtitle}>Room 302 • 4 Flatmates sharing living costs</Text>
          </View>

          <TouchableOpacity
            style={styles.groupPill}
            onPress={() => router.push('/roommates')}
          >
            <View style={styles.groupDot} />
            <Text style={styles.groupPillText}>Flat 302</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero Net Balance Card */}
        <BalanceCard
          netBalance={netBalanceTotal}
          youOwe={youOweTotal}
          youAreOwed={youAreOwedTotal}
          onAddExpensePress={() => router.push('/add-expense')}
          onSettleUpPress={() => router.push('/settle-up')}
        />

        {/* Roommates Standing Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Roommate Debts</Text>
          <TouchableOpacity onPress={() => router.push('/balances')}>
            <Text style={styles.seeAllText}>See All ({roommateBalances.length})</Text>
          </TouchableOpacity>
        </View>

        {roommateBalances.map((item) => (
          <RoommateCard
            key={item.user.id}
            item={item}
            onSettlePress={() => router.push('/settle-up')}
          />
        ))}

        {/* Recent Household Activity Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => router.push('/expenses')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {expenses.slice(0, 3).map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onPress={() => router.push(`/expense/${expense.id}`)}
          />
        ))}
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
    paddingBottom: 90, // space for tab bar
    gap: Spacing.md,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTextColumn: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.textPrimary,
  },
  waveEmoji: {
    fontSize: 22,
  },
  greetingSubtitle: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  groupPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderDelicate,
  },
  groupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.balancePositive,
  },
  groupPillText: {
    ...Typography.labelSm,
    color: Colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  seeAllText: {
    ...Typography.labelSm,
    color: Colors.balancePositive,
  },
});
