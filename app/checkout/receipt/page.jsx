"use client";

import {useEffect,useState} from "react";

function money(value,currency="IDR"){
  const n=Number(value)||0;
  if(currency==="IDR") return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
  return new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:2}).format(n);
}

const courierUrls={
  JNE:n=>`https://www.jne.co.id/id/tracking/trace/${encodeURIComponent(n)}`,
  "J&T":n=>`https://jet.co.id/track?waybill=${encodeURIComponent(n)}`,
  SiCepat:n=>`https://www.sicepat.com/checkAwb/${encodeURIComponent(n)}`,
  AnterAja:n=>`https://anteraja.id/tracking/${encodeURIComponent(n)}`,
  "Pos Indonesia":n=>`https://www.posindonesia.co.id/id/tracking/${encodeURIComponent(n)}`,
  "Ninja Xpress":n=>`https://www.ninjaxpress.co/id-id/tracking?id=${encodeURIComponent(n)}`,
  "SPX Express":n=>`https://spx.co.id/track?trackingNumber=${encodeURIComponent(n)}`,
  "ID Express":n=>`https://idexpress.com/cek-resi/${encodeURIComponent(n)}`,
  TIKI:n=>`https://www.tiki.id/id/tracking?awb=${encodeURIComponent(n)}`,
  "DHL Express":n=>`https://www.dhl.com/global-en/home/tracking.html?tracking-id=${encodeURIComponent(n)}`,
  FedEx:n=>`https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`,
  UPS:n=>`https://www.ups.com/track?loc=en_US&tracknum=${encodeURIComponent(n)}`,
  USPS:n=>`https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(n)}`,
  "Royal Mail":n=>`https://www.royalmail.com/track-your-item#/details/${encodeURIComponent(n)}`,
  Aramex:n=>`https://www.aramex.com/track/results?ShipmentNumber=${encodeURIComponent(n)}`,
  EMS:n=>`https://www.ems.post/en/global-network/tracking?item=${encodeURIComponent(n)}`,
  "SF Express":n=>`https://www.sf-international.com/us/en/dynamic_function/waybill/#search/bill-number/${encodeURIComponent(n)}`,
  DPD:n=>`https://www.dpd.com/gb/en/track-your-parcel/?parcel=${encodeURIComponent(n)}`,
  GLS:n=>`https://gls-group.com/GROUP/en/parcel-tracking/?match=${encodeURIComponent(n)}`,
  "Canada Post":n=>`https://www.canadapost-postescanada.ca/track-reperage/en#/details/${encodeURIComponent(n)}`,
  "Australia Post":n=>`https://auspost.com.au/mypost/track/#/search/${encodeURIComponent(n)}`,
  "Japan Post":n=>`https://trackings.post.japanpost.jp/services/sp/srv/search/?requestNo1=${encodeURIComponent(n)}&locale=en`,
  "Korea Post":n=>`https://service.epost.go.kr/trace.RetrieveEmsTraceListList.comm?POST_CODE=${encodeURIComponent(n)}`,
  "Singapore Post":n=>`https://www.singpost.com/track-items?trackNumber=${encodeURIComponent(n)}`,
  "La Poste":n=>`https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
  Correos:n=>`https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=${encodeURIComponent(n)}`,
  "NZ Post":n=>`https://www.nzpost.co.nz/tools/tracking?trackid=${encodeURIComponent(n)}`,
  "17TRACK (Universal)":n=>`https://www.17track.net/en?nums=${encodeURIComponent(n)}`,
};

export default function ReceiptPage(){
  const [receipt,setReceipt]=useState(null);
  useEffect(()=>{
    try{
      const raw=localStorage.getItem("16flames_receipt");
      if(raw) setReceipt(JSON.parse(raw));
    }catch(e){}
  },[]);

  if(!receipt) return <main className="receipt-page"><section className="receipt-empty"><h1>TRANSACTION RECEIPT</h1><p>Bukti transaksi belum tersedia di perangkat ini.</p><a href="/">KEMBALI KE TOKO</a></section></main>;

  const bank=receipt.bank || "Virtual Account";
  const displayCurrency = receipt.shipping?.country_code === "ID" ? "IDR" : (receipt.currency || "USD");
  const courier=receipt.courier||"";
  const trackingNumber=receipt.trackingNumber||"";
  const trackingUrl=receipt.trackingUrl || (courierUrls[courier]&&trackingNumber ? courierUrls[courier](trackingNumber) : "");
  const status=receipt.shippingStatus||"MENUNGGU DIPROSES";
  return <main className="receipt-page">
    <section className="receipt-card">
      <div className="receipt-top"><div className="receipt-mark">✓</div><div><div className="receipt-eyebrow">16FLAMES · TRANSACTION</div><h1>PAYMENT RECEIPT</h1></div></div>
      <div className="receipt-status"><span>MENUNGGU VERIFIKASI</span><small>Transfer sudah dibuat sebagai pesanan. Pembayaran akan dikonfirmasi setelah dicek.</small></div>
      <div className="receipt-grid">
        <div><small>ORDER ID</small><strong>{receipt.orderId}</strong></div>
        <div><small>METODE</small><strong>VIRTUAL ACCOUNT · {bank}</strong></div>
        <div><small>NAMA PEMBELI</small><strong>{receipt.shipping?.full_name || "-"}</strong></div>
        <div><small>EMAIL</small><strong>{receipt.shipping?.email || "-"}</strong></div>
      </div>
      <div className="receipt-va">
        <small>TRANSFER KE {bank.toUpperCase()}</small>
        <div className="receipt-va-number">{receipt.vaNumber || "-"}</div>
        {receipt.vaHolder && <div className="receipt-va-holder">A/N {receipt.vaHolder}</div>}
        <div className="receipt-total"><span>TOTAL PEMBAYARAN</span><strong>{money(receipt.amount,displayCurrency)}</strong></div>
      </div>
      <div className="receipt-items">
        <h2>DETAIL PESANAN</h2>
        {(receipt.items||[]).map((item,i)=><div className="receipt-item" key={i}><span>{item.name} × {item.qty}{item.size?` · ${item.size}`:""}</span><strong>{money((Number(item.price)||0)*(Number(item.qty)||1),displayCurrency)}</strong></div>)}
      </div>

      <div className="tracking-box">
        <div className="tracking-heading"><div><small>PENGIRIMAN</small><h2>{status}</h2></div><span className="tracking-icon">↗</span></div>
        {trackingNumber ? <>
          <div className="tracking-row"><span>KURIR</span><strong>{courier||"Kurir"}</strong></div>
          <div className="tracking-row"><span>NOMOR RESI</span><strong className="tracking-code">{trackingNumber}</strong></div>
          <div className="tracking-actions">
            <button onClick={()=>navigator.clipboard?.writeText(trackingNumber)}>SALIN RESI</button>
            {trackingUrl && <a href={trackingUrl} target="_blank" rel="noreferrer">LACAK PENGIRIMAN ↗</a>}
          </div>
        </> : <p className="tracking-empty">Nomor resi akan ditambahkan setelah pesanan dikirim. Kamu dapat melihatnya kembali di halaman bukti transaksi ini.</p>}
      </div>

      <div className="receipt-note"><b>PENTING</b><br/>Simpan halaman ini sebagai bukti order. Bukti transaksi ini tidak berarti dana sudah terverifikasi. Status pengiriman dan nomor resi akan diperbarui oleh toko setelah pesanan diproses.</div>
      <div className="receipt-actions"><button onClick={()=>window.print()}>CETAK / SIMPAN PDF</button><button className="secondary" onClick={()=>navigator.clipboard?.writeText(receipt.vaNumber||"")}>SALIN NOMOR VA</button><a className="secondary" href="/orders">RIWAYAT PESANAN</a><a href="/">KEMBALI KE TOKO</a></div>
    </section>
    <style jsx global>{`
      .receipt-page{min-height:100vh;background:#f5f1ed;padding:50px 20px;font-family:Arial,sans-serif;color:#111;display:flex;justify-content:center;align-items:flex-start}
      .receipt-card{width:min(760px,100%);background:#fff;padding:42px;box-shadow:0 20px 70px rgba(0,0,0,.10)}
      .receipt-top{display:flex;gap:18px;align-items:center;border-bottom:1px solid #ddd;padding-bottom:25px}.receipt-mark{width:48px;height:48px;border:1px solid #111;display:grid;place-items:center;font-size:24px}.receipt-eyebrow{font-size:11px;letter-spacing:3px;font-weight:700}.receipt-top h1{margin:5px 0 0;font-size:34px;letter-spacing:-1px}
      .receipt-status{margin:25px 0;padding:18px;background:#f6f3ef}.receipt-status span{display:block;font-weight:800;letter-spacing:2px;font-size:13px}.receipt-status small{display:block;margin-top:8px;color:#666;line-height:1.5}
      .receipt-grid{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #ddd}.receipt-grid>div{padding:17px 0;border-bottom:1px solid #ddd}.receipt-grid>div:nth-child(odd){padding-right:20px}.receipt-grid>div:nth-child(even){padding-left:20px;border-left:1px solid #ddd}.receipt-grid small,.receipt-va>small,.receipt-items h2,.tracking-heading small{display:block;font-size:10px;letter-spacing:2px;color:#777;font-weight:700}.receipt-grid strong{display:block;margin-top:7px;font-size:13px;word-break:break-word}.receipt-va{margin:28px 0;padding:25px;border:1px solid #111;text-align:center}.receipt-va-number{font-size:34px;font-weight:800;letter-spacing:3px;margin:12px 0;word-break:break-all}.receipt-va-holder{font-size:13px;color:#666}.receipt-total{margin-top:20px;padding-top:17px;border-top:1px solid #ddd;display:flex;justify-content:space-between;align-items:center}.receipt-total strong{font-size:22px}.receipt-items{margin-top:30px}.receipt-items h2{border-bottom:1px solid #ddd;padding-bottom:12px}.receipt-item{display:flex;justify-content:space-between;gap:20px;padding:13px 0;border-bottom:1px solid #eee;font-size:14px}
      .tracking-box{margin-top:30px;border:1px solid #111;padding:24px}.tracking-heading{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #ddd;padding-bottom:15px}.tracking-heading h2{font-size:20px;margin:7px 0 0}.tracking-icon{width:34px;height:34px;border:1px solid #111;display:grid;place-items:center}.tracking-row{display:flex;justify-content:space-between;gap:20px;padding:15px 0;border-bottom:1px solid #eee;font-size:13px}.tracking-row span{font-size:10px;letter-spacing:2px;color:#777;font-weight:700}.tracking-code{letter-spacing:1.5px}.tracking-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.tracking-actions button,.tracking-actions a{border:0;background:#111;color:#fff;padding:12px 15px;font-weight:700;font-size:10px;letter-spacing:1px;text-decoration:none;cursor:pointer}.tracking-actions a{background:#e9e5e0;color:#111}.tracking-empty{font-size:13px;line-height:1.7;color:#666;margin:17px 0 0}
      .receipt-note{margin-top:25px;padding:16px;background:#faf8f5;color:#555;font-size:12px;line-height:1.6}.receipt-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.receipt-actions button,.receipt-actions a{border:0;background:#111;color:#fff;padding:14px 18px;font-weight:700;font-size:11px;letter-spacing:1px;text-decoration:none;cursor:pointer}.receipt-actions .secondary{background:#e9e5e0;color:#111}.receipt-actions a{display:inline-flex;align-items:center}
      @media(max-width:600px){.receipt-page{padding:15px}.receipt-card{padding:24px}.receipt-top h1{font-size:25px}.receipt-grid{grid-template-columns:1fr}.receipt-grid>div:nth-child(even){padding-left:0;border-left:0}.receipt-va-number{font-size:25px}.receipt-total{align-items:flex-start;gap:15px;flex-direction:column}.tracking-row{align-items:flex-start;flex-direction:column;gap:7px}}
      @media print{.receipt-page{padding:0;background:#fff}.receipt-card{box-shadow:none;width:100%;padding:20px}.receipt-actions{display:none}.tracking-actions{display:none}}
    `}</style>
  </main>;
}
