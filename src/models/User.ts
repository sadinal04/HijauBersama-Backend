import mongoose, { Document, Schema } from "mongoose";

export interface INotification {
  message: string;
  link: string;
  createdAt: Date;
  read?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
  profilePhoto?: string;
  notifications: mongoose.Types.DocumentArray<INotification>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    notifications: { type: [NotificationSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
