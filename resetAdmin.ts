import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./src/models/Admin";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/emi-products";

const resetAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Delete all existing admins
    await Admin.deleteMany({});
    console.log("Deleted all existing admin users");

    // Create new admin with your email
    const admin = new Admin({
      email: "satyamchhetri629@gmail.com",
      password: "admin123",
      name: "Satyam",
      notificationEnabled: true,
      lowStockThreshold: 5,
    });

    await admin.save();
    console.log("\n✅ New admin user created successfully!");
    console.log("Email:", admin.email);
    console.log("Password: admin123");
    console.log("Notifications enabled:", admin.notificationEnabled);
    console.log("Low stock threshold:", admin.lowStockThreshold);
    console.log("\nYou will receive email alerts when stock drops below 5 units");
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetAdmin();
