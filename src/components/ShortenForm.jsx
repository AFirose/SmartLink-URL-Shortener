 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenUrl } from '../services/api';

const ShortenForm = ({ user }) => {
  // ✅ All state declarations are here
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Simple URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (include https://)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('User logged in:', user ? 'Yes' : 'No');
      console.log('User data:', user);
      
      const { data } = await shortenUrl(url);
      console.log('Shorten response:', data);
      
      setShortenedUrl(`http://localhost:5000/api/url/${data.shortUrl}`);
      setUrl('');
      
      // If user is logged in, redirect to dashboard
      if (user) {
        alert('URL shortened and saved to your account!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.msg || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    alert('Copied to clipboard!');
  };

  return (
    <section className="relative -mt-20 px-6">
      <div className="container mx-auto">
        <div className="bg-primary-dark-violet bg-cover bg-no-repeat p-8 md:p-12 rounded-lg">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Shorten a link here..."
                className={`w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {error && <p className="text-red-400 text-sm mt-2 italic">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-600 transition disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Shortening...' : 'Shorten It!'}
            </button>
          </form>

          {shortenedUrl && (
            <div className="mt-6 bg-white p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-900 break-all">{shortenedUrl}</p>
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          )}

          {user && shortenedUrl && (
            <p className="text-white text-center mt-4">
              ✨ Link saved to your dashboard! Redirecting...
            </p>
          )}

          {!user && shortenedUrl && (
            <p className="text-white text-center mt-4">
              <a href="/register" className="underline font-bold">Sign up</a> to save your links permanently!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShortenForm;