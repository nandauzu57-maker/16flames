TES NOTIFIKASI EMAIL VELOURA

1. Buat file .env.local di folder utama website.
2. Isi:
   RESEND_API_KEY=re_API_KEY_KAMU
   BRAND_ORDER_EMAIL=email_yang_menerima_order
   BRAND_FROM_EMAIL=Veloura <onboarding@resend.dev>

3. RESTART website setelah mengubah .env.local.
4. Buka http://localhost:3000/test-email
5. Klik KIRIM EMAIL TEST.

PENTING:
- Jangan pernah memasukkan API key ke chat atau screenshot.
- Jika memakai onboarding@resend.dev, Resend dapat membatasi tujuan pengiriman ke email akun Resend. Jika ingin mengirim ke email lain, verifikasi domain pengirim di Resend dan ubah BRAND_FROM_EMAIL ke alamat domain yang sudah diverifikasi.
- Jika halaman test berwarna merah, jangan melakukan transaksi dulu. Perbaiki error test sampai BERHASIL.
- Setelah test berhasil, COD/QRIS akan mengirim notifikasi saat order dibuat, dan PayPal/Card saat pembayaran selesai.
