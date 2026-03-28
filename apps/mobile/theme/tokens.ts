// ============================================================
// FOOTLAW — Design Tokens
// Dark-mode-first theme system for the entire mobile app
// ============================================================

export const Colors = {
  // ---- Base ----
  background: '#0f131f',
  surface: '#0f131f',
  surfaceVariant: '#313442',
  surfaceContainerLow: '#171b28',
  surfaceContainer: '#1b1f2c',
  surfaceContainerHigh: '#262a37',
  surfaceContainerHighest: '#313442',
  surfaceContainerLowest: '#0a0e1a',
  surfaceLight: '#353946',
  surfaceBorder: '#444650',
  outline: '#8e909c',
  outlineVariant: '#444650',

  // ---- Brand (Top Eleven Green) ----
  primary: '#2ae500', 
  onPrimary: '#053900',
  primaryContainer: '#033000',
  onPrimaryContainer: '#1ca600',
  primaryDark: '#106e00',
  primaryLight: '#79ff5b',
  
  // ---- Secondary (Cyan/Blue) ----
  secondary: '#bdf4ff',
  onSecondary: '#00363d',
  secondaryContainer: '#00e3fd',
  onSecondaryContainer: '#00616d',

  // ---- Tertiary (Purple/Indigo) ----
  tertiary: '#bdc2ff',
  onTertiary: '#1b247f',
  tertiaryContainer: '#111a77',
  onTertiaryContainer: '#7f88e5',

  // ---- Semantic ----
  success: '#2ae500',
  successDark: '#106e00',
  warning: '#f59e0b',
  warningDark: '#d97706',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  danger: '#ffb4ab',
  dangerDark: '#93000a',

  // ---- Premium ----
  gold: '#f59e0b',
  goldLight: '#fbbf24',
  goldGlow: 'rgba(245, 158, 11, 0.3)',

  // ---- Text ----
  textPrimary: '#dfe2f3',
  onSurface: '#dfe2f3',
  textSecondary: '#c5c6d2',
  onSurfaceVariant: '#c5c6d2',
  textMuted: '#8e909c',
  textInverse: '#0f131f',

  // ---- Pitch ----
  pitchGreen: '#0f131f', // Using background for pitch now based on gradient
  pitchLine: '#ffffff',
  pitchDark: '#0a0e1a',

  // ---- Morale Colors ----
  morale: {
    Terrible: '#ffb4ab',
    Poor: '#f97316',
    Fair: '#eab308',
    Good: '#2ae500',
    Superb: '#00e3fd',
  },

  // ---- Position Colors ----
  position: {
    GK: '#f59e0b',
    DL: '#2ae500', DC: '#2ae500', DR: '#2ae500',
    ML: '#00e3fd', MC: '#00e3fd', MR: '#00e3fd',
    AML: '#a855f7', AMC: '#a855f7', AMR: '#a855f7',
    ST: '#ffb4ab',
  },

  // ---- Misc ----
  overlay: 'rgba(15, 19, 31, 0.8)', // Matches stadium-bg linear gradient
  shimmer: 'rgba(255, 255, 255, 0.05)',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  heading: 'PlusJakartaSans_600SemiBold',
  headingBold: 'PlusJakartaSans_700Bold',
  headingBlack: 'PlusJakartaSans_800ExtraBold',
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  }),
} as const;
