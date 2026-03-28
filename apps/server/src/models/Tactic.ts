import mongoose, { Schema, type Document } from 'mongoose';

export interface ITacticDocument extends Document {
  clubId: mongoose.Types.ObjectId;
  formation: string; // e.g., '4-4-2', '4-3-3', '3-5-2'
  mentality: string; // e.g., 'Attacking', 'Defending', 'Normal'
  passingStyle: string; // e.g., 'Short', 'Long', 'Mixed'
  startingEleven: mongoose.Types.ObjectId[]; // Array of exactly 11 Player IDs
  substitutes: mongoose.Types.ObjectId[]; // Array of up to 7 Player IDs
  createdAt: Date;
  updatedAt: Date;
}

const TacticSchema = new Schema<ITacticDocument>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true, unique: true },
    formation: { 
      type: String, 
      required: true, 
      default: '4-4-2',
      enum: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '5-3-2', '4-5-1', '3-4-3'] // Standard default formations
    },
    mentality: { 
      type: String, 
      required: true, 
      default: 'Normal',
      enum: ['Attacking', 'Normal', 'Defending', 'Hard Defending']
    },
    passingStyle: { 
      type: String, 
      required: true, 
      default: 'Mixed',
      enum: ['Short', 'Long', 'Mixed', 'Focus Flanks', 'Focus Middle']
    },
    startingEleven: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
      validate: {
        validator: function(v: mongoose.Types.ObjectId[]) {
          return v.length <= 11; // Can be less if squad is incomplete, but max 11
        },
        message: 'A starting lineup cannot exceed 11 players.'
      },
      default: []
    },
    substitutes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
      validate: {
        validator: function(v: mongoose.Types.ObjectId[]) {
          return v.length <= 7;
        },
        message: 'You can only have up to 7 substitutes.'
      },
      default: []
    }
  },
  { timestamps: true }
);

export const Tactic = mongoose.model<ITacticDocument>('Tactic', TacticSchema);
