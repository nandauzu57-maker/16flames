"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const facts = [
  { number: "01", title: "FOUNDED 2026", text: "16FLAMES lahir dari kecintaan pada era Y2K — dibangun oleh tim kecil yang ingin menghadirkan fashion nostalgia dengan kualitas modern." },
  { number: "02", title: "MADE FOR EVERYONE", text: "Koleksi kami dirancang untuk semua bentuk tubuh dan semua gaya, dari everyday basics sampai statement pieces." },
  { number: "03", title: "GLOBAL SHIPPING", text: "Kami mengirim ke seluruh dunia dengan checkout aman via PayPal, kartu debit/kredit, dan QRIS untuk pembayaran yang tersedia." }
];

export default function AboutPage(){
  const [scrolled,setScrolled]=useState(false);
  const [content,setContent]=useState(null);
  useEffect(()=>{fetch("/api/content",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(x=>x&&setContent(x.about)).catch(()=>{})},[]);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>20); window.addEventListener("scroll",onScroll); return()=>window.removeEventListener("scroll",onScroll)},[]);

  return <main className={`philosophy-page ${scrolled?"is-scrolled":""}`}>
    <Navbar active="about" />

    <section className="philosophy-hero">
      <div className="philosophy-hero-copy">
        <div className="eyebrow">{content?.eyebrow || "ABOUT 16FLAMES"}</div>
        <h1>{(content?.title || "WHO WE\nARE.").split("\n").map((x,i)=><span key={i}>{i>0&&<br/>}{i===1?<em>{x}</em>:x}</span>)}</h1>
        <p>{content?.text || "16FLAMES adalah brand fashion Y2K yang percaya bahwa pakaian adalah cara untuk merayakan keberanian jadi diri sendiri — velour, crystal, dan siluet nostalgia yang tetap terasa relevan hari ini."}</p>
        <div className="philosophy-signature">16FLAMES <span>EST. 2026</span></div>
      </div>
      <div className="philosophy-hero-visual">
        <div className="philosophy-orbit orbit-one"></div>
        <div className="philosophy-orbit orbit-two"></div>
        <div className="philosophy-image-frame">
          <img src={content?.heroImage || "/18.jpg"} alt="16FLAMES studio"/>
          <div className="philosophy-image-label">{content?.heroLabel || "OUR STUDIO / 001"}</div>
        </div>
        <div className="floating-star star-one">✦</div>
        <div className="floating-star star-two">✧</div>
        <div className="floating-card">MADE WITH<br/><strong>REAL PEOPLE.</strong></div>
      </div>
    </section>

    <div className="philosophy-marquee"><div>ABOUT US • OUR STORY • OUR PROMISE • 16FLAMES • ABOUT US • OUR STORY • OUR PROMISE • 16FLAMES •</div></div>

    <section className="philosophy-moments">
      {facts.map((m,i)=><article className="philosophy-moment" key={m.number}>
        <div className="moment-photo"><img src={`/products/${[40,50,60][i]}.jpg`} alt={m.title}/><span>{m.number}</span></div>
        <div className="moment-copy"><div className="eyebrow">{m.number}</div><h3>{m.title}</h3><p>{m.text}</p><div className="moment-line"></div></div>
      </article>)}
    </section>

    <section className="philosophy-manifesto">
      <div className="manifesto-glow"></div>
      <div className="manifesto-small">GOT QUESTIONS?</div>
      <h2>LET'S<br/><em>TALK.</em></h2>
      <p>Untuk pertanyaan produk, kolaborasi, atau bantuan pesanan, hubungi tim kami — kami balas secepat mungkin.</p>
      <div className="manifesto-badge">✦ HELLO ✦<br/><small>hello@16flames.com</small></div>
    </section>

    <section className="philosophy-values">
      <div><div className="eyebrow">WHY SHOP WITH US</div><h2>SIMPLE.<br/><em>SECURE.</em></h2></div>
      <div className="values-grid">
        <div><b>01</b><span>SECURE CHECKOUT</span><p>Pembayaran via PayPal, kartu, atau QRIS — aman dan cepat.</p></div>
        <div><b>02</b><span>REAL PHOTOS</span><p>Semua produk difoto asli, tidak ada gambar palsu atau AI.</p></div>
        <div><b>03</b><span>RESPONSIVE SUPPORT</span><p>Tim kami siap bantu lewat email untuk setiap pertanyaan pesanan.</p></div>
        <div><b>04</b><span>WORLDWIDE SHIPPING</span><p>Kami kirim ke banyak negara dengan estimasi ongkir transparan.</p></div>
      </div>
    </section>

    <section className="philosophy-final">
      <div className="final-photo"><img src="/products/6.jpg" alt="16FLAMES collection"/></div>
      <div className="final-copy"><div className="eyebrow">READY TO SHOP?</div><h2>JOIN THE<br/><em>MOVEMENT.</em></h2><p>Jelajahi koleksi terbaru kami dan temukan piece yang paling terasa "kamu".</p><button className="black-btn" onClick={()=>window.location.href="/"}>EXPLORE THE COLLECTION</button></div>
    </section>

    <footer className="philosophy-footer"><div className="brand">16FLAMES<span>®</span></div><p>Original Y2K-inspired fashion for the modern icon.</p><button onClick={()=>window.location.href="/"}>SHOP NOW ↗</button></footer>
  </main>;
}
