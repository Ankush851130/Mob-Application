import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Radius, Spacing } from '../constants/spacing';
import Theme from '../constants/theme';
import { useExpenses } from '../context/ExpenseContext';

export default function JoinRoomScreen() {
  const router = useRouter();
  const { roomCode, joinFlatRoom, createFlatRoom } = useExpenses();
  const [inputCode, setInputCode] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inputCode.trim()) {
      Alert.alert('Room Key Required', 'Please enter a 6-character room key (e.g. AB12CD).');
      return;
    }

    setLoading(true);
    try {
      const res = await joinFlatRoom(inputCode.trim());
      if (res.success) {
        Alert.alert('Joined Flat Room! 🎉', `You are now a member of Room ${inputCode.trim().toUpperCase()}`);
        router.back();
      } else {
        Alert.alert('Join Error ❌', res.error || 'Invalid room key. Please check the code and try again.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not join room.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newRoomName.trim()) {
      Alert.alert('Flat Name Required', 'Please enter a name for your flat (e.g. Flatmates, Flat 302).');
      return;
    }

    setLoading(true);
    try {
      const res = await createFlatRoom(newRoomName.trim());
      if (res.success && res.code) {
        Alert.alert(
          'Room Created! 🏡',
          `Room "${newRoomName.trim()}" created successfully!\n\nYour Room Key is: ${res.code}\n\nShare this Room Key with your flatmates so they can join!`,
          [{ text: 'Great!', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Create Error ❌', res.error || 'Could not create flat room.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not create room.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect Flatmates</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        {/* Toggle Mode Pills */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'join' && styles.toggleActive]}
            onPress={() => setMode('join')}
          >
            <Text style={[styles.toggleText, mode === 'join' && styles.toggleTextActive]}>
              Join Room
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'create' && styles.toggleActive]}
            onPress={() => setMode('create')}
          >
            <Text style={[styles.toggleText, mode === 'create' && styles.toggleTextActive]}>
              Create Room
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'join' ? (
          <View style={[styles.card, Theme.shadows.subtle]}>
            <Text style={styles.label}>ENTER 6-CHARACTER ROOM KEY</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. AB12CD"
              placeholderTextColor={Colors.textMuted}
              value={inputCode}
              onChangeText={setInputCode}
              autoCapitalize="characters"
              maxLength={8}
            />
            {roomCode ? <Text style={styles.hint}>Current Room Key: {roomCode}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleJoin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Text style={styles.primaryBtnText}>Join Flat Room</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.card, Theme.shadows.subtle]}>
            <Text style={styles.label}>FLAT / ROOM NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Flatmates, Apartment 302"
              placeholderTextColor={Colors.textMuted}
              value={newRoomName}
              onChangeText={setNewRoomName}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Text style={styles.primaryBtnText}>Create New Room</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  container: {
    padding: Spacing.marginMobile,
    gap: Spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.full,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  toggleActive: {
    backgroundColor: Colors.surfaceCard,
  },
  toggleText: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.balancePositive,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.r2xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderTranslucent,
  },
  label: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
  },
  input: {
    height: 50,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  hint: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  primaryBtn: {
    height: 50,
    backgroundColor: Colors.balancePositive,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
});
