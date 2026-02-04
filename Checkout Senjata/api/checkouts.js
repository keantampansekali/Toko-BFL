// Vercel Serverless Function for Checkouts API
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join('/tmp', 'data');
const CHECKOUTS_FILE = path.join(DATA_DIR, 'checkouts.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Read checkouts from file
async function readCheckouts() {
    try {
        await ensureDataDir();
        const data = await fs.readFile(CHECKOUTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await writeCheckouts({});
            return {};
        }
        throw error;
    }
}

// Write checkouts to file
async function writeCheckouts(checkouts) {
    await ensureDataDir();
    await fs.writeFile(CHECKOUTS_FILE, JSON.stringify(checkouts, null, 2), 'utf8');
}

// Main handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { method } = req;
        const { id } = req.query;

        if (method === 'GET') {
            const checkouts = await readCheckouts();
            const checkoutArray = Object.values(checkouts);
            return res.json(checkoutArray);
        }

        if (method === 'POST') {
            const checkout = req.body;
            
            if (!checkout.id || !checkout.username || !checkout.items || !checkout.total) {
                return res.status(400).json({ error: 'Invalid checkout data' });
            }
            
            const checkouts = await readCheckouts();
            checkouts[checkout.id.toString()] = checkout;
            await writeCheckouts(checkouts);
            
            return res.status(201).json(checkout);
        }

        if (method === 'DELETE') {
            const { id } = req.query;
            const checkouts = await readCheckouts();
            
            if (!checkouts[id]) {
                return res.status(404).json({ error: 'Checkout not found' });
            }
            
            delete checkouts[id];
            await writeCheckouts(checkouts);
            
            return res.json({ message: 'Checkout deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
