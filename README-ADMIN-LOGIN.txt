LOGIN ADMIN 16FLAMES
====================

Halaman admin:
https://DOMAIN-KAMU.com/admin

Production menggunakan username + scrypt password hash. Tidak ada password default yang aman.

Environment Variables wajib:
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
ADMIN_SESSION_SECRET

Buat hash password:
npm run admin:hash -- "PASSWORD-ADMIN-BARU"

Buat ADMIN_SESSION_SECRET random minimal 32 byte. Simpan semua environment variable di dashboard hosting, bukan di GitHub.

Jika membuka /admin tanpa login, otomatis diarahkan ke /admin/login.

Fitur admin:
- Kelola pesanan
- Ubah status pengiriman
- Pilih ekspedisi
- Masukkan nomor resi
- Simpan resi
- Logout
