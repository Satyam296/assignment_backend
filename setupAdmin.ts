import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./src/models/Admin";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/emi-products";

const setupAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "satyamchhetri629@gmail.com" });
    
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Notifications enabled:", existingAdmin.notificationEnabled);
      console.log("Low stock threshold:", existingAdmin.lowStockThreshold);
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      email: "satyamchhetri629@gmail.com",
      password: "admin123", // In production, this should be hashed!
      name: "Satyam",
      notificationEnabled: true,
      lowStockThreshold: 5,
    });

    await admin.save();
    
    console.log("✅ Admin user created successfully!");
    console.log("====================================");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("Low Stock Threshold: 5 units");
    console.log("====================================");
    console.log("⚠️  IMPORTANT: Change the password in production!");
    console.log("Update your email in the admin dashboard to receive notifications.");

    process.exit(0);
  } catch (error) {
    console.error("Error setting up admin:", error);
    process.exit(1);
  }
};

setupAdmin();
