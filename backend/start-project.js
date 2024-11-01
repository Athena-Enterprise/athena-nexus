require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

// Paths and credentials from .env
const rootPath = process.env.ROOT_PATH;
const postgresUser = process.env.POSTGRES_USER;
const postgresPassword = process.env.POSTGRES_PASSWORD; // Get the password
const postgresDb = process.env.POSTGRES_DB;

// Commands to run
const commands = [
    { cmd: 'node', args: ['server.js'], cwd: path.join(rootPath, 'backend') },
    { cmd: 'cmd', args: ['/k', ''], cwd: path.join(rootPath, 'backend') }, // Empty command for second backend
    { cmd: 'npm', args: ['start'], cwd: path.join(rootPath, 'frontend') },
    { cmd: 'node', args: ['bot.js'], cwd: path.join(rootPath, 'backend', 'bot') },
    { cmd: 'cmd', args: ['/k', ''], cwd: path.join(rootPath, 'frontend') }, // Empty command for frontend
    {
        // PostgreSQL command with optional password
        cmd: 'psql',
        args: [
            '-U', postgresUser,
            '-h', '127.0.0.1',
            '-d', postgresDb,
            ...(postgresPassword ? ['-W'] : []) // Prompt for password if provided
        ],
        cwd: rootPath,
    },
];

// Function to spawn a command
function runCommand({ cmd, args, cwd }) {
    const process = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true });

    process.on('error', (err) => {
        console.error(`Error starting ${cmd}:`, err);
    });

    process.on('close', (code) => {
        console.log(`${cmd} exited with code ${code}`);
    });
}

// Start each command
commands.forEach(runCommand);
