// tailwind.config.js

module.exports = {
  darkMode: 'class', // Enable dark mode via class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths as necessary
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ef233c', // Red accent for the logo
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'], // Welcoming font for headings
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        lightmode: { // Define your custom light theme
          "primary": "#ef233c", // Vivid Red
          "primary-content": "#ffffff", // White text for primary elements
          "secondary": "#00bcff", // Bright Blue
          "secondary-content": "#ffffff", // White text for secondary elements
          "accent": "#ff6f00", // Vibrant Orange for accents
          "accent-content": "#ffffff", // White text for accents
          "neutral": "#f5f5f5", // Light Grey for neutral backgrounds
          "neutral-content": "#1a202c", // Dark text on neutral backgrounds
          "base-100": "#ffffff", // Base white background
          "base-200": "#f5f5f5", // Slightly darker white for layered elements
          "base-300": "#e5e5e5", // Even darker white for borders or dividers
          "base-content": "#1a202c", // Dark text for base content
          "info": "#17a2b8", // Teal for informational messages
          "info-content": "#ffffff", // White text on info backgrounds
          "success": "#28a745", // Green for success messages
          "success-content": "#ffffff", // White text on success backgrounds
          "warning": "#ffc107", // Yellow for warnings
          "warning-content": "#212529", // Dark text on warning backgrounds
          "error": "#dc3545", // Red for errors
          "error-content": "#ffffff", // White text on error backgrounds
        },
        "dark": { // Define your custom dark theme
          "primary": "#ef233c", // Vivid Red (consistent with light theme)
          "primary-content": "#ffffff", // White text for primary elements
          "secondary": "#00bcff", // Bright Blue (consistent with light theme)
          "secondary-content": "#ffffff", // White text for secondary elements
          "accent": "#ff6f00", // Vibrant Orange (consistent with light theme)
          "accent-content": "#ffffff", // White text for accents
          "neutral": "#2d2d2d", // Dark Grey for neutral backgrounds
          "neutral-content": "#cfd1d1", // Light Grey text on neutral backgrounds
          "base-100": "#1a202c", // Very Dark Blue-Grey background
          "base-200": "#141b1b", // Slightly lighter dark background
          "base-300": "#0d1313", // Darkest Grey for borders or dividers
          "base-content": "#cfd1d1", // Light text for base content
          "info": "#17a2b8", // Teal (consistent with light theme)
          "info-content": "#ffffff", // White text on info backgrounds
          "success": "#28a745", // Green (consistent with light theme)
          "success-content": "#ffffff", // White text on success backgrounds
          "warning": "#ffc107", // Yellow (consistent with light theme)
          "warning-content": "#f9dcd1", // Light text on warning backgrounds
          "error": "#dc3545", // Red (consistent with light theme)
          "error-content": "#ffffff", // White text on error backgrounds
        },
        "athena-light": {
          "primary": "#6A0DAD", // Royal Purple
          "primary-content": "#ffffff", // White text
          "secondary": "#FFD700", // Gold
          "secondary-content": "#ffffff", // White text
          "accent": "#FF69B4", // Hot Pink
          "accent-content": "#ffffff", // White text
          "neutral": "#F5F5F5", // Light Grey
          "neutral-content": "#1a202c", // Dark text
          "base-100": "#ffffff", // White background
          "base-200": "#F0EFFF", // Lavender Mist
          "base-300": "#E6E6FA", // Lavender
          "base-content": "#1a202c", // Dark text
          "info": "#1E90FF", // Dodger Blue
          "info-content": "#ffffff", // White text
          "success": "#32CD32", // Lime Green
          "success-content": "#ffffff", // White text
          "warning": "#FFA500", // Orange
          "warning-content": "#ffffff", // White text
          "error": "#FF4500", // Orange Red
          "error-content": "#ffffff", // White text
        },
        "athena-dark": {
          "primary": "#B19CD9", // Light Purple
          "primary-content": "#1a202c", // Dark text
          "secondary": "#FFD700", // Gold (consistent)
          "secondary-content": "#1a202c", // Dark text
          "accent": "#FF69B4", // Hot Pink (consistent)
          "accent-content": "#1a202c", // Dark text
          "neutral": "#2D2D2D", // Dark Grey
          "neutral-content": "#F5F5F5", // Light text
          "base-100": "#1a202c", // Dark Background
          "base-200": "#121212", // Very Dark Grey
          "base-300": "#0D0D0D", // Almost Black
          "base-content": "#F5F5F5", // Light text
          "info": "#1E90FF", // Dodger Blue (consistent)
          "info-content": "#1a202c", // Dark text
          "success": "#32CD32", // Lime Green (consistent)
          "success-content": "#1a202c", // Dark text
          "warning": "#FFA500", // Orange (consistent)
          "warning-content": "#1a202c", // Dark text
          "error": "#FF4500", // Orange Red (consistent)
          "error-content": "#1a202c", // Dark text
        },
        "default-light": {
          "primary": "#1E40AF", // Indigo
          "primary-content": "#ffffff", // White text
          "secondary": "#D97706", // Amber
          "secondary-content": "#ffffff", // White text
          "accent": "#10B981", // Emerald
          "accent-content": "#ffffff", // White text
          "neutral": "#F3F4F6", // Light Grey
          "neutral-content": "#1a202c", // Dark text
          "base-100": "#ffffff", // White background
          "base-200": "#f5f5f5", // Light Grey
          "base-300": "#e5e5e5", // Grey
          "base-content": "#1a202c", // Dark text
          "info": "#3B82F6", // Blue
          "info-content": "#ffffff", // White text
          "success": "#22C55E", // Green
          "success-content": "#ffffff", // White text
          "warning": "#F59E0B", // Amber
          "warning-content": "#1a202c", // Dark text
          "error": "#EF4444", // Red
          "error-content": "#ffffff", // White text
        },
        "default-dark": {
          "primary": "#93C5FD", // Light Indigo
          "primary-content": "#1a202c", // Dark text
          "secondary": "#FCD34D", // Light Amber
          "secondary-content": "#1a202c", // Dark text
          "accent": "#6EE7B7", // Light Emerald
          "accent-content": "#1a202c", // Dark text
          "neutral": "#2D3748", // Dark Grey Blue
          "neutral-content": "#F3F4F6", // Light Grey text
          "base-100": "#1a202c", // Dark background
          "base-200": "#2D3748", // Dark Grey Blue
          "base-300": "#4A5568", // Blue Grey
          "base-content": "#F3F4F6", // Light text
          "info": "#60A5FA", // Light Blue
          "info-content": "#1a202c", // Dark text
          "success": "#34D399", // Light Green
          "success-content": "#1a202c", // Dark text
          "warning": "#FBBF24", // Amber
          "warning-content": "#1a202c", // Dark text
          "error": "#F87171", // Light Red
          "error-content": "#1a202c", // Dark text
        },
        "ocean-blue-light": {
          "primary": "#1E40AF", // Ocean Blue
          "primary-content": "#ffffff", // White text
          "secondary": "#0284C7", // Blue
          "secondary-content": "#ffffff", // White text
          "accent": "#38BDF8", // Sky Blue
          "accent-content": "#ffffff", // White text
          "neutral": "#E0F2FE", // Light Sky Blue
          "neutral-content": "#1a202c", // Dark text
          "base-100": "#ffffff", // White background
          "base-200": "#E0F2FE", // Light Sky Blue
          "base-300": "#BAE6FD", // Sky Blue
          "base-content": "#1a202c", // Dark text
          "info": "#60A5FA", // Light Blue
          "info-content": "#ffffff", // White text
          "success": "#34D399", // Green
          "success-content": "#ffffff", // White text
          "warning": "#FBBF24", // Amber
          "warning-content": "#1a202c", // Dark text
          "error": "#F87171", // Light Red
          "error-content": "#ffffff", // White text
        },
        "ocean-blue-dark": {
          "primary": "#60A5FA", // Light Blue
          "primary-content": "#1a202c", // Dark text
          "secondary": "#3B82F6", // Blue
          "secondary-content": "#1a202c", // Dark text
          "accent": "#38BDF8", // Sky Blue (consistent)
          "accent-content": "#1a202c", // Dark text
          "neutral": "#1E293B", // Dark Blue Grey
          "neutral-content": "#E0F2FE", // Light Sky Blue text
          "base-100": "#1E293B", // Dark background
          "base-200": "#0F172A", // Very Dark Blue Grey
          "base-300": "#0D1B2A", // Almost Black Blue
          "base-content": "#E0F2FE", // Light text
          "info": "#3B82F6", // Blue (consistent)
          "info-content": "#1a202c", // Dark text
          "success": "#34D399", // Green (consistent)
          "success-content": "#1a202c", // Dark text
          "warning": "#FCD34D", // Light Amber
          "warning-content": "#1a202c", // Dark text
          "error": "#F87171", // Light Red (consistent)
          "error-content": "#1a202c", // Dark text
        },
        "teal-light": {
          "primary": "#14B8A6", // Teal
          "primary-content": "#ffffff", // White text
          "secondary": "#2DD4BF", // Light Teal
          "secondary-content": "#ffffff", // White text
          "accent": "#0CA678", // Emerald Teal
          "accent-content": "#ffffff", // White text
          "neutral": "#E6FFFA", // Mint Cream
          "neutral-content": "#1a202c", // Dark text
          "base-100": "#ffffff", // White background
          "base-200": "#E6FFFA", // Mint Cream
          "base-300": "#B2F5EA", // Light Mint
          "base-content": "#1a202c", // Dark text
          "info": "#38BDF8", // Sky Blue
          "info-content": "#ffffff", // White text
          "success": "#10B981", // Green
          "success-content": "#ffffff", // White text
          "warning": "#F59E0B", // Amber
          "warning-content": "#1a202c", // Dark text
          "error": "#EF4444", // Red
          "error-content": "#ffffff", // White text
        },
        "teal-dark": {
          "primary": "#2DD4BF", // Light Teal
          "primary-content": "#1a202c", // Dark text
          "secondary": "#14B8A6", // Teal (consistent)
          "secondary-content": "#1a202c", // Dark text
          "accent": "#0CA678", // Emerald Teal (consistent)
          "accent-content": "#1a202c", // Dark text
          "neutral": "#065F46", // Dark Teal
          "neutral-content": "#E6FFFA", // Mint Cream text
          "base-100": "#065F46", // Dark Teal background
          "base-200": "#064E3B", // Darker Teal
          "base-300": "#047857", // Emerald Green
          "base-content": "#E6FFFA", // Light text
          "info": "#38BDF8", // Sky Blue (consistent)
          "info-content": "#1a202c", // Dark text
          "success": "#10B981", // Green (consistent)
          "success-content": "#1a202c", // Dark text
          "warning": "#FBBF24", // Amber (consistent)
          "warning-content": "#1a202c", // Dark text
          "error": "#F87171", // Light Red (consistent)
          "error-content": "#1a202c", // Dark text
        },
        "sunrise-light": {
          "primary": "#FDB813", // Bright Orange
          "primary-content": "#ffffff", // White text
          "secondary": "#FF7F50", // Coral
          "secondary-content": "#ffffff", // White text
          "accent": "#FF69B4", // Hot Pink
          "accent-content": "#ffffff", // White text
          "neutral": "#FFF5E1", // Light Peach
          "neutral-content": "#1a202c", // Dark text
          "base-100": "#ffffff", // White background
          "base-200": "#FFF5E1", // Light Peach
          "base-300": "#FFEFD5", // Papaya Whip
          "base-content": "#1a202c", // Dark text
          "info": "#00BFFF", // Deep Sky Blue
          "info-content": "#ffffff", // White text
          "success": "#32CD32", // Lime Green
          "success-content": "#ffffff", // White text
          "warning": "#FFA500", // Orange
          "warning-content": "#1a202c", // Dark text
          "error": "#FF4500", // Orange Red
          "error-content": "#ffffff", // White text
        },
        "sunrise-dark": {
          "primary": "#FF7F50", // Coral
          "primary-content": "#1a202c", // Dark text
          "secondary": "#FDB813", // Bright Orange (consistent)
          "secondary-content": "#1a202c", // Dark text
          "accent": "#FF69B4", // Hot Pink (consistent)
          "accent-content": "#1a202c", // Dark text
          "neutral": "#4A2C2A", // Deep Brown
          "neutral-content": "#FFF5E1", // Light Peach text
          "base-100": "#4A2C2A", // Deep Brown background
          "base-200": "#3B1F1E", // Darker Brown
          "base-300": "#2E1515", // Very Dark Brown
          "base-content": "#FFF5E1", // Light text
          "info": "#00BFFF", // Deep Sky Blue (consistent)
          "info-content": "#1a202c", // Dark text
          "success": "#32CD32", // Lime Green (consistent)
          "success-content": "#1a202c", // Dark text
          "warning": "#FFA500", // Orange (consistent)
          "warning-content": "#1a202c", // Dark text
          "error": "#FF4500", // Orange Red (consistent)
          "error-content": "#1a202c", // Dark text
        },
        "midnight-light": {
          "primary": "#2C3E50", // Midnight Blue
          "primary-content": "#ffffff", // White text
          "secondary": "#34495E", // Dark Slate Grey
          "secondary-content": "#ffffff", // White text
          "accent": "#9B59B6", // Amethyst
          "accent-content": "#ffffff", // White text
          "neutral": "#ECF0F1", // Clouds
          "neutral-content": "#2C3E50", // Dark text
          "base-100": "#ffffff", // White background
          "base-200": "#ECF0F1", // Clouds
          "base-300": "#BDC3C7", // Silver
          "base-content": "#2C3E50", // Dark text
          "info": "#3498DB", // Blue
          "info-content": "#ffffff", // White text
          "success": "#2ECC71", // Green
          "success-content": "#ffffff", // White text
          "warning": "#F1C40F", // Yellow
          "warning-content": "#2C3E50", // Dark text
          "error": "#E74C3C", // Red
          "error-content": "#ffffff", // White text
        },
        "midnight-dark": {
          "primary": "#9B59B6", // Amethyst
          "primary-content": "#2C3E50", // Dark text
          "secondary": "#34495E", // Dark Slate Grey (consistent)
          "secondary-content": "#2C3E50", // Dark text
          "accent": "#8E44AD", // Purple
          "accent-content": "#2C3E50", // Dark text
          "neutral": "#2C3E50", // Midnight Blue
          "neutral-content": "#ECF0F1", // Clouds text
          "base-100": "#2C3E50", // Midnight Blue background
          "base-200": "#1A252F", // Darker Midnight Blue
          "base-300": "#17202A", // Very Dark Blue
          "base-content": "#ECF0F1", // Light text
          "info": "#3498DB", // Blue (consistent)
          "info-content": "#2C3E50", // Dark text
          "success": "#2ECC71", // Green (consistent)
          "success-content": "#2C3E50", // Dark text
          "warning": "#F1C40F", // Yellow (consistent)
          "warning-content": "#2C3E50", // Dark text
          "error": "#E74C3C", // Red (consistent)
          "error-content": "#2C3E50", // Dark text
        },
        "emerald-light": {
          "primary": "#10B981", // Emerald
          "primary-content": "#ffffff", // White text
          "secondary": "#34D399", // Light Emerald
          "secondary-content": "#ffffff", // White text
          "accent": "#4ADE80", // Green
          "accent-content": "#ffffff", // White text
          "neutral": "#E0F2FE", // Mint Cream
          "neutral-content": "#1a202c", // Dark text
          "base-100": "#ffffff", // White background
          "base-200": "#E0F2FE", // Mint Cream
          "base-300": "#BAE6FD", // Sky Blue
          "base-content": "#1a202c", // Dark text
          "info": "#3B82F6", // Blue
          "info-content": "#ffffff", // White text
          "success": "#10B981", // Emerald (consistent)
          "success-content": "#ffffff", // White text
          "warning": "#F59E0B", // Amber
          "warning-content": "#1a202c", // Dark text
          "error": "#EF4444", // Red
          "error-content": "#ffffff", // White text
        },
        "emerald-dark": {
          "primary": "#34D399", // Light Emerald
          "primary-content": "#1a202c", // Dark text
          "secondary": "#10B981", // Emerald (consistent)
          "secondary-content": "#1a202c", // Dark text
          "accent": "#4ADE80", // Green (consistent)
          "accent-content": "#1a202c", // Dark text
          "neutral": "#065F46", // Dark Teal
          "neutral-content": "#E0F2FE", // Mint Cream text
          "base-100": "#065F46", // Dark Teal background
          "base-200": "#064E3B", // Darker Teal
          "base-300": "#047857", // Emerald Green
          "base-content": "#E0F2FE", // Light text
          "info": "#3B82F6", // Blue (consistent)
          "info-content": "#1a202c", // Dark text
          "success": "#10B981", // Emerald (consistent)
          "success-content": "#1a202c", // Dark text
          "warning": "#FCD34D", // Light Amber
          "warning-content": "#1a202c", // Dark text
          "error": "#F87171", // Light Red (consistent)
          "error-content": "#1a202c", // Dark text
        },
        "cyberpunk-light": {
          "primary": "#00FFFF", // Cyan Neon
          "primary-content": "#000000", // Black text
          "secondary": "#FF00FF", // Magenta Neon
          "secondary-content": "#000000", // Black text
          "accent": "#FFFF00", // Yellow Neon
          "accent-content": "#000000", // Black text
          "neutral": "#F0F0F0", // Light Grey
          "neutral-content": "#000000", // Black text
          "base-100": "#ffffff", // White background
          "base-200": "#F0F0F0", // Light Grey
          "base-300": "#D9D9D9", // Grey
          "base-content": "#000000", // Black text
          "info": "#1E90FF", // Blue
          "info-content": "#000000", // Black text
          "success": "#32CD32", // Lime Green
          "success-content": "#000000", // Black text
          "warning": "#FFA500", // Orange
          "warning-content": "#000000", // Black text
          "error": "#FF4500", // Orange Red
          "error-content": "#000000", // Black text
        },
        "cyberpunk-dark": {
          "primary": "#FF00FF", // Magenta Neon
          "primary-content": "#00FFFF", // Cyan Neon text
          "secondary": "#00FFFF", // Cyan Neon (consistent)
          "secondary-content": "#FF00FF", // Magenta Neon text
          "accent": "#FFFF00", // Yellow Neon (consistent)
          "accent-content": "#000000", // Black text
          "neutral": "#1F2937", // Dark Blue Grey
          "neutral-content": "#FF00FF", // Magenta Neon text
          "base-100": "#0F172A", // Very Dark Blue
          "base-200": "#1F2937", // Dark Blue Grey
          "base-300": "#374151", // Medium Dark Grey
          "base-content": "#FF00FF", // Magenta Neon text
          "info": "#1E90FF", // Blue (consistent)
          "info-content": "#00FFFF", // Cyan Neon text
          "success": "#32CD32", // Lime Green (consistent)
          "success-content": "#000000", // Black text
          "warning": "#FFA500", // Orange (consistent)
          "warning-content": "#000000", // Black text
          "error": "#FF4500", // Orange Red (consistent)
          "error-content": "#000000", // Black text
        }
      },
    ],
  },
};
