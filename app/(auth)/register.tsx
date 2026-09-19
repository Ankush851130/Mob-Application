import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import Theme from '../../constants/theme';
import { FlatLedgerLogo } from '../../components/FlatLedgerLogo';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <FlatLedgerLogo size="lg" />
          <Text style={styles.tagline}>Create your account & join your flat</Text>
        </View>

        <View style={[styles.card, Theme.shadows.card]}>
          <Text style={styles.cardTitle}>Register</Text>

          <View style={styles.field}>
            <Text style={styles.labelCaps}>FULL NAME</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ankush" />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.labelCaps}>EMAIL ADDRESS</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.labelCaps}>PASSWORD</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
              <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            </View>
          </View>

          <TouchableOpacity style={[styles.loginBtn, Theme.shadows.glow]} onPress={handleRegister}>
            <Text style={styles.loginBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    flexGrow: 1,
    gap: Spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tagline: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r3xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
    gap: Spacing.md,
  },
  cardTitle: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
  },
  field: {
    gap: 4,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
  },
  inputBox: {
    height: 48,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderDelicate,
  },
  input: {
    flex: 1,
    ...Typography.bodyLg,
    color: Colors.textPrimary,
  },
  loginBtn: {
    height: 52,
    backgroundColor: Colors.balancePositive,
    borderRadius: Radius.r2xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  loginBtnText: {
    ...Typography.headlineSm,
    color: Colors.onPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
  },
  linkText: {
    ...Typography.headlineSm,
    fontSize: 14,
    color: Colors.balancePositive,
  },
});
