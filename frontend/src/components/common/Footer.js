// src/pages/Footer.js

import React from 'react';
import { FaGithub, FaDiscord, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-300 text-base-content mt-20">
      <div className="w-full flex flex-col items-center">
        {/* Categories with Underlines */}
        <div className="flex flex-col md:flex-row justify-center w-full">
          {/* Resources */}
          <div className="mb-6 md:mb-0 md:mr-12">
            <span className="footer-title text-xl block relative pb-2">
              Resources
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span> {/* Increased width to full */}
            </span>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="link link-hover">Support</a></li>
              <li><a href="#" className="link link-hover">Documentation</a></li>
              <li><a href="#" className="link link-hover">Community</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="mb-6 md:mb-0 md:mr-12">
            <span className="footer-title text-xl block relative pb-2">
              Company
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span> {/* Increased width to full */}
            </span>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="link link-hover">Careers</a></li>
              <li><a href="#" className="link link-hover">About Us</a></li>
              <li><a href="#" className="link link-hover">TOS</a></li>
            </ul>
          </div>
          
          {/* Products */}
          <div>
            <span className="footer-title text-xl block relative pb-2">
              Products
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span> {/* Increased width to full */}
            </span>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="link link-hover">Athena Nexus</a></li>
              <li><a href="#" className="link link-hover">Bot Dashboard</a></li>
              <li><a href="#" className="link link-hover">Premium Features</a></li>
            </ul>
          </div>
        </div>
        
        {/* Horizontal Divider */}
        <div className="w-full border-t border-gray-400 my-6"></div>
        
        {/* Social Icons */}
        <div className="footer-socials flex space-x-6">
          <a href="https://github.com" className="text-3xl hover:text-gray-700" aria-label="GitHub">
            <FaGithub style={{ color: '#333333' }} />
          </a>
          <a href="https://discord.com" className="text-3xl hover:text-blue-600" aria-label="Discord">
            <FaDiscord style={{ color: '#7289DA' }} />
          </a>
          <a href="https://twitter.com" className="text-3xl hover:text-blue-400" aria-label="Twitter">
            <FaTwitter style={{ color: '#1DA1F2' }} />
          </a>
        </div>
        
        {/* Copyright */}
        <p className="text-sm mt-6">© 2024 Athena Nexus. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
