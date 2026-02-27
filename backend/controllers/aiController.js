 import Url from "../models/Url.js";
import axios from "axios";
import * as cheerio from 'cheerio';

// ===========================================
// 1. AI-POWERED LINK CATEGORIZATION
// ===========================================
export const categorizeUrl = async (req, res) => {
  try {
    const { urlId } = req.params;
    const url = await Url.findById(urlId);
    
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    
    console.log('Categorizing URL:', url.originalUrl);
    
    // Enhanced categorization based on domain patterns
    const categories = [
      { patterns: ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv'], category: 'Video' },
      { patterns: ['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 'tiktok.com', 'snapchat.com'], category: 'Social' },
      { patterns: ['amazon.com', 'ebay.com', 'walmart.com', 'etsy.com', 'shopify.com', 'aliexpress.com'], category: 'Shopping' },
      { patterns: ['wikipedia.org', 'khanacademy.org', 'coursera.org', 'udemy.com', 'edx.org'], category: 'Education' },
      { patterns: ['netflix.com', 'hulu.com', 'disneyplus.com', 'spotify.com', 'hbomax.com'], category: 'Entertainment' },
      { patterns: ['github.com', 'stackoverflow.com', 'gitlab.com', 'npmjs.com', 'dev.to'], category: 'Development' },
      { patterns: ['cnn.com', 'bbc.com', 'nytimes.com', 'reuters.com', 'theguardian.com', 'wsj.com'], category: 'News' },
      { patterns: ['medium.com', 'blogspot.com', 'wordpress.com', 'substack.com', 'hashnode.com'], category: 'Article' }
    ];
    
    let category = 'Other';
    const urlLower = url.originalUrl.toLowerCase();
    
    // Check against known patterns
    for (const item of categories) {
      if (item.patterns.some(pattern => urlLower.includes(pattern))) {
        category = item.category;
        break;
      }
    }
    
    // If still uncategorized, try to fetch page title for better guessing
    if (category === 'Other') {
      try {
        const response = await axios.get(url.originalUrl, { 
          timeout: 3000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(response.data);
        const title = $('title').text().toLowerCase();
        
        if (title.includes('video') || title.includes('watch') || title.includes('stream')) {
          category = 'Video';
        } else if (title.includes('shop') || title.includes('buy') || title.includes('price') || title.includes('cart')) {
          category = 'Shopping';
        } else if (title.includes('learn') || title.includes('course') || title.includes('tutorial') || title.includes('class')) {
          category = 'Education';
        } else if (title.includes('news') || title.includes('breaking') || title.includes('headline')) {
          category = 'News';
        } else if (title.includes('blog') || title.includes('post') || title.includes('article')) {
          category = 'Article';
        }
      } catch (error) {
        console.log('Could not fetch page for categorization:', error.message);
      }
    }
    
    url.category = category;
    await url.save();
    
    res.json({ 
      success: true,
      urlId: url._id,
      originalUrl: url.originalUrl,
      category: category,
      message: `✅ Categorized as ${category}`
    });
    
  } catch (error) {
    console.error('Categorization error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error categorizing URL", 
      error: error.message 
    });
  }
};

// ===========================================
// 2. SMART PREVIEWS (Fetch metadata)
// ===========================================
export const generatePreview = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }
    
    console.log('Generating preview for:', url);
    
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ message: "Invalid URL format" });
    }
    
    // Fetch webpage and extract metadata
    const response = await axios.get(url, { 
      timeout: 5000,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract title (try multiple sources)
    const title = $('title').text() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('meta[name="twitter:title"]').attr('content') || 
                  'No title available';
    
    // Extract description
    const description = $('meta[name="description"]').attr('content') || 
                        $('meta[property="og:description"]').attr('content') || 
                        $('meta[name="twitter:description"]').attr('content') || 
                        'No description available';
    
    // Extract image
    let imageUrl = $('meta[property="og:image"]').attr('content') || 
                   $('meta[name="twitter:image"]').attr('content') || 
                   $('meta[name="twitter:image:src"]').attr('content') || '';
    
    // Make relative URLs absolute
    if (imageUrl && imageUrl.startsWith('/')) {
      try {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      } catch (e) {
        // Keep as is
      }
    }
    
    // Extract keywords
    let keywords = [];
    const keywordsMeta = $('meta[name="keywords"]').attr('content');
    if (keywordsMeta) {
      keywords = keywordsMeta.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }
    
    // Truncate description if too long
    const shortDescription = description.length > 300 ? 
      description.substring(0, 300) + '...' : description;
    
    // Save to database if URL exists (for logged-in users)
    if (req.user) {
      const urlRecord = await Url.findOne({ 
        originalUrl: url,
        user: req.user._id 
      });
      
      if (urlRecord) {
        urlRecord.title = title;
        urlRecord.description = shortDescription;
        urlRecord.imageUrl = imageUrl;
        urlRecord.keywords = keywords.slice(0, 5);
        await urlRecord.save();
        console.log('Preview saved to database');
      }
    }
    
    res.json({
      success: true,
      title: title.trim(),
      description: shortDescription.trim(),
      imageUrl: imageUrl,
      keywords: keywords.slice(0, 5),
      siteName: $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname.replace('www.', '')
    });
    
  } catch (error) {
    console.error('Preview error:', error.message);
    
    // Return fallback data
    res.status(200).json({ 
      success: true,
      title: new URL(req.body.url).hostname.replace('www.', ''),
      description: "Preview unavailable - Website could not be fetched",
      imageUrl: null,
      keywords: [],
      siteName: new URL(req.body.url).hostname.replace('www.', ''),
      fallback: true
    });
  }
};

// ===========================================
// 3. USAGE INSIGHTS & ANALYTICS
// ===========================================
export const getInsights = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    
    console.log('Generating insights for:', url.shortUrl);
    
    // Calculate insights
    const daysSinceCreation = Math.floor((Date.now() - new Date(url.createdAt)) / (1000 * 60 * 60 * 24)) || 1;
    const avgClicksPerDay = (url.clicks / daysSinceCreation).toFixed(1);
    
    // Performance rating
    let performance = 'Low';
    if (url.clicks > 50) performance = 'High';
    else if (url.clicks > 10) performance = 'Medium';
    
    // Suggest tags based on title and category
    const suggestedTags = [];
    
    // Add category as tag
    if (url.category && url.category !== 'Uncategorized') {
      suggestedTags.push(url.category.toLowerCase());
    }
    
    // Extract from title
    if (url.title) {
      const words = url.title.toLowerCase().split(' ');
      const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
      words.forEach(word => {
        word = word.replace(/[^a-z0-9]/g, '');
        if (word.length > 3 && !commonWords.includes(word) && !suggestedTags.includes(word)) {
          suggestedTags.push(word);
        }
      });
    }
    
    res.json({
      success: true,
      url: {
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        shortCode: url.shortUrl,
        clicks: url.clicks,
        createdAt: url.createdAt
      },
      insights: {
        category: url.category || 'Uncategorized',
        performance: performance,
        daysSinceCreation: daysSinceCreation,
        averageClicksPerDay: parseFloat(avgClicksPerDay),
        title: url.title || 'No title available',
        description: url.description || 'No description',
        lastAccessed: url.lastAccessed || url.createdAt
      },
      suggestedTags: suggestedTags.slice(0, 5)
    });
    
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error generating insights", 
      error: error.message 
    });
  }
};

// ===========================================
// 4. BATCH CATEGORIZATION (for dashboard)
// ===========================================
export const categorizeAllUrls = async (req, res) => {
  try {
    const userId = req.user._id;
    const urls = await Url.find({ user: userId, category: 'Uncategorized' });
    
    console.log(`Categorizing ${urls.length} URLs for user ${userId}`);
    
    const results = [];
    for (const url of urls) {
      // Simple categorization logic
      const urlLower = url.originalUrl.toLowerCase();
      let category = 'Other';
      
      if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be') || urlLower.includes('vimeo.com')) {
        category = 'Video';
      } else if (urlLower.includes('github.com') || urlLower.includes('stackoverflow.com') || urlLower.includes('gitlab.com')) {
        category = 'Development';
      } else if (urlLower.includes('amazon.com') || urlLower.includes('ebay.com') || urlLower.includes('walmart.com')) {
        category = 'Shopping';
      } else if (urlLower.includes('wikipedia.org') || urlLower.includes('khanacademy.org') || urlLower.includes('coursera.org')) {
        category = 'Education';
      } else if (urlLower.includes('facebook.com') || urlLower.includes('twitter.com') || urlLower.includes('instagram.com')) {
        category = 'Social';
      } else if (urlLower.includes('netflix.com') || urlLower.includes('hulu.com') || urlLower.includes('spotify.com')) {
        category = 'Entertainment';
      } else if (urlLower.includes('cnn.com') || urlLower.includes('bbc.com') || urlLower.includes('nytimes.com')) {
        category = 'News';
      } else if (urlLower.includes('medium.com') || urlLower.includes('blogspot.com') || urlLower.includes('wordpress.com')) {
        category = 'Article';
      }
      
      url.category = category;
      await url.save();
      results.push({ url: url.originalUrl, category });
    }
    
    res.json({
      success: true,
      message: `✅ Categorized ${results.length} URLs`,
      results
    });
    
  } catch (error) {
    console.error('Batch categorization error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error categorizing URLs", 
      error: error.message 
    });
  }
};

// ===========================================
// 5. GET PREVIEW FOR URL (by ID)
// ===========================================
export const getPreviewById = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    
    res.json({
      success: true,
      title: url.title || 'No title',
      description: url.description || 'No description',
      imageUrl: url.imageUrl || null,
      keywords: url.keywords || [],
      category: url.category || 'Uncategorized'
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};