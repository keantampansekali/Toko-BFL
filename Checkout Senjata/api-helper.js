// API Helper - Replaces Firebase helper
// Base URL for API (defaults to same origin)
// Works with both local server and Vercel deployment
const API_BASE_URL = window.location.origin;

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    try {
        // Build query string from options.params if exists
        let url = `${API_BASE_URL}/api${endpoint}`;
        if (options.params) {
            const params = new URLSearchParams(options.params);
            url += '?' + params.toString();
        }
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// User functions
async function getUsersFromAPI(callback) {
    try {
        const users = await apiRequest('/users');
        if (callback) callback(users);
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        if (callback) callback([]);
        return [];
    }
}

async function saveUserToAPI(user, callback) {
    try {
        // Check if user exists
        const users = await getUsersFromAPI();
        const existingUser = users.find(u => u.username === user.username);
        
        let result;
        if (existingUser) {
            // Update existing user
            result = await apiRequest(`/users?username=${encodeURIComponent(user.username)}`, {
                method: 'PUT',
                body: JSON.stringify(user)
            });
        } else {
            // Create new user
            result = await apiRequest('/users', {
                method: 'POST',
                body: JSON.stringify(user)
            });
        }
        
        if (callback) callback(result);
        return result;
    } catch (error) {
        console.error('Error saving user:', error);
        if (callback) callback(null);
        return null;
    }
}

async function deleteUserFromAPI(username, callback) {
    try {
        await apiRequest(`/users?username=${encodeURIComponent(username)}`, {
            method: 'DELETE'
        });
        if (callback) callback(true);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        if (callback) callback(false);
        return false;
    }
}

// Checkout functions
async function getCheckoutsFromAPI(callback) {
    try {
        const checkouts = await apiRequest('/checkouts');
        if (callback) callback(checkouts);
        return checkouts;
    } catch (error) {
        console.error('Error getting checkouts:', error);
        if (callback) callback([]);
        return [];
    }
}

async function saveCheckoutToAPI(checkout, callback) {
    try {
        const savedCheckout = await apiRequest('/checkouts', {
            method: 'POST',
            body: JSON.stringify(checkout)
        });
        if (callback) callback(savedCheckout);
        return savedCheckout;
    } catch (error) {
        console.error('Error saving checkout:', error);
        if (callback) callback(null);
        return null;
    }
}

// Compatibility functions (for existing code)
function getUsersFromFirebase(callback) {
    return getUsersFromAPI(callback);
}

function saveUserToFirebase(user, callback) {
    return saveUserToAPI(user, callback);
}

function deleteUserFromFirebase(username, callback) {
    return deleteUserFromAPI(username, callback);
}

function getCheckoutsFromFirebase(callback) {
    return getCheckoutsFromAPI(callback);
}

function saveCheckoutToFirebase(checkout, callback) {
    return saveCheckoutToAPI(checkout, callback);
}

// Real-time listeners (simulated with polling)
let checkoutListeners = [];
let userListeners = [];
let pollingInterval = null;

function startPolling() {
    if (pollingInterval) return;
    
    pollingInterval = setInterval(async () => {
        // Poll for checkouts
        if (checkoutListeners.length > 0) {
            try {
                const checkouts = await getCheckoutsFromAPI();
                checkoutListeners.forEach(callback => callback(checkouts));
            } catch (error) {
                console.error('Error polling checkouts:', error);
            }
        }
        
        // Poll for users
        if (userListeners.length > 0) {
            try {
                const users = await getUsersFromAPI();
                userListeners.forEach(callback => callback(users));
            } catch (error) {
                console.error('Error polling users:', error);
            }
        }
    }, 2000); // Poll every 2 seconds
}

function listenToCheckouts(callback) {
    checkoutListeners.push(callback);
    startPolling();
    
    // Immediately call with current data
    getCheckoutsFromAPI(callback);
}

function listenToUsers(callback) {
    userListeners.push(callback);
    startPolling();
    
    // Immediately call with current data
    getUsersFromAPI(callback);
}

// Firebase compatibility check (always return false since we're not using Firebase)
function isFirebaseReady() {
    return false;
}

// Export for use in HTML files
if (typeof window !== 'undefined') {
    window.getUsersFromFirebase = getUsersFromFirebase;
    window.saveUserToFirebase = saveUserToFirebase;
    window.deleteUserFromFirebase = deleteUserFromFirebase;
    window.getCheckoutsFromFirebase = getCheckoutsFromFirebase;
    window.saveCheckoutToFirebase = saveCheckoutToFirebase;
    window.listenToCheckouts = listenToCheckouts;
    window.listenToUsers = listenToUsers;
    window.isFirebaseReady = isFirebaseReady;
}
