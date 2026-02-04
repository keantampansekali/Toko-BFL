// Firebase Helper Functions
// Fungsi-fungsi untuk berinteraksi dengan Firebase Realtime Database

// Check if Firebase is initialized
function isFirebaseReady() {
    return typeof firebase !== 'undefined' && firebaseDb;
}

// ========== USERS FUNCTIONS ==========

// Get all users from Firebase
function getUsersFromFirebase(callback) {
    if (!isFirebaseReady()) {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        callback(users);
        return;
    }

    firebaseDb.ref('users').once('value')
        .then(snapshot => {
            const users = [];
            snapshot.forEach(child => {
                users.push(child.val());
            });
            callback(users);
        })
        .catch(error => {
            console.error('Error getting users:', error);
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            callback(users);
        });
}

// Save user to Firebase
function saveUserToFirebase(user, callback) {
    if (!isFirebaseReady()) {
        // Fallback to localStorage
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingIndex = users.findIndex(u => u.username === user.username);
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem('users', JSON.stringify(users));
        if (callback) callback();
        return;
    }

    const userRef = firebaseDb.ref('users').child(user.username);
    userRef.set(user)
        .then(() => {
            if (callback) callback();
        })
        .catch(error => {
            console.error('Error saving user:', error);
            // Fallback to localStorage
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingIndex = users.findIndex(u => u.username === user.username);
            if (existingIndex >= 0) {
                users[existingIndex] = user;
            } else {
                users.push(user);
            }
            localStorage.setItem('users', JSON.stringify(users));
            if (callback) callback();
        });
}

// Delete user from Firebase
function deleteUserFromFirebase(username, callback) {
    if (!isFirebaseReady()) {
        // Fallback to localStorage
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.username !== username);
        localStorage.setItem('users', JSON.stringify(users));
        if (callback) callback();
        return;
    }

    firebaseDb.ref('users').child(username).remove()
        .then(() => {
            if (callback) callback();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            // Fallback to localStorage
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users = users.filter(u => u.username !== username);
            localStorage.setItem('users', JSON.stringify(users));
            if (callback) callback();
        });
}

// ========== CHECKOUTS FUNCTIONS ==========

// Get all checkouts from Firebase
function getCheckoutsFromFirebase(callback) {
    if (!isFirebaseReady()) {
        // Fallback to localStorage
        const checkouts = JSON.parse(localStorage.getItem('checkouts') || '[]');
        callback(checkouts);
        return;
    }

    firebaseDb.ref('checkouts').once('value')
        .then(snapshot => {
            const checkouts = [];
            snapshot.forEach(child => {
                checkouts.push(child.val());
            });
            callback(checkouts);
        })
        .catch(error => {
            console.error('Error getting checkouts:', error);
            // Fallback to localStorage
            const checkouts = JSON.parse(localStorage.getItem('checkouts') || '[]');
            callback(checkouts);
        });
}

// Save checkout to Firebase
function saveCheckoutToFirebase(checkoutData, callback) {
    if (!isFirebaseReady()) {
        // Fallback to localStorage
        let checkouts = JSON.parse(localStorage.getItem('checkouts') || '[]');
        checkouts.push(checkoutData);
        localStorage.setItem('checkouts', JSON.stringify(checkouts));
        if (callback) callback();
        return;
    }

    const checkoutRef = firebaseDb.ref('checkouts').child(checkoutData.id.toString());
    checkoutRef.set(checkoutData)
        .then(() => {
            console.log('✅ Checkout saved to Firebase:', checkoutData.id);
            if (callback) callback();
        })
        .catch(error => {
            console.error('❌ Error saving checkout:', error);
            // Fallback to localStorage
            let checkouts = JSON.parse(localStorage.getItem('checkouts') || '[]');
            checkouts.push(checkoutData);
            localStorage.setItem('checkouts', JSON.stringify(checkouts));
            if (callback) callback();
        });
}

// Delete checkout from Firebase
function deleteCheckoutFromFirebase(checkoutId, callback) {
    if (!isFirebaseReady()) {
        // Fallback to localStorage
        let checkouts = JSON.parse(localStorage.getItem('checkouts') || '[]');
        checkouts = checkouts.filter(c => c.id !== checkoutId);
        localStorage.setItem('checkouts', JSON.stringify(checkouts));
        if (callback) callback();
        return;
    }

    firebaseDb.ref('checkouts').child(checkoutId.toString()).remove()
        .then(() => {
            if (callback) callback();
        })
        .catch(error => {
            console.error('Error deleting checkout:', error);
            // Fallback to localStorage
            let checkouts = JSON.parse(localStorage.getItem('checkouts') || '[]');
            checkouts = checkouts.filter(c => c.id !== checkoutId);
            localStorage.setItem('checkouts', JSON.stringify(checkouts));
            if (callback) callback();
        });
}

// ========== REAL-TIME LISTENERS ==========

// Listen to users changes (for admin page)
function listenToUsers(callback) {
    if (!isFirebaseReady()) {
        // Fallback: poll localStorage
        setInterval(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            callback(users);
        }, 2000);
        return;
    }

    firebaseDb.ref('users').on('value', snapshot => {
        const users = [];
        snapshot.forEach(child => {
            users.push(child.val());
        });
        callback(users);
    });
}

// Listen to checkouts changes (for admin page)
function listenToCheckouts(callback) {
    if (!isFirebaseReady()) {
        // Fallback: poll localStorage
        setInterval(() => {
            const checkouts = JSON.parse(localStorage.getItem('checkouts') || '[]');
            callback(checkouts);
        }, 2000);
        return;
    }

    firebaseDb.ref('checkouts').on('value', snapshot => {
        const checkouts = [];
        snapshot.forEach(child => {
            checkouts.push(child.val());
        });
        callback(checkouts);
    });
}
