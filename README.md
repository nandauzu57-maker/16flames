# Veloura Global Store — Real PayPal Checkout

This version replaces the real PayPal checkout with a real PayPal Orders API integration.

## 1. Install

```bash
npm install
```

## 2. Configure PayPal

Copy `.env.example` to `.env.local` and fill in your PayPal credentials:

```env
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For testing, use a PayPal **Sandbox** app. For real money, switch `PAYPAL_ENV=live` and use the **Live** Client ID/Secret from your PayPal Business account.

## 3. Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4. Important for real payments

A payment provider account and verified credentials are required. The code cannot legally or technically process real money without your own merchant account.

For an Indonesian seller, PayPal is the global payment option used in this build. PayPal's Indonesia business pages state that merchants can sell across 200+ markets and 130+ currencies, subject to account and country availability.

## 5. Going live

1. Create/verify a PayPal Business account.
2. Create a Live REST app in PayPal Developer.
3. Put Live Client ID and Secret into your hosting environment variables.
4. Set `PAYPAL_ENV=live`.
5. Set `NEXT_PUBLIC_SITE_URL` to your HTTPS domain.
6. Deploy once. After that, product/content changes can be handled separately when you later add the admin/database system.

Never put `PAYPAL_CLIENT_SECRET` in browser code or commit `.env.local` to GitHub.

## Global payment checkout
The checkout now supports PayPal wallet plus PayPal-hosted credit/debit card fields when the merchant account is eligible. PayPal's eligible alternative funding sources can also appear automatically. Apple Pay and Google Pay require merchant onboarding/eligibility and are not displayed as fake buttons. See PayPal's current documentation for eligibility and onboarding.

## Email notifikasi transaksi

Tambahkan ke `.env.local`:

```env
RESEND_API_KEY=re_xxx
BRAND_ORDER_EMAIL=email-brand-kamu@gmail.com
BRAND_FROM_EMAIL=Veloura <onboarding@resend.dev>
```

Email pembeli wajib diisi saat checkout. Order COD/QRIS akan mengirim notifikasi ke `BRAND_ORDER_EMAIL`. PayPal/Card akan mengirim notifikasi setelah capture berhasil.

Untuk mengetes email tanpa melakukan pembelian, jalankan website lalu klik `TEST-EMAIL.bat`. Jika gagal, pesan error dari Resend akan ditampilkan.

Jangan pernah membagikan `RESEND_API_KEY` atau `PAYPAL_CLIENT_SECRET`.

## TEST EMAIL
Setelah membuat `.env.local` dan restart server, buka `http://localhost:3000/test-email`. Jangan tes transaksi sebelum halaman ini menunjukkan BERHASIL.
