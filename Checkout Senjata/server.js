const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Read data from JSON file
async function readData(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array/object
        if (error.code === 'ENOENT') {
            return filename === 'users.json' ? [] : {};
        }
        throw error;
    }
}

// Write data to JSON file
async function writeData(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Initialize data files
async function initializeData() {
    await ensureDataDir();
    
    // Initialize users.json with admin user if not exists
    try {
        const users = await readData('users.json');
        const adminExists = users.find(u => u.username.toLowerCase() === 'admin');
        if (!adminExists) {
            users.push({
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            await writeData('users.json', users);
            console.log('✅ Admin user initialized');
        }
    } catch (error) {
        console.error('Error initializing users:', error);
    }
    
    // Initialize checkouts.json if not exists
    try {
        await readData('checkouts.json');
    } catch (error) {
        await writeData('checkouts.json', {});
        console.log('✅ Checkouts file initialized');
    }
}

// API Routes

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await readData('users.json');
        // Don't send passwords to client
        const safeUsers = users.map(({ password, ...user }) => user);
        res.json(safeUsers);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// Get user by username (for login)
app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await readData('users.json');
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        // Return user without password
        const { password: _, ...safeUser } = user;
        res.json(safeUser);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const { username, password, role = 'member' } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        const users = await readData('users.json');
        
        // Check if user already exists
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
        await writeData('users.json', users);
        
        // Return user without password
        const { password: _, ...safeUser } = newUser;
        res.status(201).json(safeUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
app.put('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const updates = req.body;
        
        const users = await readData('users.json');
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update user
        users[userIndex] = { ...users[userIndex], ...updates };
        await writeData('users.json', users);
        
        // Return user without password
        const { password: _, ...safeUser } = users[userIndex];
        res.json(safeUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
app.delete('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        if (username.toLowerCase() === 'admin') {
            return res.status(403).json({ error: 'Cannot delete admin user' });
        }
        
        const users = await readData('users.json');
        const filteredUsers = users.filter(u => u.username !== username);
        
        if (users.length === filteredUsers.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await writeData('users.json', filteredUsers);
        
        // Also delete user's checkouts
        const checkouts = await readData('checkouts.json');
        const filteredCheckouts = {};
        Object.keys(checkouts).forEach(key => {
            if (checkouts[key].username !== username) {
                filteredCheckouts[key] = checkouts[key];
            }
        });
        await writeData('checkouts.json', filteredCheckouts);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Get all checkouts
app.get('/api/checkouts', async (req, res) => {
    try {
        const checkouts = await readData('checkouts.json');
        const checkoutArray = Object.values(checkouts);
        res.json(checkoutArray);
    } catch (error) {
        console.error('Error getting checkouts:', error);
        res.status(500).json({ error: 'Failed to get checkouts' });
    }
});

// Create new checkout
app.post('/api/checkouts', async (req, res) => {
    try {
        const checkout = req.body;
        
        if (!checkout.id || !checkout.username || !checkout.items || !checkout.total) {
            return res.status(400).json({ error: 'Invalid checkout data' });
        }
        
        const checkouts = await readData('checkouts.json');
        checkouts[checkout.id.toString()] = checkout;
        await writeData('checkouts.json', checkouts);
        
        res.status(201).json(checkout);
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Failed to create checkout' });
    }
});

// Delete checkout
app.delete('/api/checkouts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const checkouts = await readData('checkouts.json');
        
        if (!checkouts[id]) {
            return res.status(404).json({ error: 'Checkout not found' });
        }
        
        delete checkouts[id];
        await writeData('checkouts.json', checkouts);
        
        res.json({ message: 'Checkout deleted successfully' });
    } catch (error) {
        console.error('Error deleting checkout:', error);
        res.status(500).json({ error: 'Failed to delete checkout' });
    }
});

// Start server
async function startServer() {
    await initializeData();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📁 Data stored in: ${DATA_DIR}`);
        console.log(`🌐 Accessible from other computers on your network`);
        console.log(`   Use your computer's IP address: http://YOUR_IP:${PORT}`);
    });
}

startServer().catch(console.error);
