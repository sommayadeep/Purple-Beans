import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  productId: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  category: string;
  rating: number;
  roastLevel: string;
  origin: string;
  notes: string[];
  reviews: {
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    image: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    roastLevel: { type: String, default: "" },
    origin: { type: String, default: "" },
    notes: { type: [String], default: [] },
    reviews: { type: [ReviewSchema], default: [] },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
