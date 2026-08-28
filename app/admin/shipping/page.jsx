"use client";

import {useEffect,useState} from "react";
<<<<<<< HEAD
import { getShippingRoute } from "../../../lib/shipping";
=======
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585

const COURIERS=[
  "JNE","J&T","SiCepat","AnterAja","Pos Indonesia","Ninja Xpress","SPX Express","ID Express","TIKI",
  "DHL Express","FedEx","UPS","USPS","Royal Mail","Aramex","EMS","SF Express","DPD","GLS",
  "Canada Post","Australia Post","Japan Post","Korea Post","Singapore Post","La Poste","Correos","NZ Post",
  "17TRACK (Universal)","Lainnya"
];
const STATUSES=["MENUNGGU DIPROSES","DIKEMAS","DIKIRIM","SAMPAI"];
const urls={
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

export default function ShippingAdmin(){
  const [orders,setOrders]=useState([]);
  const [selected,setSelected]=useState(null);
  const [courier,setCourier]=useState("");
  const [trackingNumber,setTrackingNumber]=useState("");
  const [status,setStatus]=useState("MENUNGGU DIPROSES");
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    const load=()=>{try{const raw=JSON.parse(localStorage.getItem("16flames_orders")||"[]");setOrders(Array.isArray(raw)?raw:[])}catch(e){setOrders([])}};
    load();
    window.addEventListener("storage",load);
    window.addEventListener("focus",load);
    return()=>{window.removeEventListener("storage",load);window.removeEventListener("focus",load)};
  },[]);
  function choose(o){setSelected(o);setCourier(o.courier||"");setTrackingNumber(o.trackingNumber||"");setStatus(o.shippingStatus||"MENUNGGU DIPROSES");setSaved(false)}
  function save(){
    if(!selected)return;
    if(trackingNumber.trim() && !courier){setSaved(false);window.alert("Pilih kurir terlebih dahulu sebelum menyimpan nomor resi.");return;}
    if(status==="DIKIRIM" && !trackingNumber.trim()){setSaved(false);window.alert("Untuk status DIKIRIM, masukkan nomor resi terlebih dahulu.");return;}
    const trackingUrl=(urls[courier]&&trackingNumber)?urls[courier](trackingNumber):"";
    const updated={...selected,courier,trackingNumber,trackingUrl,shippingStatus:status,shippingUpdatedAt:new Date().toISOString()};
    const next=orders.map(o=>o.orderId===selected.orderId?updated:o);
    setOrders(next);setSelected(updated);setSaved(true);
    localStorage.setItem("16flames_orders",JSON.stringify(next));
    const current=JSON.parse(localStorage.getItem("16flames_receipt")||"null");
    if(current?.orderId===selected.orderId)localStorage.setItem("16flames_receipt",JSON.stringify(updated));
  }
  return <main className="shipping-admin"><div className="admin-card">
    <div className="admin-head"><div><div className="eyebrow">16FLAMES · SHIPPING</div><h1>KELOLA RESI PENGIRIMAN</h1><p>Tambahkan kurir lokal atau internasional dan nomor resi setelah pesanan siap dikirim. Data testing tersimpan di browser ini.</p></div><div className="head-actions"><a href="/">TOKO</a><button type="button" onClick={async()=>{await fetch("/api/admin/logout",{method:"POST"});window.location.href="/admin/login"}}>KELUAR</button></div></div>
    {!orders.length?<div className="empty">Belum ada order VA di browser ini. Buat satu order terlebih dahulu.</div>:<div className="admin-layout">
      <div className="orders"><h2>ORDER</h2>{orders.map(o=><button key={o.orderId} className={selected?.orderId===o.orderId?"order active":"order"} onClick={()=>choose(o)}><strong>{o.orderId}</strong><span>{o.shipping?.full_name||"-"}</span><small>{o.shippingStatus||"MENUNGGU DIPROSES"}{o.trackingNumber?` · ${o.trackingNumber}`:""}</small></button>)}</div>
<<<<<<< HEAD
      <div className="editor">{selected?<><div className="editor-title"><div><small>ORDER ID</small><h2>{selected.orderId}</h2></div><button type="button" className="receipt-link" onClick={()=>{try{localStorage.setItem("16flames_receipt",JSON.stringify(selected))}catch(e){};window.location.href="/checkout/receipt"}}>BUKA BUKTI TRANSAKSI</button></div><div className="route-box"><small>RUTE PENGIRIMAN</small><strong>{getShippingRoute(selected.shipping).routeLabel}</strong><span>{selected.shipping?.fulfillment_origin === "Malaysia" ? "Fulfillment Malaysia → Kuala Lumpur" : "Fulfillment Indonesia → tujuan internasional"}</span></div><label>Status pengiriman<select value={status} onChange={e=>setStatus(e.target.value)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></label><label>Kurir<select value={courier} onChange={e=>setCourier(e.target.value)}><option value="">Pilih kurir</option>{COURIERS.map(c=><option key={c}>{c}</option>)}</select></label><label>Nomor resi<input value={trackingNumber} onChange={e=>setTrackingNumber(e.target.value)} placeholder="Contoh: JP1234567890"/></label>{trackingNumber&&<div className="preview"><small>PREVIEW</small><strong>{courier||"Kurir"}</strong><span>{trackingNumber}</span></div>}<button className="save" onClick={save}>SIMPAN RESI</button>{saved&&<div className="saved">✓ Resi tersimpan. Bukti transaksi sekarang menampilkan data pengiriman.</div>}<p className="note">Catatan: karena website ini belum memakai database/akun admin, data resi pada versi testing tersimpan di localStorage browser. Untuk website production, resi sebaiknya disimpan di database agar pembeli bisa melihatnya dari perangkat mana pun.</p></>:<div className="empty">Pilih order di sebelah kiri untuk menambahkan resi.</div>}</div>
    </div>}
  </div><style jsx global>{`
    .shipping-admin{min-height:100vh;background:#f5f1ed;padding:40px 20px;color:#111;font-family:Arial,sans-serif}.admin-card{max-width:1100px;margin:auto;background:#fff;padding:36px;box-shadow:0 20px 70px #0001}.admin-head{display:flex;justify-content:space-between;gap:25px;border-bottom:1px solid #ddd;padding-bottom:25px}.eyebrow{font-size:10px;font-weight:800;letter-spacing:3px;color:#777}.admin-head h1{font-size:32px;margin:8px 0}.admin-head p{max-width:650px;color:#666;line-height:1.6;font-size:13px}.admin-head>a,.editor-title>a,.editor-title>button{background:#111;color:#fff;padding:12px 16px;text-decoration:none;font-size:10px;font-weight:800;letter-spacing:1px;height:max-content}.admin-layout{display:grid;grid-template-columns:330px 1fr;gap:30px;margin-top:30px}.orders h2{font-size:11px;letter-spacing:2px;color:#777}.order{display:block;width:100%;text-align:left;border:1px solid #ddd;background:#fff;padding:15px;margin:8px 0;cursor:pointer}.order.active{border-color:#111}.order strong,.order span,.order small{display:block}.order strong{font-size:12px}.order span{font-size:13px;margin-top:5px}.order small{font-size:10px;color:#777;margin-top:7px}.editor{border-left:1px solid #ddd;padding-left:30px}.editor-title{display:flex;justify-content:space-between;align-items:start;border-bottom:1px solid #ddd;padding-bottom:18px;margin-bottom:20px}.editor-title small,.preview small{font-size:9px;letter-spacing:2px;color:#777;font-weight:800}.editor-title h2{margin:6px 0 0;font-size:18px}.route-box{padding:14px;background:#f7f4f0;border:1px solid #ddd;margin:18px 0;display:grid;gap:5px}.route-box small{font-size:9px;letter-spacing:2px;font-weight:800;color:#777}.route-box strong{font-size:14px}.route-box span{font-size:11px;color:#666}.editor label{display:block;font-size:11px;font-weight:800;margin:18px 0}.editor select,.editor input{display:block;width:100%;box-sizing:border-box;margin-top:8px;padding:14px;border:1px solid #ccc;background:#fff;font-size:13px}.save{margin-top:10px;width:100%;padding:15px;border:0;background:#111;color:#fff;font-weight:800;cursor:pointer}.preview{padding:16px;background:#f7f4f0;margin:18px 0;display:grid;gap:7px}.preview strong{font-size:14px}.preview span{font-size:18px;letter-spacing:2px}.saved{margin-top:15px;padding:13px;background:#edf8ee;font-size:12px}.note{font-size:11px;color:#777;line-height:1.6}.empty{padding:30px;background:#faf8f5;color:#666;margin-top:25px}.admin-layout .empty{margin-top:0}@media(max-width:750px){.shipping-admin{padding:15px}.admin-card{padding:22px}.admin-head{display:block}.admin-head>a{display:inline-block;margin-top:15px}.admin-layout{grid-template-columns:1fr}.editor{border-left:0;border-top:1px solid #ddd;padding:25px 0 0}.editor-title{display:block}.editor-title>a,.editor-title>button{display:inline-block;margin-top:12px}}
=======
      <div className="editor">{selected?<><div className="editor-title"><div><small>ORDER ID</small><h2>{selected.orderId}</h2></div><button type="button" className="receipt-link" onClick={()=>{try{localStorage.setItem("16flames_receipt",JSON.stringify(selected))}catch(e){};window.location.href="/checkout/receipt"}}>BUKA BUKTI TRANSAKSI</button></div><label>Status pengiriman<select value={status} onChange={e=>setStatus(e.target.value)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></label><label>Kurir<select value={courier} onChange={e=>setCourier(e.target.value)}><option value="">Pilih kurir</option>{COURIERS.map(c=><option key={c}>{c}</option>)}</select></label><label>Nomor resi<input value={trackingNumber} onChange={e=>setTrackingNumber(e.target.value)} placeholder="Contoh: JP1234567890"/></label>{trackingNumber&&<div className="preview"><small>PREVIEW</small><strong>{courier||"Kurir"}</strong><span>{trackingNumber}</span></div>}<button className="save" onClick={save}>SIMPAN RESI</button>{saved&&<div className="saved">✓ Resi tersimpan. Bukti transaksi sekarang menampilkan data pengiriman.</div>}<p className="note">Catatan: karena website ini belum memakai database/akun admin, data resi pada versi testing tersimpan di localStorage browser. Untuk website production, resi sebaiknya disimpan di database agar pembeli bisa melihatnya dari perangkat mana pun.</p></>:<div className="empty">Pilih order di sebelah kiri untuk menambahkan resi.</div>}</div>
    </div>}
  </div><style jsx global>{`
    .shipping-admin{min-height:100vh;background:#f5f1ed;padding:40px 20px;color:#111;font-family:Arial,sans-serif}.admin-card{max-width:1100px;margin:auto;background:#fff;padding:36px;box-shadow:0 20px 70px #0001}.admin-head{display:flex;justify-content:space-between;gap:25px;border-bottom:1px solid #ddd;padding-bottom:25px}.eyebrow{font-size:10px;font-weight:800;letter-spacing:3px;color:#777}.admin-head h1{font-size:32px;margin:8px 0}.admin-head p{max-width:650px;color:#666;line-height:1.6;font-size:13px}.admin-head>a,.editor-title>a,.editor-title>button{background:#111;color:#fff;padding:12px 16px;text-decoration:none;font-size:10px;font-weight:800;letter-spacing:1px;height:max-content}.admin-layout{display:grid;grid-template-columns:330px 1fr;gap:30px;margin-top:30px}.orders h2{font-size:11px;letter-spacing:2px;color:#777}.order{display:block;width:100%;text-align:left;border:1px solid #ddd;background:#fff;padding:15px;margin:8px 0;cursor:pointer}.order.active{border-color:#111}.order strong,.order span,.order small{display:block}.order strong{font-size:12px}.order span{font-size:13px;margin-top:5px}.order small{font-size:10px;color:#777;margin-top:7px}.editor{border-left:1px solid #ddd;padding-left:30px}.editor-title{display:flex;justify-content:space-between;align-items:start;border-bottom:1px solid #ddd;padding-bottom:18px;margin-bottom:20px}.editor-title small,.preview small{font-size:9px;letter-spacing:2px;color:#777;font-weight:800}.editor-title h2{margin:6px 0 0;font-size:18px}.editor label{display:block;font-size:11px;font-weight:800;margin:18px 0}.editor select,.editor input{display:block;width:100%;box-sizing:border-box;margin-top:8px;padding:14px;border:1px solid #ccc;background:#fff;font-size:13px}.save{margin-top:10px;width:100%;padding:15px;border:0;background:#111;color:#fff;font-weight:800;cursor:pointer}.preview{padding:16px;background:#f7f4f0;margin:18px 0;display:grid;gap:7px}.preview strong{font-size:14px}.preview span{font-size:18px;letter-spacing:2px}.saved{margin-top:15px;padding:13px;background:#edf8ee;font-size:12px}.note{font-size:11px;color:#777;line-height:1.6}.empty{padding:30px;background:#faf8f5;color:#666;margin-top:25px}.admin-layout .empty{margin-top:0}@media(max-width:750px){.shipping-admin{padding:15px}.admin-card{padding:22px}.admin-head{display:block}.admin-head>a{display:inline-block;margin-top:15px}.admin-layout{grid-template-columns:1fr}.editor{border-left:0;border-top:1px solid #ddd;padding:25px 0 0}.editor-title{display:block}.editor-title>a,.editor-title>button{display:inline-block;margin-top:12px}}
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
  `}</style></main>;
}
