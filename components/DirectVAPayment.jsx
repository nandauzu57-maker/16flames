"use client";
import {useMemo,useState} from "react";

const BANKS=[
  {key:"BCA",label:"BCA"},
  {key:"MANDIRI",label:"Mandiri"},
  {key:"BNI",label:"BNI"},
  {key:"BRI",label:"BRI"},
  {key:"PERMATA",label:"Permata"},
  {key:"CIMB",label:"CIMB Niaga"},
];

export default function DirectVAPayment({shipping,items,total,currency="IDR",onSuccess,onError}){
  const [open,setOpen]=useState(false);
  const [bank,setBank]=useState("BCA");
  const [confirmed,setConfirmed]=useState(false);
  const [busy,setBusy]=useState(false);
  const accounts=useMemo(()=>({
    BCA:{name:"BCA",number:process.env.NEXT_PUBLIC_VA_BCA||"",holder:process.env.NEXT_PUBLIC_VA_BCA_NAME||""},
    MANDIRI:{name:"Mandiri",number:process.env.NEXT_PUBLIC_VA_MANDIRI||"",holder:process.env.NEXT_PUBLIC_VA_MANDIRI_NAME||""},
    BNI:{name:"BNI",number:process.env.NEXT_PUBLIC_VA_BNI||"",holder:process.env.NEXT_PUBLIC_VA_BNI_NAME||""},
    BRI:{name:"BRI",number:process.env.NEXT_PUBLIC_VA_BRI||"",holder:process.env.NEXT_PUBLIC_VA_BRI_NAME||""},
    PERMATA:{name:"Permata",number:process.env.NEXT_PUBLIC_VA_PERMATA||"",holder:process.env.NEXT_PUBLIC_VA_PERMATA_NAME||""},
    CIMB:{name:"CIMB Niaga",number:process.env.NEXT_PUBLIC_VA_CIMB||"",holder:process.env.NEXT_PUBLIC_VA_CIMB_NAME||""},
  }),[]);
  const account=accounts[bank];

  const submit=async()=>{
    if(!shipping?.full_name || !shipping?.email || !shipping?.address_line_1 || !shipping?.city || !shipping?.postal_code){
      const e=new Error("Lengkapi nama, email, dan alamat pengiriman terlebih dahulu."); onError?.(e); return;
    }
    if(!account.number){
      const e=new Error(`Nomor VA ${account.name} belum diisi di .env.local.`); onError?.(e); return;
    }
    if(!confirmed){
      const e=new Error("Centang konfirmasi setelah melakukan transfer ke Virtual Account."); onError?.(e); return;
    }
    setBusy(true);
    try{
      const res=await fetch("/api/manual-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"virtual_account",bank,shipping,items,total,currency})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Order gagal dibuat");
      onSuccess?.({...data, vaNumber:account.number, vaHolder:account.holder, amount:total});
    }catch(e){onError?.(e)}finally{setBusy(false)}
  };

  return <div className="manual-payment direct-va-payment">
    <button className={`manual-method ${open?"active":""}`} onClick={()=>setOpen(!open)}>
      <span>🏦</span><span><b>Virtual Account Indonesia</b><small>Transfer langsung ke VA/akun pembayaran kamu</small></span><strong>{open?"−":"+"}</strong>
    </button>
    {open && <div className="manual-panel">
      <div className="va-bank-tabs">
        {BANKS.map(x=><button type="button" key={x.key} className={bank===x.key?"active":""} onClick={()=>{setBank(x.key);setConfirmed(false)}}>{x.label}</button>)}
      </div>
      <div className="direct-va-card">
        <div className="direct-va-label">TRANSFER KE {account.name.toUpperCase()}</div>
        <div className="direct-va-number">{account.number||"BELUM DIISI"}</div>
        {account.holder&&<div className="direct-va-holder">A/N {account.holder}</div>}
        <div className="direct-va-amount">TOTAL PEMBAYARAN: <strong>{money(total,currency)}</strong></div>
      </div>
      <ol className="va-steps">
        <li>Salin nomor Virtual Account di atas.</li>
        <li>Lakukan transfer sesuai total pesanan.</li>
        <li>Pastikan nama penerima dan jumlah transfer sudah benar.</li>
        <li>Simpan bukti pembayaran sampai pesanan dikonfirmasi.</li>
      </ol>
      <label className="confirm-check"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> Saya sudah melakukan pembayaran ke Virtual Account di atas.</label>
      <button className="manual-submit" disabled={busy} onClick={submit}>{busy?"MEMPROSES...":"SAYA SUDAH BAYAR"}</button>
      <p className="manual-note">Pembayaran langsung ke VA/akun kamu tidak bisa diverifikasi otomatis oleh website tanpa API bank/payment gateway. Order akan masuk sebagai <b>MENUNGGU VERIFIKASI</b> dan detail pesanan dikirim ke email brand.</p>
    </div>}
  </div>;
}

function money(value,currency="IDR"){
  if(currency === "IDR") return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(value)||0);
  return new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:2}).format(Number(value)||0);
}
