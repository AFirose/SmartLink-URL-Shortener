import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

// Connect to MongoDB (no extra options needed in Mongoose 7+)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminExists = await User.findOne({ email: "admin1@example.com" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      name: "Admin User",
      email: "admin1@example.com",
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("Admin created:", admin);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();