import mongoose, { Schema, type Document } from 'mongoose';
import { AvatarStyle } from '@footlaw/shared';

export interface IProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  nationality: string;
  avatarStyle: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    nationality: { type: String, required: true },
    avatarStyle: {
      type: String,
      enum: Object.values(AvatarStyle),
      default: AvatarStyle.TRACKSUIT,
    },
  },
  { timestamps: true }
);

ProfileSchema.index({ userId: 1 });

export const Profile = mongoose.model<IProfileDocument>('Profile', ProfileSchema);
