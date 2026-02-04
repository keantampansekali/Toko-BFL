# WARUNG BEEPEL - E-Commerce Website

Website e-commerce untuk toko online WARUNG BEEPEL dengan sistem checkout dan admin dashboard.

## Fitur

- ✅ Login & Registrasi
- ✅ Halaman Checkout dengan keranjang belanja
- ✅ Dashboard Admin untuk mengelola transaksi dan member
- ✅ Halaman Transaksi untuk melihat riwayat pembelian
- ✅ Tema dark techno dengan pink-hitam-putih
- ✅ Responsive design

## Cara Deploy ke Vercel

### Metode 1: Via Vercel CLI

1. Install Vercel CLI (jika belum):
```bash
npm i -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts dan pilih:
   - Set up and deploy? **Yes**
   - Which scope? Pilih akun Anda
   - Link to existing project? **No**
   - Project name? (biarkan default atau beri nama)
   - Directory? **./** (current directory)
   - Override settings? **No**

### Metode 2: Via GitHub (Recommended)

1. Buat repository di GitHub
2. Push semua file ke repository
3. Buka [vercel.com](https://vercel.com)
4. Login dengan GitHub
5. Klik "Add New Project"
6. Import repository Anda
7. Klik "Deploy"

### Metode 3: Via Vercel Dashboard

1. Buka [vercel.com](https://vercel.com)
2. Login/Register
3. Klik "Add New Project"
4. Drag & drop folder project atau pilih dari GitHub
5. Klik "Deploy"

## File Structure

```
.
├── index.html          # Halaman Login
├── register.html       # Halaman Registrasi
├── home.html           # Halaman Home
├── checkout.html       # Halaman Checkout
├── admin.html          # Dashboard Admin
├── my-transactions.html # Halaman Transaksi User
├── logo-w-border.png   # Logo
├── Pistol-GTAV.png     # Gambar produk
├── vercel.json         # Konfigurasi Vercel
└── README.md           # Dokumentasi
```

## Catatan Penting

⚠️ **Data Storage**: Website ini menggunakan `localStorage` browser untuk menyimpan data. Data akan hilang jika:
- User menghapus browser cache
- User menggunakan browser berbeda
- User menggunakan mode incognito/private

Untuk production, disarankan menggunakan database backend (Firebase, Supabase, atau custom API).

## Teknologi

- HTML5
- CSS3 (dengan animasi dan efek modern)
- Vanilla JavaScript
- LocalStorage untuk data persistence

## Lisensi

Free to use
