import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, setUser }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/url/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUrls(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Your URLs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : urls.length === 0 ? (
          <p>No URLs yet. Go to home page to shorten some!</p>
        ) : (
          <div className="grid gap-4">
            {urls.map(url => (
              <div key={url._id} className="bg-white p-4 rounded shadow">
                <p className="text-gray-600 mb-2">{url.originalUrl}</p>
                <p className="text-blue-500">http://localhost:5000/api/url/{url.shortUrl}</p>
                <p className="text-sm text-gray-500 mt-2">Clicks: {url.clicks || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;