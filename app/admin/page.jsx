"use client";

import {useEffect,useState} from "react";

export default function AdminPage(){
  const [count,setCount]=useState(0);
  useEffect(()=>{try{const x=JSON.parse(localStorage.getItem("16flames_orders")||"[]");setCount(Array.isArray(x)?x.length:0)}catch{}},[]);
  return <main className="admin-home">
    <section className="admin-home-card">
      <div className="eyebrow">16FLAMES · ADMIN</div>
      <h1>DASHBOARD TOKO</h1>
      <p>Kelola status pengiriman dan nomor resi pesanan dari perangkat yang digunakan untuk testing ini.</p>
      <div className="admin-stats"><div><span>TOTAL PESANAN</span><strong>{count}</strong></div><div><span>FITUR</span><strong>RESI</strong></div></div>
      <a className="admin-main-button" href="/admin/shipping">KELOLA PESANAN &amp; RESI →</a><button className="admin-logout" onClick={async()=>{await fetch("/api/admin/logout",{method:"POST"});window.location.href="/admin/login"}}>KELUAR ADMIN</button>
      <a className="admin-secondary" href="/">KEMBALI KE TOKO</a>
      <div className="admin-warning"><b>PENTING</b><br/>Versi ini masih menggunakan localStorage untuk testing. Jika website sudah online dan admin serta pembeli memakai perangkat berbeda, gunakan database/login agar status dan resi tersinkron ke semua perangkat.</div>
    </section>
    <style jsx>{`
      .admin-home{min-height:100vh;background:#f5f1ed;padding:40px 20px;font-family:Arial,sans-serif;color:#111;display:flex;align-items:center;justify-content:center}.admin-home-card{width:min(720px,100%);background:#fff;padding:42px;box-shadow:0 20px 70px #0001}.eyebrow{font-size:10px;letter-spacing:3px;font-weight:800;color:#777}.admin-home h1{font-size:42px;margin:10px 0}.admin-home p{color:#666;line-height:1.7;font-size:13px}.admin-stats{display:grid;grid-template-columns:1fr 1fr;background:#111;color:#fff;margin:28px 0}.admin-stats div{padding:20px;border-right:1px solid #333}.admin-stats div:last-child{border-right:0}.admin-stats span{display:block;font-size:9px;letter-spacing:2px;font-weight:800}.admin-stats strong{display:block;margin-top:7px;font-size:24px}.admin-main-button,.admin-secondary,.admin-logout{display:block;width:100%;box-sizing:border-box;text-align:center;text-decoration:none;padding:15px;margin-top:10px;font-size:10px;font-weight:900;letter-spacing:1px}.admin-main-button{background:#111;color:#fff}.admin-logout{border:0;background:#ddd;color:#111;cursor:pointer;margin-top:10px}.admin-secondary{background:#e9e5e0;color:#111}.admin-warning{margin-top:25px;padding:16px;background:#faf8f5;color:#666;font-size:11px;line-height:1.7}.admin-warning b{color:#111}@media(max-width:600px){.admin-home{padding:15px}.admin-home-card{padding:25px}.admin-home h1{font-size:32px}.admin-stats{grid-template-columns:1fr}.admin-stats div{border-right:0;border-bottom:1px solid #333}.admin-stats div:last-child{border-bottom:0}}
    `}</style>
  </main>;
}
