// Supabase Helper - Replaces Firebase helper
// Setup Supabase client

// IMPORTANT: Replace these with your Supabase project credentials
// Get them from: https://app.supabase.com/project/_/settings/api
const SUPABASE_URL = 'https://uuqpdpmvgchhwlptpjuk.supabase.co'; // Full URL dengan https://
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cXBkcG12Z2NoaHdscHRwanVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDg2NjEsImV4cCI6MjA4NTgyNDY2MX0.s6bYB0_a05Tia6rxBD8aLZihGkUnrLR6XvgQyRfuRrI'; // Your anon/public key

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    try {
        // Check if Supabase library is loaded
        if (typeof supabase === 'undefined') {
            console.error('Supabase library not loaded. Check if CDN script is accessible.');
            // Try to load it manually if not loaded
            if (typeof window !== 'undefined' && !window.supabase) {
                console.warn('Supabase library missing. Please ensure the script tag is present.');
            }
            return false;
        }
        
        if (!supabase.createClient) {
            console.error('supabase.createClient is not available. Supabase library may be outdated or corrupted.');
            return false;
        }
        
        // Initialize client
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return false;
    }
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
                role: 'king'
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
                role: 'king'
            };
            const saved = await saveUserToSupabase(adminUser);
            if (saved) {
                data.push(saved);
            }
        }

        // Ensure all users have role field (default to 'member' if missing)
        const usersWithRole = (data || []).map(user => {
            if (!user.role) {
                console.log(`User ${user.username} missing role, defaulting to 'member'`);
                user.role = 'member';
            }
            return user;
        });
        
        if (callback) callback(usersWithRole);
        return usersWithRole;
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
            date: c.date,
            prepared: !!c.prepared,
            prepared_by: c.prepared_by || null,
            prepared_at: c.prepared_at || null
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
                date: checkout.date,
                prepared: !!checkout.prepared,
                prepared_by: checkout.prepared_by || null,
                prepared_at: checkout.prepared_at || null
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
            date: data.date,
            prepared: !!data.prepared,
            prepared_by: data.prepared_by || null,
            prepared_at: data.prepared_at || null
        };

        if (callback) callback(result);
        return result;
    } catch (error) {
        console.error('Error saving checkout:', error);
        // Helpful message in browser
        try {
            alert(`❌ Checkout gagal.\n\nDetail: ${error?.message || error}\n\nKemungkinan besar: RLS policy Supabase menolak INSERT ke tabel checkouts.`);
        } catch (_) {}
        if (callback) callback(null);
        return null;
    }
}

async function updateCheckoutPreparedInSupabase(checkoutId, prepared, preparedBy, callback) {
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback(null);
            return null;
        }

        const isPrepared = !!prepared;

        // If cancelling, only allow the same admin who prepared it
        if (!isPrepared) {
            const { data: existing, error: existingErr } = await supabaseClient
                .from('checkouts')
                .select('prepared_by')
                .eq('checkout_id', checkoutId)
                .single();

            if (existingErr) throw existingErr;

            const existingPreparedBy = existing?.prepared_by || null;
            if (existingPreparedBy && preparedBy && existingPreparedBy !== preparedBy) {
                try {
                    alert(`❌ Tidak bisa membatalkan.\n\nHanya admin yang menyiapkan transaksi ini yang bisa membatalkan.\n\nDisiapkan oleh: ${existingPreparedBy}\nAnda: ${preparedBy}`);
                } catch (_) {}
                if (callback) callback(null);
                return null;
            }
        }

        const updatePayload = {
            prepared: isPrepared,
            prepared_by: isPrepared ? (preparedBy || null) : null,
            prepared_at: isPrepared ? new Date().toISOString() : null
        };

        const { data, error } = await supabaseClient
            .from('checkouts')
            .update(updatePayload)
            .eq('checkout_id', checkoutId)
            .select()
            .single();

        if (error) throw error;

        const result = {
            id: data.checkout_id,
            username: data.username,
            items: data.items,
            total: parseFloat(data.total),
            date: data.date,
            prepared: !!data.prepared,
            prepared_by: data.prepared_by || null,
            prepared_at: data.prepared_at || null
        };

        if (callback) callback(result);
        return result;
    } catch (error) {
        console.error('Error updating checkout prepared:', error);
        try {
            alert(`❌ Gagal ubah status siap.\n\nDetail: ${error?.message || error}\n\nKemungkinan besar: RLS policy Supabase menolak UPDATE ke tabel checkouts.`);
        } catch (_) {}
        if (callback) callback(null);
        return null;
    }
}

// Inventory / Stock functions
async function getInventoryFromSupabase(callback) {
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback([]);
            return [];
        }

        const { data, error } = await supabaseClient
            .from('inventory')
            .select('*')
            .order('product_name', { ascending: true });

        if (error) throw error;

        if (callback) callback(data || []);
        return data || [];
    } catch (error) {
        console.error('Error getting inventory:', error);
        if (callback) callback([]);
        return [];
    }
}

async function upsertInventoryItemInSupabase(productName, stock, callback) {
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback(null);
            return null;
        }

        const payload = {
            product_name: productName,
            stock: Number(stock) || 0
        };

        const { data, error } = await supabaseClient
            .from('inventory')
            .upsert(payload, { onConflict: 'product_name' })
            .select()
            .single();

        if (error) throw error;
        if (callback) callback(data);
        return data;
    } catch (error) {
        console.error('Error upserting inventory:', error);
        try { alert(`❌ Gagal simpan stok.\n\nDetail: ${error?.message || error}`); } catch (_) {}
        if (callback) callback(null);
        return null;
    }
}

async function decrementInventoryForCheckoutInSupabase(items, callback) {
    // NOTE: best-effort (no transaction). For high-concurrency you’d use an RPC.
    try {
        if (!isSupabaseReady()) {
            console.error('Supabase not initialized');
            if (callback) callback(false);
            return false;
        }

        // Load current inventory
        const inv = await getInventoryFromSupabase();
        const invMap = new Map(inv.map(r => [r.product_name, Number(r.stock) || 0]));

        // Validate stock
        for (const item of items) {
            const name = item.name;
            const need = Number(item.quantity) || 0;
            const have = invMap.has(name) ? invMap.get(name) : 0;
            if (need > have) {
                try { alert(`❌ Stok tidak cukup untuk "${name}".\nButuh: ${need}\nStok: ${have}`); } catch (_) {}
                if (callback) callback(false);
                return false;
            }
        }

        // Apply updates
        for (const item of items) {
            const name = item.name;
            const need = Number(item.quantity) || 0;
            const have = invMap.get(name);
            const next = have - need;
            const { error } = await supabaseClient
                .from('inventory')
                .update({ stock: next })
                .eq('product_name', name);
            if (error) throw error;
        }

        if (callback) callback(true);
        return true;
    } catch (error) {
        console.error('Error decrementing inventory:', error);
        try { alert(`❌ Gagal mengurangi stok.\n\nDetail: ${error?.message || error}`); } catch (_) {}
        if (callback) callback(false);
        return false;
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

function updateCheckoutPrepared(checkoutId, prepared, preparedBy, callback) {
    return updateCheckoutPreparedInSupabase(checkoutId, prepared, preparedBy, callback);
}

function getInventory(callback) {
    return getInventoryFromSupabase(callback);
}

function upsertInventoryItem(productName, stock, callback) {
    return upsertInventoryItemInSupabase(productName, stock, callback);
}

function decrementInventoryForCheckout(items, callback) {
    return decrementInventoryForCheckoutInSupabase(items, callback);
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
    window.updateCheckoutPrepared = updateCheckoutPrepared;
    window.getInventory = getInventory;
    window.upsertInventoryItem = upsertInventoryItem;
    window.decrementInventoryForCheckout = decrementInventoryForCheckout;
    window.listenToCheckouts = listenToCheckouts;
    window.listenToUsers = listenToUsers;
    window.isFirebaseReady = isFirebaseReady;
    window.refreshCheckouts = refreshCheckouts;
    window.refreshUsers = refreshUsers;
    window.initSupabase = initSupabase;
}
