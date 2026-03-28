// ============================================================
// FOOTLAW — Game Constants
// Centralized values used by both client and server
// ============================================================

import { Position } from '../types';

// ---- Formations ----

export interface FormationPosition {
  position: Position;
  x: number; // 0-100
  y: number; // 0-100
}

export const FORMATIONS: Record<string, FormationPosition[]> = {
  '4-4-2': [
    { position: Position.GK, x: 50, y: 5 },
    { position: Position.DL, x: 15, y: 25 },
    { position: Position.DC, x: 38, y: 22 },
    { position: Position.DC, x: 62, y: 22 },
    { position: Position.DR, x: 85, y: 25 },
    { position: Position.ML, x: 15, y: 50 },
    { position: Position.MC, x: 38, y: 48 },
    { position: Position.MC, x: 62, y: 48 },
    { position: Position.MR, x: 85, y: 50 },
    { position: Position.ST, x: 38, y: 78 },
    { position: Position.ST, x: 62, y: 78 },
  ],
  '4-3-3': [
    { position: Position.GK, x: 50, y: 5 },
    { position: Position.DL, x: 15, y: 25 },
    { position: Position.DC, x: 38, y: 22 },
    { position: Position.DC, x: 62, y: 22 },
    { position: Position.DR, x: 85, y: 25 },
    { position: Position.MC, x: 30, y: 48 },
    { position: Position.MC, x: 50, y: 45 },
    { position: Position.MC, x: 70, y: 48 },
    { position: Position.AML, x: 20, y: 75 },
    { position: Position.ST, x: 50, y: 80 },
    { position: Position.AMR, x: 80, y: 75 },
  ],
  '4-2-3-1': [
    { position: Position.GK, x: 50, y: 5 },
    { position: Position.DL, x: 15, y: 25 },
    { position: Position.DC, x: 38, y: 22 },
    { position: Position.DC, x: 62, y: 22 },
    { position: Position.DR, x: 85, y: 25 },
    { position: Position.MC, x: 38, y: 42 },
    { position: Position.MC, x: 62, y: 42 },
    { position: Position.AML, x: 20, y: 62 },
    { position: Position.AMC, x: 50, y: 60 },
    { position: Position.AMR, x: 80, y: 62 },
    { position: Position.ST, x: 50, y: 82 },
  ],
  '3-5-2': [
    { position: Position.GK, x: 50, y: 5 },
    { position: Position.DC, x: 25, y: 22 },
    { position: Position.DC, x: 50, y: 20 },
    { position: Position.DC, x: 75, y: 22 },
    { position: Position.ML, x: 10, y: 50 },
    { position: Position.MC, x: 30, y: 45 },
    { position: Position.MC, x: 50, y: 42 },
    { position: Position.MC, x: 70, y: 45 },
    { position: Position.MR, x: 90, y: 50 },
    { position: Position.ST, x: 38, y: 78 },
    { position: Position.ST, x: 62, y: 78 },
  ],
  '5-3-2': [
    { position: Position.GK, x: 50, y: 5 },
    { position: Position.DL, x: 10, y: 30 },
    { position: Position.DC, x: 30, y: 22 },
    { position: Position.DC, x: 50, y: 20 },
    { position: Position.DC, x: 70, y: 22 },
    { position: Position.DR, x: 90, y: 30 },
    { position: Position.MC, x: 30, y: 48 },
    { position: Position.MC, x: 50, y: 45 },
    { position: Position.MC, x: 70, y: 48 },
    { position: Position.ST, x: 38, y: 78 },
    { position: Position.ST, x: 62, y: 78 },
  ],
};

// ---- Game Balance ----

export const GAME = {
  MATCH_DURATION_SECONDS: 600,           // 10 minutes real-time
  MATCH_TICKS: 600,                       // 1 tick per real second
  IN_GAME_MINUTES: 90,                    // 90 in-game minutes
  TICKS_PER_MINUTE: 600 / 90,             // ~6.67 ticks per in-game minute

  SEASON_DAYS: 28,
  LEAGUE_SIZE: 14,
  MATCHES_PER_SEASON: 26,                 // 14 teams * 2 - 2
  MATCH_START_DAY: 3,

  CUP_TEAMS: 128,
  CUP_MATCH_INTERVAL_DAYS: 2,

  ASSOCIATION_MIN_MEMBERS: 4,
  ASSOCIATION_MAX_MEMBERS: 6,

  STARTING_CASH: 500_000,
  STARTING_TOKENS: 10,
  STARTING_PLAYERS: 15,
} as const;

// ---- Player Generation ----

export const PLAYER = {
  MIN_AGE: 18,
  MAX_AGE: 21,
  MIN_STAR_RATING: 2,
  MAX_STAR_RATING: 3,

  CONDITION_DROP_PER_MATCH: { min: 10, max: 15 },
  CONDITION_REGEN_RATE: 5,               // 5% every 3 hours
  CONDITION_REGEN_INTERVAL_HOURS: 3,

  GREEN_PACK_RESTORE: 15,

  GROWTH_PEAK_START: 24,
  GROWTH_PEAK_END: 28,
  DECLINE_START: 32,
  DECLINE_RATE_PERCENT: 5,

  OUT_OF_POSITION_PENALTY: 0.6,          // 60% of normal performance

  MORALE_MULTIPLIERS: {
    Terrible: 0.80,
    Poor: 0.90,
    Fair: 1.00,
    Good: 1.05,
    Superb: 1.15,
  },
} as const;

// ---- Touchline Shouts ----

export const SHOUT_EFFECTS = {
  'Demand More': { stat: 'shooting', boost: 0.10, durationMinutes: 3 },
  'Tighten Up': { stat: 'tackling', boost: 0.10, durationMinutes: 3 },
  'Stay Focused': { stat: 'all', boost: 0.05, durationMinutes: 3 },
} as const;

export const SHOUT_COOLDOWN_SECONDS = 180; // 3 minutes

// ---- Manager Presence ----

export const MANAGER_PRESENCE_BONUS = 0.05; // +5% possession

// ---- Auction ----

export const AUCTION = {
  DEFAULT_DURATION_HOURS: 4,
  KNOCKOUT_THRESHOLD_SECONDS: 10,
  KNOCKOUT_RESET_SECONDS: 20,
  TOKEN_COST_PER_BID: 1,
} as const;

// ---- Facilities ----

export const FACILITY_MAX_LEVEL = {
  Stadium: 10,
  'Pitch Surface': 5,
  'Medical Center': 5,
  'Training Ground': 5,
  'Fan Shop': 5,
} as const;

// ---- Nationalities ----

export const NATIONALITIES = [
  'Argentina', 'Australia', 'Belgium', 'Brazil', 'Cameroon',
  'Canada', 'Chile', 'China', 'Colombia', 'Croatia',
  'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'England',
  'Finland', 'France', 'Germany', 'Ghana', 'Greece',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica',
  'Japan', 'Kenya', 'Mexico', 'Morocco', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Paraguay',
  'Peru', 'Poland', 'Portugal', 'Romania', 'Russia',
  'Saudi Arabia', 'Scotland', 'Senegal', 'Serbia', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Turkey',
  'Ukraine', 'United States', 'Uruguay', 'Venezuela', 'Wales',
] as const;

// ---- Masteries ----

export const MASTERIES = [
  'Free Kick Specialist',
  'Shadow Striker',
  'Sweeper Keeper',
  'Playmaker',
  'Target Man',
  'Box-to-Box',
  'Ball Playing Defender',
  'Inverted Winger',
  'Poacher',
  'Deep Lying Playmaker',
  'Complete Forward',
  'Regista',
] as const;

// ---- Star Rating Thresholds ----
// Average stat value maps to star rating

export const STAR_THRESHOLDS = [
  { stars: 1, minAvg: 0, maxAvg: 19 },
  { stars: 2, minAvg: 20, maxAvg: 29 },
  { stars: 3, minAvg: 30, maxAvg: 39 },
  { stars: 4, minAvg: 40, maxAvg: 49 },
  { stars: 5, minAvg: 50, maxAvg: 59 },
  { stars: 6, minAvg: 60, maxAvg: 69 },
  { stars: 7, minAvg: 70, maxAvg: 79 },
  { stars: 8, minAvg: 80, maxAvg: 87 },
  { stars: 9, minAvg: 88, maxAvg: 93 },
  { stars: 10, minAvg: 94, maxAvg: 100 },
] as const;
