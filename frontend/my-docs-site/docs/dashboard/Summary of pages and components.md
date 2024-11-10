---
title: Application Overview
---

# Application Overview

This document provides a comprehensive overview of the application's pages, components, and their functionalities for both developers (Admin Menu) and Discord server owners (User Menu).

## Summary of Pages and Components

### A. Admin Menu (For Developers)

The Admin Menu is designed for developers to manage the application's users, servers, commands, and bot settings.

#### 1. Admin Dashboard (`/admin`)
   - **Description**: Displays overall statistics including:
     - Total users
     - Total servers
     - Active features
     - CPU and RAM usage
     - Database storage size
     - Recent activities

#### 2. User Management (`/admin/user-management`)
   - **Description**: Allows management of user accounts:
     - Assign or revoke admin roles

#### 3. Server Management (`/admin/server-management`)
   - **Description**: Manage bot-related server data:
     - View all servers where the bot is active
     - Access server owners, user counts, and server statuses
     - Manage custom commands and features per server
     - Modify server commands, delete servers, and set server statuses

#### 4. Command & Feature Management (`/admin/command-feature-management`)
   - **Description**: Enable, disable, deprecate, delete, or create commands and features:
     - Provides a code editor for new commands
     - Allows setting command name, description, tier, and associated features

#### 5. Custom Command Management (`/admin/custom-command-management`)
   - **Description**: Manage pre-defined custom commands without requiring code:
     - Select from pre-defined actions and setup custom embeds via a selector menu

#### 6. Notification Management (`/admin/notification-management`)
   - **Description**: Create, view, update, and delete notifications sent to users

#### 7. Activity Log Management (`/admin/activity-log-management`)
   - **Description**: View audit logs, user actions, and recent activities for accountability

#### 8. Bot Management (`/admin/bot-management`)
   - **Description**: Control bot settings:
     - Restart bot
     - Modify bot name, description, and avatar
     - Enable/disable bot addition to servers

### B. User Menu (For Discord Server Owners)

The User Menu is for Discord server owners to customize their experience with the bot in their respective servers.

#### 1. Dashboard (`/dashboard`)
   - **Description**: Server overview:
     - Displays bot statistics specific to the server and bot status
     - Provides a server dropdown in the sidebar for managing multiple servers

#### 2. Commands (`/dashboard/commands`)
   - **Description**: Manage custom commands:
     - Create, enable, or disable commands for the server
     - Prevent deprecated commands from being enabled

#### 3. Settings (`/settings`)
   - **Description**: Bot-specific settings for a server:
     - Modify bot avatar and name, specific to the server

### C. Common Components

Reusable components used across various pages of the application.

#### 1. Sidebar (`Sidebar.js`)
   - **Description**: A navigation menu for both Admin and User menus
   - **Features**:
     - Contains links to ActivityLogManagement, CustomCommandManagement, and NotificationManagement
     - Enhanced design with colors, separators, and full viewport height

#### 2. Navbar (`Navbar.js`)
   - **Description**: Top navigation bar

#### 3. Footer (`Footer.js`)
   - **Description**: Bottom footer bar

#### 4. StatCard (`StatCard.js`)
   - **Description**: Reusable component for displaying statistical information

#### 5. ConfirmModal (`ConfirmModal.js`)
   - **Description**: Modal dialog for confirming critical actions like deletions

#### 6. ErrorBoundary (`ErrorBoundary.js`)
   - **Description**: Catches JavaScript errors within the component tree for improved error handling

### D. Utility Components

These components provide additional functionalities to enhance user experience and maintain security.

#### 1. PrivateRoute (`PrivateRoute.js`)
   - **Description**: Protects routes that require user authentication

#### 2. AdminRoute (`AdminRoute.js`)
   - **Description**: Restricts access to routes requiring admin privileges

#### 3. ThemeSelector (`ThemeSelector.js`)
   - **Description**: Allows users to switch themes for a personalized experience

#### 4. CodeEditor (`CodeEditor.js`)
   - **Description**: Integrated code editor for developers to write or edit command code

---

By organizing pages and components as outlined above, this document aims to provide clarity on the application's structure and enhance maintainability for both developers and end-users.
