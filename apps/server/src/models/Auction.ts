import mongoose, { Schema, type Document } from 'mongoose';

export interface IAuctionBid {
  clubId: mongoose.Types.ObjectId;
  amount: number;
  createdAt: Date;
}

export interface IAuctionDocument extends Document {
  playerId: mongoose.Types.ObjectId;
  startPrice: number;
  currentBid: number;
  highestBidderId: mongoose.Types.ObjectId | null;
  endTime: Date;
  status: 'active' | 'completed' | 'cancelled';
  bids: IAuctionBid[];
  sellerId: mongoose.Types.ObjectId | null; // Null if system-generated
  createdAt: Date;
  updatedAt: Date;
}

const AuctionBidSchema = new Schema(
  {
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AuctionSchema = new Schema<IAuctionDocument>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, unique: true },
    startPrice: { type: Number, required: true },
    currentBid: { type: Number, required: true },
    highestBidderId: { type: Schema.Types.ObjectId, ref: 'Club', default: null },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    bids: [AuctionBidSchema],
    sellerId: { type: Schema.Types.ObjectId, ref: 'Club', default: null }
  },
  { timestamps: true }
);

AuctionSchema.index({ endTime: 1, status: 1 });

export const Auction = mongoose.model<IAuctionDocument>('Auction', AuctionSchema);
