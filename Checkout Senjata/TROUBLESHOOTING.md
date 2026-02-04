# 🔧 Troubleshooting - Transaksi Tidak Masuk

## ✅ File Sudah Diperbaiki

File `firebase-config.js` dan `firebase-helper.js` sudah dibuat ulang. Pastikan kedua file ini ada di Vercel deployment.

---

## 🔍 Langkah 1: Cek Firebase Database Rules

**PENTING:** Database rules harus di-set dengan benar agar transaksi bisa tersimpan.

1. Buka https://console.firebase.google.com/
2. Pilih project: **bflshop-6de0e**
3. Klik **"Realtime Database"** di menu kiri
4. Klik tab **"Rules"** (di atas)
5. Pastikan rules seperti ini:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true
    },
    "checkouts": {
      ".read": true,
      ".write": true
    }
  }
}
```

6. Klik **"Publish"** untuk menyimpan

---

## 🔍 Langkah 2: Cek Console Browser

1. Buka website di Vercel
2. Tekan **F12** (Developer Tools)
3. Buka tab **Console**
4. Lakukan checkout
5. Cek apakah ada error atau pesan sukses:

**Harus muncul:**
- ✅ `Firebase initialized successfully!`
- ✅ `Checkout saved to Firebase: [ID]`

**Jika ada error:**
- ❌ `Permission denied` → Database rules belum benar
- ❌ `Firebase is not defined` → File firebase-config.js tidak ter-load
- ❌ `Network error` → Koneksi internet atau Firebase down

---

## 🔍 Langkah 3: Cek Firebase Console

1. Buka https://console.firebase.google.com/
2. Pilih project: **bflshop-6de0e**
3. Klik **"Realtime Database"**
4. Cek apakah ada data di:
   - `checkouts/` → Harus ada transaksi
   - `users/` → Harus ada user yang terdaftar

**Jika tidak ada data:**
- Transaksi tidak tersimpan ke Firebase
- Kemungkinan database rules salah atau Firebase tidak ter-initialize

---

## 🔍 Langkah 4: Pastikan File Ada di Vercel

Pastikan file berikut ada di Vercel deployment:

- ✅ `firebase-config.js`
- ✅ `firebase-helper.js`
- ✅ `index.html`
- ✅ `checkout.html`
- ✅ `admin.html`
- ✅ `register.html`
- ✅ `my-transactions.html`

**Cara cek:**
1. Buka website Vercel
2. Coba akses: `https://your-site.vercel.app/firebase-config.js`
3. Harus muncul isi file (bukan 404)

---

## 🔍 Langkah 5: Test Transaksi

1. **Buka website di Vercel**
2. **Daftar sebagai member baru** (atau login)
3. **Tambah item ke cart**
4. **Klik Checkout**
5. **Buka Console (F12)** → Cek apakah muncul:
   ```
   ✅ Checkout saved to Firebase: [timestamp]
   ```
6. **Buka Firebase Console** → Realtime Database
7. **Cek folder `checkouts/`** → Harus ada transaksi baru

---

## 🚨 Masalah Umum & Solusi

### ❌ Error: "Permission denied"

**Penyebab:** Database rules belum di-set atau salah

**Solusi:**
1. Buka Firebase Console → Realtime Database → Rules
2. Set rules seperti di Langkah 1
3. Klik **Publish**
4. Refresh website dan coba lagi

---

### ❌ Error: "Firebase is not defined"

**Penyebab:** File `firebase-config.js` tidak ter-load

**Solusi:**
1. Cek apakah file `firebase-config.js` ada di Vercel
2. Cek Network tab di browser (F12) → Apakah file ter-load?
3. Pastikan path file benar: `firebase-config.js` (bukan `./firebase-config.js`)

---

### ❌ Transaksi tidak muncul di admin

**Penyebab:** 
- Transaksi tidak tersimpan ke Firebase
- Admin page tidak ter-load data dari Firebase

**Solusi:**
1. Cek Console browser untuk error
2. Cek Firebase Console → Realtime Database → Apakah data ada?
3. Refresh admin page
4. Pastikan admin sudah login

---

### ❌ Data hanya muncul di komputer yang sama

**Penyebab:** Masih menggunakan localStorage (Firebase tidak aktif)

**Solusi:**
1. Cek Console browser → Harus muncul: `✅ Firebase initialized successfully!`
2. Jika tidak muncul, cek `firebase-config.js` sudah benar
3. Cek database rules sudah di-set
4. Clear cache browser dan refresh

---

## ✅ Checklist

Sebelum deploy ke Vercel, pastikan:

- [ ] File `firebase-config.js` ada dan sudah di-update dengan config Firebase
- [ ] File `firebase-helper.js` ada
- [ ] Database rules sudah di-set di Firebase Console
- [ ] Test lokal dulu → Transaksi harus masuk ke Firebase
- [ ] Deploy semua file ke Vercel (termasuk `firebase-config.js` dan `firebase-helper.js`)

---

## 🎯 Quick Test

1. **Buka website Vercel**
2. **F12** → Console
3. **Lakukan checkout**
4. **Cek Console** → Harus muncul: `✅ Checkout saved to Firebase: [ID]`
5. **Buka Firebase Console** → Realtime Database → `checkouts/` → Harus ada data

Jika semua langkah di atas sudah dilakukan dan masih tidak berfungsi, cek:
- Console browser untuk error messages
- Firebase Console untuk melihat apakah data tersimpan
- Network tab untuk melihat apakah file Firebase ter-load

---

**Setelah file di-deploy ulang ke Vercel, transaksi seharusnya sudah bisa masuk!** 🎉
