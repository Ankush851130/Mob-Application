import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, FontFamily } from '../constants/typography';

interface FlatLedgerLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const FlatLedgerLogo: React.FC<FlatLedgerLogoProps> = ({ size = 'md', showText = true }) => {
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;
  const badgeSize = size === 'sm' ? 32 : size === 'lg' ? 56 : 40;
  const borderRadius = size === 'sm' ? 10 : size === 'lg' ? 18 : 12;
  const textSize = size === 'sm' ? Typography.headlineSm : size === 'lg' ? Typography.headlineLgMobile : Typography.headlineSm;

  return (
    <View style={styles.container}>
      <View style={[styles.iconBadge, { width: badgeSize, height: badgeSize, borderRadius }]}>
        <Ionicons name="wallet" size={iconSize} color={Colors.onPrimary} />
      </View>
      {showText && (
        <Text style={[styles.text, textSize]}>
          Flat<Text style={styles.highlightText}>Ledger</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBadge: {
    backgroundColor: Colors.balancePositive,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.balancePositive,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  highlightText: {
    color: Colors.balancePositive,
    fontFamily: FontFamily.bold,
  },
});
