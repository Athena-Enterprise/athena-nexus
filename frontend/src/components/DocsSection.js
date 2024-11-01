// frontend/src/components/DocsSection.js

import React from 'react';

const DocsSection = () => {
  return (
    <div className="pt-20 shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
      <div className="prose">
        <h3>Overview</h3>
        <p>Athena Nexus is a powerful Discord bot designed to enhance server functionality...</p>

        <h3>API Endpoints</h3>
        <ul>
          <li><strong>/api/auth/login:</strong> Initiates Discord OAuth2 login.</li>
          <li><strong>/api/auth/logout:</strong> Logs out the current user.</li>
          <li><strong>/api/admin/statistics:</strong> Retrieves bot and server statistics.</li>
          {/* Add more endpoints as needed */}
        </ul>

        <h3>Database Schema</h3>
        <p>The bot uses Sequelize ORM with the following models:</p>
        <ul>
          <li><strong>User:</strong> Stores user information.</li>
          <li><strong>Server:</strong> Stores Discord server details.</li>
          <li><strong>Command:</strong> Stores bot command configurations.</li>
          {/* Add more models as needed */}
        </ul>

        <h3>Folder Structure</h3>
        <pre>
{`
backend/
├── bot/
│   ├── commands/
│   │   ├── ping.js
│   │   └── serverinfo.js
│   └── utils/
│       └── deploy-commands.js
├── config/
│   ├── database.js
│   └── passport.js
├── controllers/
│   ├── adminController.js
│   └── authController.js
├── middleware/
│   ├── auth.js
│   └── isAdmin.js
├── models/
│   ├── user.js
│   └── server.js
├── routes/
│   ├── adminRoutes.js
│   └── authRoutes.js
└── scripts/
    ├── registerCommands.js
    └── setAdmin.js
`}
        </pre>

        <h3>Command Structure</h3>
        <p>Each command follows this structure:</p>
        <pre>
{`
module.exports = {
  name: 'commandName',
  description: 'Command Description',
  execute(message, args) {
    // Command logic here
  },
};
`}
        </pre>

        {/* Add more documentation as needed */}
      </div>
    </div>
  );
};

export default DocsSection;
