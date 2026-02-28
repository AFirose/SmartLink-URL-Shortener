 import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Analytics = () => {
  const { urlId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, [urlId]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/ai/analytics/${urlId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2"><strong>Original URL:</strong> {data?.url?.originalUrl}</p>
        <p className="mb-2"><strong>Short URL:</strong> {data?.url?.shortUrl}</p>
        <p className="mb-2"><strong>Category:</strong> {data?.url?.category}</p>
        <p className="mb-2"><strong>Total Clicks:</strong> {data?.analytics?.totalClicks}</p>
      </div>
    </div>
  );
};

export default Analytics;