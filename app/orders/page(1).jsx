"use client";

import { useEffect, useState } from "react";

function money(value, currency = "IDR") {
  const n = Number(value) || 0;
  try {
    return currency === "IDR"
      ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)
      : new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  } catch { return `${currency} ${n}`; }
}

function dateText(value) {
  if (!value) return "-";
  try { return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
  catch { return "-"; }
}

const STATUS_CLASS = {
  "MENUNGGU DIPROSES": "pending",
  "DIKEMAS": "packed",
  "DIKIRIM": "shipped",
  "SAMPAI": "done",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("16flames_orders");
        const parsed = raw ? JSON.parse(raw) : [];
        setOrders(Array.isArray(parsed) ? parsed : []);
      } catch { setOrders([]); }
      finally { setReady(true); }
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener("focus", load);
    return () => { window.removeEventListener("storage", load); window.removeEventListener("focus", load); };
  }, []);

  function openOrder(order) {
    try { localStorage.setItem("16flames_receipt", JSON.stringify(order)); } catch {}
    window.location.href = "/checkout/receipt";
  }

  return (
    <main className="orders-page">
      <section className="orders-shell">
        <header className="orders-header">
          <div>
            <div className="orders-eyebrow">16FLAMES · ACCOUNT</div>
            <h1>RIWAYAT PESANAN</h1>
            <p>Lihat pesanan, status pengiriman, dan nomor resi dari pesanan yang dibuat di perangkat ini.</p>
          </div>
          <a className="orders-back" href="/">KEMBALI KE TOKO</a>
        </header>

        <div className="orders-summary">
          <div><span>TOTAL PESANAN</span><strong>{orders.length}</strong></div>
          <div><span>PESANAN TERBARU</span><strong>{orders.length ? dateText(orders[0]?.createdAt) : "-"}</strong></div>
        </div>

        {!ready ? <div className="orders-empty">MEMUAT RIWAYAT...</div> :
        !orders.length ? (
          <div className="orders-empty">
            <div className="empty-icon">♡</div>
            <h2>BELUM ADA PESANAN</h2>
            <p>Pesanan yang berhasil dibuat akan otomatis muncul di halaman ini.</p>
            <a href="/">MULAI BELANJA</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => {
              const status = order.shippingStatus || "MENUNGGU DIPROSES";
              const statusClass = STATUS_CLASS[status] || "pending";
              const currency = order.currency || "IDR";
              return (
                <article className="order-card" key={order.orderId || `order-${index}`}>
                  <div className="order-top">
                    <div><span className="order-label">ORDER ID</span><strong className="order-id">{order.orderId || "-"}</strong></div>
                    <span className={`order-status ${statusClass}`}>{status}</span>
                  </div>
                  <div className="order-date">{dateText(order.createdAt)}</div>
                  <div className="order-products">
                    {(order.items || []).map((item, itemIndex) => (
                      <div className="order-product" key={`${item.productId || item.name}-${itemIndex}`}>
                        <div><strong>{item.name || "Produk"}</strong><span>{item.size ? `Ukuran ${item.size} · ` : ""}Qty {item.qty || 1}</span></div>
                        <b>{money((Number(item.price) || 0) * (Number(item.qty) || 1), currency)}</b>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <div className="order-shipping">
                      <span>PENGIRIMAN</span>
                      {order.trackingNumber ? <><strong>{order.courier || "Kurir"}</strong><code>{order.trackingNumber}</code></> : <strong>Nomor resi belum tersedia</strong>}
                    </div>
                    <div className="order-total"><span>TOTAL</span><strong>{money(order.amount, currency)}</strong></div>
                  </div>
                  <div className="order-actions">
                    <button type="button" onClick={() => openOrder(order)}>LIHAT DETAIL PESANAN</button>
                    {order.trackingUrl && order.trackingNumber ? <a href={order.trackingUrl} target="_blank" rel="noreferrer">LACAK PENGIRIMAN ↗</a> : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <style jsx>{`
        .orders-page{min-height:100vh;background:#f5f1ed;color:#111;padding:48px 20px 80px;font-family:Arial,Helvetica,sans-serif}
        .orders-shell{width:min(980px,100%);margin:0 auto}.orders-header{background:#fff;padding:38px;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;gap:25px;align-items:flex-start}
        .orders-eyebrow{font-size:10px;letter-spacing:2.5px;font-weight:800}.orders-header h1{margin:9px 0 10px;font-size:clamp(30px,5vw,52px);letter-spacing:-2px}
        .orders-header p{max-width:620px;margin:0;color:#666;font-size:13px;line-height:1.7}.orders-back{flex:0 0 auto;background:#111;color:#fff;text-decoration:none;padding:13px 16px;font-size:10px;font-weight:800;letter-spacing:1px}
        .orders-summary{display:grid;grid-template-columns:1fr 1fr;background:#111;color:#fff}.orders-summary>div{padding:22px 28px;border-right:1px solid #333}.orders-summary>div:last-child{border-right:0}
        .orders-summary span,.order-label,.order-shipping>span,.order-total>span{display:block;font-size:9px;letter-spacing:1.8px;font-weight:800}.orders-summary strong{display:block;margin-top:7px;font-size:22px}
        .orders-empty{background:#fff;margin-top:20px;padding:70px 25px;text-align:center}.empty-icon{font-size:48px}.orders-empty h2{margin:10px 0;font-size:22px}.orders-empty p{color:#777;font-size:13px;line-height:1.6}
        .orders-empty a{display:inline-block;margin-top:14px;background:#111;color:#fff;text-decoration:none;padding:13px 18px;font-size:10px;font-weight:800;letter-spacing:1px}
        .orders-list{display:grid;gap:18px;margin-top:20px}.order-card{background:#fff;padding:25px;border:1px solid #ddd}.order-top{display:flex;justify-content:space-between;align-items:flex-start;gap:15px}
        .order-label{color:#777}.order-id{display:block;margin-top:6px;font-size:14px;word-break:break-all}.order-status{padding:8px 10px;font-size:9px;font-weight:900;letter-spacing:1px;white-space:nowrap}
        .order-status.pending{background:#f4efe8}.order-status.packed{background:#eee8f5}.order-status.shipped{background:#e6f1ed}.order-status.done{background:#e8eee0}
        .order-date{color:#777;font-size:11px;margin:8px 0 18px}.order-products{border-top:1px solid #ddd}.order-product{display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px solid #eee;font-size:12px}
        .order-product strong,.order-product span{display:block}.order-product span{color:#777;margin-top:5px;font-size:10px}.order-product b{white-space:nowrap}
        .order-footer{display:grid;grid-template-columns:1fr auto;gap:20px;padding:18px 0}.order-shipping strong,.order-shipping code,.order-total strong{display:block;margin-top:6px}
        .order-shipping strong{font-size:12px}.order-shipping code{width:fit-content;max-width:100%;padding:5px 7px;background:#f6f3ef;font-size:11px;word-break:break-all}.order-total{text-align:right}.order-total strong{font-size:18px}
        .order-actions{display:flex;gap:9px;flex-wrap:wrap;border-top:1px solid #ddd;padding-top:16px}.order-actions button,.order-actions a{border:0;background:#111;color:#fff;padding:12px 14px;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:1px;cursor:pointer}.order-actions a{background:#e9e5e0;color:#111}
        @media(max-width:650px){.orders-page{padding:15px 12px 50px}.orders-header{padding:25px 20px;flex-direction:column}.orders-summary{grid-template-columns:1fr}.orders-summary>div{border-right:0;border-bottom:1px solid #333}.orders-summary>div:last-child{border-bottom:0}.order-card{padding:19px}.order-top{flex-direction:column}.order-footer{grid-template-columns:1fr}.order-total{text-align:left}.order-actions button,.order-actions a{width:100%;text-align:center}}
      `}</style>
    </main>
  );
}
