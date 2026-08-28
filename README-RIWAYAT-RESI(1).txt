FITUR 16FLAMES - RIWAYAT + RESI
===============================

1. /orders
   Halaman RIWAYAT PESANAN untuk melihat pesanan yang tersimpan pada browser.

2. /admin
   Dashboard admin sederhana untuk masuk ke pengelolaan pengiriman.

3. /admin/shipping
   Admin dapat memilih order, mengubah status, memilih kurir, dan memasukkan nomor resi.

4. Nomor resi
   Setelah disimpan, nomor resi tampil di RIWAYAT PESANAN dan bukti transaksi pada browser yang sama.

5. Pelacakan
   Tombol LACAK PENGIRIMAN menggunakan URL tracking kurir yang tersedia di project.

6. Pembayaran
   History sekarang juga dicatat untuk QRIS dan PayPal/Card, selain Virtual Account.

CATATAN:
Project ini masih menggunakan localStorage. Untuk production yang benar-benar tersinkron antar perangkat, diperlukan database + login/admin authentication.
