# WARUNG BEEPEL - Checkout System

Aplikasi checkout dengan backend server lokal yang menyimpan data di file JSON.

## Fitur

- ✅ Login dan Registrasi Member
- ✅ Checkout Produk
- ✅ Dashboard Admin
- ✅ Manajemen Member
- ✅ Riwayat Transaksi
- ✅ Data tersimpan di file JSON lokal
- ✅ Dapat diakses dari komputer lain di jaringan yang sama

## Instalasi

1. Pastikan Node.js sudah terinstall (versi 14 atau lebih baru)
   - Download dari: https://nodejs.org/

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan server:
   ```bash
   npm start
   ```

4. Buka browser dan akses:
   ```
   http://localhost:3000
   ```

## Mengakses dari Komputer Lain

1. **Cari IP address komputer server:**
   - **Windows:** Buka Command Prompt (cmd), ketik `ipconfig` dan cari "IPv4 Address"
   - **Linux/Mac:** Buka Terminal, ketik `ifconfig` atau `ip addr` dan cari IP address

2. **Dari komputer lain di jaringan yang sama, akses:**
   ```
   http://IP_ADDRESS:3000
   ```
   Contoh: `http://192.168.1.100:3000`

3. **Pastikan firewall mengizinkan koneksi pada port 3000:**
   - **Windows:** Buka Windows Defender Firewall → Advanced Settings → Inbound Rules → New Rule → Port → TCP → 3000 → Allow
   - **Linux:** `sudo ufw allow 3000`
   - **Mac:** System Preferences → Security & Privacy → Firewall → Firewall Options → Add → Port 3000

## Struktur Data

Data disimpan di folder `data/`:
- `users.json` - Data user/member
- `checkouts.json` - Data transaksi checkout

## Default Login

- **Username:** admin
- **Password:** admin123

## API Endpoints

- `GET /api/users` - Get all users
- `POST /api/users/login` - Login user
- `POST /api/users` - Create new user
- `PUT /api/users/:username` - Update user
- `DELETE /api/users/:username` - Delete user
- `GET /api/checkouts` - Get all checkouts
- `POST /api/checkouts` - Create new checkout
- `DELETE /api/checkouts/:id` - Delete checkout

## Catatan

- Data disimpan secara lokal di folder `data/`
- Backup folder `data/` secara berkala untuk keamanan
- Server harus berjalan agar aplikasi dapat digunakan
