// Vercel Serverless Function for Users API
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join('/tmp', 'data'); // Use /tmp for Vercel (ephemeral)
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Read users from file
async function readUsers() {
    try {
        await ensureDataDir();
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Initialize with admin user
            const defaultUsers = [{
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            }];
            await writeUsers(defaultUsers);
            return defaultUsers;
        }
        throw error;
    }
}

// Write users to file
async function writeUsers(users) {
    await ensureDataDir();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Main handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { method } = req;
        const { username } = req.query;

        if (method === 'GET') {
            // Get all users or specific user
            const users = await readUsers();
            
            if (username) {
                const user = users.find(u => u.username === username);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                const { password, ...safeUser } = user;
                return res.json(safeUser);
            }
            
            // Return all users without passwords
            const safeUsers = users.map(({ password, ...user }) => user);
            return res.json(safeUsers);
        }

        if (method === 'POST') {
            // Check if it's a login request
            if (req.body.action === 'login') {
                const { username, password } = req.body;
                const users = await readUsers();
                const user = users.find(u => u.username === username);
                
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                
                if (user.password !== password) {
                    return res.status(401).json({ error: 'Invalid password' });
                }
                
                const { password: _, ...safeUser } = user;
                return res.json(safeUser);
            }

            // Create new user
            const { username, password, role = 'member' } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }
            
            const users = await readUsers();
            
            if (users.find(u => u.username === username)) {
                return res.status(409).json({ error: 'Username already exists' });
            }
            
            const newUser = {
                username,
                password,
                role,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            await writeUsers(users);
            
            const { password: _, ...safeUser } = newUser;
            return res.status(201).json(safeUser);
        }

        if (method === 'PUT') {
            const { username } = req.query;
            const updates = req.body;
            
            const users = await readUsers();
            const userIndex = users.findIndex(u => u.username === username);
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            users[userIndex] = { ...users[userIndex], ...updates };
            await writeUsers(users);
            
            const { password: _, ...safeUser } = users[userIndex];
            return res.json(safeUser);
        }

        if (method === 'DELETE') {
            const { username } = req.query;
            
            if (username.toLowerCase() === 'admin') {
                return res.status(403).json({ error: 'Cannot delete admin user' });
            }
            
            const users = await readUsers();
            const filteredUsers = users.filter(u => u.username !== username);
            
            if (users.length === filteredUsers.length) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            await writeUsers(filteredUsers);
            
            // Also delete user's checkouts
            const checkoutsFile = path.join(DATA_DIR, 'checkouts.json');
            try {
                const checkouts = JSON.parse(await fs.readFile(checkoutsFile, 'utf8'));
                const filteredCheckouts = {};
                Object.keys(checkouts).forEach(key => {
                    if (checkouts[key].username !== username) {
                        filteredCheckouts[key] = checkouts[key];
                    }
                });
                await fs.writeFile(checkoutsFile, JSON.stringify(filteredCheckouts, null, 2));
            } catch (error) {
                // Checkouts file might not exist, ignore
            }
            
            return res.json({ message: 'User deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
