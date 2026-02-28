import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [previewLink, setPreviewLink] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [editingLink, setEditingLink] = useState(null);
  
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
      filtered = filtered.filter(link => 
        link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredLinks(filtered);
  }, [links, selectedCategory, selectedTags, searchTerm]);

  // US3 & US5: Fetch all links and analytics
  const fetchLinks = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/links', { headers });
      
      const linksData = response.data;
      setLinks(linksData);
      
      // Extract unique categories (US6)
      const uniqueCategories = [...new Set(linksData.map(link => link.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      // Extract all tags (US8)
      const tags = [...new Set(linksData.flatMap(link => link.tags || []))];
      setAllTags(tags);
      
      // Calculate statistics (US5)
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

  // US7: Get analytics for a specific link
  const viewAnalytics = (linkId) => {
    navigate(`/analytics/${linkId}`);
  };

  // US6: Auto-categorize link (call backend AI)
  const autoCategorize = async (linkId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `http://localhost:5000/api/links/${linkId}/categorize`,
        {},
        { headers }
      );
      
      // Update the link with new category
      setLinks(links.map(link => 
        link._id === linkId ? { ...link, category: response.data.category } : link
      ));
      
      alert(`Link categorized as: ${response.data.category}`);
    } catch (err) {
      console.error('Error categorizing link:', err);
    }
  };

  // US8: Add tag to link
  const addTag = async (linkId, tag) => {
    if (!tag.trim()) return;
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `http://localhost:5000/api/links/${linkId}/tags`,
        { tag },
        { headers }
      );
      
      // Update the link with new tags
      setLinks(links.map(link => 
        link._id === linkId ? { ...link, tags: response.data.tags } : link
      ));
      
      // Update all tags list
      const updatedTags = [...new Set([...allTags, tag])];
      setAllTags(updatedTags);
      
      setNewTag('');
      setEditingLink(null);
    } catch (err) {
      console.error('Error adding tag:', err);
    }
  };

  // US8: Remove tag from link
  const removeTag = async (linkId, tagToRemove) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `http://localhost:5000/api/links/${linkId}/tags/${tagToRemove}`,
        { headers }
      );
      
      // Update the link
      setLinks(links.map(link => 
        link._id === linkId ? { ...link, tags: response.data.tags } : link
      ));
    } catch (err) {
      console.error('Error removing tag:', err);
    }
  };

  // US9: Get link preview
  const fetchPreview = async (linkId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `http://localhost:5000/api/links/${linkId}/preview`,
        { headers }
      );
      
      setPreviewLink(response.data);
    } catch (err) {
      console.error('Error fetching preview:', err);
    }
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
      <nav className="bg-white shadow-sm">
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
        {/* Stats Overview (US5) */}
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
            <p className="text-lg font-semibold text-gray-800 truncate">
              {stats.popularLinks[0]?.originalUrl || 'No clicks yet'}
            </p>
            <p className="text-sm text-gray-500">
              {stats.popularLinks[0]?.clicks || 0} clicks
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search URLs or titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter (US6) */}
            <div>
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

            {/* Tags Filter (US8) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Tags</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid (US3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map(link => (
            <div key={link._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Link Preview Image (US9) */}
              {link.previewImage && (
                <img 
                  src={link.previewImage} 
                  alt={link.title || 'Link preview'}
                  className="w-full h-32 object-cover"
                />
              )}
              
              <div className="p-4">
                {/* Title and URL */}
                <h3 className="font-semibold text-gray-800 mb-1 truncate">
                  {link.title || link.originalUrl}
                </h3>
                <a 
                  href={link.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline truncate block mb-2"
                >
                  {link.originalUrl}
                </a>
                
                {/* Short URL */}
                <div className="bg-gray-50 p-2 rounded mb-3">
                  <p className="text-xs text-gray-500">Short URL:</p>
                  <a 
                    href={`http://localhost:5000/${link.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:underline"
                  >
                    {link.shortUrl}
                  </a>
                </div>

                {/* Category (US6) */}
                <div className="mb-2">
                  {link.category ? (
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {link.category}
                    </span>
                  ) : (
                    <button
                      onClick={() => autoCategorize(link._id)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      + Auto-categorize
                    </button>
                  )}
                </div>

                {/* Tags (US8) */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {link.tags?.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(link._id, tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {editingLink === link._id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New tag"
                        className="flex-1 text-sm px-2 py-1 border rounded"
                        onKeyPress={(e) => e.key === 'Enter' && addTag(link._id, newTag)}
                      />
                      <button
                        onClick={() => addTag(link._id, newTag)}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingLink(link._id)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      + Add tag
                    </button>
                  )}
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{link.clicks || 0}</span> clicks
                  </div>
                  
                  <div className="flex space-x-2">
                    {/* Preview Button (US9) */}
                    <button
                      onClick={() => fetchPreview(link._id)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Preview"
                    >
                      👁️
                    </button>
                    
                    {/* Analytics Button (US7) */}
                    <button
                      onClick={() => viewAnalytics(link._id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Analytics"
                    >
                      📊
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteLink(link._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Links Message */}
        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No links found</p>
            <a href="/" className="text-blue-500 hover:underline mt-2 inline-block">
              Shorten your first link
            </a>
          </div>
        )}

        {/* Preview Modal (US9) */}
        {previewLink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Link Preview</h3>
                  <button
                    onClick={() => setPreviewLink(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {previewLink.image && (
                  <img 
                    src={previewLink.image} 
                    alt={previewLink.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <h4 className="text-lg font-semibold mb-2">{previewLink.title}</h4>
                <p className="text-gray-600 mb-4">{previewLink.description}</p>
                
                <a 
                  href={previewLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {previewLink.url}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;