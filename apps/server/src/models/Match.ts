import mongoose, { Schema, type Document } from 'mongoose';

export interface IMatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'injury' | 'shot' | 'save' | 'foul';
  player1Id?: mongoose.Types.ObjectId; // E.g. Goalscorer
  player2Id?: mongoose.Types.ObjectId; // E.g. Assist or player fouled
  clubId: mongoose.Types.ObjectId; // Which club performed the event
  text: string; // Commentary text
}

export interface IMatchDocument extends Document {
  homeClubId: mongoose.Types.ObjectId;
  awayClubId: mongoose.Types.ObjectId;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'completed';
  competition: string; // e.g. 'World Tour', 'League'
  date: Date;
  events: IMatchEvent[];
  stats: {
    homePossession: number;
    awayPossession: number;
    homeShots: number;
    awayShots: number;
    homeShotsOnTarget: number;
    awayShotsOnTarget: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MatchEventSchema = new Schema(
  {
    minute: { type: Number, required: true },
    type: { 
      type: String, 
      enum: ['goal', 'yellow_card', 'red_card', 'substitution', 'injury', 'shot', 'save', 'foul'],
      required: true 
    },
    player1Id: { type: Schema.Types.ObjectId, ref: 'Player' },
    player2Id: { type: Schema.Types.ObjectId, ref: 'Player' },
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const MatchSchema = new Schema<IMatchDocument>(
  {
    homeClubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    awayClubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },
    competition: { type: String, required: true },
    date: { type: Date, required: true },
    events: [MatchEventSchema],
    stats: {
      homePossession: { type: Number, default: 50 },
      awayPossession: { type: Number, default: 50 },
      homeShots: { type: Number, default: 0 },
      awayShots: { type: Number, default: 0 },
      homeShotsOnTarget: { type: Number, default: 0 },
      awayShotsOnTarget: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

MatchSchema.index({ homeClubId: 1, date: -1 });
MatchSchema.index({ awayClubId: 1, date: -1 });
MatchSchema.index({ status: 1 });

export const Match = mongoose.model<IMatchDocument>('Match', MatchSchema);
