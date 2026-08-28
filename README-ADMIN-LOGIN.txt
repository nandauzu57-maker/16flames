LOGIN ADMIN 16FLAMES
====================

Halaman admin:
https://DOMAIN-KAMU.com/admin

<<<<<<< HEAD
Production menggunakan username + scrypt password hash. Tidak ada password default yang aman.

Environment Variables wajib:
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
ADMIN_SESSION_SECRET

Buat hash password:
npm run admin:hash -- "PASSWORD-ADMIN-BARU"

Buat ADMIN_SESSION_SECRET random minimal 32 byte. Simpan semua environment variable di dashboard hosting, bukan di GitHub.

Jika membuka /admin tanpa login, otomatis diarahkan ke /admin/login.
=======
Username default:
admin

Password default:
16flames@2026

Untuk production, WAJIB ganti credentials melalui Environment Variables:
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET

Contoh di Vercel:
Project -> Settings -> Environment Variables -> Add New

Setelah menambah/mengubah environment variables, lakukan Redeploy.

Jika membuka /admin tanpa login, otomatis diarahkan ke:
/admin/login
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585

Fitur admin:
- Kelola pesanan
- Ubah status pengiriman
- Pilih ekspedisi
- Masukkan nomor resi
- Simpan resi
- Logout
