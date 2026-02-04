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

// Check if Firebase is available
if (typeof firebase !== 'undefined') {
    try {
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
} else {
    console.warn('⚠️ Firebase SDK not loaded. Website will use localStorage.');
}
