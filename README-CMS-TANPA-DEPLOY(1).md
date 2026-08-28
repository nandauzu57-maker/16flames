# 16FLAMES CMS — ubah foto & teks tanpa deploy ulang

Versi ini menambahkan editor konten di `/admin`.

## Yang bisa diubah tanpa deploy
- Teks hero homepage
- Foto hero homepage
- Foto dan judul section editorial
- Foto dan teks section customizer
- Foto dan judul Home & Pet
- Teks newsletter
- Teks + foto hero halaman About
- Teks + foto hero halaman Filosofi
- Nama + foto semua produk
- Maintenance ON/OFF

## Penyimpanan
Konten disimpan ke Upstash Redis menggunakan:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Login admin membutuhkan:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET` (minimal 32 karakter)

## Foto
Agar foto dapat berubah tanpa deploy, kolom foto memakai **URL gambar publik** (`https://...`).
Jangan memasukkan API key atau secret ke editor.

## Setelah upload ke GitHub/Vercel
Deploy versi kode ini **sekali**. Setelah deployment berhasil, perubahan foto/teks dari `/admin` disimpan ke Redis dan tidak memerlukan deployment lagi.

Perubahan kode/desain tetap memerlukan deployment.
