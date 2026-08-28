# 16flames — Security & Automatic Maintenance

## 1. Wajib sebelum production

1. **Cabut/rotate PayPal credentials yang pernah tersimpan di file lama.** Jangan gunakan lagi secret yang pernah masuk archive/Git.
2. Buat `.env.local` dari `.env.example`.
3. Buat password admin baru (minimal 12 karakter):

```bash
npm install
npm run admin:hash -- "PASSWORD-ADMIN-BARU"
```

Salin output ke `ADMIN_PASSWORD_HASH`.
4. Buat `ADMIN_SESSION_SECRET` random minimal 32 byte. Contoh PowerShell:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

5. Jangan pernah mengisi secret ke `NEXT_PUBLIC_*`. Variabel tersebut dikirim ke browser.

## 2. Automatic maintenance

GitHub Dependabot akan memeriksa dependency npm setiap minggu dan membuat pull request update. GitHub Actions akan menjalankan `npm ci`, audit vulnerability level high, dan production build sebelum perubahan digabungkan.

**Jangan mengaktifkan auto-merge untuk major update/payment dependency** tanpa mengecek hasil build dan checkout.

## 3. Deployment

Gunakan provider seperti Vercel/Netlify/GitHub Actions yang terhubung ke repository. Setiap merge ke `main` dapat memicu deployment otomatis. Pastikan environment variables production disimpan di dashboard provider, bukan di repository.

## 4. Endpoint test

`/api/test-email` dan `/api/test-order-email` tidak dapat digunakan normal di production. Jika benar-benar perlu testing production, set `TEST_EMAIL_SECRET` dan kirim header `x-test-email-secret`.
