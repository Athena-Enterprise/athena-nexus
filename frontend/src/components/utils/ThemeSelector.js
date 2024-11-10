// frontend/src/components/utils/ThemeSelector.js

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaPalette } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';
import '../../styles/ThemeSelector.css'; // Ensure this file exists and has necessary styles

function ThemeSelector() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  const themes = [
    { name: 'Athena Light', value: 'athena-light' },
    { name: 'Athena Dark', value: 'athena-dark' },
    { name: 'Default Light', value: 'default-light' },
    { name: 'Default Dark', value: 'default-dark' },
    { name: 'Ocean Blue Light', value: 'ocean-blue-light' },
    { name: 'Ocean Blue Dark', value: 'ocean-blue-dark' },
    { name: 'Teal Light', value: 'teal-light' },
    { name: 'Teal Dark', value: 'teal-dark' },
    { name: 'Sunrise Light', value: 'sunrise-light' },
    { name: 'Sunrise Dark', value: 'sunrise-dark' },
    { name: 'Midnight Light', value: 'midnight-light' },
    { name: 'Midnight Dark', value: 'midnight-dark' },
    { name: 'Emerald Light', value: 'emerald-light' },
    { name: 'Emerald Dark', value: 'emerald-dark' },
    { name: 'Cyberpunk Light', value: 'cyberpunk-light' },
    { name: 'Cyberpunk Dark', value: 'cyberpunk-dark' },
  ];

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeChange = (selectedTheme) => {
    toggleTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50" ref={selectorRef}>
      {/* Palette Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-circle btn-primary shadow-lg"
        aria-label="Select Theme"
      >
        <FaPalette className="text-xl" />
      </button>

      {/* Dropdown Menu with Transition */}
      <CSSTransition
        in={isOpen}
        timeout={200}
        classNames="dropdown"
        unmountOnExit
      >
        <ul className="absolute left-0 bottom-full mb-2 w-48 bg-base-100 border border-gray-200 rounded-md shadow-lg">
          {themes.map((th) => (
            <li key={th.value}>
              <button
                onClick={() => handleThemeChange(th.value)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${
                  theme === th.value ? 'bg-gray-200 font-semibold' : ''
                }`}
              >
                {th.name}
              </button>
            </li>
          ))}
        </ul>
      </CSSTransition>
    </div>
  );
}

export default ThemeSelector;
