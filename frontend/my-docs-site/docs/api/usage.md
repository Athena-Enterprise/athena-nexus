# API Usage

This document explains key backend API routes, including:
- User authentication
- Activity log management
- Notifications management
- Server commands

Each section provides examples of using the routes in the frontend.

## Authentication

### Login with Discord
```javascript
window.location.href = 'http://localhost:5000/api/auth/discord';
