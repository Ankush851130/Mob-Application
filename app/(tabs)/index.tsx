import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import Theme from '../../constants/theme';
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
    users,
    roomCode,
    roomName,
    youOweTotal,
    youAreOwedTotal,
    netBalanceTotal,
    roommateBalances,
    isLoaded,
  } = useExpenses();

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading FlatLedger...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader />
        <View style={styles.onboardingContainer}>
          <View style={[styles.onboardingCard, Theme.shadows.card]}>
            <Ionicons name="wallet-outline" size={48} color={Colors.balancePositive} />
            <Text style={styles.onboardingTitle}>Welcome to FlatLedger</Text>
            <Text style={styles.onboardingSub}>
              Smart, stress-free household expense management for flatmates.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.primaryBtnText}>Sign In to Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.secondaryBtnText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        onNotificationPress={() => router.push('/activity')}
        onProfilePress={() => router.push('/profile')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Greeting Banner */}
        <View style={styles.greetingContainer}>
          <View style={styles.greetingTextColumn}>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingTitle}>Hello, {currentUser.name}</Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
            <Text style={styles.greetingSubtitle}>
              {roomCode
                ? `${roomName || 'Flat'} • ${users.length} Flatmate${users.length === 1 ? '' : 's'}`
                : 'No active flat room connected'}
            </Text>
          </View>

          {roomCode ? (
            <TouchableOpacity style={styles.groupPill} onPress={() => router.push('/roommates')}>
              <View style={styles.groupDot} />
              <Text style={styles.groupPillText}>Key: {roomCode}</Text>
              <Ionicons name="chevron-forward" size={12} color={Colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.joinPill} onPress={() => router.push('/join-room')}>
              <Ionicons name="add-circle" size={14} color={Colors.onPrimary} />
              <Text style={styles.joinPillText}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* If User has NO room yet -> Prompt to Join or Create */}
        {!roomCode ? (
          <View style={[styles.noRoomCard, Theme.shadows.card]}>
            <Ionicons name="home-outline" size={40} color={Colors.balancePositive} />
            <Text style={styles.noRoomTitle}>You're Not in a Flat Room Yet</Text>
            <Text style={styles.noRoomSub}>
              Create a new flat room to invite roomies or enter an existing Room Key to join!
            </Text>

            <TouchableOpacity style={styles.createRoomBtn} onPress={() => router.push('/join-room')}>
              <Ionicons name="add" size={18} color={Colors.onPrimary} />
              <Text style={styles.createRoomBtnText}>Create or Join Flat Room</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Hero Net Balance Card */}
            <BalanceCard
              netBalance={netBalanceTotal}
              youOwe={youOweTotal}
              youAreOwed={youAreOwedTotal}
              onAddExpensePress={() => router.push('/add-expense')}
              onSettleUpPress={() => router.push('/settle-up')}
            />

            {/* Roommates Standing Section */}
            {roommateBalances.length > 0 && (
              <>
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
              </>
            )}

            {/* Recent Household Activity Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Expenses</Text>
              {expenses.length > 0 && (
                <TouchableOpacity onPress={() => router.push('/expenses')}>
                  <Text style={styles.seeAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            {expenses.length === 0 ? (
              <View style={styles.emptyExpensesCard}>
                <Text style={styles.emptyExpensesText}>No expenses logged yet in Room {roomCode}.</Text>
                <TouchableOpacity style={styles.addFirstBtn} onPress={() => router.push('/add-expense')}>
                  <Text style={styles.addFirstBtnText}>+ Add First Expense</Text>
                </TouchableOpacity>
              </View>
            ) : (
              expenses.slice(0, 4).map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onPress={() => router.push(`/expense/${expense.id}`)}
                />
              ))
            )}
          </>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.bodyMd,
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    paddingBottom: 90,
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
  joinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.balancePositive,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  joinPillText: {
    ...Typography.labelSm,
    color: Colors.onPrimary,
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
  noRoomCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    marginTop: Spacing.md,
  },
  noRoomTitle: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  noRoomSub: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  createRoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.balancePositive,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.xl,
    marginTop: 8,
  },
  createRoomBtnText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
  onboardingContainer: {
    flex: 1,
    padding: Spacing.marginMobile,
    justifyContent: 'center',
  },
  onboardingCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
  },
  onboardingTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.textPrimary,
  },
  onboardingSub: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.balancePositive,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
  secondaryBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDelicate,
  },
  secondaryBtnText: {
    ...Typography.labelMd,
    color: Colors.textPrimary,
  },
  emptyExpensesCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
  },
  emptyExpensesText: {
    ...Typography.bodyMd,
    color: Colors.textMuted,
  },
  addFirstBtn: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.balancePositiveBg,
    borderRadius: Radius.full,
  },
  addFirstBtnText: {
    ...Typography.labelSm,
    color: Colors.balancePositive,
  },
});
