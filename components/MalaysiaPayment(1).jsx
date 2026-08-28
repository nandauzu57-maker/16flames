"use client";
import {useMemo,useState} from "react";

function money(value,currency="MYR"){
  return new Intl.NumberFormat("ms-MY",{style:"currency",currency,maximumFractionDigits:2}).format(Number(value)||0);
}

export default function MalaysiaPayment({shipping,items,total,currency="MYR",onSuccess,onError}){
  const [open,setOpen]=useState(null);
  const [confirmed,setConfirmed]=useState({qris:false,bank:false});
  const [busy,setBusy]=useState(false);
  const config=useMemo(()=>({
    qris:{qr:process.env.NEXT_PUBLIC_DUITNOW_QR_IMAGE||"/duitnow.png",merchant:process.env.NEXT_PUBLIC_DUITNOW_MERCHANT_NAME||"16FLAMES MALAYSIA"},
    bank:{name:process.env.NEXT_PUBLIC_MY_BANK_NAME||"",account:process.env.NEXT_PUBLIC_MY_BANK_ACCOUNT||"",holder:process.env.NEXT_PUBLIC_MY_BANK_HOLDER||""}
  }),[]);

  async function submit(type){
    if(!shipping?.full_name || !shipping?.email || !shipping?.address_line_1 || !shipping?.city || !shipping?.postal_code){
      onError?.(new Error("Lengkapi nama, email, dan alamat pengiriman terlebih dahulu.")); return;
    }
    if(type==="qris" && !config.qris.merchant){ onError?.(new Error("Merchant DuitNow belum dikonfigurasi.")); return; }
    if(type==="bank" && (!config.bank.name || !config.bank.account || !config.bank.holder)){ onError?.(new Error("Data rekening Malaysia belum dikonfigurasi di environment Vercel.")); return; }
    if(!confirmed[type]){ onError?.(new Error("Centang konfirmasi setelah melakukan pembayaran.")); return; }
    setBusy(true);
    try{
      const res=await fetch("/api/manual-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:type==="qris"?"duitnow_qr":"bank_transfer_my",shipping,items,total,currency:"MYR"})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Order gagal dibuat");
      onSuccess?.({...data,paymentMethod:type==="qris"?"DuitNow QR Malaysia":"Bank Transfer Malaysia"});
    }catch(e){onError?.(e)}finally{setBusy(false)}
  }

  return <div className="malaysia-payment-grid">
    <div className="manual-payment malaysia-payment-card">
      <button className={`manual-method ${open==="qris"?"active":""}`} onClick={()=>setOpen(open==="qris"?null:"qris")}>
        <span>▦</span><span><b>DuitNow QR Malaysia</b><small>Scan DuitNow QR toko lalu konfirmasi pembayaran</small></span><strong>{open==="qris"?"−":"+"}</strong>
      </button>
      {open==="qris" && <div className="manual-panel">
        <div className="manual-qris-layout">
          <div className="qris-box"><img src={config.qris.qr} alt="DuitNow QR Malaysia" onError={e=>{e.currentTarget.style.display="none";e.currentTarget.parentElement.classList.add("qris-missing")}}/><span className="qris-fallback">DUITNOW QR<br/><small>Tambahkan file public/duitnow.png</small></span></div>
          <div><h4>Bayar dengan DuitNow QR</h4><ol><li>Buka aplikasi bank/e-wallet Malaysia yang mendukung DuitNow QR.</li><li>Scan DuitNow QR toko di samping.</li><li>Bayar sesuai total checkout dalam MYR.</li><li>Simpan bukti pembayaran.</li></ol><label className="confirm-check"><input type="checkbox" checked={confirmed.qris} onChange={e=>setConfirmed({...confirmed,qris:e.target.checked})}/> Saya sudah membayar dan siap mengirim bukti jika diminta.</label></div>
        </div>
        <button className="manual-submit" disabled={busy} onClick={()=>submit("qris")}>{busy?"MEMPROSES...":"SAYA SUDAH BAYAR DUITNOW"}</button>
        <p className="manual-note">Pembayaran manual DuitNow akan masuk sebagai <b>MENUNGGU VERIFIKASI</b>.</p>
      </div>}
    </div>

    <div className="manual-payment malaysia-payment-card">
      <button className={`manual-method ${open==="bank"?"active":""}`} onClick={()=>setOpen(open==="bank"?null:"bank")}>
        <span>🏦</span><span><b>Akun Virtual / Bank Malaysia</b><small>Transfer langsung ke akun pembayaran Malaysia</small></span><strong>{open==="bank"?"−":"+"}</strong>
      </button>
      {open==="bank" && <div className="manual-panel">
        <div className="direct-va-card">
          <div className="direct-va-label">TRANSFER KE BANK MALAYSIA</div>
          <div className="direct-va-number">{config.bank.account||"BELUM DIKONFIGURASI"}</div>
          <div className="direct-va-holder">A/N {config.bank.holder||"—"}</div>
          <div className="direct-va-holder">BANK: {config.bank.name||"—"}</div>
          <div className="direct-va-amount">TOTAL PEMBAYARAN: <strong>{money(total,"MYR")}</strong></div>
        </div>
        <ol className="va-steps"><li>Salin nomor rekening di atas.</li><li>Lakukan transfer sesuai total pesanan.</li><li>Pastikan nama penerima dan jumlah transfer benar.</li><li>Simpan bukti pembayaran.</li></ol>
        <label className="confirm-check"><input type="checkbox" checked={confirmed.bank} onChange={e=>setConfirmed({...confirmed,bank:e.target.checked})}/> Saya sudah melakukan pembayaran dan siap mengirim bukti jika diminta.</label>
        <button className="manual-submit" disabled={busy} onClick={()=>submit("bank")}>{busy?"MEMPROSES...":"SAYA SUDAH BAYAR"}</button>
        <p className="manual-note">Transfer manual Malaysia akan masuk sebagai <b>MENUNGGU VERIFIKASI</b>. Ini bukan nomor VA dinamis dari bank.</p>
      </div>}
    </div>
  </div>;
}
