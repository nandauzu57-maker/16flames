16FLAMES — MIDTRANS VIRTUAL ACCOUNT

Fitur yang ditambahkan:
- Virtual Account otomatis per transaksi.
- Pilihan bank ditampilkan melalui Midtrans Snap (BCA, Mandiri, BNI, BRI, Permata, CIMB jika tersedia di akun).
- Nomor VA tidak lagi memakai NEXT_PUBLIC_VA_BCA / MANDIRI / BNI / BRI statis.
- Checkout Indonesia menggunakan IDR untuk transaksi Midtrans.
- COD tidak digunakan.

SETUP SANDBOX
1. Buat/login akun Midtrans dan buka Settings > Access Keys.
2. Salin Server Key ke .env.local:
   MIDTRANS_SERVER_KEY=SB-Mid-server-...
3. Salin Client Key ke:
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
4. Pastikan:
   MIDTRANS_IS_PRODUCTION=false
   NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
5. Jalankan:
   npm install
   npm run dev
6. Pilih negara Indonesia saat checkout, lalu klik BAYAR DENGAN VIRTUAL ACCOUNT.
7. Snap Midtrans akan membuat nomor VA untuk order tersebut.

PRODUCTION
Setelah akun dan metode pembayaran Midtrans sudah aktif:
MIDTRANS_IS_PRODUCTION=true
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true
lalu gunakan Server Key dan Client Key Production.

WEBHOOK
Endpoint notifikasi tersedia di:
/api/midtrans/notification
Atur URL Notification/Payment Notification di dashboard Midtrans menjadi:
https://DOMAIN-KAMU.com/api/midtrans/notification

CATATAN KURS
Produk di website saat ini menggunakan harga dasar USD. Untuk transaksi Indonesia, MIDTRANS_IDR_RATE dipakai untuk mengubah total menjadi IDR.
Jika kurs yang ingin dipakai berbeda, ubah MIDTRANS_IDR_RATE di .env.local.

KEAMANAN
- Jangan pernah menaruh MIDTRANS_SERVER_KEY di NEXT_PUBLIC_*.
- Jangan commit .env.local ke GitHub.
- Jangan gunakan nomor VA statis dari rekening pribadi.
