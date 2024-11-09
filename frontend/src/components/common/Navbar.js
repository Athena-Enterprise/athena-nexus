// frontend/src/components/common/Navbar.js

import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Corrected path
import { useTheme } from '../../context/ThemeContext';
import axios from '../../services/api';
import ThemeSelector from '../utils/ThemeSelector'; // Corrected path

function Navbar() {
  const { user, setUser } = useAuth();
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Mapping themes to background classes
  const themeBackgrounds = {
    'athena-light': 'bg-white shadow-lg',
    'athena-dark': 'bg-gray-800 shadow-lg',
    // Add other themes as needed
  };

  // Determine Navbar background based on theme and scroll position
  const getNavbarBackgroundClass = () => {
    if (isScrolled) {
      return themeBackgrounds[theme] || 'bg-base-100 shadow-lg';
    } else {
      return 'bg-transparent';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('/auth/logout', { withCredentials: true });
      setUser(null); // Update the user context
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const discordInviteUrl = `https://discord.com/oauth2/authorize?client_id=1283070994965069878&scope=bot`;

  // Hide Navbar on dashboard routes
  const hideNavbar = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  if (hideNavbar) {
    return null; // Do not render Navbar on dashboard or admin routes
  }

  const handleLogin = () => {
    // Redirect directly to Discord OAuth
    const redirectUri = encodeURIComponent('http://localhost:5000/api/auth/discord/callback');
    window.location.href = `https://discord.com/oauth2/authorize?client_id=1283070994965069878&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email%20guilds`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarBackgroundClass()}`}
    >
      <div className="container mx-auto px-4">
        <div className="navbar py-4">
          {/* Navbar Start */}
          <div className="navbar-start">
            {/* Hamburger Menu for Mobile */}
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                {/* Hamburger Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                {user && (
                  <>
                    <li>
                      <Link to="/dashboard" className="text-lg">
                        Dashboard
                      </Link>
                    </li>
                    {user.isAdmin && (
                      <li>
                        <Link to="/admin/dashboard" className="text-lg">
                          Admin
                        </Link>
                      </li>
                    )}
                  </>
                )}
                <li>
                  <a href="/about" className="text-lg">
                    About Us
                  </a>
                </li>
                <li>
                  <a href={discordInviteUrl} className="text-lg">
                    Add to Discord
                  </a>
                </li>
              </ul>
            </div>
            {/* Logo */}
            <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
              Athena Nexus
            </Link>
          </div>

          {/* Navbar Center */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {user && (
                <>
                  <li>
                    <Link to="/dashboard" className="text-lg">
                      Dashboard
                    </Link>
                  </li>
                  {user.isAdmin && (
                    <li>
                      <Link to="/admin/dashboard" className="text-lg">
                        Admin
                      </Link>
                    </li>
                  )}
                </>
              )}
              <li>
                <a href="/about" className="text-lg">
                  About Us
                </a>
              </li>
              <li>
                <a href={discordInviteUrl} className="text-lg">
                  Add to Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Navbar End */}
          <div className="navbar-end flex items-center space-x-4">
            {/* Theme Selector */}
            <ThemeSelector />
            {user ? (
              <div className="dropdown dropdown-end" ref={dropdownRef}>
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar flex items-center cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-10 rounded-full">
                    <img src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`} alt="User Avatar"/>
                  </div>
                </label>
                {dropdownOpen && (
                  <ul
                    tabIndex={0}
                    className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button onClick={handleLogout} className="text-base-content">
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button onClick={handleLogin} className="btn btn-primary text-base px-4 py-2">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
