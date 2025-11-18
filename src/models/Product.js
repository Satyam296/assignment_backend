"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var VariantSchema = new mongoose_1.Schema({
    id: String,
    name: String,
    color: String,
    storage: String,
    price: Number,
    mrp: Number,
    image: String,
    images: [String], // Array of image URLs
    stock: { type: Number, default: 10 }, // Default stock 10 units
    availableEmiPlans: [String], // Array of EMI plan IDs available for this variant
});
var EMIPlanSchema = new mongoose_1.Schema({
    id: String,
    tenure: Number,
    monthlyPayment: Number,
    interestRate: Number,
    cashback: Number,
    mutualFundName: String,
});
var SpecificationSchema = new mongoose_1.Schema({
    key: String,
    value: String,
});
var DownpaymentOptionSchema = new mongoose_1.Schema({
    id: String,
    amount: Number,
    label: String,
});
var ProductSchema = new mongoose_1.Schema({
    slug: { type: String, unique: true, required: true, lowercase: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    variants: [VariantSchema],
    emiPlans: [EMIPlanSchema],
    specifications: [SpecificationSchema],
    downpaymentOptions: [DownpaymentOptionSchema],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Product", ProductSchema);
