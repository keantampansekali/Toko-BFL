// Supabase Helper - Replaces Firebase helper
// Setup Supabase client

// IMPORTANT: Replace these with your Supabase project credentials
// Get them from: https://app.supabase.com/project/_/settings/api
const SUPABASE_URL = 'https://uuqpdpmvgchhwlptpjuk.supabase.co'; // Full URL dengan https://
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cXBkcG12Z2NoaHdscHRwanVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDg2NjEsImV4cCI6MjA4NTgyNDY2MX0.s6bYB0_a05Tia6rxBD8aLZihGkUnrLR6XvgQyRfuRrI'; // Your anon/public key

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return true;
    }
    return false;
}

// Check if Supabase is ready
function isSupabaseReady() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return true;
}

// User functions
async function getUsersFromSupabase(callback) {
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback([]);
            return [];
        }

        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error getting users:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            
            // Show user-friendly error
            if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
                alert('⚠️ Error: Tables belum dibuat!\n\nSilakan jalankan SQL script di Supabase Dashboard:\n1. Buka SQL Editor\n2. Copy isi file supabase-setup.sql\n3. Jalankan script');
            }
            
            if (callback) callback([]);
            return [];
        }

        // If no users, try to create admin user
        if (!data || data.length === 0) {
            console.log('No users found, creating admin user...');
            const adminUser = {
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            };
            const saved = await saveUserToSupabase(adminUser);
            if (saved) {
                if (callback) callback([saved]);
                return [saved];
            }
        }

        // Initialize admin user if not exists
        const adminExists = data.find(u => u.username.toLowerCase() === 'admin');
        if (!adminExists) {
            console.log('Admin user not found, creating...');
            const adminUser = {
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            };
            const saved = await saveUserToSupabase(adminUser);
            if (saved) {
                data.push(saved);
            }
        }

        if (callback) callback(data || []);
        return data || [];
    } catch (error) {
        console.error('Error getting users:', error);
        if (callback) callback([]);
        return [];
    }
}

async function saveUserToSupabase(user, callback) {
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback(null);
            return null;
        }

        // Check if user exists
        const { data: existingUsers } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', user.username)
            .limit(1);

        let result;
        if (existingUsers && existingUsers.length > 0) {
            // Update existing user
            const { data, error } = await supabaseClient
                .from('users')
                .update({
                    password: user.password,
                    role: user.role
                })
                .eq('username', user.username)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // Insert new user
            const { data, error } = await supabaseClient
                .from('users')
                .insert({
                    username: user.username,
                    password: user.password,
                    role: user.role || 'member'
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        if (callback) callback(result);
        return result;
    } catch (error) {
        console.error('Error saving user:', error);
        if (callback) callback(null);
        return null;
    }
}

async function deleteUserFromSupabase(username, callback) {
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback(false);
            return false;
        }

        if (username.toLowerCase() === 'admin') {
            if (callback) callback(false);
            return false;
        }

        // Delete user
        const { error: userError } = await supabaseClient
            .from('users')
            .delete()
            .eq('username', username);

        if (userError) throw userError;

        // Also delete user's checkouts
        const { error: checkoutError } = await supabaseClient
            .from('checkouts')
            .delete()
            .eq('username', username);

        // Ignore checkout error if no checkouts exist
        if (checkoutError && !checkoutError.message.includes('no rows')) {
            console.error('Error deleting user checkouts:', checkoutError);
        }

        if (callback) callback(true);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        if (callback) callback(false);
        return false;
    }
}

// Checkout functions
async function getCheckoutsFromSupabase(callback) {
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback([]);
            return [];
        }

        const { data, error } = await supabaseClient
            .from('checkouts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error getting checkouts:', error);
            if (callback) callback([]);
            return [];
        }

        // Transform data to match expected format
        const checkouts = data.map(c => ({
            id: c.checkout_id,
            username: c.username,
            items: c.items,
            total: parseFloat(c.total),
            date: c.date
        }));

        if (callback) callback(checkouts);
        return checkouts;
    } catch (error) {
        console.error('Error getting checkouts:', error);
        if (callback) callback([]);
        return [];
    }
}

async function saveCheckoutToSupabase(checkout, callback) {
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback(null);
            return null;
        }

        const { data, error } = await supabaseClient
            .from('checkouts')
            .insert({
                checkout_id: checkout.id,
                username: checkout.username,
                items: checkout.items,
                total: checkout.total,
                date: checkout.date
            })
            .select()
            .single();

        if (error) throw error;

        // Transform back to expected format
        const result = {
            id: data.checkout_id,
            username: data.username,
            items: data.items,
            total: parseFloat(data.total),
            date: data.date
        };

        if (callback) callback(result);
        return result;
    } catch (error) {
        console.error('Error saving checkout:', error);
        if (callback) callback(null);
        return null;
    }
}

// Compatibility functions (for existing code)
function getUsersFromFirebase(callback) {
    return getUsersFromSupabase(callback);
}

function saveUserToFirebase(user, callback) {
    return saveUserToSupabase(user, callback);
}

function deleteUserFromFirebase(username, callback) {
    return deleteUserFromSupabase(username, callback);
}

function getCheckoutsFromFirebase(callback) {
    return getCheckoutsFromSupabase(callback);
}

function saveCheckoutToFirebase(checkout, callback) {
    return saveCheckoutToSupabase(checkout, callback);
}

// Real-time listeners
let checkoutListeners = [];
let userListeners = [];
let checkoutSubscription = null;
let userSubscription = null;

function listenToCheckouts(callback) {
    if (!isSupabaseReady()) {
        console.error('Supabase not initialized');
        return;
    }

    // Remove duplicate listeners
    checkoutListeners = checkoutListeners.filter(cb => cb !== callback);
    checkoutListeners.push(callback);

    // Immediately get current data
    getCheckoutsFromSupabase(callback);

    // Setup real-time subscription
    if (!checkoutSubscription) {
        checkoutSubscription = supabaseClient
            .channel('checkouts-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'checkouts' },
                (payload) => {
                    console.log('Checkout changed:', payload);
                    // Refresh and notify all listeners
                    getCheckoutsFromSupabase((checkouts) => {
                        checkoutListeners.forEach(cb => cb(checkouts));
                    });
                }
            )
            .subscribe();
    }
}

function listenToUsers(callback) {
    if (!isSupabaseReady()) {
        console.error('Supabase not initialized');
        return;
    }

    // Remove duplicate listeners
    userListeners = userListeners.filter(cb => cb !== callback);
    userListeners.push(callback);

    // Immediately get current data
    getUsersFromSupabase(callback);

    // Setup real-time subscription
    if (!userSubscription) {
        userSubscription = supabaseClient
            .channel('users-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'users' },
                (payload) => {
                    console.log('User changed:', payload);
                    // Refresh and notify all listeners
                    getUsersFromSupabase((users) => {
                        userListeners.forEach(cb => cb(users));
                    });
                }
            )
            .subscribe();
    }
}

// Force refresh
function refreshCheckouts() {
    if (checkoutListeners.length > 0) {
        getCheckoutsFromSupabase((checkouts) => {
            checkoutListeners.forEach(callback => callback(checkouts));
        });
    }
}

function refreshUsers() {
    if (userListeners.length > 0) {
        getUsersFromSupabase((users) => {
            userListeners.forEach(callback => callback(users));
        });
    }
}

// Firebase compatibility check
function isFirebaseReady() {
    return isSupabaseReady();
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
    window.refreshCheckouts = refreshCheckouts;
    window.refreshUsers = refreshUsers;
    window.initSupabase = initSupabase;
}
