import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import Theme from '../../constants/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { RoommateCard } from '../../components/RoommateCard';
import { useExpenses } from '../../context/ExpenseContext';

export default function BalancesScreen() {
  const router = useRouter();
  const {
    youOweTotal,
    youAreOwedTotal,
    netBalanceTotal,
    roommateBalances,
  } = useExpenses();

  const isPositive = netBalanceTotal >= 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Balances & Settlement"
        onNotificationPress={() => router.push('/activity')}
        onProfilePress={() => router.push('/profile')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Room Balances Summary Card */}
        <View style={[styles.summaryCard, Theme.shadows.card]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="wallet-outline" size={20} color={Colors.balancePositive} />
              <Text style={styles.cardTitle}>Room 302 Balances</Text>
            </View>
            <View style={styles.optimizedPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.optimizedText}>Optimized Net</Text>
            </View>
          </View>

          {/* Main Net Standing */}
          <View style={styles.standingSection}>
            <Text style={styles.standingLabel}>Overall Balance</Text>
            <View style={styles.currencyRow}>
              <Text style={[styles.currencyText, isPositive ? styles.textPositive : styles.textNegative]}>
                {isPositive ? '+' : '-'}₹{Math.abs(netBalanceTotal).toFixed(2)}
              </Text>
              <View style={[styles.statusBadge, isPositive ? styles.badgePositive : styles.badgeNegative]}>
                <Text style={[styles.statusBadgeText, isPositive ? styles.textPositive : styles.textNegative]}>
                  {isPositive ? 'You are owed money' : 'You have pending debts'}
                </Text>
              </View>
            </View>
          </View>

          {/* Bento Box Sub-metrics */}
          <View style={styles.bentoContainer}>
            <View style={styles.bentoItem}>
              <View style={styles.bentoLabelRow}>
                <View style={[styles.dot, { backgroundColor: Colors.balancePositive }]} />
                <Text style={styles.bentoLabel}>You are owed</Text>
              </View>
              <Text style={[styles.bentoValue, styles.textPositive]}>
                ₹{youAreOwedTotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.bentoDivider} />

            <View style={styles.bentoItem}>
              <View style={styles.bentoLabelRow}>
                <View style={[styles.dot, { backgroundColor: Colors.balanceNegative }]} />
                <Text style={styles.bentoLabel}>You owe</Text>
              </View>
              <Text style={[styles.bentoValue, styles.textNegative]}>
                ₹{youOweTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Roommate Debts Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Roommate Balances</Text>
          <Text style={styles.activeSplitsText}>{roommateBalances.length} Active Splits</Text>
        </View>

        {roommateBalances.map((item) => (
          <RoommateCard
            key={item.user.id}
            item={item}
            onSettlePress={() => router.push('/settle-up')}
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
    paddingBottom: 90,
    gap: Spacing.md,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cardTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  optimizedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.balancePositiveBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.balancePositive,
  },
  optimizedText: {
    ...Typography.labelCaps,
    color: Colors.balancePositive,
    fontSize: 10,
  },
  standingSection: {
    gap: 2,
  },
  standingLabel: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  currencyText: {
    ...Typography.currencyDisplay,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgePositive: {
    backgroundColor: Colors.balancePositiveBg,
  },
  badgeNegative: {
    backgroundColor: Colors.balanceNegativeBg,
  },
  statusBadgeText: {
    ...Typography.labelCaps,
    fontSize: 10,
  },
  textPositive: {
    color: Colors.balancePositive,
  },
  textNegative: {
    color: Colors.balanceNegative,
  },
  bentoContainer: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bentoItem: {
    flex: 1,
    gap: 2,
  },
  bentoDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.borderDelicate,
    marginHorizontal: Spacing.sm,
  },
  bentoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bentoLabel: {
    ...Typography.labelSm,
    color: Colors.textSecondary,
  },
  bentoValue: {
    ...Typography.headlineSm,
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
  activeSplitsText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
});
