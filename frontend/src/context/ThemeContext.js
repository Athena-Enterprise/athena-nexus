// src/context/ThemeContext.js

import React, { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Set "athena-dark" as the default theme
  const [theme, setTheme] = useState('athena-dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'athena-dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Function to apply the theme
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme.endsWith('dark')) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Function to toggle themes
  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    applyTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
