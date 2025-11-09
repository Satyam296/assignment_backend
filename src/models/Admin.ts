import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  notificationEnabled: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    notificationEnabled: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 5 }, // Alert when stock drops below this
  },
  { timestamps: true }
);

export default mongoose.model<IAdmin>("Admin", AdminSchema);
