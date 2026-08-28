"use client";

import {useEffect,useState} from "react";

<<<<<<< HEAD
const fields = [
  ["heroEyebrow","Label hero"],["heroTitle","Judul hero (2 baris, pisahkan dengan ENTER)"],["heroText","Teks hero"],["heroButton","Tombol hero"],["heroImage","URL foto hero"],
  ["editorialEyebrow","Label editorial"],["editorialTitle","Judul editorial (2 baris)"],["editorialImage","URL foto editorial"],
  ["customEyebrow","Label custom"],["customTitle","Judul custom (2 baris)"],["customText","Teks custom"],["customImage","URL foto custom"],
  ["petEyebrow","Label Home & Pet"],["petTitle","Judul Home & Pet (2 baris)"],["petImage","URL foto Home & Pet"],
  ["newsletterTitle","Judul newsletter (2 baris)"],["newsletterText","Teks newsletter"]
];

export default function AdminPage(){
  const [count,setCount]=useState(0),[maintenance,setMaintenance]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const [content,setContent]=useState(null),[saving,setSaving]=useState(false),[saved,setSaved]=useState("");
  useEffect(()=>{
    try{const x=JSON.parse(localStorage.getItem("16flames_orders")||"[]");setCount(Array.isArray(x)?x.length:0)}catch{}
    fetch("/api/admin/maintenance",{cache:"no-store"}).then(async r=>{const x=await r.json().catch(()=>({}));if(r.status===401){window.location.href="/admin/login?next=/admin";return;}if(!r.ok)throw new Error(x.error||"Gagal memuat status maintenance.");setMaintenance(Boolean(x.enabled))}).catch(e=>setMessage(e.message));
    fetch("/api/admin/content",{cache:"no-store"}).then(async r=>{if(r.status===401){window.location.href="/admin/login?next=/admin";return null}return r.ok?r.json():null}).then(x=>x&&setContent(x)).catch(e=>setSaved(e.message));
  },[]);
  async function toggleMaintenance(){
    setBusy(true);setMessage("");
    try{const r=await fetch("/api/admin/maintenance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({enabled:!maintenance})});const x=await r.json().catch(()=>({}));if(r.status===401||r.status===403){window.location.href="/admin/login?next=/admin";return;}if(!r.ok)throw new Error(x.error||"Gagal mengubah maintenance.");setMaintenance(x.enabled);setMessage(x.enabled?"Maintenance AKTIF — toko disembunyikan dari pengunjung.":"Maintenance NONAKTIF — toko kembali normal.")}catch(e){setMessage(e.message)}finally{setBusy(false)}
  }
  function change(section,key,value){setContent(c=>({...c,[section]:{...c[section],[key]:value}}))}
  async function save(){
    setSaving(true);setSaved("");
    try{const r=await fetch("/api/admin/content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(content)});const x=await r.json().catch(()=>({}));if(r.status===401||r.status===403){window.location.href="/admin/login?next=/admin";return;}if(!r.ok)throw new Error(x.error||"Gagal menyimpan.");setContent(x.content);setSaved("✓ Tersimpan. Perubahan foto/teks langsung dipakai website tanpa deploy ulang.")}catch(e){setSaved(e.message)}finally{setSaving(false)}
  }
  return <main className="admin-home"><section className="admin-home-card">
    <div className="eyebrow">16FLAMES · ADMIN</div><h1>DASHBOARD TOKO</h1><p>Kelola maintenance, foto, teks, dan produk langsung dari perangkat admin.</p>
    <div className="admin-stats"><div><span>TOTAL PESANAN</span><strong>{count}</strong></div><div><span>FITUR</span><strong>CMS + RESI</strong></div></div>
    <div className="maintenance-box"><div><span>MODE MAINTENANCE</span><strong className={maintenance?"on":"off"}>{maintenance?"ON — AKTIF":"OFF — NONAKTIF"}</strong></div><button className="maintenance-button" onClick={toggleMaintenance} disabled={busy}>{busy?"MEMPROSES...":maintenance?"MATIKAN MAINTENANCE":"AKTIFKAN MAINTENANCE"}</button>{message&&<p className="maintenance-message">{message}</p>}</div>

    {content && <div className="cms-box"><div className="cms-head"><div><span>EDITOR WEBSITE</span><h2>FOTO & TEKS</h2></div><button onClick={save} disabled={saving}>{saving?"MENYIMPAN...":"SIMPAN PERUBAHAN"}</button></div>
      <p className="cms-note">Untuk foto, masukkan <b>URL gambar</b> yang bisa dibuka publik (https://...). Hosting gambar eksternal diperlukan agar foto berubah tanpa deploy.</p>
      {[["home","HOME"],["about","ABOUT"],["philosophy","FILOSOFI"]].map(([section,label])=><div className="cms-section" key={section}><h3>{label}</h3>{section==="home"?fields.map(([key,label2])=><label key={key}>{label2}{key.toLowerCase().includes("image")?<input value={content.home[key]||""} onChange={e=>change(section,key,e.target.value)} placeholder="https://..."/>:<textarea rows={key.includes("Text")?3:2} value={content.home[key]||""} onChange={e=>change(section,key,e.target.value)}/>}</label>):[["eyebrow","Label"],["title","Judul (2 baris)"],["text","Teks"],["heroImage","URL foto hero"],["heroLabel","Label foto"]].map(([key,label2])=><label key={key}>{label2}{key==="heroImage"?<input value={content[section][key]||""} onChange={e=>change(section,key,e.target.value)} placeholder="https://..."/>:<textarea rows={key==="text"?4:2} value={content[section][key]||""} onChange={e=>change(section,key,e.target.value)}/>}</label>)}</div>)}
      <div className="cms-section"><h3>FOTO PRODUK</h3><p className="cms-note">Ganti URL foto produk di sini. Nama produk juga bisa diubah.</p>{Object.keys(content.products||{}).map(id=>{const p=content.products[id];return <div className="product-edit" key={id}><b>Produk #{id}</b><input value={p.name||""} placeholder="Nama produk" onChange={e=>change("products",id,{...p,name:e.target.value})}/><input value={p.image||""} placeholder="https://... URL foto" onChange={e=>change("products",id,{...p,image:e.target.value})}/></div>})}</div>
      {saved&&<div className="save-result">{saved}</div>}
    </div>}

    <a className="admin-main-button" href="/admin/shipping">KELOLA PESANAN &amp; RESI →</a><button className="admin-logout" onClick={async()=>{await fetch("/api/admin/logout",{method:"POST"});window.location.href="/admin/login"}}>KELUAR ADMIN</button><a className="admin-secondary" href="/">KEMBALI KE TOKO</a>
    <div className="admin-warning"><b>PENTING</b><br/>Foto yang ingin diubah tanpa deploy harus berada di hosting gambar publik. Jangan masukkan API key, password, atau secret ke kolom editor.</div>
  </section><style jsx>{`
.admin-home{min-height:100vh;background:#f5f1ed;padding:40px 20px;font-family:Arial,sans-serif;color:#111;display:flex;align-items:flex-start;justify-content:center}.admin-home-card{width:min(860px,100%);background:#fff;padding:42px;box-shadow:0 20px 70px #0001}.eyebrow{font-size:10px;letter-spacing:3px;font-weight:800;color:#777}.admin-home h1{font-size:42px;margin:10px 0}.admin-home p{color:#666;line-height:1.7;font-size:13px}.admin-stats{display:grid;grid-template-columns:1fr 1fr;background:#111;color:#fff;margin:28px 0}.admin-stats div{padding:20px;border-right:1px solid #333}.admin-stats div:last-child{border-right:0}.admin-stats span{display:block;font-size:9px;letter-spacing:2px;font-weight:800}.admin-stats strong{display:block;margin-top:7px;font-size:24px}.maintenance-box{margin:22px 0;padding:18px;border:1px solid #ddd;background:#fafafa}.maintenance-box span{display:block;font-size:9px;letter-spacing:2px;font-weight:800}.maintenance-box strong{display:block;margin:7px 0 14px;font-size:18px}.maintenance-box .on{color:#b00020}.maintenance-box .off{color:#111}.maintenance-button,.cms-head button{width:100%;padding:14px;border:0;background:#111;color:#fff;font-size:10px;font-weight:900;letter-spacing:1px;cursor:pointer}.maintenance-button:disabled,.cms-head button:disabled{opacity:.55}.maintenance-message,.save-result{font-size:11px!important;margin:10px 0 0!important;color:#333!important}.cms-box{border:1px solid #ddd;margin:24px 0;padding:20px;background:#fafafa}.cms-head{display:flex;align-items:center;justify-content:space-between;gap:15px}.cms-head span{font-size:9px;letter-spacing:2px;font-weight:800}.cms-head h2{margin:6px 0 0;font-size:25px}.cms-head button{width:auto;min-width:180px}.cms-note{font-size:11px!important}.cms-section{border-top:1px solid #ddd;padding:20px 0}.cms-section h3{font-size:12px;letter-spacing:2px;margin:0 0 15px}.cms-section label{display:block;font-size:10px;font-weight:800;letter-spacing:.5px;margin:12px 0}.cms-section input,.cms-section textarea,.product-edit input{display:block;width:100%;box-sizing:border-box;margin-top:6px;border:1px solid #ccc;background:#fff;padding:11px;font:inherit;font-size:12px;outline:none}.cms-section textarea{resize:vertical}.product-edit{display:grid;grid-template-columns:100px 1fr 1.5fr;gap:8px;align-items:center;margin:8px 0}.product-edit b{font-size:10px}.save-result{padding:12px;background:#eee;margin-top:15px!important}.admin-main-button,.admin-secondary,.admin-logout{display:block;width:100%;box-sizing:border-box;text-align:center;text-decoration:none;padding:15px;margin-top:10px;font-size:10px;font-weight:900;letter-spacing:1px}.admin-main-button{background:#111;color:#fff}.admin-logout{border:0;background:#ddd;color:#111;cursor:pointer}.admin-secondary{background:#e9e5e0;color:#111}.admin-warning{margin-top:25px;padding:16px;background:#faf8f5;color:#666;font-size:11px;line-height:1.7}.admin-warning b{color:#111}@media(max-width:600px){.admin-home{padding:15px}.admin-home-card{padding:25px}.admin-home h1{font-size:32px}.admin-stats{grid-template-columns:1fr}.admin-stats div{border-right:0;border-bottom:1px solid #333}.cms-head{display:block}.cms-head button{width:100%;margin-top:15px}.product-edit{grid-template-columns:1fr}.product-edit b{margin-top:8px}}
`}</style></main>;
=======
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
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
}
