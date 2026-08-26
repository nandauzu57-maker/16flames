16FLAMES - ADMIN RESI + RIWAYAT PESANAN
========================================

HALAMAN ADMIN
-------------
Buka:
/admin

Lalu klik:
KELOLA PESANAN & RESI

Atau langsung buka:
/admin/shipping

CARA MENGUBAH STATUS DAN RESI
------------------------------
1. Pastikan order sudah dibuat di browser yang sama.
2. Buka /admin/shipping.
3. Klik ORDER yang ingin diubah.
4. Pilih STATUS:
   - MENUNGGU DIPROSES
   - DIKEMAS
   - DIKIRIM
   - SAMPAI
5. Pilih KURIR.
6. Masukkan NOMOR RESI.
7. Klik SIMPAN RESI.
8. Buka RIWAYAT PESANAN (/orders) untuk melihat hasilnya.

ATURAN VALIDASI
---------------
- Jika nomor resi diisi, kurir wajib dipilih.
- Jika status diubah menjadi DIKIRIM, nomor resi wajib diisi.
- Link LACAK PENGIRIMAN dibuat otomatis sesuai kurir yang dipilih jika URL tracking tersedia.

RIWAYAT PEMBELIAN
-----------------
Pesanan QRIS, Virtual Account, dan PayPal/Card yang berhasil dibuat sekarang disimpan ke daftar 16flames_orders sehingga dapat muncul di /orders pada perangkat/browser yang sama.

CATATAN PENTING PRODUKSI
------------------------
Versi ini masih menggunakan localStorage. Artinya admin dan pembeli harus menggunakan browser/perangkat yang sama untuk berbagi data order dan resi.
Untuk toko online production, pindahkan order, status, resi, akun pembeli, dan history ke database/server agar admin dapat memperbarui resi dari perangkat admin dan pembeli melihat perubahan dari perangkat mereka.
