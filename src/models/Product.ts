import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
  id: string;
  name: string;
  color?: string;
  storage?: string;
  price: number;
  mrp: number;
  image: string;
  images?: string[]; // Multiple images for different angles/positions
  stock?: number; // Inventory count
}

export interface IEMIPlan {
  id: string;
  tenure: number;
  monthlyPayment: number;
  interestRate: number;
  cashback?: number;
  mutualFundName?: string;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IDownpaymentOption {
  id: string;
  amount: number;
  label: string;
}

export interface IProduct extends Document {
  slug: string;
  name: string;
  category: string;
  description: string;
  variants: IVariant[];
  emiPlans: IEMIPlan[];
  specifications?: ISpecification[];
  downpaymentOptions?: IDownpaymentOption[];
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema({
  id: String,
  name: String,
  color: String,
  storage: String,
  price: Number,
  mrp: Number,
  image: String,
  images: [String], // Array of image URLs
  stock: { type: Number, default: 10 }, // Default stock 10 units
});

const EMIPlanSchema = new Schema({
  id: String,
  tenure: Number,
  monthlyPayment: Number,
  interestRate: Number,
  cashback: Number,
  mutualFundName: String,
});

const SpecificationSchema = new Schema({
  key: String,
  value: String,
});

const DownpaymentOptionSchema = new Schema({
  id: String,
  amount: Number,
  label: String,
});

const ProductSchema = new Schema(
  {
    slug: { type: String, unique: true, required: true, lowercase: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    variants: [VariantSchema],
    emiPlans: [EMIPlanSchema],
    specifications: [SpecificationSchema],
    downpaymentOptions: [DownpaymentOptionSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
