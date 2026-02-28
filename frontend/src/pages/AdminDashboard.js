import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = ({ user, setUser }) => {
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalUrls: 0, totalClicks: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Logout function
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update user state if setUser exists
    if (setUser) {
      setUser(null);
    }
    
    // Redirect to home page
    navigate('/');
  };

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/admin/stats', { headers })
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchLinks = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:5000/api/admin/links', { headers });
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return; // wait until token exists
    fetchData();
    fetchLinks();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete user and all URLs?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
      fetchLinks();
    } catch (err) { console.error(err); }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Delete this link?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/links/${linkId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchLinks();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center p-8">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Total URLs</h3>
            <p className="text-3xl font-bold">{stats.totalUrls}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Total Clicks</h3>
            <p className="text-3xl font-bold">{stats.totalClicks}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <h2 className="text-xl font-bold p-6 border-b">Users Management</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Admin</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{u.isAdmin ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:text-red-800" disabled={u.isAdmin}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b">Links Moderation</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Short URL</th>
                <th className="px-6 py-3 text-left">Original URL</th>
                <th className="px-6 py-3 text-left">Owner</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map(l => (
                <tr key={l._id} className="border-t">
                  <td className="px-6 py-4">{l.shortUrl}</td>
                  <td className="px-6 py-4">{l.originalUrl}</td>
                  <td className="px-6 py-4">{l.ownerName}</td>
                  <td className="px-6 py-4">{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteLink(l._id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;