"use client";
import {useState} from "react";

export default function TestEmail(){
  const [loading,setLoading]=useState(false); const [result,setResult]=useState(null);
  async function test(){setLoading(true);setResult(null);try{const r=await fetch("/api/test-email",{cache:"no-store"});const d=await r.json();setResult({ok:r.ok,...d});}catch(e){setResult({ok:false,error:e.message})}finally{setLoading(false)}}
  return <main style={{minHeight:"100vh",padding:"60px 20px",fontFamily:"Arial,sans-serif",background:"#f7f2f4",color:"#171317"}}>
    <div style={{maxWidth:720,margin:"auto",background:"white",padding:36,border:"1px solid #ddd",boxShadow:"0 15px 40px #0001"}}>
      <div style={{fontSize:12,letterSpacing:3}}>VELOURA / EMAIL DIAGNOSTIC</div>
      <h1 style={{fontSize:42,margin:"14px 0"}}>Test Notifikasi Pembelian</h1>
      <p>Tekan tombol di bawah. Website akan mencoba mengirim email test melalui Resend ke <b>BRAND_ORDER_EMAIL</b>.</p>
      <button onClick={test} disabled={loading} style={{padding:"14px 22px",background:"#171317",color:"white",border:0,cursor:"pointer",fontWeight:700}}>{loading?"MENGIRIM...":"KIRIM EMAIL TEST"}</button>
      {result&&<div style={{marginTop:24,padding:18,background:result.ok?"#edf9ef":"#fff0f0",border:"1px solid #ddd",whiteSpace:"pre-wrap",lineHeight:1.6}}>
        <b>{result.ok?"BERHASIL":"GAGAL"}</b><br/>{result.message||result.error}<br/>{result.emailId&&<>Email ID: {result.emailId}<br/></>}{result.to&&<>Tujuan: {result.to}<br/></>}{result.help&&<><br/><b>Petunjuk:</b> {result.help}</>}
      </div>}
      <p style={{marginTop:30,fontSize:13}}>Jika berhasil tetapi tidak terlihat, cek Spam/Junk. Jika gagal, kirim screenshot pesan merah ini kepada pembuat website.</p>
    </div>
  </main>
}
