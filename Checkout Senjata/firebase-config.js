// ============================================
// FIREBASE CONFIGURATION
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyCg73s7J5NOB5ekZgrEf4RX1ZR-Mufft5w",
  authDomain: "bflshop-6de0e.firebaseapp.com",
  databaseURL: "https://bflshop-6de0e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bflshop-6de0e",
  storageBucket: "bflshop-6de0e.firebasestorage.app",
  messagingSenderId: "783422746882",
  appId: "1:783422746882:web:26964e0916b3488db5921b",
  measurementId: "G-6WR26CHFZQ"
};

// Initialize Firebase (akan di-initialize di setiap halaman)
// Variabel global untuk digunakan di semua halaman
var firebaseApp, firebaseAuth, firebaseDb;

// Function to initialize Firebase
function initializeFirebase() {
    // Wait for Firebase SDK to be loaded
    if (typeof firebase === 'undefined') {
        console.warn('⚠️ Firebase SDK not loaded yet. Retrying...');
        setTimeout(initializeFirebase, 100);
        return;
    }

    try {
        // Check if already initialized
        if (firebaseApp) {
            console.log('✅ Firebase already initialized');
            return;
        }

        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        // Use databaseURL for Realtime Database
        firebaseDb = firebase.database(firebaseApp);
        console.log('✅ Firebase initialized successfully!');
        console.log('Database URL:', firebaseConfig.databaseURL);
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        console.warn('⚠️ Website will use localStorage as fallback');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    // DOM already loaded, try to initialize
    setTimeout(initializeFirebase, 100);
}
