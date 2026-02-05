# Setup Supabase untuk WARUNG BEEPEL

## Langkah 1: Buat Project Supabase

1. **Buka https://supabase.com** dan login (atau daftar jika belum punya akun)

2. **Klik "New Project"**

3. **Isi detail project:**
   - **Name:** WARUNG BEEPEL (atau nama lain)
   - **Database Password:** Buat password yang kuat (simpan password ini!)
   - **Region:** Pilih region terdekat (misalnya: Southeast Asia (Singapore))
   - **Pricing Plan:** Pilih Free tier (cukup untuk development)

4. **Klik "Create new project"** dan tunggu setup selesai (sekitar 2 menit)

## Langkah 2: Setup Database Tables

1. **Buka SQL Editor:**
   - Di Supabase Dashboard, klik **"SQL Editor"** di sidebar kiri
   - Klik **"New query"**

2. **Jalankan SQL Script:**
   - Copy semua isi dari file `supabase-setup.sql`
   - Paste ke SQL Editor
   - Klik **"Run"** (atau tekan Ctrl+Enter)

3. **Verifikasi Tables:**
   - Klik **"Table Editor"** di sidebar
   - Anda harus melihat 2 tables:
     - `users` - dengan 1 row (admin user)
     - `checkouts` - kosong

## Langkah 3: Dapatkan API Credentials

1. **Buka Project Settings:**
   - Klik **"Settings"** (icon gear) di sidebar
   - Klik **"API"**

2. **Copy Credentials:**
   - **Project URL** - Copy URL ini (contoh: `https://xxxxx.supabase.co`)
   - **anon public** key - Copy key ini (panjang, mulai dengan `eyJ...`)

3. **Update `supabase-helper.js`:**
   - Buka file `supabase-helper.js`
   - Ganti `YOUR_SUPABASE_URL` dengan Project URL Anda
   - Ganti `YOUR_SUPABASE_ANON_KEY` dengan anon public key Anda

   Contoh:
   ```javascript
   const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

## Langkah 4: Include Supabase JS Library

Pastikan semua file HTML sudah include Supabase JS library. Tambahkan di `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Atau di sebelum closing `</body>` tag.

## Langkah 5: Test Aplikasi

1. **Buka aplikasi di browser:**
   ```
   http://localhost:3000/index.html
   ```
   (atau buka file HTML langsung)

2. **Test Login:**
   - Username: `admin`
   - Password: `admin123`

3. **Test Registrasi:**
   - Buat user baru
   - Cek di Supabase Dashboard → Table Editor → users

4. **Test Checkout:**
   - Login sebagai user
   - Lakukan checkout
   - Cek di Supabase Dashboard → Table Editor → checkouts

## Langkah 6: Real-time Updates

Supabase sudah setup untuk real-time updates! Ketika ada transaksi baru:
- Data akan otomatis muncul di komputer lain
- Tidak perlu refresh halaman
- Update real-time via WebSocket

## Troubleshooting

### Error: "Supabase not initialized"

**Solusi:**
- Pastikan Supabase JS library sudah di-include
- Pastikan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` sudah diisi dengan benar
- Cek browser console untuk error detail

### Error: "relation does not exist"

**Solusi:**
- Pastikan SQL script sudah dijalankan di SQL Editor
- Cek di Table Editor apakah tables sudah ada

### Error: "new row violates row-level security policy"

**Solusi:**
- Pastikan RLS policies sudah dibuat (ada di SQL script)
- Cek di Supabase Dashboard → Authentication → Policies

### Data tidak muncul real-time

**Solusi:**
- Pastikan Realtime sudah enabled di Supabase Dashboard
- Settings → API → Realtime → Enable
- Pastikan tables sudah enable Realtime:
  - Table Editor → Pilih table → Settings → Enable Realtime

## Supabase Free Tier Limits

- **Database Size:** 500 MB
- **Bandwidth:** 5 GB/month
- **API Requests:** Unlimited (rate limited)
- **Realtime Connections:** 200 concurrent

**Cukup untuk aplikasi kecil-menengah!**

## Security Notes

- ✅ RLS (Row Level Security) sudah diaktifkan
- ✅ Password disimpan sebagai plain text (untuk development)
- ⚠️ Untuk production, sebaiknya hash password menggunakan Supabase Auth
- ✅ Policies sudah setup untuk membatasi akses

## Next Steps

Setelah setup selesai:
1. Test semua fitur aplikasi
2. Data akan tersimpan di Supabase cloud
3. Bisa diakses dari mana saja
4. Real-time updates otomatis bekerja

## Deploy ke Production

Untuk deploy ke Vercel/Netlify:
1. Setup Supabase project (sudah dilakukan)
2. Update `supabase-helper.js` dengan credentials
3. Deploy HTML files
4. Semua akan bekerja dengan Supabase backend!

Jika ada masalah, cek:
- Browser Console untuk JavaScript errors
- Supabase Dashboard → Logs untuk API errors
- Network tab untuk request/response
