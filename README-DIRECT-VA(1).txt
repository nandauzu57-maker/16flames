16FLAMES — PEMBAYARAN VIRTUAL ACCOUNT LANGSUNG

Versi ini TIDAK menggunakan Midtrans.

Cara mengisi nomor VA/akun pembayaran:
1. Salin .env.example menjadi .env.local
2. Isi nomor Virtual Account/akun pembayaran milik kamu.
3. Jika punya nama penerima, isi bagian _NAME.

Contoh:
NEXT_PUBLIC_VA_BCA=1234567890123456
NEXT_PUBLIC_VA_BCA_NAME=16FLAMES

NEXT_PUBLIC_VA_MANDIRI=1234567890123456
NEXT_PUBLIC_VA_MANDIRI_NAME=16FLAMES

Catatan:
- Nomor yang ditampilkan ke pembeli adalah nomor yang kamu masukkan sendiri.
- Jangan memasukkan nomor VA milik orang lain.
- Pembayaran manual/direct VA tidak dapat diverifikasi otomatis oleh website tanpa API bank/payment gateway.
- Setelah pembeli menekan "SAYA SUDAH BAYAR", order dibuat dengan status MENUNGGU VERIFIKASI dan notifikasi order dikirim ke email brand.
- Untuk verifikasi otomatis di masa depan, diperlukan API bank/payment gateway yang memang mendukung akun kamu.
