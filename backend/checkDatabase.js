import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Url from "./models/Url.js";

dotenv.config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Count all URLs
    const totalUrls = await Url.countDocuments();
    console.log(`\n📊 Total URLs in database: ${totalUrls}`);

    // Get all URLs (without user association)
    const urlsWithoutUser = await Url.find({ user: { $exists: false } });
    console.log(`\n📊 URLs without user: ${urlsWithoutUser.length}`);
    
    if (urlsWithoutUser.length > 0) {
      console.log("\nSample URLs without user:");
      urlsWithoutUser.slice(0, 3).forEach((url, i) => {
        console.log(`${i+1}. ${url.originalUrl} -> ${url.shortUrl}`);
      });
    }

    // Find your user
    const user = await User.findOne({ email: "admin1@example.com" }); // Change to your email
    
    if (user) {
      console.log(`\n👤 Found user: ${user.name} (${user.email})`);
      console.log(`User ID: ${user._id}`);
      
      // Count URLs for this user
      const userUrls = await Url.find({ user: user._id });
      console.log(`\n📊 URLs for this user: ${userUrls.length}`);
      
      if (userUrls.length > 0) {
        console.log("\nYour URLs:");
        userUrls.forEach((url, i) => {
          console.log(`${i+1}. ${url.originalUrl} -> ${url.shortUrl} (${url.clicks || 0} clicks)`);
        });
      } else {
        console.log("\n❌ No URLs found for this user!");
      }
    } else {
      console.log("\n❌ User not found!");
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkDatabase();