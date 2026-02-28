import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, setUser }) => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalLinks: 0,
    popularLinks: []
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch all links on component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  // Filter links based on category, tags, and search
  useEffect(() => {
    let filtered = [...links];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(link => link.category === selectedCategory);
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(link => 
        selectedTags.every(tag => link.tags?.includes(tag))
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(link => 
        link.originalUrl.toLowerCase().includes(term) ||
        link.title?.toLowerCase().includes(term) ||
        link.category?.toLowerCase().includes(term) ||
        link.shortUrl?.toLowerCase().includes(term) ||
        link.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredLinks(filtered);
  }, [links, selectedCategory, selectedTags, searchTerm]);

  // Fetch links function
  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('http://localhost:5000/api/urls/user/me', { headers });
      
      const linksData = response.data;
      console.log('Fetched links:', linksData);
      
      setLinks(linksData);
      setFilteredLinks(linksData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(linksData.map(link => link.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      // Extract all tags
      const tags = [...new Set(linksData.flatMap(link => link.tags || []))];
      setAllTags(tags);
      
      // Calculate statistics
      const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
      const popular = [...linksData].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5);
      
      setStats({
        totalClicks,
        totalLinks: linksData.length,
        popularLinks: popular
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching links:', err);
      setLoading(false);
    }
  };

  // View analytics
  const viewAnalytics = (linkId) => {
    navigate(`/analytics/${linkId}`);
  };

  // Delete link
  const deleteLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/api/links/${linkId}`, { headers });
      fetchLinks(); // Refresh the list
    } catch (err) {
      console.error('Error deleting link:', err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setUser) setUser(null);
    navigate('/');
  };

  // Navigate to home page to shorten new link
  const goToShorten = () => {
    navigate('/');
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSelectedTags([]);
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Links</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Permanent Shorten Button Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Want to shorten another link?</h2>
              <p className="text-blue-100">Create short, trackable links in seconds</p>
            </div>
            <button
              onClick={goToShorten}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              ✂️ Shorten New Link
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm uppercase">Total Links</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.totalLinks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm uppercase">Total Clicks</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.totalClicks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm uppercase">Popular Link</h3>
            {stats.popularLinks && stats.popularLinks.length > 0 ? (
              <>
                <p className="text-lg font-semibold text-gray-800 truncate" title={stats.popularLinks[0]?.originalUrl}>
                  {stats.popularLinks[0]?.originalUrl || 'No links'}
                </p>
                <p className="text-sm text-gray-500">
                  {stats.popularLinks[0]?.clicks || 0} clicks
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-400">No clicks yet</p>
                <p className="text-sm text-gray-400">Create and share links</p>
              </>
            )}
          </div>
        </div>

        {/* Filters Section - Side by Side */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filter Links</h2>
            {(selectedCategory !== 'all' || searchTerm || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-500 hover:text-blue-700 mt-2 md:mt-0"
              >
                Clear all filters
              </button>
            )}
          </div>
          
          {/* Side by Side Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Bar */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search URLs, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags Filter - Simplified for side by side */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags {selectedTags.length > 0 && `(${selectedTags.length} selected)`}
              </label>
              {allTags.length > 0 ? (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleTag(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select tags to filter</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag} {selectedTags.includes(tag) ? '✓' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-400 py-2">No tags available</p>
              )}
            </div>
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <span className="text-sm text-gray-500">Active tag filters:</span>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                >
                  {tag}
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              ))}
            </div>
          )}

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500 border-t pt-4">
            Showing {filteredLinks.length} of {links.length} links
          </div>
        </div>

        {/* Links List View */}
        {filteredLinks.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 border-b">
              <div className="col-span-4">Original URL</div>
              <div className="col-span-3">Short URL</div>
              <div className="col-span-2">Category / Tags</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1 text-center">Clicks</div>
            </div>

            {/* Links List */}
            <div className="divide-y divide-gray-200">
              {filteredLinks.map(link => (
                <div key={link._id} className="p-4 hover:bg-gray-50 transition">
                  {/* Mobile View */}
                  <div className="md:hidden space-y-2">
                    <div className="flex justify-between items-start">
                      <a 
                        href={link.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium text-sm truncate max-w-[200px]"
                        title={link.originalUrl}
                      >
                        {link.originalUrl}
                      </a>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {link.clicks || 0} clicks
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Short: </span>
                      <a 
                        href={`http://localhost:5000/api/urls/${link.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-mono text-xs"
                      >
                        {link.shortUrl}
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {link.category && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {link.category}
                        </span>
                      )}
                      {link.tags?.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => viewAnalytics(link._id)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          📊 Analytics
                        </button>
                        <button
                          onClick={() => deleteLink(link._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-12 items-center text-sm">
                    <div className="col-span-4 truncate pr-2" title={link.originalUrl}>
                      <a 
                        href={link.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.originalUrl}
                      </a>
                    </div>
                    
                    <div className="col-span-3">
                      <a 
                        href={`http://localhost:5000/api/urls/${link.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-mono text-xs"
                      >
                        {link.shortUrl}
                      </a>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {link.category && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {link.category}
                          </span>
                        )}
                        {link.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                        {link.tags?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{link.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-gray-500 text-xs">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="col-span-1 text-center font-semibold">
                      {link.clicks || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">No links found</p>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or create a new link</p>
            <button
              onClick={clearFilters}
              className="text-blue-500 hover:text-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;