import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';
import { ScreenHeader } from '../components/ScreenHeader';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [darkTheme, setDarkTheme] = React.useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="App Settings" showBack onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, Theme.shadows.card]}>
          <Text style={styles.labelCaps}>PREFERENCES</Text>

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Payment Reminders</Text>
              <Text style={styles.rowSub}>Receive alerts when flatmates post bills</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.borderDelicate, true: Colors.balancePositive }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Default Currency</Text>
              <Text style={styles.rowSub}>Indian Rupee (₹ INR)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
        </View>

        <View style={[styles.card, Theme.shadows.card]}>
          <Text style={styles.labelCaps}>ABOUT APP</Text>
          <Text style={styles.versionText}>FlatLedger Mobile App v1.0.0 (Stitch Edition)</Text>
          <Text style={styles.versionSub}>Designed with Google Material System & Expo React Native</Text>
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
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.sm,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...Typography.bodyLg,
    color: Colors.textPrimary,
  },
  rowSub: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDelicate,
  },
  versionText: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  versionSub: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
});
