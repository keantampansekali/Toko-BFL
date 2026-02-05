# Deploy ke Vercel dengan Gambar

## ✅ File Sudah Diperbaiki!

Semua path gambar sudah diupdate untuk bekerja di Vercel:
- ✅ Menggunakan absolute path dengan `window.location.origin`
- ✅ Error handling jika gambar tidak ditemukan
- ✅ Logo di semua halaman sudah diperbaiki

## Cara Deploy ke Vercel

### 1. Pastikan Semua File Ada

Pastikan folder project berisi:
- ✅ Semua file HTML (index.html, checkout.html, dll)
- ✅ File gambar: `Pistol-GTAV.png`, `logo-w-border.png`
- ✅ `supabase-helper.js`
- ✅ `vercel.json` (sudah dibuat)
- ✅ `package.json` (sudah dibuat)

### 2. Deploy via Vercel CLI

```bash
# Install Vercel CLI (jika belum)
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy ke production
vercel --prod
```

### 3. Deploy via Vercel Website

1. Buka https://vercel.com
2. Klik "Add New Project"
3. **Import dari Git** (recommended):
   - Connect repository (GitHub/GitLab/Bitbucket)
   - Vercel akan auto-detect konfigurasi
4. **Atau Upload langsung:**
   - Klik "Browse" dan pilih folder project
   - Vercel akan auto-detect `vercel.json`

### 4. Verifikasi Gambar

Setelah deploy:
1. Buka URL deployment (contoh: `https://your-project.vercel.app`)
2. Buka halaman checkout
3. Cek apakah gambar muncul:
   - Logo di header
   - Gambar produk (Pistol Kacang)

## Troubleshooting

### Gambar Masih Tidak Muncul

**Cek 1: File gambar sudah ter-upload?**
- Pastikan file `.png` ada di root folder
- Vercel akan serve semua file static

**Cek 2: Path benar?**
- Buka browser console (F12)
- Cek Network tab
- Lihat request untuk gambar - apakah 404?

**Cek 3: CORS/Cache?**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)

### Solusi Alternatif: Supabase Storage

Jika gambar masih tidak muncul, gunakan Supabase Storage:

1. **Setup Supabase Storage:**
   - Buka Supabase Dashboard → Storage
   - Create bucket: `product-images` (public)
   - Upload semua gambar

2. **Update checkout.html:**
   ```javascript
   { 
     name: 'PISTOL KACANG', 
     price: 7000, 
     image: 'https://uuqpdpmvgchhwlptpjuk.supabase.co/storage/v1/object/public/product-images/Pistol-GTAV.png' 
   }
   ```

3. **Keuntungan:**
   - ✅ Gambar tersimpan di cloud
   - ✅ CDN global (cepat)
   - ✅ Tidak perlu upload ke Vercel
   - ✅ Bisa update tanpa redeploy

## File yang Sudah Diperbaiki

1. ✅ `checkout.html` - Path gambar menggunakan absolute path
2. ✅ `index.html` - Logo menggunakan absolute path
3. ✅ `register.html` - Logo menggunakan absolute path
4. ✅ `vercel.json` - Konfigurasi untuk static files
5. ✅ `package.json` - Untuk Vercel deployment

## Catatan

- **File gambar harus di root folder** (sama level dengan HTML files)
- **Vercel akan serve semua static files** secara otomatis
- **Path absolute** (`window.location.origin`) bekerja di local dan Vercel

## Test Lokal

Sebelum deploy, test lokal:

```bash
# Install http-server
npm install -g http-server

# Run server
http-server -p 3000

# Buka http://localhost:3000
# Cek apakah gambar muncul
```

Jika gambar muncul di local, akan muncul di Vercel juga!
