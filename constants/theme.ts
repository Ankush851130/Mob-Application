import { Colors } from './colors';
import { Typography, FontFamily } from './typography';
import { Spacing, Radius } from './spacing';

export const Theme = {
  colors: Colors,
  typography: Typography,
  fonts: FontFamily,
  spacing: Spacing,
  radius: Radius,
  shadows: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    glow: {
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 14,
      elevation: 5,
    },
    subtle: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 2,
    },
  },
};

export default Theme;
