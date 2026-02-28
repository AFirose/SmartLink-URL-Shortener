import { useState } from 'react';
import mobileNavImage from '../assets/images/mobile-navigation.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Changed from "Shortly" to "SmartLink" */}
          <Link to="/" className="text-2xl font-bold text-primary-cyan">
            SmartLink
          </Link>

          {/* Rest of your code remains exactly the same... */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-primary-cyan">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary-cyan">
              Pricing
            </Link>
            <Link to="/resources" className="text-gray-600 hover:text-primary-cyan">
              Resources
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-cyan">
                  Dashboard
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary-cyan">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-primary-cyan text-white px-6 py-2 rounded-full hover:bg-primary-dark-cyan transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-cyan">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-cyan text-white px-6 py-2 rounded-full hover:bg-primary-dark-cyan transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/features" className="text-gray-600 hover:text-primary-cyan">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-primary-cyan">
                Pricing
              </Link>
              <Link to="/resources" className="text-gray-600 hover:text-primary-cyan">
                Resources
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-primary-cyan">
                    Dashboard
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" className="text-gray-600 hover:text-primary-cyan">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-primary-cyan text-white px-6 py-2 rounded-full hover:bg-primary-dark-cyan transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-primary-cyan">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-cyan text-white px-6 py-2 rounded-full hover:bg-primary-dark-cyan transition text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;