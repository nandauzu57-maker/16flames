const RESEND_API_URL = "https://api.resend.com/emails";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function env(name) {
  return String(process.env[name] || "").trim();
}

function formatMoney(value, currency = "USD") {
  const amount = Number(value) || 0;
  const code = String(currency || "USD").toUpperCase();
  const locale = code === "IDR" ? "id-ID" : "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: code === "IDR" ? 0 : 2,
      maximumFractionDigits: code === "IDR" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString(locale)}`;
  }
}

export async function sendOrderEmail({ orderId, paymentMethod, status, shipping, items, total, currency = "USD", paypalOrderId = "", midtransTransactionId = "" }) {
  const apiKey = env("RESEND_API_KEY");
  const to = env("BRAND_ORDER_EMAIL");
  const from = env("BRAND_FROM_EMAIL") || "Veloura <onboarding@resend.dev>";

  if (!apiKey) throw new Error("RESEND_API_KEY belum diisi di .env.local");
  if (!to) throw new Error("BRAND_ORDER_EMAIL belum diisi di .env.local");

  const rows = (Array.isArray(items) ? items : []).map((item) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee">${esc(item.name || item.productName || item.productId)}</td>
      <td style="padding:10px;border-bottom:1px solid #eee">${esc(item.size || "OS")}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:center">${esc(item.qty || 1)}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">${formatMoney(item.price, currency)}</td>
    </tr>`).join("");

  const subject = `Pesanan baru ${orderId} — ${String(paymentMethod).toUpperCase()}`;
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#171317;line-height:1.5">
    <div style="max-width:700px;margin:auto;border:1px solid #eee;padding:24px">
      <h1 style="margin-top:0">Pesanan Baru — 16flames</h1>
      <p><b>Order:</b> ${esc(orderId)}</p>
      <p><b>Metode transaksi:</b> ${esc(String(paymentMethod).toUpperCase())}</p>
      <p><b>Status:</b> ${esc(status)}</p>
      ${paypalOrderId ? `<p><b>PayPal Order ID:</b> ${esc(paypalOrderId)}</p>` : ""}${midtransTransactionId ? `<p><b>Midtrans Transaction ID:</b> ${esc(midtransTransactionId)}</p>` : ""}
      <h2>Data Pembeli</h2>
      <p><b>Nama:</b> ${esc(shipping?.full_name)}<br>
      <b>Email:</b> ${esc(shipping?.email)}<br>
      <b>Alamat:</b> ${esc(shipping?.address_line_1)} ${esc(shipping?.address_line_2)}<br>
      <b>Kota:</b> ${esc(shipping?.city)}<br>
      <b>Provinsi/State:</b> ${esc(shipping?.state)}<br>
      <b>Kode pos:</b> ${esc(shipping?.postal_code)}<br>
      <b>Negara:</b> ${esc(shipping?.country_code)}</p>
      <h2>Barang</h2>
      <table style="border-collapse:collapse;width:100%"><thead><tr><th style="text-align:left;padding:10px;border-bottom:2px solid #171317">Produk</th><th style="padding:10px;border-bottom:2px solid #171317">Ukuran</th><th style="padding:10px;border-bottom:2px solid #171317">Qty</th><th style="text-align:right;padding:10px;border-bottom:2px solid #171317">Harga</th></tr></thead><tbody>${rows}</tbody></table>
      <h2 style="text-align:right">Total: ${formatMoney(total, currency)}</h2>
    </div></body></html>`;

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.message || data?.name || JSON.stringify(data);
    throw new Error(`Resend gagal mengirim email: ${detail}`);
  }
  return { id: data.id || null };
}
