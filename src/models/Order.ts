import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  productId: string;
  productName: string;
  variantId: string;
  variantColor?: string;
  variantStorage?: string;
  variantPrice: number;
  emiPlanId: string;
  emiTenure: number;
  monthlyPayment: number;
  interestRate: number;
  cashback?: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    variantId: { type: String, required: true },
    variantColor: { type: String },
    variantStorage: { type: String },
    variantPrice: { type: Number, required: true },
    emiPlanId: { type: String, required: true },
    emiTenure: { type: Number, required: true },
    monthlyPayment: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    cashback: { type: Number },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
