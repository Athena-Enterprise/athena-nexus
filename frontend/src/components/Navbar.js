// frontend/src/components/Navbar.js

import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // State to control dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Define a mapping between themes and navbar background classes
  const themeBackgrounds = {
    'athena-light': 'bg-white shadow-lg',
    'athena-dark': 'bg-gray-800 shadow-lg',
    'default-light': 'bg-white shadow-lg',
    'default-dark': 'bg-gray-800 shadow-lg',
    'ocean-blue-light': 'bg-blue-100 shadow-lg',
    'ocean-blue-dark': 'bg-blue-900 shadow-lg',
    'teal-light': 'bg-teal-100 shadow-lg',
    'teal-dark': 'bg-teal-900 shadow-lg',
    'sunrise-light': 'bg-yellow-100 shadow-lg',
    'sunrise-dark': 'bg-yellow-900 shadow-lg',
    'midnight-light': 'bg-gray-100 shadow-lg',
    'midnight-dark': 'bg-gray-900 shadow-lg',
    'emerald-light': 'bg-emerald-100 shadow-lg',
    'emerald-dark': 'bg-emerald-900 shadow-lg',
    'cyberpunk-light': 'bg-pink-100 shadow-lg',
    'cyberpunk-dark': 'bg-pink-900 shadow-lg',
  };

  // Determine Navbar background based on theme and scroll position
  const getNavbarBackgroundClass = () => {
    if (isScrolled) {
      return themeBackgrounds[theme] || 'bg-transparent';
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
      const response = await axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true });
      console.log('Logout response:', response.data);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Construct Discord invite URL using frontend env variables
  const discordInviteUrl = `https://discord.com/oauth2/authorize?client_id=1283070994965069878&permissions=8&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauth%2Fdiscord%2Fcallback&scope=bot`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarBackgroundClass()}`}
    >
      <div className="mx-auto" style={{ maxWidth: '80%' }}>
        <div className="navbar py-6">
          {/* Navbar Start: Logo and Hamburger Menu */}
          <div className="navbar-start">
            {/* Hamburger Menu for Mobile */}
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/dashboard" className="text-lg">Dashboard</Link></li>
                <li><Link to="/admin" className="text-lg">Admin</Link></li>
                <li><a href="https://athenanetwork.gg/about-us" target="_blank" rel="noopener noreferrer" className="text-lg">About Us</a></li>
                <li><a href={discordInviteUrl} target="_blank" rel="noopener noreferrer" className="text-lg">Add to Discord</a></li>
              </ul>
            </div>
            {/* Logo */}
            <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">Athena Nexus</Link>
          </div>

          {/* Navbar Center: Navigation Links (Visible on Large Screens) */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/dashboard" className="text-lg">Dashboard</Link></li>
              <li><Link to="/admin" className="text-lg">Admin</Link></li>
              <li><a href="https://athenanetwork.gg/about-us" target="_blank" rel="noopener noreferrer" className="text-lg">About Us</a></li>
              <li><a href={discordInviteUrl} target="_blank" rel="noopener noreferrer" className="text-lg">Add to Discord</a></li>
            </ul>
          </div>

          {/* Navbar End: Login Button or User Avatar */}
          <div className="navbar-end">
            {user ? (
              <div className="dropdown dropdown-end" ref={dropdownRef}>
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar flex items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User Menu"
                >
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        user.avatar
                          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                          : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
                      }
                      alt="User Avatar"
                    />
                  </div>
                </label>
                {dropdownOpen && (
                  <ul
                    tabIndex={0}
                    className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li><Link to="/settings" className="text-base-content">User Settings</Link></li>
                    <li><button onClick={handleLogout} className="text-base-content">Logout</button></li>
                  </ul>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary text-base px-4 py-2">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
