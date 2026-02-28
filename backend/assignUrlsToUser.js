import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Url from "./models/Url.js";

dotenv.config();

const assignUrlsToUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find your user
    const user = await User.findOne({ email: "admin1@example.com" });
    
    if (!user) {
      console.log("❌ User not found!");
      process.exit();
    }

    console.log(`\n👤 Found user: ${user.name} (${user.email})`);
    console.log(`User ID: ${user._id}`);

    // Find all URLs without user
    const urlsWithoutUser = await Url.find({ user: { $exists: false } });
    console.log(`\n📊 Found ${urlsWithoutUser.length} URLs without user`);

    // Assign them to the user
    let assigned = 0;
    for (const url of urlsWithoutUser) {
      url.user = user._id;
      await url.save();
      assigned++;
      console.log(`✅ Assigned: ${url.originalUrl.substring(0, 50)}... -> ${url.shortUrl}`);
    }

    console.log(`\n✅ Successfully assigned ${assigned} URLs to your account!`);

    // Verify
    const userUrls = await Url.find({ user: user._id });
    console.log(`\n📊 You now have ${userUrls.length} URLs in your dashboard:`);
    
    userUrls.forEach((url, index) => {
      console.log(`${index + 1}. ${url.originalUrl.substring(0, 60)}... (${url.clicks || 0} clicks)`);
    });

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

assignUrlsToUser();