 import express from "express";
import { shortenUrl, getUrl, getUserUrls, getAllUrls } from "../controllers/urlController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Public routes - no authentication needed
router.post("/shorten", shortenUrl);  // ✅ Changed: removed 'protect'
router.get("/:id", getUrl);           // ✅ Public - anyone can access

// Protected routes - require authentication
router.get("/user/me", protect, getUserUrls);
router.get("/admin/all", protect, admin, getAllUrls);

export default router;