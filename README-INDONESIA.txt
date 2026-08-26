VELOURA GLOBAL STORE - VERSI SIAP JALAN

CARA PALING MUDAH:
1. Extract ZIP ini.
2. Pastikan Node.js LTS sudah terpasang.
3. Buka folder hasil extract.
4. DOUBLE CLICK: START-WEBSITE.bat
5. Tunggu sampai muncul http://localhost:3000.
6. Buka alamat tersebut di Chrome.

PENTING UNTUK PEMBAYARAN:
- Website dapat berjalan tanpa credential PayPal.
- Untuk pembayaran sungguhan, isi .env.local dengan credential PayPal Sandbox/Live milik kamu.
- Jangan membagikan PAYPAL_CLIENT_SECRET.

Format .env.local:
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=CLIENT_ID_KAMU
PAYPAL_CLIENT_SECRET=SECRET_KAMU
NEXT_PUBLIC_PAYPAL_CLIENT_ID=CLIENT_ID_KAMU
NEXT_PUBLIC_SITE_URL=http://localhost:3000

SETELAH MENGUBAH .env.local:
1. Tutup server dengan Ctrl+C.
2. Jalankan START-WEBSITE.bat lagi.

FITUR:
- Responsive fashion storefront
- Search, kategori, wishlist, cart, quick view
- Ukuran produk
- Foto produk dari URL contoh
- Global shipping address
- PayPal Checkout asli ketika credential tersedia
- PayPal Card Fields ketika merchant eligible
- Success/cancel pages

CATATAN:
Metode seperti Apple Pay, Google Pay, dan metode lokal tidak boleh dibuat sebagai tombol palsu. Payment provider hanya menampilkan metode yang benar-benar eligible untuk akun merchant, negara, perangkat, dan transaksi.

QRIS DAN COD
------------
- QRIS: ganti file public/qris.png dengan gambar QRIS merchant milikmu sendiri. Checkout membuat order berstatus MENUNGGU VERIFIKASI setelah pelanggan mengonfirmasi pembayaran.
- COD: checkout membuat order COD berstatus MENUNGGU KONFIRMASI. COD harus benar-benar tersedia dari kurir/wilayahmu; website tidak bisa memaksa kurir menerima COD.
- QRIS/COD di versi ini adalah order manual, bukan gateway otomatis. Untuk otomatisasi penuh gunakan payment gateway/kurir yang menyediakan API + webhook dan database order.
