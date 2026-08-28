# Pembayaran Malaysia

Jika checkout memilih Malaysia, website menampilkan:
- DuitNow QR (gambar `public/duitnow.png`)
- Bank Transfer Malaysia

Total pembayaran menggunakan MYR dengan kurs storefront `1 USD = 4.70 MYR`.

## Konfigurasi Vercel
Set:
- `NEXT_PUBLIC_DUITNOW_QR_IMAGE=/duitnow.png`
- `NEXT_PUBLIC_DUITNOW_MERCHANT_NAME=nama merchant`
- `NEXT_PUBLIC_MY_BANK_NAME=nama bank`
- `NEXT_PUBLIC_MY_BANK_ACCOUNT=nomor rekening`
- `NEXT_PUBLIC_MY_BANK_HOLDER=nama pemilik`

Jangan masukkan secret/API key ke variabel `NEXT_PUBLIC_*`.

## Penting
DuitNow QR dan bank transfer pada versi ini adalah pembayaran manual: order masuk `PENDING_VERIFICATION`.
Untuk pembayaran Malaysia yang otomatis membuat invoice/VA dan memverifikasi pembayaran otomatis, perlu integrasi payment gateway Malaysia yang mendukung metode tersebut.
