LOGIN ADMIN 16FLAMES
====================

Halaman admin:
https://DOMAIN-KAMU.com/admin

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

Fitur admin:
- Kelola pesanan
- Ubah status pengiriman
- Pilih ekspedisi
- Masukkan nomor resi
- Simpan resi
- Logout
