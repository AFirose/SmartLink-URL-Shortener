 import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ShortenForm from "./components/ShortenForm";
import Features from "./components/Features";
import Boost from "./components/Boost";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";

// IMPORT THE NEW PAGES
import FeaturesPage from './pages/Features';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (!user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={
            <>
              <Navbar user={user} setUser={setUser} />
              <Hero />
              <ShortenForm user={user} />
              <Features />
              <Boost />
              <Footer />
            </>
          } />
          
          {/* NEW PAGES ROUTES */}
          <Route path="/features" element={
            <>
              <Navbar user={user} setUser={setUser} />
              <FeaturesPage />
              <Footer />
            </>
          } />
          
          <Route path="/pricing" element={
            <>
              <Navbar user={user} setUser={setUser} />
              <Pricing />
              <Footer />
            </>
          } />
          
          <Route path="/resources" element={
            <>
              <Navbar user={user} setUser={setUser} />
              <Resources />
              <Footer />
            </>
          } />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
          } />
          
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } />
          
          <Route path="/analytics/:urlId" element={
            <ProtectedRoute>
              <Analytics user={user} />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard user={user} setUser={setUser} />
            </AdminRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-xl text-gray-600 mt-4">Page not found</p>
                <a href="/" className="btn-primary mt-6 inline-block">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;