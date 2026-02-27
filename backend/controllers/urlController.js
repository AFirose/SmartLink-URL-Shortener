 import Url from "../models/Url.js";

// ===========================================
// 1. SHORTEN URL
// ===========================================
export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    console.log('User from auth:', req.user ? req.user._id : 'No user');
    
    const newUrl = new Url({
      originalUrl,
      shortUrl: shortCode,
      user: req.user ? req.user._id : null,
      clicks: 0
    });

    await newUrl.save();
    console.log('URL saved with user:', newUrl.user);
    
    res.status(201).json({
      originalUrl: newUrl.originalUrl,
      shortUrl: newUrl.shortUrl,
      clicks: newUrl.clicks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while shortening URL" });
  }
};

// ===========================================
// 2. GET URL BY SHORT CODE (Redirect)
// ===========================================
export const getUrl = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Looking for shortUrl:', id);
    
    const url = await Url.findOne({ shortUrl: id });

    if (!url) {
      return res.status(404).json({ msg: "URL not found" });
    }

    // Increment clicks
    url.clicks += 1;
    await url.save();
    
    console.log('Redirecting to:', url.originalUrl);
    
    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while fetching URL" });
  }
};

// ===========================================
// 3. GET USER'S URLS (Dashboard)
// ===========================================
export const getUserUrls = async (req, res) => {
  try {
    console.log('Getting URLs for user:', req.user._id);
    
    const urls = await Url.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${urls.length} URLs for user`);
    res.json(urls);
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    res.status(500).json({ message: error.message });
  }
};

// ===========================================
// 4. GET ALL URLS (Admin only)
// ===========================================
export const getAllUrls = async (req, res) => {
  try {
    console.log('Admin fetching all URLs');
    
    const urls = await Url.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${urls.length} total URLs`);
    res.json(urls);
  } catch (error) {
    console.error('Error fetching all URLs:', error);
    res.status(500).json({ message: error.message });
  }
};