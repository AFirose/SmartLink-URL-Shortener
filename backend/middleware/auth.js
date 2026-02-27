 import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - verify user is logged in
export const protect = async (req, res, next) => {
  let token;

  console.log('🔍 Auth middleware triggered');
  console.log('Headers:', req.headers.authorization);

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(" ")[1];
      console.log('✅ Token extracted:', token.substring(0, 20) + '...');

      // Verify token
      console.log('🔐 Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded:', decoded);

      // Get user from token (without password)
      console.log('🔍 Looking for user with ID:', decoded.id);
      req.user = await User.findById(decoded.id).select("-password");
      
      console.log('👤 User found:', req.user ? req.user.email : '❌ NOT FOUND');

      if (!req.user) {
        console.log('❌ User not found in database with ID:', decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      console.log('✅ Authentication successful for:', req.user.email);
      next();
    } catch (error) {
      console.error("❌ Auth error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log('❌ No authorization header or not Bearer token');
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin middleware - check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    console.log('✅ Admin access granted for:', req.user.email);
    next();
  } else {
    console.log('❌ Admin access denied');
    return res.status(403).json({ message: "Not authorized as admin" });
  }
};