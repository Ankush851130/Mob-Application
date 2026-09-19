import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import Theme from '../../constants/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { ActivityItem } from '../../components/ActivityItem';
import { useExpenses } from '../../context/ExpenseContext';

export default function ActivityScreen() {
  const router = useRouter();
  const { expenses } = useExpenses();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Activity Log"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, Theme.shadows.card]}>
          <Text style={styles.cardTitle}>Recent Household Activity</Text>
          <Text style={styles.cardSubtitle}>Audit trail of expenses, splits, and settlements</Text>

          <View style={styles.timeline}>
            {expenses.map((expense) => (
              <ActivityItem key={expense.id} expense={expense} />
            ))}
          </View>
        </View>
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
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.xs,
  },
  cardTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  timeline: {
    gap: Spacing.md,
  },
});
