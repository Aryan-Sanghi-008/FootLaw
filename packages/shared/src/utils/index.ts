// ============================================================
// FOOTLAW — Shared Utilities
// Pure functions used by both client and server
// ============================================================

import { type PlayerStats, Position, Morale } from '../types';
import { PLAYER, STAR_THRESHOLDS } from '../constants';

// ---- Stat Calculations ----

/** Calculate the average of all player stats */
export function calculateStatAverage(stats: PlayerStats): number {
  const values = Object.values(stats);
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

/** Calculate star rating from player stats */
export function calculateStarRating(stats: PlayerStats): number {
  const avg = calculateStatAverage(stats);
  const tier = STAR_THRESHOLDS.find(t => avg >= t.minAvg && avg <= t.maxAvg);
  return tier ? tier.stars : 1;
}

/** Apply morale multiplier to a stat value */
export function applyMoraleMultiplier(statValue: number, morale: Morale): number {
  const multiplier = PLAYER.MORALE_MULTIPLIERS[morale];
  return Math.round(statValue * multiplier);
}

/** Apply condition multiplier to a stat value (linear scale 0.5x at 0% to 1.0x at 100%) */
export function applyConditionMultiplier(statValue: number, condition: number): number {
  const multiplier = 0.5 + (condition / 100) * 0.5;
  return Math.round(statValue * multiplier);
}

/** Calculate effective stat with all multipliers applied */
export function effectiveStat(
  statValue: number,
  morale: Morale,
  condition: number,
  isInPosition: boolean,
): number {
  let value = statValue;
  value = applyMoraleMultiplier(value, morale);
  value = applyConditionMultiplier(value, condition);
  if (!isInPosition) {
    value = Math.round(value * PLAYER.OUT_OF_POSITION_PENALTY);
  }
  return Math.max(1, Math.min(100, value));
}

// ---- Position Helpers ----

const POSITION_GROUPS: Record<string, Position[]> = {
  goalkeeper: [Position.GK],
  defender: [Position.DL, Position.DC, Position.DR],
  midfielder: [Position.ML, Position.MC, Position.MR, Position.DMC],
  attacker: [Position.AML, Position.AMC, Position.AMR, Position.ST],
};

/** Check if a player's natural position matches a target position */
export function isPositionMatch(naturalPosition: Position, targetPosition: Position): boolean {
  if (naturalPosition === targetPosition) return true;

  // Allow some flexibility within groups
  for (const group of Object.values(POSITION_GROUPS)) {
    if (group.includes(naturalPosition) && group.includes(targetPosition)) {
      return true; // Same group = partial match (reduced penalty)
    }
  }
  return false;
}

/** Get the position group name */
export function getPositionGroup(position: Position): string {
  for (const [group, positions] of Object.entries(POSITION_GROUPS)) {
    if (positions.includes(position)) return group;
  }
  return 'unknown';
}

// ---- Formatting ----

/** Format cash as a short string (e.g. 1.2M, 500K) */
export function formatCash(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return amount.toString();
}

/** Format condition as a percentage string */
export function formatCondition(condition: number): string {
  return `${Math.round(condition)}%`;
}

/** Format match minute (e.g. "45+2'" or "67'") */
export function formatMatchMinute(minute: number): string {
  if (minute <= 45) return `${minute}'`;
  if (minute <= 47) return `45+${minute - 45}'`;
  if (minute <= 90) return `${minute}'`;
  return `90+${minute - 90}'`;
}

// ---- Random Helpers (Seeded) ----

/** Simple seeded PRNG (Mulberry32) for deterministic match simulation */
export function createSeededRNG(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a random element from an array using a seeded RNG */
export function seededPick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Generate a random integer between min and max (inclusive) using a seeded RNG */
export function seededInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
