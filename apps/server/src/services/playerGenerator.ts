// ============================================================
// Player Generation Service
// Creates randomized players for new clubs
// ============================================================

import { Position, Morale, type PlayerStats } from '@footlaw/shared';
import { PLAYER, GAME } from '@footlaw/shared';
import { calculateStarRating } from '@footlaw/shared';
import { Player } from '../models';
import mongoose from 'mongoose';

// ---- Name pools ----

const FIRST_NAMES = [
  'James', 'Carlos', 'Luca', 'Mohammed', 'Yuki', 'Lars', 'Pierre', 'Diego',
  'Alex', 'Marco', 'Andre', 'Kenji', 'Omar', 'David', 'Rafael', 'Sven',
  'Rui', 'Emile', 'Niko', 'Hassan', 'Kwame', 'Theo', 'Mateo', 'Tomas',
  'Victor', 'Leo', 'Bruno', 'Felix', 'Emir', 'Javier', 'Paolo', 'Mikael',
  'Ivan', 'Anton', 'Faris', 'Chen', 'Samir', 'Daniel', 'Eric', 'Hugo',
];

const LAST_NAMES = [
  'Silva', 'Mueller', 'Tanaka', 'Jensen', 'Garcia', 'Rossi', 'Dubois',
  'Kim', 'Rodriguez', 'Schmidt', 'Andersson', 'Santos', 'Fischer', 'Lopez',
  'Martin', 'Hernandez', 'Costa', 'Berg', 'Nakamura', 'Ali', 'Williams',
  'Fernandez', 'Petrov', 'Moreno', 'Ricci', 'Larsson', 'Torres', 'Weber',
  'Patel', 'Okafor', 'Mensah', 'Park', 'Nguyen', 'Ivanov', 'Kone', 'Cruz',
  'Diallo', 'Eriksen', 'Novak', 'Souza',
];

// ---- Position distribution for a 15-player squad ----

const SQUAD_POSITIONS: Position[] = [
  Position.GK, Position.GK,                         // 2 keepers
  Position.DL, Position.DC, Position.DC, Position.DR, // 4 defenders
  Position.ML, Position.MC, Position.MC, Position.MR, // 4 midfielders
  Position.AML, Position.AMC, Position.AMR,            // 3 attackers
  Position.ST, Position.ST,                            // 2 strikers
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate stats for a 2-3 star player (avg 20-39) */
function generateStarterStats(): PlayerStats {
  const targetAvg = randomInt(22, 38);
  const variance = 12;

  const genStat = () => {
    const val = targetAvg + randomInt(-variance, variance);
    return Math.max(5, Math.min(65, val));
  };

  return {
    fitness: genStat(),
    strength: genStat(),
    pace: genStat(),
    aggression: genStat(),
    positioning: genStat(),
    creativity: genStat(),
    passing: genStat(),
    shooting: genStat(),
    tackling: genStat(),
    crossing: genStat(),
  };
}

/** Generate a full squad of 15 starter players for a new club */
export async function generateStarterSquad(
  clubId: mongoose.Types.ObjectId
): Promise<void> {
  const usedNames = new Set<string>();
  const players = [];

  for (const position of SQUAD_POSITIONS) {
    // Generate unique name
    let firstName: string;
    let lastName: string;
    let fullName: string;

    do {
      firstName = randomPick(FIRST_NAMES);
      lastName = randomPick(LAST_NAMES);
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));

    usedNames.add(fullName);

    const stats = generateStarterStats();
    const starRating = calculateStarRating(stats);
    const age = randomInt(PLAYER.MIN_AGE, PLAYER.MAX_AGE);

    players.push({
      clubId,
      firstName,
      lastName,
      age,
      position,
      starRating,
      condition: 100,
      morale: Morale.GOOD,
      mastery: null,
      isYouth: false,
      stats,
      injuredUntil: null,
    });
  }

  await Player.insertMany(players);
  console.log(`⚽ Generated ${players.length} players for club ${clubId}`);
}
