import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/emi-products";

const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) {
    return Math.round(principal / tenureMonths);
  }
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
  return Math.round(numerator / denominator);
};
const generateEMIPlans = () => {
  return [
    {
      id: "p1",
      tenure: 3,
      interestRate: 0,
      cashback: 0,
      mutualFundName: "ICICI Bank",
    },
    {
      id: "p2",
      tenure: 6,
      interestRate: 1.73,
      cashback: 500,
      mutualFundName: "HDFC Bank",
    },
    {
      id: "p3",
      tenure: 9,
      interestRate: 1.88,
      cashback: 1000,
      mutualFundName: "Axis Bank",
    },
    {
      id: "p4",
      tenure: 12,
      interestRate: 1.89,
      cashback: 1500,
      mutualFundName: "Kotak Mahindra",
    },
  ];
};

const seedData = [
  {
    slug: "iphone-17-pro",
    name: "Apple iPhone 17 Pro",
    category: "Smartphones",
    description: "Latest Apple flagship smartphone with advanced features",
    specifications: [
      { key: "Storage", value: "256 GB" },
      { key: "Color", value: "Cosmic Orange" },
      { key: "Front Camera", value: "18MP" },
      { key: "Front Camera Features", value: "18MP front cam with autofocus, Center Stage, Night mode, HDR 5, portraits, Animoji, 4K stabilized video, spatial audio, and dual capture features." },
      { key: "Rear Camera", value: "48MP + 48MP + 48MP" },
      { key: "Rear Camera Features", value: "48MP Fusion system with 4 lenses, 8x zoom, up to 40x digital, ProRAW, Night mode, Smart HDR 5, macro, spatial photos, and advanced stabilization." },
      { key: "Screen Size", value: "6.3 inch" },
      { key: "Screen Resolution", value: "2622 x 1206 Pixels" },
      { key: "Screen Type", value: "Super Retina XDR Display" },
      { key: "Processor", value: "A19 Chip, 6 Core Processor" },
      { key: "Core", value: "Hexa Core" },
      { key: "Operating System", value: "iOS 26" },
      { key: "SIM Type", value: "Dual Sim" },
      { key: "Package", value: "Handset, USB C Charge Cable (1m), Documentation" },
    ],
    downpaymentOptions: [
      { id: "dp1", amount: 20235, label: "₹20235" },
      { id: "dp2", amount: 40470, label: "₹40470" },
    ],
    variants: [
      {
        id: "v1",
        name: "Silver 256GB",
        color: "Silver",
        storage: "256GB",
        price: 134900,
        mrp: 149900,
        stock: 8,
        image: "https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558",
        images: [
          "https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558",
          "https://images.snapmint.com/product_assets/images/001/154/807/large/open-uri20251021-2855301-1w6zv?1761017558",
          "https://images.snapmint.com/product_assets/images/001/154/808/large/open-uri20251021-2855301-4vhtc4?1761017558",
          "https://images.snapmint.com/product_assets/images/001/154/809/large/open-uri20251021-2855301-dn3u82?1761017558",
          "https://images.snapmint.com/product_assets/images/001/154/810/large/open-uri20251021-2855301-rptlrs?1761017558",
          "https://images.snapmint.com/product_assets/images/001/154/811/large/open-uri20251021-2855301-15vrhwi?1761017559",
          "https://images.snapmint.com/product_assets/images/001/154/812/large/open-uri20251021-2855301-ejci3q?1761017559",
        ],
      },
      {
        id: "v2",
        name: "Silver 512GB",
        color: "Silver",
        storage: "512GB",
        price: 154900,
        mrp: 169900,
        stock: 0, // Out of stock for testing
        image: "https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558",
        // Images will be shared from 256GB Silver variant automatically
      },
      {
        id: "v3",
        name: "Cosmic Orange 256GB",
        color: "Cosmic Orange",
        storage: "256GB",
        price: 139900,
        mrp: 149900,
        stock: 12,
        image: "https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541",
        images: [
          "https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541",
          "https://images.snapmint.com/product_assets/images/001/154/793/large/open-uri20251021-2855301-14q9hu6?1761017541",
          "https://images.snapmint.com/product_assets/images/001/154/794/large/open-uri20251021-2855301-151nlj6?1761017541",
          "https://images.snapmint.com/product_assets/images/001/154/795/thumb/open-uri20251021-2855301-140js9k?1761017541",
          "https://images.snapmint.com/product_assets/images/001/154/796/large/open-uri20251021-2855301-1ekq5ib?1761017541",
          "https://images.snapmint.com/product_assets/images/001/154/797/large/open-uri20251021-2855301-1t6xkcw?1761017541",
          "https://images.snapmint.com/product_assets/images/001/154/798/thumb/open-uri20251021-2855301-osqdu7?1761017541",
        ],
      },
      {
        id: "v4",
        name: "Cosmic Orange 512GB",
        color: "Cosmic Orange",
        storage: "512GB",
        price: 159900,
        mrp: 169900,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541",
        // Images will be shared from 256GB Cosmic Orange variant automatically
      },
      {
        id: "v5",
        name: "Deep Blue 256GB",
        color: "Deep Blue",
        storage: "256GB",
        price: 136900,
        mrp: 149900,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549",
        images: [
          "https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549",
          "https://images.snapmint.com/product_assets/images/001/154/800/large/open-uri20251021-2855301-9rqvoi?1761017549",
          "https://images.snapmint.com/product_assets/images/001/154/801/large/open-uri20251021-2855301-swkfff?1761017549",
          "https://images.snapmint.com/product_assets/images/001/154/802/large/open-uri20251021-2855301-1v24c0v?1761017549",
          "https://images.snapmint.com/product_assets/images/001/154/803/large/open-uri20251021-2855301-4r63e4?1761017550",
          "https://images.snapmint.com/product_assets/images/001/154/804/large/open-uri20251021-2855301-1p4q298?1761017550",
          "https://images.snapmint.com/product_assets/images/001/154/805/large/open-uri20251021-2855301-12nmluz?1761017550",
        ],
      },
      {
        id: "v6",
        name: "Deep Blue 512GB",
        color: "Deep Blue",
        storage: "512GB",
        price: 156900,
        mrp: 169900,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549",
        // Images will be shared from 256GB Deep Blue variant automatically
      },
    ],
    emiPlans: generateEMIPlans(), // EMI plans (monthly payment calculated on frontend based on selected variant)
  },
  {
    slug: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    description: "Premium Samsung smartphone with exceptional display",
    specifications: [
      { key: "Storage", value: "256 GB" },
      { key: "Color", value: "Phantom Black" },
      { key: "Front Camera", value: "12MP" },
      { key: "Front Camera Features", value: "12MP with Dual Pixel AF, 4K video recording at 60fps, Auto HDR" },
      { key: "Rear Camera", value: "200MP + 50MP + 12MP + 10MP" },
      { key: "Rear Camera Features", value: "200MP Wide, 50MP Periscope Telephoto, 12MP Ultra Wide, 10MP Telephoto with OIS, 100x Space Zoom" },
      { key: "Screen Size", value: "6.8 inch" },
      { key: "Screen Resolution", value: "3120 x 1440 Pixels" },
      { key: "Screen Type", value: "Dynamic AMOLED 2X Display, 120Hz" },
      { key: "Processor", value: "Snapdragon 8 Gen 3" },
      { key: "Core", value: "Octa Core" },
      { key: "Operating System", value: "Android 14, One UI 6" },
      { key: "SIM Type", value: "Dual Sim" },
      { key: "Battery", value: "5000 mAh" },
      { key: "Package", value: "Handset, USB C Cable, SIM Ejector Tool, Documentation" },
    ],
    downpaymentOptions: [
      { id: "dp1", amount: 18000, label: "₹18000" },
      { id: "dp2", amount: 36000, label: "₹36000" },
    ],
    variants: [
      {
        id: "v1",
        name: "Titanium Gray 256GB",
        color: "Titanium Gray",
        storage: "256GB",
        price: 129900,
        mrp: 144900,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/000/939/165/large/open-uri20240226-25016-16vtfke?1708944894",
        images: [
          "https://images.snapmint.com/product_assets/images/000/939/165/large/open-uri20240226-25016-16vtfke?1708944894",
          "https://images.snapmint.com/product_assets/images/000/939/166/large/open-uri20240226-25016-3va3rh?1708944894",
          "https://images.snapmint.com/product_assets/images/000/939/167/large/open-uri20240226-25016-agxann?1708944894",
          "https://images.snapmint.com/product_assets/images/000/939/168/large/open-uri20240226-25016-jnsxay?1708944895",
          "https://images.snapmint.com/product_assets/images/000/939/169/large/data?1708944895",
          "https://images.snapmint.com/product_assets/images/000/939/172/large/open-uri20240226-25016-1nqvwjd?1708944898",
          "https://images.snapmint.com/product_assets/images/000/939/173/large/open-uri20240226-25016-smj74t?1708944898",
        ],
      },
      {
        id: "v2",
        name: "Titanium Violet 512GB",
        color: "Titanium Violet",
        storage: "512GB",
        price: 149900,
        mrp: 164900,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/000/939/174/large/open-uri20240226-25016-disn3u?1708944904",
        images: [
          "https://images.snapmint.com/product_assets/images/000/939/174/large/open-uri20240226-25016-disn3u?1708944904",
          "https://images.snapmint.com/product_assets/images/000/939/175/large/open-uri20240226-25016-1wpdnep?1708944904",
          "https://images.snapmint.com/product_assets/images/000/939/176/large/open-uri20240226-25016-16wa7w8?1708944904",
          "https://images.snapmint.com/product_assets/images/000/939/177/large/open-uri20240226-25016-1w2kkzw?1708944904",
          "https://images.snapmint.com/product_assets/images/000/939/178/large/data?1708944905",
          "https://images.snapmint.com/product_assets/images/000/939/180/large/data?1708944906",
          "https://images.snapmint.com/product_assets/images/000/939/181/large/open-uri20240226-25016-1aetpvv?1708944906",
        ],
      },
      {
        id: "v3",
        name: "Titanium Black 256GB",
        color: "Titanium Black",
        storage: "256GB",
        price: 132900,
        mrp: 144900,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/000/939/183/large/open-uri20240226-25016-r7xqys?1708944912",
        images: [
          "https://images.snapmint.com/product_assets/images/000/939/183/large/open-uri20240226-25016-r7xqys?1708944912",
          "https://images.snapmint.com/product_assets/images/000/939/184/large/open-uri20240226-25016-1pt8w5z?1708944912",
          "https://images.snapmint.com/product_assets/images/000/939/185/large/open-uri20240226-25016-nvmf70?1708944912",
          "https://images.snapmint.com/product_assets/images/000/939/186/large/open-uri20240226-25016-1jt9n3t?1708944913",
          "https://images.snapmint.com/product_assets/images/000/939/188/large/data?1708944914",
          "https://images.snapmint.com/product_assets/images/000/939/189/large/data?1708944915",
          "https://images.snapmint.com/product_assets/images/000/939/191/large/open-uri20240226-25016-1uzbepv?1708944916",
        ],
      },
    ],
    emiPlans: generateEMIPlans(), // EMI plans (monthly payment calculated on frontend based on selected variant)
  },
  {
    slug: "google-pixel-9-pro",
    name: "Google Pixel 9 Pro",
    category: "Smartphones",
    description: "Google's flagship smartphone with advanced AI features and exceptional camera",
    specifications: [
      { key: "Storage", value: "256 GB" },
      { key: "Color", value: "Obsidian" },
      { key: "Front Camera", value: "42MP" },
      { key: "Front Camera Features", value: "42MP with autofocus, 4K video at 60fps, HDR, Night Sight" },
      { key: "Rear Camera", value: "50MP + 48MP + 48MP" },
      { key: "Rear Camera Features", value: "50MP Main, 48MP Ultra Wide, 48MP Telephoto with 5x optical zoom, Super Res Zoom up to 30x, Night Sight, Magic Eraser, Best Take" },
      { key: "Screen Size", value: "6.7 inch" },
      { key: "Screen Resolution", value: "3120 x 1440 Pixels" },
      { key: "Screen Type", value: "LTPO OLED, 120Hz, HDR10+" },
      { key: "Processor", value: "Google Tensor G4" },
      { key: "Core", value: "Octa Core" },
      { key: "Operating System", value: "Android 15" },
      { key: "SIM Type", value: "Dual Sim (Nano + eSIM)" },
      { key: "Battery", value: "5050 mAh with 30W Fast Charging" },
      { key: "Package", value: "Handset, USB C to C Cable, SIM Ejector Tool, Quick Start Guide" },
    ],
    downpaymentOptions: [
      { id: "dp1", amount: 15000, label: "₹15000" },
      { id: "dp2", amount: 30000, label: "₹30000" },
    ],
    variants: [
      {
        id: "v1",
        name: "Obsidian 256GB",
        color: "Obsidian",
        storage: "256GB",
        price: 109999,
        mrp: 124999,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/001/069/754/large/open-uri20250319-28213-e8k1n1?1742389860",
        images: [
          "https://images.snapmint.com/product_assets/images/001/069/754/large/open-uri20250319-28213-e8k1n1?1742389860",
          "https://images.snapmint.com/product_assets/images/001/069/755/large/open-uri20250319-28213-1obpw25?1742389860",
          "https://images.snapmint.com/product_assets/images/001/069/756/large/open-uri20250319-28213-12r4zln?1742389860",
          "https://images.snapmint.com/product_assets/images/001/069/757/large/open-uri20250319-28213-i9aqg1?1742389861",
          "https://images.snapmint.com/product_assets/images/001/069/758/large/open-uri20250319-28213-8sm256?1742389861",
          "https://images.snapmint.com/product_assets/images/001/069/759/large/open-uri20250319-28213-s38oid?1742389861",
          "https://images.snapmint.com/product_assets/images/001/069/761/large/open-uri20250319-28213-60dlr0?1742389862",
        ],
      },
      {
        id: "v2",
        name: "Porcelain 512GB",
        color: "Porcelain",
        storage: "512GB",
        price: 129999,
        mrp: 144999,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/001/069/763/large/open-uri20250319-28213-4p59v4?1742389873",
        images: [
          "https://images.snapmint.com/product_assets/images/001/069/763/large/open-uri20250319-28213-4p59v4?1742389873",
          "https://images.snapmint.com/product_assets/images/001/069/764/large/open-uri20250319-28213-50a05l?1742389874",
          "https://images.snapmint.com/product_assets/images/001/069/765/large/open-uri20250319-28213-hsnxng?1742389874",
          "https://images.snapmint.com/product_assets/images/001/069/766/large/open-uri20250319-28213-9cljpw?1742389874",
          "https://images.snapmint.com/product_assets/images/001/069/767/large/open-uri20250319-28213-1ivfdcu?1742389874",
          "https://images.snapmint.com/product_assets/images/001/069/768/large/open-uri20250319-28213-1skqg2t?1742389875",
          "https://images.snapmint.com/product_assets/images/001/069/770/large/open-uri20250319-28213-1sdz2ub?1742389875",
        ],
      },
      {
        id: "v3",
        name: "Hazel 256GB",
        color: "Hazel",
        storage: "256GB",
        price: 112999,
        mrp: 124999,
        stock: 10,
        image: "https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842",
        images: [
          "https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842",
          "https://images.snapmint.com/product_assets/images/001/069/746/large/open-uri20250319-28213-1qk1s16?1742389842",
          "https://images.snapmint.com/product_assets/images/001/069/747/large/open-uri20250319-28213-p13r5q?1742389844",
          "https://images.snapmint.com/product_assets/images/001/069/748/large/open-uri20250319-28213-cq5z9u?1742389844",
          "https://images.snapmint.com/product_assets/images/001/069/750/large/open-uri20250319-28213-juceox?1742389846",
          "https://images.snapmint.com/product_assets/images/001/069/751/large/open-uri20250319-28213-1gorwa7?1742389847",
          "https://images.snapmint.com/product_assets/images/001/069/752/large/open-uri20250319-28213-2qgbo6?1742389850",
        ],
      },
    ],
    emiPlans: generateEMIPlans(), // EMI plans (monthly payment calculated on frontend based on selected variant)
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert seed data
    const result = await Product.insertMany(seedData);
    console.log(`${result.length} products inserted successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
