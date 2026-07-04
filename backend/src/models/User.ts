import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "customer" | "admin";
  phone?: string;
  addresses: {
    label: string;
    street: string;
    suburb?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat?: number;
    lng?: number;
    isDefault: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    street: { type: String, required: true },
    suburb: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },
    lat: { type: Number },
    lng: { type: Number },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    image: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
