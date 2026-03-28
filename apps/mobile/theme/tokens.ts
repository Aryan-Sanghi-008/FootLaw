// ============================================================
// FOOTLAW — Design Tokens
// Dark-mode-first theme system for the entire mobile app
// ============================================================

export const Colors = {
  // ---- Base ----
  background: '#0a0e1a',
  surface: '#111827',
  surfaceLight: '#1f2937',
  surfaceBorder: '#374151',

  // ---- Brand ----
  primary: '#3b82f6',        // Electric blue
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',

  // ---- Semantic ----
  success: '#10b981',        // Emerald
  successDark: '#059669',
  warning: '#f59e0b',        // Gold
  warningDark: '#d97706',
  danger: '#ef4444',         // Crimson
  dangerDark: '#dc2626',

  // ---- Premium ----
  gold: '#f59e0b',
  goldLight: '#fbbf24',
  goldGlow: 'rgba(245, 158, 11, 0.3)',

  // ---- Text ----
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  textInverse: '#111827',

  // ---- Pitch ----
  pitchGreen: '#1a472a',
  pitchLine: '#ffffff',
  pitchDark: '#0f2d1a',

  // ---- Morale Colors ----
  morale: {
    Terrible: '#ef4444',
    Poor: '#f97316',
    Fair: '#eab308',
    Good: '#22c55e',
    Superb: '#3b82f6',
  },

  // ---- Position Colors ----
  position: {
    GK: '#f59e0b',
    DL: '#22c55e', DC: '#22c55e', DR: '#22c55e',
    ML: '#3b82f6', MC: '#3b82f6', MR: '#3b82f6',
    AML: '#a855f7', AMC: '#a855f7', AMR: '#a855f7',
    ST: '#ef4444',
  },

  // ---- Misc ----
  overlay: 'rgba(0, 0, 0, 0.6)',
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
  heading: 'Outfit_600SemiBold',
  headingBold: 'Outfit_700Bold',
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
