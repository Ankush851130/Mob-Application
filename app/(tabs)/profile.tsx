import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import Theme from '../../constants/theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { CURRENT_USER } from '../../data/mockUsers';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/(auth)/login') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Account & Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={[styles.profileCard, Theme.shadows.card]}>
          <Image source={{ uri: CURRENT_USER.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{CURRENT_USER.name}</Text>
          <Text style={styles.userEmail}>{CURRENT_USER.email}</Text>

          <View style={styles.roomTag}>
            <Ionicons name="business" size={14} color={Colors.balancePositive} />
            <Text style={styles.roomTagText}>{CURRENT_USER.room} • Flat 302</Text>
          </View>
        </View>

        {/* Menu Options Group */}
        <View style={[styles.menuCard, Theme.shadows.card]}>
          <Text style={styles.menuSectionTitle}>HOUSEHOLD & ROOMMATES</Text>

          <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/roommates')}>
            <View style={styles.menuIconBox}>
              <Ionicons name="people-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Roommates & Flat 302</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/settings')}>
            <View style={styles.menuIconBox}>
              <Ionicons name="settings-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>App Settings & Currency</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/activity')}>
            <View style={styles.menuIconBox}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Activity Audit History</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out of FlatLedger</Text>
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
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    paddingBottom: 90,
    gap: Spacing.md,
  },
  profileCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    marginBottom: 4,
  },
  userName: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
  },
  userEmail: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
  roomTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.balancePositiveBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  roomTagText: {
    ...Typography.labelSm,
    color: Colors.balancePositive,
  },
  menuCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.xs,
  },
  menuSectionTitle: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    marginLeft: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: Spacing.sm,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    ...Typography.bodyLg,
    color: Colors.textPrimary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDelicate,
    marginLeft: 44,
  },
  logoutBtn: {
    height: 48,
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.errorContainer,
    marginTop: Spacing.xs,
  },
  logoutText: {
    ...Typography.labelMd,
    color: Colors.error,
  },
});
