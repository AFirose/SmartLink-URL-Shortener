import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ShortenForm from "./components/ShortenForm";
import Features from "./components/Features";
import Boost from "./components/Boost";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin"; // NEW
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";

// NEW PAGES
import FeaturesPage from './pages/Features';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

// Admin Route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/admin-login" />;
  if (!user.isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Home */}
        <Route path="/" element={
          <>
            <Navbar user={user} setUser={setUser} />
            <Hero />
            <ShortenForm user={user} />
            <Features />
            <Boost />
            <Footer />
          </>
        }/>

        {/* Other pages */}
        <Route path="/features" element={<><Navbar user={user} setUser={setUser} /><FeaturesPage /><Footer /></>} />
        <Route path="/pricing" element={<><Navbar user={user} setUser={setUser} /><Pricing /><Footer /></>} />
        <Route path="/resources" element={<><Navbar user={user} setUser={setUser} /><Resources /><Footer /></>} />

        {/* Auth */}
        <Route path="/login" element={user && !user.isAdmin ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user && !user.isAdmin ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />} />
        <Route path="/admin-login" element={user && user.isAdmin ? <Navigate to="/admin" /> : <AdminLogin setUser={setUser} />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard user={user} setUser={setUser} />
          </ProtectedRoute>
        }/>
        <Route path="/analytics/:urlId" element={
          <ProtectedRoute>
            <Analytics user={user} />
          </ProtectedRoute>
        }/>

        {/* Admin */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard user={user} setUser={setUser} />
          </AdminRoute>
        }/>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
              <p className="text-xl text-gray-600 mt-4">Page not found</p>
              <a href="/" className="btn-primary mt-6 inline-block">Go Home</a>
            </div>
          </div>
        }/>
      </Routes>
    </div>
  );
}

export default App;