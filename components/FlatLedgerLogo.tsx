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
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 24;
  const textSize = size === 'sm' ? Typography.headlineSm : size === 'lg' ? Typography.headlineLgMobile : Typography.headlineSm;

  return (
    <View style={styles.container}>
      <View style={[styles.iconBadge, { width: iconSize + 12, height: iconSize + 12 }]}>
        <Ionicons name="wallet-outline" size={iconSize} color={Colors.primary} />
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
    backgroundColor: Colors.balancePositiveBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
