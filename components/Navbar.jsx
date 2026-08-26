"use client";

import { useState } from "react";

const currencies = [
  ["USD","USD - US Dollar","🇺🇸"], ["EUR","EUR - Euro","🇪🇺"], ["GBP","GBP - British Pound","🇬🇧"],
  ["IDR","IDR - Indonesian Rupiah","🇮🇩"], ["MYR","MYR - Malaysian Ringgit","🇲🇾"], ["SGD","SGD - Singapore Dollar","🇸🇬"],
  ["AUD","AUD - Australian Dollar","🇦🇺"], ["CAD","CAD - Canadian Dollar","🇨🇦"], ["NZD","NZD - New Zealand Dollar","🇳🇿"], ["JPY","JPY - Japanese Yen","🇯🇵"],
  ["CNY","CNY - Chinese Yuan","🇨🇳"], ["KRW","KRW - Korean Won","🇰🇷"], ["INR","INR - Indian Rupee","🇮🇳"],
  ["THB","THB - Thai Baht","🇹🇭"], ["PHP","PHP - Philippine Peso","🇵🇭"], ["CHF","CHF - Swiss Franc","🇨🇭"]
];

const countries = [
  ["US","United States","🇺🇸"], ["ID","Indonesia","🇮🇩"], ["MY","Malaysia","🇲🇾"], ["SG","Singapore","🇸🇬"],
  ["GB","United Kingdom","🇬🇧"], ["AU","Australia","🇦🇺"], ["CA","Canada","🇨🇦"], ["JP","Japan","🇯🇵"],
  ["CN","China","🇨🇳"], ["KR","South Korea","🇰🇷"], ["IN","India","🇮🇳"]
];

export default function Navbar({ active = "home", cartCount = 0, onSearch, onBag, menu: menuProp, onMenuToggle, currency = "USD", onCurrencyChange }){
  const [localMenu, setLocalMenu] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftCurrency, setDraftCurrency] = useState(currency);
  const [country, setCountry] = useState("ID");
  const [language, setLanguage] = useState("English");
  const menu = menuProp !== undefined ? menuProp : localMenu;
  const toggleMenu = onMenuToggle || (()=>setLocalMenu(m=>!m));

  function go(path){
    setLocalMenu(false);
    if (typeof window !== "undefined") window.location.href = path;
  }

  function handleBag(){
    if (onBag) { onBag(); return; }
    go("/#shop");
  }

  function handleSearch(){
    if (onSearch) { onSearch(); return; }
    go("/#shop");
  }

  function openSettings(){
    setDraftCurrency(currency);
    setSettingsOpen(true);
  }

  function saveSettings(){
    onCurrencyChange?.(draftCurrency);
    try{ localStorage.setItem("16flames_currency",draftCurrency); }catch(e){}
    setSettingsOpen(false);
  }

  const selectedCurrency = currencies.find(x=>x[0]===currency) || currencies[0];
  const selectedCountry = countries.find(x=>x[0]===country) || countries[1];

  const links = [
    { key: "home", label: "HOME", path: "/" },
    { key: "about", label: "ABOUT", path: "/about" },
    { key: "filosofi", label: "FILOSOFI", path: "/filosofi" },
    { key: "history", label: "RIWAYAT PESANAN", path: "/orders" }
  ];

  return (
    <header className="header">
      <div className="nav-top">
        <button className="mobile-menu" onClick={toggleMenu} aria-label="Open menu"><span></span><span></span><span></span></button>
        <div className="nav-tagline">TIMELESS Y2K LUXURY</div>
        <button className="mobile-brand" onClick={()=>go("/")}>✦ <span>16FLAMES</span> ✦</button>
        <div className="brand desktop-brand">✦ <span>16FLAMES</span> ✦</div>

        <div className="nav-actions">
          <button className="currency-trigger" onClick={openSettings} aria-label="Location, language and currency settings">
            <span className="currency-flag">{selectedCurrency[2]}</span>
            <span className="currency-code">{selectedCurrency[0]}</span>
            <span className="currency-chevron">⌄</span>
          </button>
          <button className="icon-bag" onClick={handleBag} aria-label="Shopping bag"><span></span><b>{cartCount}</b></button>
        </div>

        {settingsOpen && (
          <>
            <button className="locale-backdrop" aria-label="Close settings" onClick={()=>setSettingsOpen(false)}></button>
            <div className="locale-panel">
              <div className="locale-field">
                <label>Deliver to</label>
                <div className="locale-select-wrap">
                  <span>{selectedCountry[2]}</span>
                  <select value={country} onChange={e=>setCountry(e.target.value)}>
                    {countries.map(([code,name,flag])=><option key={code} value={code}>{flag}  {name}</option>)}
                  </select>
                </div>
              </div>

              <div className="locale-field">
                <label>Language</label>
                <div className="locale-select-wrap">
                  <span className="globe-icon">◎</span>
                  <select value={language} onChange={e=>setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Bahasa Indonesia</option>
                  </select>
                </div>
              </div>

              <div className="locale-field">
                <label>Currency</label>
                <div className="locale-select-wrap currency-choice">
                  <span>{currencies.find(x=>x[0]===draftCurrency)?.[2] || "🌐"}</span>
                  <select value={draftCurrency} onChange={e=>setDraftCurrency(e.target.value)}>
                    {currencies.map(([code,name])=><option key={code} value={code}>{name}</option>)}
                  </select>
                </div>
              </div>

              <button className="locale-save" onClick={saveSettings}>Save</button>
            </div>
          </>
        )}
      </div>

      <nav className={"desktop-nav "+(menu?"nav-open":"")}>
        {links.map((l,i)=>(
          <span key={l.key} style={{display:"contents"}}>
            <button className={active===l.key?"active":""} onClick={()=>go(l.path)}>{l.label}</button>
            {i < links.length-1 && <i></i>}
          </span>
        ))}
      </nav>

      <div className="mobile-brand-sub">
        <div className="mobile-logo">16FLAMES</div>
        <div className="mobile-tagline"><span>✦</span> Y2K LUXURY WEAR <span>✦</span></div>
      </div>
    </header>
  );
}
