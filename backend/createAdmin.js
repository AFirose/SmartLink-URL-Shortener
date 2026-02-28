import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin exists
    let admin = await User.findOne({ email: "admin1@example.com" });
    
    if (admin) {
      console.log("✅ Admin user found:");
      console.log("Name:", admin.name);
      console.log("Email:", admin.email);
      console.log("isAdmin:", admin.isAdmin);
      
      // Update to ensure isAdmin is true
      if (!admin.isAdmin) {
        admin.isAdmin = true;
        await admin.save();
        console.log("✅ Updated isAdmin to true");
      }
    } else {
      // Create new admin
      console.log("Creating new admin user...");
      admin = new User({
        name: "Admin User",
        email: "admin1@example.com",
        password: "admin123", // Will be hashed by pre-save hook
        isAdmin: true
      });
      await admin.save();
      console.log("✅ New admin created");
    }

    // Verify
    const verified = await User.findOne({ email: "admin1@example.com" });
    console.log("\n✅ Admin verification:");
    console.log("Name:", verified.name);
    console.log("Email:", verified.email);
    console.log("isAdmin:", verified.isAdmin);
    
    // Test password
    const testPassword = await verified.comparePassword("admin123");
    console.log("Password test (admin123):", testPassword ? "✅ Works" : "❌ Failed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();