import mongoose, { Schema, type Document } from 'mongoose';
import { GAME } from '@footlaw/shared';

export interface IFacilitiesData {
  stadium: { level: number; capacity: number };
  pitchSurface: { level: number };
  medicalCenter: { level: number };
  trainingGround: { level: number };
  fanShop: { level: number };
}

export interface IClubDocument extends Document {
  profileId: mongoose.Types.ObjectId;
  name: string;
  abbreviation: string;
  cash: number;
  tokens: number;
  leagueId: mongoose.Types.ObjectId | null;
  tier: number;
  facilities: IFacilitiesData;
  tutorialCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FacilitiesSchema = new Schema(
  {
    stadium: {
      level: { type: Number, default: 1 },
      capacity: { type: Number, default: 5000 },
    },
    pitchSurface: { level: { type: Number, default: 1 } },
    medicalCenter: { level: { type: Number, default: 1 } },
    trainingGround: { level: { type: Number, default: 1 } },
    fanShop: { level: { type: Number, default: 1 } },
  },
  { _id: false }
);

const ClubSchema = new Schema<IClubDocument>(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 20 },
    abbreviation: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
    },
    cash: { type: Number, default: GAME.STARTING_CASH },
    tokens: { type: Number, default: GAME.STARTING_TOKENS },
    leagueId: { type: Schema.Types.ObjectId, ref: 'League', default: null },
    tier: { type: Number, default: 10 }, // Start at the lowest tier
    facilities: { type: FacilitiesSchema, default: () => ({}) },
    tutorialCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ClubSchema.index({ profileId: 1 });
ClubSchema.index({ leagueId: 1 });
ClubSchema.index({ tier: 1 });

export const Club = mongoose.model<IClubDocument>('Club', ClubSchema);
