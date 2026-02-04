# Cara Deploy ke Vercel

## Persiapan

1. **Install Vercel CLI** (opsional, bisa juga via website):
   ```bash
   npm install -g vercel
   ```

2. **Pastikan semua file sudah ada:**
   - `package.json`
   - `vercel.json`
   - `api/users.js`
   - `api/checkouts.js`
   - Semua file HTML
   - `api-helper.js`

## Deploy via Vercel CLI

1. **Login ke Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   
   Ikuti instruksi yang muncul. Pilih:
   - Set up and deploy? **Yes**
   - Which scope? Pilih akun Anda
   - Link to existing project? **No**
   - Project name? (biarkan default atau beri nama)
   - Directory? **./** (current directory)

3. **Deploy ke production:**
   ```bash
   vercel --prod
   ```

## Deploy via Vercel Website

1. **Buka https://vercel.com** dan login

2. **Klik "Add New Project"**

3. **Import dari Git** (jika menggunakan Git):
   - Connect repository dari GitHub/GitLab/Bitbucket
   - Vercel akan otomatis detect konfigurasi

4. **Atau Upload langsung:**
   - Klik "Browse" dan pilih folder project
   - Vercel akan otomatis detect `vercel.json`

5. **Klik "Deploy"**

## Catatan Penting

⚠️ **PENTING: Data di Vercel adalah EPHEMERAL (tidak persisten)**

- Data disimpan di `/tmp` yang akan hilang setelah serverless function selesai
- Setiap request bisa mendapatkan data yang berbeda
- Untuk production, disarankan menggunakan database eksternal seperti:
  - **Vercel KV** (Redis) - Gratis tier tersedia
  - **Upstash Redis** - Gratis tier tersedia
  - **MongoDB Atlas** - Gratis tier tersedia
  - **Supabase** - Gratis tier tersedia

## Upgrade ke Database Persisten (Opsional)

Jika ingin data benar-benar persisten, bisa upgrade menggunakan Vercel KV:

1. Install Vercel KV:
   ```bash
   npm install @vercel/kv
   ```

2. Setup di Vercel Dashboard:
   - Buka project settings
   - Tambahkan Vercel KV integration
   - Copy environment variables

3. Update `api/users.js` dan `api/checkouts.js` untuk menggunakan KV

## Setelah Deploy

1. **Dapatkan URL deployment:**
   - Akan muncul di terminal setelah deploy
   - Atau cek di Vercel Dashboard

2. **Test aplikasi:**
   - Buka URL yang diberikan
   - Test login dengan: `admin` / `admin123`
   - Test registrasi user baru
   - Test checkout

3. **Share URL:**
   - URL bisa diakses dari mana saja (tidak perlu jaringan lokal)
   - Contoh: `https://your-project.vercel.app`

## Troubleshooting

- **Error: Cannot find module**: Pastikan semua dependencies ada di `package.json`
- **Error: Function timeout**: Vercel free tier punya limit 10 detik per function
- **Data hilang**: Normal, karena menggunakan `/tmp` yang ephemeral

## Alternatif: Deploy dengan Database

Jika butuh data persisten, saya bisa bantu setup dengan:
- Vercel KV (Redis)
- MongoDB Atlas
- Supabase
- Atau database lainnya

Hubungi saya jika perlu bantuan setup database persisten!
