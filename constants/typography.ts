export const FontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const Typography = {
  headlineXl: {
    fontFamily: FontFamily.extraBold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1,
  },
  headlineXlMobile: {
    fontFamily: FontFamily.extraBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  headlineLg: {
    fontFamily: FontFamily.bold,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  headlineLgMobile: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  headlineMd: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  headlineSm: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  bodyLg: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  bodyMd: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  labelCaps: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  labelMd: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  labelSm: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  currencyDisplay: {
    fontFamily: FontFamily.extraBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1,
  },
};
