import mongoose, { Schema, type Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  password: string;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUserDocument>('User', UserSchema);
