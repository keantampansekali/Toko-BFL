# Cara Deploy ke Vercel - Step by Step

## Metode 1: Via Vercel Dashboard (Drag & Drop)

1. **Buka Vercel:**
   - Kunjungi: https://vercel.com/new
   - Login dengan GitHub/Email

2. **Upload Project:**
   - Klik area "Drag & Drop" atau "Browse"
   - Pilih **SEMUA FILE** di folder "Checkout Senjata"
   - Pastikan file-file ini ter-upload:
     - ✅ index.html
     - ✅ home.html
     - ✅ checkout.html
     - ✅ register.html
     - ✅ admin.html
     - ✅ my-transactions.html
     - ✅ logo-w-border.png
     - ✅ Pistol-GTAV.png
     - ✅ vercel.json
     - ✅ package.json

3. **Deploy Settings:**
   - Framework Preset: **Other** atau **None**
   - Root Directory: **./** (biarkan kosong)
   - Build Command: **kosongkan** (biarkan kosong)
   - Output Directory: **kosongkan** (biarkan kosong)

4. **Klik "Deploy"**

5. **Tunggu sampai selesai** (sekitar 1-2 menit)

6. **Akses website:**
   - URL akan muncul seperti: `https://toko-bfl-xxxxx.vercel.app`
   - Klik URL tersebut

## Metode 2: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Buka terminal di folder project:**
   ```bash
   cd "C:\Users\Keannn\Downloads\Checkout Senjata"
   ```

3. **Login:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Pilih akun Anda
   - Link to existing project? **N**
   - Project name? (tekan Enter untuk default)
   - Directory? **./** (tekan Enter)
   - Override settings? **N**

6. **Setelah selesai, akses URL yang diberikan**

## Troubleshooting 404 Error

Jika masih dapat 404:

1. **Pastikan index.html ada di root:**
   - File harus langsung di root folder
   - Bukan di subfolder

2. **Cek di Vercel Dashboard:**
   - Settings > Files
   - Pastikan semua file HTML terlihat

3. **Coba akses langsung:**
   - `https://toko-bfl.vercel.app/index.html`
   - Bukan hanya `https://toko-bfl.vercel.app/`

4. **Redeploy:**
   - Di Vercel Dashboard, klik "Redeploy"
   - Atau hapus project dan buat baru

5. **Jika masih error, coba:**
   - Hapus vercel.json
   - Deploy ulang
   - Vercel seharusnya auto-detect HTML files

## Catatan Penting

⚠️ **Data Storage:**
- Website ini menggunakan localStorage browser
- Data tidak tersimpan di server
- Setiap user memiliki data terpisah

✅ **File yang harus ada:**
- Semua file .html
- Semua file gambar (.png)
- vercel.json (opsional)
- package.json (opsional)
