# Setup Gambar untuk Vercel

## Masalah
Gambar tidak muncul di Vercel karena path relatif tidak bekerja dengan baik.

## Solusi 1: Path Absolute (Cepat) ✅

Gunakan path absolute dengan `window.location.origin` untuk Vercel.

**File sudah diupdate untuk menggunakan path absolute!**

## Solusi 2: Supabase Storage (Recommended) 🚀

### Keuntungan:
- ✅ Gambar tersimpan di cloud
- ✅ CDN global (cepat di mana saja)
- ✅ Tidak perlu upload ke Vercel
- ✅ Bisa update gambar tanpa redeploy

### Setup Supabase Storage:

1. **Buka Supabase Dashboard → Storage**

2. **Create Bucket:**
   - Klik "New bucket"
   - Name: `product-images`
   - Public: ✅ **Enable** (agar bisa diakses tanpa auth)
   - Klik "Create bucket"

3. **Upload Gambar:**
   - Klik bucket `product-images`
   - Klik "Upload file"
   - Upload semua gambar produk
   - Copy URL setiap gambar

4. **Update di checkout.html:**
   - Ganti path gambar dengan URL dari Supabase Storage
   - Format: `https://[project-id].supabase.co/storage/v1/object/public/product-images/[filename]`

### Contoh:
```javascript
{ name: 'PISTOL KACANG', price: 7000, image: 'https://uuqpdpmvgchhwlptpjuk.supabase.co/storage/v1/object/public/product-images/Pistol-GTAV.png' }
```

## Solusi 3: CDN Lain (Alternatif)

### ImgBB (Gratis):
1. Upload ke https://imgbb.com
2. Copy direct link
3. Ganti di checkout.html

### Cloudinary (Gratis):
1. Daftar di https://cloudinary.com
2. Upload gambar
3. Copy URL
4. Ganti di checkout.html

## Solusi yang Sudah Diterapkan

✅ **Path Absolute** - File checkout.html sudah diupdate untuk menggunakan path absolute yang bekerja di Vercel!

Cek file `checkout.html` - sudah menggunakan `getImagePath()` function.
