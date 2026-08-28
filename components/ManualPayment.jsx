"use client";
import {useState} from "react";

export default function ManualPayment({type,shipping,items,total,currency="IDR",onSuccess,onError}){
  const [open,setOpen]=useState(false);
  const [busy,setBusy]=useState(false);
  const [confirmed,setConfirmed]=useState(false);
<<<<<<< HEAD
  const [imageError,setImageError]=useState(false);
=======
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
  const submit=async()=>{
    if(type!=="qris"){ const e=new Error("Metode pembayaran tidak tersedia."); onError?.(e); return; }
    if(!shipping.full_name || !shipping.address_line_1 || !shipping.city || !shipping.postal_code || !shipping.country_code){
      const e=new Error("Lengkapi nama dan alamat pengiriman terlebih dahulu."); onError?.(e); return;
    }
    if(!confirmed){ const e=new Error("Centang konfirmasi setelah membayar dengan QRIS."); onError?.(e); return; }
    setBusy(true);
    try{
      const res=await fetch("/api/manual-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"qris",shipping,items,total,currency})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Order gagal dibuat");
      onSuccess?.(data);
    }catch(e){onError?.(e)}finally{setBusy(false)}
  };
  return <div className="manual-payment">
    <button className={`manual-method ${open?"active":""}`} onClick={()=>setOpen(!open)}>
      <span>▦</span><span><b>QRIS Indonesia</b><small>Scan QRIS toko lalu konfirmasi pembayaran</small></span><strong>{open?"−":"+"}</strong>
    </button>
    {open && <div className="manual-panel">
      <div className="manual-qris-layout">
<<<<<<< HEAD
        <div className={`qris-box ${imageError?"qris-missing":""}`}>
          {!imageError ? <img src="/qris.png" alt="QRIS toko" onError={()=>setImageError(true)}/> : <span className="qris-fallback">QRIS TOKO<br/><small>Tambahkan file public/qris.png</small></span>}
        </div>
=======
        <div className="qris-box"><img src="/qris.png" alt="QRIS toko" onError={(e)=>{e.currentTarget.style.display="none";e.currentTarget.parentElement.classList.add("qris-missing")}}/><span className="qris-fallback">QRIS TOKO<br/><small>Tambahkan file public/qris.png</small></span></div>
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
        <div><h4>Bayar dengan QRIS</h4><ol><li>Buka aplikasi pembayaran yang mendukung QRIS.</li><li>Scan QRIS toko di samping.</li><li>Bayar sesuai total pembayaran yang tertera di checkout.</li><li>Simpan bukti pembayaran.</li></ol><label className="confirm-check"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> Saya sudah membayar dan siap mengirim bukti jika diminta.</label></div>
      </div>
      <button className="manual-submit" disabled={busy} onClick={submit}>{busy?"MEMPROSES...":"SAYA SUDAH BAYAR QRIS"}</button>
      <p className="manual-note">QRIS manual tidak dapat diverifikasi otomatis oleh website ini. Order dibuat sebagai <b>MENUNGGU VERIFIKASI</b>. Ganti <code>public/qris.png</code> dengan QRIS merchant kamu sendiri.</p>
    </div>}
  </div>;
}
