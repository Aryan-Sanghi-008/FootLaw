// ============================================================
// FOOTLAW — Shared Types
// All TypeScript interfaces & enums used across client + server
// ============================================================

// ---- Enums ----

export enum Position {
  GK = 'GK',
  DL = 'DL',
  DC = 'DC',
  DR = 'DR',
  ML = 'ML',
  MC = 'MC',
  MR = 'MR',
  AML = 'AML',
  AMC = 'AMC',
  AMR = 'AMR',
  DMC = 'DMC',
  ST = 'ST',
}

export enum Morale {
  TERRIBLE = 'Terrible',
  POOR = 'Poor',
  FAIR = 'Fair',
  GOOD = 'Good',
  EXCELLENT = 'Excellent',
  SUPERB = 'Superb',
}

export enum AvatarStyle {
  TRACKSUIT = 'Tracksuit',
  BUSINESS_SUIT = 'Business Suit',
  SMART_CASUAL = 'Smart Casual',
}

export enum Mentality {
  HARD_DEFENDING = 'Hard Defending',
  NORMAL = 'Normal',
  HARD_ATTACKING = 'Hard Attacking',
}

export enum PassingStyle {
  MIXED = 'Mixed',
  LONG = 'Long',
  SHORT = 'Short',
}

export enum PressingIntensity {
  LOW = 'Low',
  HIGH = 'High',
}

export enum MatchEventType {
  KICK_OFF = 'KICK_OFF',
  PASS = 'PASS',
  SHOT_ON_TARGET = 'SHOT_ON_TARGET',
  SHOT_OFF_TARGET = 'SHOT_OFF_TARGET',
  GOAL = 'GOAL',
  SAVE = 'SAVE',
  TACKLE = 'TACKLE',
  FOUL = 'FOUL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  INJURY = 'INJURY',
  CORNER = 'CORNER',
  FREE_KICK = 'FREE_KICK',
  OFFSIDE = 'OFFSIDE',
  SUBSTITUTION = 'SUBSTITUTION',
  HALF_TIME = 'HALF_TIME',
  FULL_TIME = 'FULL_TIME',
}

export enum TouchlineShoutType {
  DEMAND_MORE = 'Demand More',
  TIGHTEN_UP = 'Tighten Up',
  STAY_FOCUSED = 'Stay Focused',
}

export enum PackType {
  GREEN = 'Green',   // Condition +15%
  RED = 'Red',       // Injury -1 day
  BLUE = 'Blue',     // Morale +1 tier
  NAME_CHANGE = 'Name Change',
}

export enum PassTier {
  CLASSIC = 'Classic',
  PRO = 'Pro',
  ULTIMATE = 'Ultimate',
}

export enum FacilityType {
  STADIUM = 'Stadium',
  PITCH_SURFACE = 'Pitch Surface',
  MEDICAL_CENTER = 'Medical Center',
  TRAINING_GROUND = 'Training Ground',
  FAN_SHOP = 'Fan Shop',
}

export enum AuctionStatus {
  ACTIVE = 'Active',
  KNOCKOUT = 'Knockout',
  SETTLED = 'Settled',
  EXPIRED = 'Expired',
}

// ---- Interfaces ----

export interface PlayerStats {
  fitness: number;
  strength: number;
  pace: number;
  aggression: number;
  positioning: number;
  creativity: number;
  passing: number;
  shooting: number;
  tackling: number;
  crossing: number;
}

export interface IPlayer {
  _id: string;
  clubId: string;
  firstName: string;
  lastName: string;
  age: number;
  position: Position;
  starRating: number;       // 1-10
  condition: number;         // 0-100
  morale: Morale;
  mastery: string | null;    // e.g. "Free Kick Specialist"
  isYouth: boolean;
  stats: PlayerStats;
  injuredUntil: string | null; // ISO date or null
  createdAt: string;
}

export interface IProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  nationality: string;
  avatarStyle: AvatarStyle;
  createdAt: string;
}

export interface IClub {
  _id: string;
  profileId: string;
  name: string;
  abbreviation: string;
  cash: number;
  tokens: number;
  leagueId: string | null;
  tier: number;
  facilities: IFacilities;
  createdAt: string;
}

export interface IFacilities {
  stadium: { level: number; capacity: number };
  pitchSurface: { level: number };
  medicalCenter: { level: number };
  trainingGround: { level: number };
  fanShop: { level: number };
}

export interface ITactics {
  formation: string;          // e.g. "4-4-2"
  mentality: Mentality;
  passingStyle: PassingStyle;
  pressingIntensity: PressingIntensity;
  lineup: ILineupSlot[];
}

export interface ILineupSlot {
  playerId: string;
  position: Position;
  x: number;  // 0-100 pitch position
  y: number;  // 0-100 pitch position
}

export interface IMatchEvent {
  id: string;
  type: MatchEventType;
  minute: number;           // 0-90 in-game minute
  playerId?: string;
  playerName?: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  teamSide: 'home' | 'away';
  commentary: string;
}

export interface IMatchTick {
  minute: number;
  second: number;
  ballPosition: { x: number; y: number };
  possession: 'home' | 'away';
  homePositions: Array<{ playerId: string; x: number; y: number }>;
  awayPositions: Array<{ playerId: string; x: number; y: number }>;
  score: { home: number; away: number };
}

export interface IMatchResult {
  matchId: string;
  homeClubId: string;
  awayClubId: string;
  homeScore: number;
  awayScore: number;
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  events: IMatchEvent[];
  manOfTheMatch: { playerId: string; playerName: string; rating: number };
}

export interface IFixture {
  _id: string;
  seasonId: string;
  leagueId: string;
  homeClubId: string;
  awayClubId: string;
  day: number;               // Day 3-28
  scheduledAt: string;       // ISO date
  status: 'scheduled' | 'live' | 'completed';
  resultId: string | null;
}

export interface ILeagueStanding {
  clubId: string;
  clubName: string;
  abbreviation: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

export interface IAuction {
  _id: string;
  playerId: string;
  sellerClubId: string;
  startingPrice: number;
  currentBid: number;
  currentBidderId: string | null;
  tokenCostPerBid: number;
  status: AuctionStatus;
  endsAt: string;            // ISO date
  bids: IAuctionBid[];
}

export interface IAuctionBid {
  bidderId: string;
  amount: number;
  tokenCost: number;
  placedAt: string;
}

export interface IInventoryItem {
  _id: string;
  clubId: string;
  type: PackType;
  quantity: number;
}

// ---- Auth ----

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateClubRequest {
  clubName: string;
  abbreviation: string;
  nationality: string;
  avatarStyle: AvatarStyle;
  managerFirstName: string;
  managerLastName: string;
}

// ---- API Responses ----

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
