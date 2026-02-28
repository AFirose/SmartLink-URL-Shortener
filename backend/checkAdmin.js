import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin exists
    const admin = await User.findOne({ email: "admin1@example.com" });
    
    if (admin) {
      console.log("\n✅ Admin found:");
      console.log("Name:", admin.name);
      console.log("Email:", admin.email);
      console.log("isAdmin:", admin.isAdmin);
      
      // Test password
      const passwordMatch = await bcrypt.compare("admin123", admin.password);
      console.log("Password test (admin123):", passwordMatch ? "✅ Correct" : "❌ Wrong");
      
      if (!admin.isAdmin) {
        // Fix isAdmin if false
        admin.isAdmin = true;
        await admin.save();
        console.log("✅ Fixed isAdmin to true");
      }
    } else {
      console.log("\n❌ Admin not found. Creating new admin...");
      
      // Create new admin
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const newAdmin = new User({
        name: "Admin User",
        email: "admin1@example.com",
        password: hashedPassword,
        isAdmin: true
      });
      await newAdmin.save();
      console.log("✅ New admin created");
    }

    // Show all users
    const allUsers = await User.find({}).select("name email isAdmin");
    console.log("\n📋 All users in database:");
    allUsers.forEach(u => {
      console.log(`- ${u.email} (isAdmin: ${u.isAdmin})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkAdmin();