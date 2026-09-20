import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { useExpenses } from '../context/ExpenseContext';

export default function ActivityScreen() {
  const router = useRouter();
  const { notifications, expenses, roomCode } = useExpenses();

  const displayItems = notifications.length > 0
    ? notifications
    : expenses.map((e) => ({
        id: e.id,
        title: e.title,
        body: `${e.paidByName} logged ₹${e.amount}`,
        categoryEmoji: e.categoryEmoji,
        createdAt: e.date,
      }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={`Activity Log • ${roomCode || 'Flat'}`} showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, Theme.shadows.subtle]}>
          <View style={styles.headerRow}>
            <Ionicons name="notifications" size={20} color={Colors.balancePositive} />
            <Text style={styles.cardTitle}>Live Roommate Activity Feed</Text>
          </View>
          <Text style={styles.cardSub}>
            {roomCode
              ? `Real-time notifications and action history for Room Key ${roomCode}`
              : 'Connect to a flat room to view room activity history'}
          </Text>
        </View>

        <Text style={styles.sectionHeader}>RECENT NOTIFICATIONS</Text>

        {displayItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No recent roommate activity yet.</Text>
          </View>
        ) : (
          displayItems.map((item) => (
            <View key={item.id} style={[styles.activityItem, Theme.shadows.subtle]}>
              <View style={styles.iconCircle}>
                <Text style={styles.emoji}>{item.categoryEmoji || '🔔'}</Text>
              </View>

              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.body}</Text>
              </View>
            </View>
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
    padding: Spacing.marginMobile,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  cardSub: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
    marginTop: 4,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.textMuted,
  },
  activityItem: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  itemSub: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
