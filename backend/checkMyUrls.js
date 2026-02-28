import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Url from "./models/Url.js";

dotenv.config();

const checkMyUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find your user
    const user = await User.findOne({ email: "admin1@example.com" });
    
    if (!user) {
      console.log("❌ User not found!");
      process.exit();
    }

    console.log(`\n👤 User: ${user.name} (${user.email})`);
    console.log(`User ID: ${user._id}`);

    // Find all URLs for this user
    const userUrls = await Url.find({ user: user._id });
    
    console.log(`\n📊 URLs in database for this user: ${userUrls.length}`);
    
    if (userUrls.length > 0) {
      console.log("\nYour URLs:");
      userUrls.forEach((url, i) => {
        console.log(`${i+1}. ${url.originalUrl} -> ${url.shortUrl} (${url.clicks || 0} clicks)`);
      });
    } else {
      console.log("\n❌ No URLs found for this user in database!");
      
      // Check if there are any URLs at all
      const allUrls = await Url.find({});
      console.log(`\n📊 Total URLs in database: ${allUrls.length}`);
      
      if (allUrls.length > 0) {
        console.log("\nSample URLs (first 3):");
        allUrls.slice(0, 3).forEach((url, i) => {
          console.log(`${i+1}. ${url.originalUrl} -> User: ${url.user || 'NO USER'}`);
        });
      }
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkMyUrls();