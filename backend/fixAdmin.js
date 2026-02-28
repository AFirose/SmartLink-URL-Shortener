import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find the admin user
    const admin = await User.findOne({ email: "admin1@example.com" });
    
    if (!admin) {
      // Create new admin if doesn't exist
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const newAdmin = new User({
        name: "Admin User",
        email: "admin1@example.com",
        password: hashedPassword,
        isAdmin: true
      });
      await newAdmin.save();
      console.log("✅ New admin created with isAdmin: true");
    } else {
      // Update existing user to be admin
      admin.isAdmin = true;
      // If password needs reset
      // admin.password = await bcrypt.hash("admin123", 10);
      await admin.save();
      console.log("✅ Updated user to admin with isAdmin: true");
    }

    // Verify the update
    const verified = await User.findOne({ email: "admin1@example.com" });
    console.log("Admin status:", verified.isAdmin);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixAdmin();