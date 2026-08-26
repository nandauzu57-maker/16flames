"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const moments = [
  { number: "01", title: "BORN FROM NOSTALGIA", text: "16FLAMES lahir dari energi Y2K, ketika fashion terasa lebih berani, bebas, dan penuh karakter. Kami membawa kembali semangat itu dengan sentuhan yang lebih modern." },
  { number: "02", title: "WEAR YOUR ATTITUDE", text: "Pakaian bukan sekadar apa yang kamu kenakan. Ini tentang bagaimana kamu membawa diri, menunjukkan karakter, dan berani menjadi versi dirimu sendiri." },
  { number: "03", title: "EVERY DETAIL MATTERS", text: "Dari siluet, tekstur, hingga detail kecil, setiap bagian dibuat untuk menciptakan karakter. Karena bagi 16FLAMES, gaya bukan tentang mengikuti semua orang." }
];

export default function PhilosophyPage(){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>20); window.addEventListener("scroll",onScroll); return()=>window.removeEventListener("scroll",onScroll)},[]);

  return <main className={`philosophy-page ${scrolled?"is-scrolled":""}`}>
    <Navbar active="filosofi" />

    <section className="philosophy-hero">
      <div className="philosophy-hero-copy">
        <div className="eyebrow">THE VELOURA PHILOSOPHY</div>
        <h1>WEAR YOUR<br/><em>ENERGY.</em></h1>
        <p>16FLAMES stands for the unapologetic confidence of modern girls — those who embrace being sexy, loud, soft, messy, powerful, chaotic, and gorgeous al at once.</p>
        <div className="philosophy-signature">16<em>fla</em>mes <span>EST. 2026</span></div>
      </div>
      <div className="philosophy-hero-visual">
        <div className="philosophy-orbit orbit-one"></div>
        <div className="philosophy-orbit orbit-two"></div>
        <div className="philosophy-image-frame">
          <img src="/15.jpg" alt="Veloura fashion campaign"/>
          <div className="philosophy-image-label">ICONIC ENERGY / 001</div>
        </div>
        <div className="floating-star star-one">✦</div>
        <div className="floating-star star-two">✧</div>
        <div className="floating-card">NO RULES.<br/><strong>JUST ENERGY.</strong></div>
      </div>
    </section>

    <div className="philosophy-marquee"><div> SEXY • FEARLESS • Y2K • FIERY  • 16FLAMES •  ENERGY • FEARLESS • Y2K • SEXY• 16FLAMES •</div></div>

    <section className="philosophy-intro">
      <div className="philosophy-intro-number">V / 01</div>
      <div><div className="eyebrow">WHY WE EXIST</div><h2>FASHION THAT<br/><em>FEELS ALIVE.</em></h2></div>
      <p> Sexy as Identity=Sexy is not vulgar — it’s confidence, self‑ownership, self‑expression.<strong> Every piece accentuates curves, </strong> hugs the body, and celebrates feminine heat.</p>
    </section>

    <section className="philosophy-moments">
      {moments.map((m,i)=><article className="philosophy-moment" key={m.number}>
        <div className="moment-photo"><img src={`/products/${[22,21,23][i]}.jpg`} alt={m.title}/><span>{m.number}</span></div>
        <div className="moment-copy"><div className="eyebrow">CHAPTER {m.number}</div><h3>{m.title}</h3><p>{m.text}</p><div className="moment-line"></div></div>
      </article>)}
    </section>

    <section className="philosophy-manifesto">
      <div className="manifesto-glow"></div>
      <div className="manifesto-small">OUR MANIFESTO</div>
      <h2>DON'T DRESS<br/>TO <em>FIT IN.</em></h2>
      <p>Dress for the version of you that walks into a room and changes the energy.</p>
      <div className="manifesto-badge">✦ 16FLAMES ✦<br/><small>MAKE IT YOURS</small></div>
    </section>

    <section className="philosophy-values">
      <div><div className="eyebrow">THE PROMISE</div><h2>SMALL DETAILS.<br/><em>BIG ENERGY.</em></h2></div>
      <div className="values-grid">
        <div><b>01</b><span>BE BOLD</span><p>Warna, tekstur, dan siluet yang tidak takut terlihat.</p></div>
        <div><b>02</b><span>BE YOURSELF</span><p>Mix, match, repeat. Tidak ada satu cara yang benar.</p></div>
        <div><b>03</b><span>HAVE FUN</span><p>Fashion boleh serius, tapi proses memakainya harus tetap menyenangkan.</p></div>
        <div><b>04</b><span>MAKE IT LAST</span><p>Pieces dibuat untuk kembali dipakai, bukan hanya untuk satu foto.</p></div>
      </div>
    </section>

    <section className="philosophy-final">
      <div className="final-photo"><img src="/products/4.jpg" alt="Veloura signature piece"/></div>
      <div className="final-copy"><div className="eyebrow">NOW YOU KNOW</div><h2>THE STORY<br/><em>IS YOURS.</em></h2><p>Ambil yang kamu suka. Tambahkan karakter kamu. Lalu buat 16FLAMES terasa seperti milikmu.</p><button className="black-btn" onClick={()=>window.location.href="/"}>EXPLORE THE COLLECTION</button></div>
    </section>

    <footer className="philosophy-footer"><div className="brand">16FLAMES<span>®</span></div><p>Original Y2K-inspired fashion for the modern icon.</p><button onClick={()=>window.location.href="/"}>SHOP NOW ↗</button></footer>
  </main>;
}
