import mongoose, { Schema, type Document } from 'mongoose';
import { Position, Morale } from '@footlaw/shared';

export interface IPlayerDocument extends Document {
  clubId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  age: number;
  position: string;
  starRating: number;
  condition: number;
  morale: string;
  mastery: string | null;
  isYouth: boolean;
  stats: {
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
  };
  injuredUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerStatsSchema = new Schema(
  {
    fitness: { type: Number, required: true, min: 1, max: 100 },
    strength: { type: Number, required: true, min: 1, max: 100 },
    pace: { type: Number, required: true, min: 1, max: 100 },
    aggression: { type: Number, required: true, min: 1, max: 100 },
    positioning: { type: Number, required: true, min: 1, max: 100 },
    creativity: { type: Number, required: true, min: 1, max: 100 },
    passing: { type: Number, required: true, min: 1, max: 100 },
    shooting: { type: Number, required: true, min: 1, max: 100 },
    tackling: { type: Number, required: true, min: 1, max: 100 },
    crossing: { type: Number, required: true, min: 1, max: 100 },
  },
  { _id: false }
);

const PlayerSchema = new Schema<IPlayerDocument>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 16, max: 45 },
    position: { type: String, enum: Object.values(Position), required: true },
    starRating: { type: Number, required: true, min: 1, max: 10 },
    condition: { type: Number, default: 100, min: 0, max: 100 },
    morale: {
      type: String,
      enum: Object.values(Morale),
      default: Morale.GOOD,
    },
    mastery: { type: String, default: null },
    isYouth: { type: Boolean, default: false },
    stats: { type: PlayerStatsSchema, required: true },
    injuredUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

PlayerSchema.index({ clubId: 1 });
PlayerSchema.index({ position: 1 });
PlayerSchema.index({ starRating: -1 });

export const Player = mongoose.model<IPlayerDocument>('Player', PlayerSchema);
