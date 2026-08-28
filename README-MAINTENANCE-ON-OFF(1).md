# Maintenance ON/OFF — 16FLAMES

Tombol maintenance di `/admin` bekerja tanpa deploy ulang **setelah** konfigurasi satu kali.

## Wajib di Vercel

Tambahkan 5 Environment Variables berikut:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

`ADMIN_*` dipakai untuk login admin. Dua `UPSTASH_*` dipakai untuk menyimpan status maintenance agar berlaku ke semua pengunjung.

### Membuat password hash

Di folder project jalankan:

```bash
npm run admin:hash -- "PASSWORD-ADMIN-BARU"
```

Salin hasilnya ke `ADMIN_PASSWORD_HASH`.

`ADMIN_SESSION_SECRET` harus berupa secret random minimal 32 karakter/byte.

### Membuat Redis Upstash

Buat database Redis di Upstash, lalu salin **REST URL** dan **REST TOKEN** ke:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Jangan masukkan token ke GitHub dan jangan taruh secret di kode frontend.

## Setelah Environment Variables diisi

Lakukan **satu deploy/redeploy** supaya environment variables tersedia di deployment.

Setelah itu:

1. Buka `/admin`.
2. Login sebagai admin.
3. Pada **MODE MAINTENANCE**, klik **AKTIFKAN MAINTENANCE**.
4. Status berubah menjadi **ON — AKTIF**.
5. Pengunjung akan melihat halaman maintenance.
6. Untuk mengembalikan toko, buka `/admin` lagi dan klik **MATIKAN MAINTENANCE**.

Setelah konfigurasi awal selesai, ON/OFF berikutnya **tidak perlu deploy ulang**.

## Jika muncul "Tidak diizinkan."

Versi ini sudah diperbaiki agar sesi admin yang tidak valid diarahkan kembali ke `/admin/login`.

Jika setelah login tombol masih gagal, biasanya salah satu dari dua `UPSTASH_*` belum benar atau belum tersedia di deployment. Cek **Vercel → Project → Settings → Environment Variables**, lalu redeploy sekali.

## Catatan

Jangan mengirim `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, atau `UPSTASH_REDIS_REST_TOKEN` ke chat/GitHub.
