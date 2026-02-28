import React, { useState } from 'react';
import axios from 'axios';

const ShortenForm = ({ user, onLinkCreated }) => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (err) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      const token = localStorage.getItem('token'); // ✅ Get token
      
      const response = await axios.post(
        'http://localhost:5000/api/urls/shorten',
        { originalUrl: url },
        { 
          headers: { 
            Authorization: `Bearer ${token}` // ✅ Send token with request
          } 
        }
      );

      const baseUrl = 'http://localhost:5000';
      const fullShortUrl = `${baseUrl}/api/urls/${response.data.shortUrl || response.data.id}`;
      
      setShortUrl(fullShortUrl);
      setUrl('');
      
      // Callback to refresh dashboard if provided
      if (onLinkCreated) {
        onLinkCreated();
      }
    } catch (err) {
      console.error('Shorten error:', err);
      if (err.response?.status === 401) {
        setError('Please login to shorten URLs');
      } else {
        setError(err.response?.data?.message || 'Failed to shorten URL. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto -mt-16 relative z-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Shorten a long link
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            disabled={loading}
            autoFocus
          />
          
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Shortening...
              </span>
            ) : (
              'Shorten URL'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </form>

      {shortUrl && (
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
          <p className="text-sm font-semibold text-green-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Your shortened URL is ready!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-600 hover:text-cyan-700 font-medium flex-1 truncate bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-cyan-500 transition"
            >
              {shortUrl}
            </a>
            
            <button
              onClick={copyToClipboard}
              className={`px-6 py-2 rounded-lg font-medium transition flex items-center justify-center min-w-[100px] ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortenForm;