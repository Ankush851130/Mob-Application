import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';
import { CURRENT_USER } from '../data/mockUsers';
import { FlatLedgerLogo } from './FlatLedgerLogo';

interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.brandRow}>
          <FlatLedgerLogo size="sm" showText={false} />
          <View style={styles.titleColumn}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.brandText}>FlatLedger</Text>
              <View style={styles.roomBadge}>
                <Ionicons name="business" size={10} color={Colors.balancePositive} />
                <Text style={styles.roomBadgeText}>ROOM 302</Text>
              </View>
            </View>
            {title ? <Text style={styles.subTitle}>{title}</Text> : null}
          </View>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
          <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.avatarButton} onPress={onProfilePress}>
          <Image source={{ uri: CURRENT_USER.avatar }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: Spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(247, 249, 251, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDelicate,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.balancePositiveBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  roomBadgeText: {
    ...Typography.labelCaps,
    color: Colors.balancePositive,
    fontSize: 10,
  },
  subTitle: {
    ...Typography.labelSm,
    color: Colors.textSecondary,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.borderDelicate,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
