import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { useExpenses } from '../context/ExpenseContext';

export default function RoommatesScreen() {
  const router = useRouter();
  const { users, currentUser, roomCode, roomName } = useExpenses();

  const handleAddRoommate = () => {
    Alert.alert('Room Invite Code 📩', `Share code [ ${roomCode} ] with your 2 flatmates so they can connect instantly!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={`Roommates • ${roomCode}`} showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Flat Overview Header */}
        <View style={[styles.card, Theme.shadows.card]}>
          <View style={styles.groupBadge}>
            <Ionicons name="home" size={16} color={Colors.balancePositive} />
            <Text style={styles.groupBadgeText}>LIVE HOUSEHOLD</Text>
          </View>
          <Text style={styles.title}>{roomName}</Text>
          <Text style={styles.subtitle}>{users.length} active flatmates • Room Code: {roomCode}</Text>

          <TouchableOpacity style={styles.inviteBtn} onPress={handleAddRoommate}>
            <Ionicons name="person-add-outline" size={16} color={Colors.onPrimary} />
            <Text style={styles.inviteBtnText}>Share Room Code ({roomCode})</Text>
          </TouchableOpacity>
        </View>

        {/* Roommates List */}
        <View style={styles.section}>
          <Text style={styles.labelCaps}>HOUSEHOLD MEMBERS</Text>
          <View style={[styles.membersCard, Theme.shadows.subtle]}>
            {users.map((u) => (
              <View key={u.id} style={styles.userRow}>
                <Image source={{ uri: u.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{u.name}</Text>
                    {u.id === currentUser.id && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>YOU</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.userSubtext}>{u.email} • {u.phone}</Text>
                </View>
              </View>
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
    padding: Spacing.marginMobile,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.xs,
  },
  groupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.balancePositiveBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  groupBadgeText: {
    ...Typography.labelCaps,
    color: Colors.balancePositive,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  inviteBtn: {
    height: 44,
    backgroundColor: Colors.balancePositive,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  inviteBtnText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
  section: {
    gap: 6,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
  },
  membersCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  youBadge: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  youBadgeText: {
    ...Typography.labelCaps,
    fontSize: 9,
    color: Colors.textSecondary,
  },
  userSubtext: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
});
