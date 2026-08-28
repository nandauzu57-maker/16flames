 "use client";

import { useEffect, useMemo, useState } from "react";
import PayPalCheckout from "../components/PayPalCheckout";
import ManualPayment from "../components/ManualPayment";
import DirectVAPayment from "../components/DirectVAPayment";
import MalaysiaPayment from "../components/MalaysiaPayment";
import Navbar from "../components/Navbar";
import { normalizeShipping, getShippingRoute } from "../lib/shipping";

const DEFAULT_PRODUCTS = [
  {id:1,name:"Velour Zip Hoodie",price:89,category:"Tracksuits",color:"Pink",colors:["Pink","Black","Baby Blue"],sizes:["XS","S","M","L","XL","2XL"],sizeType:"apparel",badge:"BEST SELLER",art:"hoodie",material:"Velour",fit:"Oversized",stock:18,image:"/products/1.jpg"},
  {id:2,name:"Heritage Velour Pant",price:79,category:"Tracksuits",color:"Black",colors:["Black","Pink","Grey"],sizes:["XS","S","M","L","XL","2XL"],sizeType:"bottom",badge:"NEW",art:"pants",material:"Velour",fit:"Relaxed",stock:24,image:"/products/2.jpg"},
  {id:3,name:"Bling Baby Tee",price:49,category:"Tops",color:"White",colors:["White","Pink","Black"],sizes:["XS","S","M","L","XL"],sizeType:"apparel",badge:"",art:"tee",material:"Cotton jersey",fit:"Fitted",stock:32,image:"/products/3.jpg"},
  {id:4,name:"Butterfly Zip Jacket",price:99,category:"Jackets",color:"Blue",colors:["Blue","Pink","Black"],sizes:["XS","S","M","L","XL","2XL"],sizeType:"apparel",badge:"NEW",art:"jacket",material:"Poly blend",fit:"Regular",stock:12,image:"/products/4.jpg"},
  {id:5,name:"Crystal Shoulder Bag",price:79,category:"Bags",color:"Silver",colors:["Silver","Pink","Black"],sizes:["OS"],sizeType:"one-size",badge:"",art:"bag",material:"Faux leather",fit:"One size",stock:14,image:"/products/5.jpg"},
  {id:6,name:"Glossy Mini Bag",price:69,category:"Bags",color:"Pink",colors:["Pink","White","Black"],sizes:["OS"],sizeType:"one-size",badge:"BEST SELLER",art:"mini",material:"Vegan leather",fit:"One size",stock:21,image:"/products/6.jpg"},
  {id:7,name:"Charm Necklace",price:39,category:"Jewelry",color:"Gold",colors:["Gold","Silver"],sizes:["OS"],sizeType:"one-size",badge:"",art:"necklace",material:"Stainless steel",fit:"Adjustable",stock:40,image:"/products/7.jpg"},
  {id:8,name:"Crystal Hoops",price:35,category:"Jewelry",color:"Silver",colors:["Silver","Gold"],sizes:["OS"],sizeType:"one-size",badge:"NEW",art:"hoops",material:"Stainless steel",fit:"One size",stock:35,image:"/products/8.jpg"},
  {id:9,name:"Cloud Mini Skirt",price:59,category:"Bottoms",color:"Cream",colors:["Cream","Pink","Black"],sizes:["XS","S","M","L","XL"],sizeType:"bottom",badge:"",art:"skirt",material:"Cotton blend",fit:"A-line",stock:19,image:"/products/9.jpg"},
  {id:10,name:"Soft Logo Hoodie",price:85,category:"Tops",color:"Grey",colors:["Grey","Black","Pink"],sizes:["XS","S","M","L","XL","2XL","3XL"],sizeType:"apparel",badge:"",art:"hoodie2",material:"Cotton fleece",fit:"Oversized",stock:16,image:"/products/10.jpg"},
  {id:11,name:"Dream Velour Short",price:55,category:"Bottoms",color:"Pink",colors:["Pink","Black","Cream"],sizes:["XS","S","M","L","XL"],sizeType:"bottom",badge:"",art:"short",material:"Velour",fit:"Relaxed",stock:22,image:"/products/11.jpg"},
  {id:12,name:"Star Charm Bracelet",price:42,category:"Jewelry",color:"Gold",colors:["Gold","Silver"],sizes:["OS"],sizeType:"one-size",badge:"",art:"bracelet",material:"Stainless steel",fit:"Adjustable",stock:31,image:"/products/12.jpg"},
  {id:13,name:"Cloud Runner Sneakers",price:109,category:"Shoes",color:"White",colors:["White","Pink","Black"],sizes:["36","37","38","39","40","41","42","43","44"],sizeType:"shoes",badge:"NEW",art:"shoe",material:"Mesh + rubber",fit:"True to size",stock:15,image:"/products/13.jpg"},
  {id:14,name:"Logo Slide Sandals",price:59,category:"Shoes",color:"Pink",colors:["Pink","Black","Cream"],sizes:["36","37","38","39","40","41","42"],sizeType:"shoes",badge:"",art:"shoe2",material:"EVA",fit:"Relaxed",stock:20,image:"/products/14.jpg"},
  {id:15,name:"T-SHIRT WHITE",price:32,category:"T-SHIRT",color:"White",colors:["White","Black"],sizes:["S","M","L","XL","XXL"],sizeType:"apparel",badge:"NEW",art:"tee",material:"Cotton jersey",fit:"Regular",stock:10,image:"/products/3.jpg"}
];

const CATEGORIES = ["NEW","TRACKSUITS","T-SHIRT","CLOTHING","BAGS","JEWELRY","PERFUME","HOME & PET","SHOES","SALE"];

// ================= PHOTO SETTINGS =================
// Ganti file ini saja untuk mengganti foto banner utama.
// Letakkan foto kamu di: public/hero.jpg
const HERO_IMAGE = "/hero.jpg"; // fallback; editable from Admin
// ==================================================


const COUNTRY_CURRENCY = {
  US:"USD", CA:"CAD", GB:"GBP", AU:"AUD", NZ:"NZD", SG:"SGD",
  ID:"IDR", MY:"MYR", JP:"JPY", CN:"CNY", KR:"KRW", IN:"INR",
  TH:"THB", PH:"PHP", CH:"CHF", DE:"EUR", FR:"EUR", IT:"EUR",
  ES:"EUR", NL:"EUR", BE:"EUR", AT:"EUR", IE:"EUR", PT:"EUR"
};

const CURRENCY_INFO = {
  USD:{rate:1,symbol:"$",locale:"en-US",digits:2},
  EUR:{rate:.91,symbol:"€",locale:"de-DE",digits:2},
  GBP:{rate:.77,symbol:"£",locale:"en-GB",digits:2},
  CAD:{rate:1.37,symbol:"CA$",locale:"en-CA",digits:2},
  AUD:{rate:1.53,symbol:"A$",locale:"en-AU",digits:2},
  NZD:{rate:1.68,symbol:"NZ$",locale:"en-NZ",digits:2},
  SGD:{rate:1.35,symbol:"S$",locale:"en-SG",digits:2},
  MYR:{rate:4.70,symbol:"RM",locale:"ms-MY",digits:2},
  IDR:{rate:15500,symbol:"Rp",locale:"id-ID",digits:0},
  JPY:{rate:148,symbol:"¥",locale:"ja-JP",digits:0},
  CNY:{rate:7.20,symbol:"CN¥",locale:"zh-CN",digits:2},
  KRW:{rate:1380,symbol:"₩",locale:"ko-KR",digits:0},
  INR:{rate:84,symbol:"₹",locale:"en-IN",digits:2},
  THB:{rate:35,symbol:"฿",locale:"th-TH",digits:2},
  PHP:{rate:57,symbol:"₱",locale:"en-PH",digits:2},
  CHF:{rate:.88,symbol:"CHF ",locale:"de-CH",digits:2}
};

function money(n,currency){
  const info=CURRENCY_INFO[currency] || CURRENCY_INFO.USD;
  const value=n*info.rate;
  return info.symbol + value.toLocaleString(info.locale,{minimumFractionDigits:info.digits,maximumFractionDigits:info.digits});
}

function currencyForCountry(countryCode){
  return COUNTRY_CURRENCY[countryCode] || "USD";
}

function Art({type,image}){
  const fallback = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="100%" height="100%" fill="#f4edf0"/><text x="50%" y="47%" text-anchor="middle" font-family="Arial" font-size="34" font-weight="700" fill="#111">PHOTO SLOT</text><text x="50%" y="52%" text-anchor="middle" font-family="Arial" font-size="20" fill="#777">Replace this image</text></svg>`);
  return <div className={"art art-"+type}>
    <img src={image} alt="Product photo" loading="lazy" onError={e=>{e.currentTarget.src=fallback}} />
    <div className="photo-slot-label">PHOTO SLOT</div>
    <div className="photo-shine"></div>
  </div>
}

export default function Home(){
  const [currency,setCurrency]=useState("USD");
  const [siteContent,setSiteContent]=useState(null);
  const [products,setProducts]=useState(DEFAULT_PRODUCTS);
  const [category,setCategory]=useState("ALL");
  const [search,setSearch]=useState("");
  const [menu,setMenu]=useState(false);
  const [cart,setCart]=useState([]);
  // Inventory is intentionally session-only for this demo/testing store.
  // Old localStorage values could make products appear SOLD OUT after edits or refreshes.
  const [inventory,setInventory]=useState(()=>Object.fromEntries(DEFAULT_PRODUCTS.map(p=>[p.id,p.stock])));
  const [wishlist,setWishlist]=useState([]);
  const [drawer,setDrawer]=useState(false);
  const [quick,setQuick]=useState(null);
  const [toast,setToast]=useState("");
  const [newsletter,setNewsletter]=useState("");
  const [emailDone,setEmailDone]=useState(false);
  const [checkoutOpen,setCheckoutOpen]=useState(false);
  const [sizeGuide,setSizeGuide]=useState(false);
  const [productType,setProductType]=useState("ALL");
  const [availability,setAvailability]=useState("ALL");
  const [priceFilter,setPriceFilter]=useState("ALL");
  const [sizeFilter,setSizeFilter]=useState("");
  const [filterOpen,setFilterOpen]=useState(false);
  const [shipping,setShipping]=useState({full_name:"",email:"",address_line_1:"",address_line_2:"",city:"",state:"",postal_code:"",country_code:"US",fulfillment_origin:"Indonesia"});

  useEffect(()=>{ if(toast){const t=setTimeout(()=>setToast(""),1800);return()=>clearTimeout(t)}},[toast]);
  useEffect(()=>{
    fetch("/api/content",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return;
      setSiteContent(data);
      if(data.products){
        setProducts(DEFAULT_PRODUCTS.map(p=>({ ...p, ...(data.products[String(p.id)]||{}) })));
      }
    }).catch(()=>{});
  },[]);
  useEffect(()=>{
    try{
      const saved=localStorage.getItem("16flames_currency");
      if(saved && CURRENCY_INFO[saved]) setCurrency(saved);
      else setCurrency(currencyForCountry(shipping.country_code));
    }catch(e){ setCurrency(currencyForCountry(shipping.country_code)); }
  },[]);

  // Currency can be changed manually from the navbar.
  // Selecting a shipping country sets its default currency, but does not lock the selector.

  const priceRanges=[
    {id:"under",min:0,max:28,label:"Under"},
    {id:"low",min:28,max:34,label:"Low"},
    {id:"mid",min:34,max:40,label:"Mid"},
    {id:"high",min:40,max:Infinity,label:"High"}
  ];

  const filtered=useMemo(()=>products.filter((p,index)=>{
    const catOk=category==="ALL" || category==="NEW" && p.badge==="NEW" || category==="SALE" && p.price<70 || category===p.category.toUpperCase();
    const typeOk=productType==="ALL" || productType==="FEATURED" && (p.badge==="NEW" || index<6);
    const availabilityOk=availability==="ALL" || (inventory[p.id] ?? p.stock) > 0;
    const range=priceRanges.find(x=>x.id===priceFilter);
    const priceOk=priceFilter==="ALL" || (range && p.price>=range.min && p.price<range.max);
    const sizeOk=!sizeFilter || p.sizes.includes(sizeFilter);
    return catOk && typeOk && availabilityOk && priceOk && sizeOk && p.name.toLowerCase().includes(search.toLowerCase());
  }),[products,category,search,productType,availability,priceFilter,sizeFilter,inventory]);

  const activeFilterCount=[productType!=="ALL",availability!=="ALL",priceFilter!=="ALL",!!sizeFilter].filter(Boolean).length;
  const idr=currency==="IDR";
  const priceLabels=idr
    ? ["Under Rp 450,000","Rp 450,000 - Rp 550,000","Rp 550,000 - Rp 650,000","Rp 650,000 +"]
    : ["Under "+money(28,currency),money(28,currency)+" - "+money(34,currency),money(34,currency)+" - "+money(40,currency),money(40,currency)+" +"];

  const total=cart.reduce((s,x)=>s+x.product.price*x.qty,0);
  // Product catalog prices are stored in USD. Convert once for every displayed/charged currency.
  const payableTotal=Math.round(total * (CURRENCY_INFO[currency]?.rate || 1) * 100) / 100;
  const cartCount=cart.reduce((s,x)=>s+x.qty,0);

  function stockOf(product){ return inventory[product.id] ?? product.stock; }

  function add(product,size=product.sizes[0]){
    const available=stockOf(product);
    if(available<=0){ setToast(product.name+" is SOLD OUT"); return; }
    setInventory(old=>({...old,[product.id]:(old[product.id] ?? product.stock)-1}));
    setCart(old=>{
      const found=old.find(x=>x.product.id===product.id&&x.size===size);
      if(found) return old.map(x=>x===found?{...x,qty:x.qty+1}:x);
      return [...old,{product,size,qty:1}];
    });
    setToast(product.name+" added to bag");
  }
  function changeQty(index,delta){
    setCart(old=>{
      const item=old[index];
      if(!item) return old;
      if(delta>0){
        const available=stockOf(item.product);
        if(available<=0){ setToast(item.product.name+" is SOLD OUT"); return old; }
        setInventory(inv=>({...inv,[item.product.id]:available-1}));
        return old.map((x,i)=>i===index?{...x,qty:x.qty+1}:x);
      }
      if(item.qty<=1) return old;
      setInventory(inv=>({...inv,[item.product.id]:stockOf(item.product)+1}));
      return old.map((x,i)=>i===index?{...x,qty:x.qty-1}:x);
    });
  }
  function removeItem(index){
    setCart(old=>{
      const item=old[index];
      if(item) setInventory(inv=>({...inv,[item.product.id]:stockOf(item.product)+item.qty}));
      return old.filter((_,i)=>i!==index);
    });
  }
  function selectCategory(c){
    setCategory(c==="ALL"?"ALL":c);
    setMenu(false);
    document.getElementById("shop")?.scrollIntoView({behavior:"smooth"});
  }

  return <div>
    {toast && <div className="toast">{toast}</div>}

    <div className="promo">TOTAL PEMBAYARAN = TOTAL HARGA PRODUK &nbsp; • &nbsp; 15% OFF FIRST ORDER</div>

    <Navbar
      active="home"
      cartCount={cartCount}
      currency={currency}
      onCurrencyChange={(nextCurrency)=>{setCurrency(nextCurrency);try{localStorage.setItem("16flames_currency",nextCurrency)}catch(e){}}}
      menu={menu}
      onMenuToggle={()=>setMenu(!menu)}
      onSearch={()=>{setMenu(false);document.getElementById("search")?.focus();document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}
      onBag={()=>{setMenu(false);setDrawer(true)}}
    />

    <div className="mobile-category-bar">
      <button className={category==="ALL"?"selected":""} onClick={()=>selectCategory("ALL")}>ALL</button><i></i>
      <button className={category==="NEW"?"selected":""} onClick={()=>selectCategory("NEW")}>NEW</button><i></i>
    </div>

    <section className="hero-main">
      <div className="hero-copy">
        <div className="eyebrow">{siteContent?.home?.heroEyebrow || "THE NEW Y2K ERA"}</div>
        <h1>{(siteContent?.home?.heroTitle || "ICONIC\nENERGY.").split("\n").map((x,i)=><span key={i}>{i>0&&<br/>}{i===1?<em>{x}</em>:x}</span>)}</h1>
        <p>{siteContent?.home?.heroText || "The name 16FLAMES now functions purely as a brand identity — short, memorable, punchy, and modern. It represents a girl who stands out, owns her style, and expresses herself without limits."}</p>
        <button className="black-btn" onClick={()=>selectCategory("NEW")}>{siteContent?.home?.heroButton || "SHOP NEW ARRIVALS"}</button>
      </div>
      <div className="hero-model">
        <img
          src={siteContent?.home?.heroImage || HERO_IMAGE}
          alt="Fashion campaign"
          onError={(e) => {
            e.currentTarget.src = "/products/1.jpg";
          }}
        />
        <div className="hero-gradient"></div>
        <div className="hero-sticker">15%<br/><small>OFF</small></div>
      </div>
    </section>

    <section className="split-banner">
      <div className="split-image split-one"><div>TRACKSUIT<br/><b>HEADLINER</b></div></div>
      <div className="split-image split-two"><div>EVERYDAY<br/><b>ICON</b></div></div>
    </section>

    <section className="feature-strip">
      <div><strong>NO SHIPPING FEE</strong><span>Harga produk = total pembayaran</span></div>
      <div><strong>SECURE CHECKOUT</strong><span>PayPal & international payments</span></div>
      <div><strong>WORLDWIDE</strong><span>International delivery</span></div>
      <div><strong>RETURNS</strong><span>30 day returns</span></div>
    </section>

    <section className="shop" id="shop">
     <div className="page-nudge-note"></div>
      <div className="shop-title">
        <div><div className="eyebrow">SHOP THE EDIT</div><h2>THE MATCHMAKER</h2></div>
        <div className="searchbox"><input id="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search the collection..."/><span>⌕</span></div>
      </div>
      <div className="category-tabs">
        {[
          ["ALL","ALL"],
          ["NEWS","NEW"]
        ].map(([label,value])=><button className={category===value?"selected":""} key={value} onClick={()=>selectCategory(value)}>{label}</button>)}
      </div>

      <div className="catalog-layout">
        <button className="mobile-filter-toggle" onClick={()=>setFilterOpen(!filterOpen)}>
          {filterOpen?"CLOSE FILTERS":"FILTER & SEARCH"} {activeFilterCount>0 && <span>{activeFilterCount}</span>}
        </button>

        <aside className={"catalog-filters "+(filterOpen?"filter-open":"")}>
          <div className="filter-search">
            <span>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search"/>
          </div>

          <div className="filter-section">
            <div className="filter-heading">Product Type <button onClick={()=>setProductType(productType==="ALL"?"FEATURED":"ALL")}>⌃</button></div>
            <label><input type="radio" name="productType" checked={productType==="ALL"} onChange={()=>setProductType("ALL")}/> <span>All Products</span></label>
            <label><input type="radio" name="productType" checked={productType==="FEATURED"} onChange={()=>setProductType("FEATURED")}/> <span>Featured Products</span></label>
          </div>

          <div className="filter-section">
            <div className="filter-heading">Availability <button onClick={()=>setAvailability(availability==="ALL"?"IN":"ALL")}>⌃</button></div>
            <label><input type="radio" name="availability" checked={availability==="ALL"} onChange={()=>setAvailability("ALL")}/> <span>All</span></label>
            <label><input type="radio" name="availability" checked={availability==="IN"} onChange={()=>setAvailability("IN")}/> <span>In Stock</span></label>
          </div>

          <div className="filter-section">
            <div className="filter-heading">Price <button onClick={()=>setPriceFilter(priceFilter==="ALL"?"under":"ALL")}>⌃</button></div>
            {priceRanges.map((range,i)=><label key={range.id}><input type="radio" name="price" checked={priceFilter===range.id} onChange={()=>setPriceFilter(range.id)}/> <span>{priceLabels[i]}</span></label>)}
            <label><input type="radio" name="price" checked={priceFilter==="ALL"} onChange={()=>setPriceFilter("ALL")}/> <span>All Prices</span></label>
          </div>

          <div className="filter-section filter-size">
            <div className="filter-heading">Size <button onClick={()=>setSizeFilter("")}>⌃</button></div>
            <div className="size-options">
              {["S","M","L","XL","XXL"].map(s=><button key={s} className={sizeFilter===s?"active":""} onClick={()=>setSizeFilter(sizeFilter===s?"":s)}>{s}</button>)}
            </div>
          </div>

          {activeFilterCount>0 && <button className="clear-filters" onClick={()=>{setProductType("ALL");setAvailability("ALL");setPriceFilter("ALL");setSizeFilter("");}}>CLEAR ALL FILTERS</button>}
        </aside>

        <div className="catalog-results">
          <div className="active-filter-bar">
            <span>{filtered.length} PRODUCTS</span>
            {priceFilter!=="ALL" && <button onClick={()=>setPriceFilter("ALL")}>{priceLabels[priceRanges.findIndex(x=>x.id===priceFilter)]} ×</button>}
            {sizeFilter && <button onClick={()=>setSizeFilter("")}>Size {sizeFilter} ×</button>}
            {productType==="FEATURED" && <button onClick={()=>setProductType("ALL")}>Featured Products ×</button>}
          </div>
          <div className="products">
        {filtered.map(p=>{
          const stock=stockOf(p);
          const soldOut=stock<=0;
          return <article className={"product-card "+(soldOut?"is-sold-out":"")} key={p.id}>
          <div className="product-art">
            {soldOut?<span className="badge sold-out-badge">SOLD OUT</span>:p.badge&&<span className="badge">{p.badge}</span>}
            <button className="wish" onClick={()=>setWishlist(w=>w.includes(p.id)?w.filter(x=>x!==p.id):[...w,p.id])}>{wishlist.includes(p.id)?"♥":"♡"}</button>
            <Art type={p.art} image={p.image}/>
            {!soldOut&&<button className="quick" onClick={()=>setQuick(p)}>QUICK VIEW</button>}
            {soldOut&&<div className="sold-out-overlay">SOLD OUT</div>}
          </div>
          <div className="product-meta">
            <h3>{p.name}</h3>
            <div className="price">{money(p.price,currency)}</div>
            <div className="meta-line"><span>{p.color}</span><span>{soldOut?"OUT OF STOCK":p.sizes.join(" / ")}</span></div>
            <button className="add-btn" disabled={soldOut} onClick={()=>p.sizeType==="one-size"?add(p,"OS"):setQuick(p)}>{soldOut?"SOLD OUT":p.sizeType==="one-size"?"ADD TO BAG":"CHOOSE SIZE"}</button>
          </div>
        </article>})}
          </div>
        </div>
      </div>
    </section>

    <section className="editorial">
      <div className="editorial-photo">
  <img
          src={siteContent?.home?.editorialImage || "/editorial.jpg"}
          alt="Fashion editorial"
          onError={(e) => {
            e.currentTarget.src = "/products/3.jpg";
          }}
        />
  <div className="scribble"><br/></div>
</div>
      <div className="editorial-copy"><div className="eyebrow">{siteContent?.home?.editorialEyebrow || "THE NEW COLLECTION"}</div><h2>{(siteContent?.home?.editorialTitle || "MADE TO\nSHINE.").split("\n").map((x,i)=><span key={i}>{i>0&&<br/>}{i===1?<em>{x}</em>:x}</span>)}</h2><p></p><button className="outline-btn" onClick={()=>selectCategory("JEWELRY")}>SHOP </button></div>
    </section>

    <section className="customizer">
      <div className="custom-copy"><div className="eyebrow">{siteContent?.home?.customEyebrow || "MAKE IT YOURS"}</div><h2>{(siteContent?.home?.customTitle || "THE BLING\nMATCHMAKER").split("\n").map((x,i)=><span key={i}>{i>0&&<br/>}{i===1?<em>{x}</em>:x}</span>)}</h2><p>{siteContent?.home?.customText || "Pick a silhouette, choose your size and create your own signature look."}</p><button className="black-btn" onClick={()=>setToast("Customizer demo opened")}>START CUSTOMIZING</button></div>
      <div className="custom-card photo-card"><img src={siteContent?.home?.customImage || "/customizer.jpg"} alt="16FLAMES custom collection" onError={(e)=>{e.currentTarget.src="/hero.jpg"}} /></div>
    </section>

    <section className="pet-home">
      <div><div className="eyebrow">{siteContent?.home?.petEyebrow || "HOME & PET"}</div><h2>{(siteContent?.home?.petTitle || "CUTE THINGS\nLIVE HERE.").split("\n").map((x,i)=><span key={i}>{i>0&&<br/>}{i===1?<em>{x}</em>:x}</span>)}</h2><p></p><button className="outline-btn" onClick={()=>setToast("Home & Pet collection demo")}>SHOP HOME & PET</button></div>
      <div className="pet-art photo-card"><img src={siteContent?.home?.petImage || "/home-pet.jpg"} alt="16FLAMES lifestyle collection" onError={(e)=>{e.currentTarget.src="/editorial.jpg"}} /></div>
    </section>

    <section className="instagram">
      <div className="eyebrow">FOLLOW THE FEED</div><h2>SHOP OUR INSTAGRAM</h2>
      <div className="insta-grid">{[
        "/hero.jpg",
        "/customizer.jpg",
        "/editorial.jpg",
        "/15.jpg",
        "/customizer.jpg",
        "/18.jpg"
      ].map((src,i)=><div className="insta" key={i}><img src={src} alt={`16FLAMES collection ${i+1}`} /></div>)}</div>
    </section>

    <section className="newsletter">
      <div><div className="eyebrow">JOIN THE CLUB</div><h2>{(siteContent?.home?.newsletterTitle || "GET 15% OFF\nYOUR FIRST ORDER.").split("\n").map((x,i)=><span key={i}>{i>0&&<br/>}{x}</span>)}</h2><p>{siteContent?.home?.newsletterText || "Sign up for new drops, exclusive offers and all things 16FLAMES"}</p></div>
      <div className="signup">{emailDone?<strong>You're on the list ✦</strong>:<><input value={newsletter} onChange={e=>setNewsletter(e.target.value)} placeholder="Email address"/><button onClick={()=>newsletter.includes("@")?setEmailDone(true):setToast("Enter a valid email")}>SIGN ME UP</button></>}</div>
    </section>

    <section className="payment-showcase">
      <div className="payment-showcase-title">PAYMENT METHODS</div>
      <div className="payment-showcase-line"></div>
      <div className="payment-showcase-grid">
        <div className="payment-showcase-item"><span className="payment-icon visa-showcase">VISA</span><b>Visa</b></div>
        <div className="payment-showcase-item"><span className="payment-icon mc-showcase"><i></i><i></i></span><b>Mastercard</b></div>
        <div className="payment-showcase-item"><span className="payment-icon amex-showcase">AMEX</span><b>American Express</b></div>
        <div className="payment-showcase-item"><span className="payment-icon paypal-showcase">P</span><b>PayPal</b></div>
        <div className="payment-showcase-item"><span className="payment-icon apple-showcase"></span><b>Apple Pay</b></div>
        <div className="payment-showcase-item"><span className="payment-icon google-showcase">G</span><b>Google Pay</b></div>
        <div className="payment-showcase-item"><span className="payment-icon qris-showcase">QRIS</span><b>QRIS</b></div>
      </div>
      <p className="payment-showcase-note">Available payment options may vary by country, currency, account and device.</p>

      <div className="shipment-showcase">
        <div className="shipment-showcase-title">SHIPMENT METHOD</div>
        <div className="shipment-showcase-line"></div>
        <div className="shipment-showcase-grid">
          <div className="shipment-showcase-item">
            <span className="shipment-jne-logo">JNE<small>EXPRESS</small></span>
            <b>JNE Express</b>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div className="footer-brand"><div className="brand">16FLAMES<span>®</span></div><p>Original Y2K-inspired fashion for the modern icon.</p><div className="social">◎ &nbsp; ◉ &nbsp; ♡ &nbsp; ✦</div></div>
      <div><b>SHOP</b><a>New Arrivals</a><a>Top pants</a><a>Clothing</a><a></a><a></a></div>
      <div><b>HELP</b><a>Shipping</a><a>Returns</a><a>Size Guide</a><a>Contact Us</a><a>FAQ</a></div>
      <div><b>ABOUT</b><a onClick={()=>window.location.href="/about"}>About Us</a><a onClick={()=>window.location.href="/filosofi"}>Our Philosophy</a><a onClick={()=>window.location.href="/"}>Home</a><a>Privacy</a><a>Terms</a></div>
    </footer>

    {drawer && <div className="drawer-overlay cart-overlay" onClick={()=>setDrawer(false)}>
      <aside className="drawer cart-drawer" onClick={e=>e.stopPropagation()}>
        <div className="cart-page-head">
          <h2>YOUR CART ({cartCount})</h2>
          <button aria-label="Close cart" onClick={()=>setDrawer(false)}>×</button>
        </div>

        {cart.length===0 ? (
          <div className="empty-cart"><div>♡</div><p>Your cart is empty.</p><button className="black-btn" onClick={()=>{setDrawer(false);selectCategory("ALL")}}>CONTINUE SHOPPING</button></div>
        ) : (
          <div className="cart-layout">
            <section className="cart-main">
              <div className="free-shipping-note">
                TOTAL PEMBAYARAN SAMA DENGAN TOTAL HARGA PRODUK.
              </div>

              <div className="cart-items">
                {cart.map((x,i)=>(
                  <div className="cart-row" key={i}>
                    <div className="cart-product-image">
                      <Art type={x.product.art} image={x.product.image}/>
                    </div>
                    <div className="cart-info">
                      <div className="cart-product-copy">
                        <b>{x.product.name}</b>
                        <span>STYLE: 16flames{x.product.id}</span>
                        <span>COLOR: {x.product.color || "PINK"}</span>
                        <span>SIZE: {x.size}</span>
                        <strong className="cart-item-price">{money(x.product.price*x.qty,currency)}</strong>
                      </div>
                      <div className="cart-controls">
                        <div className="qty cart-qty">
                          <button aria-label="Decrease quantity" onClick={()=>changeQty(i,-1)}>−</button>
                          <span>{x.qty}</span>
                          <button aria-label="Increase quantity" onClick={()=>changeQty(i,1)}>+</button>
                        </div>
                        <button className="remove-cart" onClick={()=>removeItem(i)} aria-label="Remove item">×</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="continue-shopping" onClick={()=>setDrawer(false)}>CONTINUE SHOPPING</button>
            </section>

            <aside className="cart-summary">
              <h3>ORDER SUMMARY</h3>
              <div className="summary-line"><span>SUBTOTAL</span><strong>{money(total,currency)}</strong></div>
              
              <div className="summary-total"><span>ESTIMATED TOTAL</span><strong>{money(total,currency)}</strong></div>
              <button className="checkout-btn cart-checkout" onClick={()=>{setDrawer(false);setCheckoutOpen(true)}}>CHECKOUT & PAY</button>
              <div className="payment-label">WE ACCEPT</div>
              <div className="payment-badges">
                <span>VISA</span><span>MC</span><span>AMEX</span><span>PayPal</span><span> Pay</span>
              </div>
            </aside>
          </div>
        )}
      </aside>
    </div>}


    {checkoutOpen && <div className="quick-overlay checkout-overlay" onClick={()=>setCheckoutOpen(false)}><div className="checkout-modal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>setCheckoutOpen(false)}>×</button>
      <div className="eyebrow">SECURE GLOBAL CHECKOUT</div>
      <h2>PAY FOR YOUR ORDER</h2>
      <p className="checkout-intro">Global checkout with PayPal, credit/debit cards and eligible alternative wallets. Payment options depend on your merchant account and the buyer's country/device.</p>
      <div className="checkout-address">
        <div className="checkout-section-title">SHIPPING ADDRESS</div>
        <div className="address-grid"><input placeholder="Full name" value={shipping.full_name} onChange={e=>setShipping({...shipping,full_name:e.target.value})}/><input type="email" placeholder="Email pembeli" value={shipping.email} onChange={e=>setShipping({...shipping,email:e.target.value})}/><select value={shipping.country_code} onChange={e=>{const countryCode=e.target.value;const nextShipping=normalizeShipping({...shipping,country_code:countryCode});setShipping(nextShipping);setCurrency(currencyForCountry(countryCode));try{localStorage.setItem("16flames_currency",currencyForCountry(countryCode))}catch(err){}}}>
          <option value="US">United States — USD ($)</option>
          <option value="GB">United Kingdom — GBP (£)</option>
          <option value="CA">Canada — CAD (CA$)</option>
          <option value="AU">Australia — AUD (A$)</option>
          <option value="NZ">New Zealand — NZD (NZ$)</option>
          <option value="SG">Singapore — SGD (S$)</option>
          <option value="ID">Indonesia — IDR (Rp)</option>
          <option value="MY">Malaysia — MYR (RM)</option>
          <option value="JP">Japan — JPY (¥)</option>
          <option value="CN">China — CNY (CN¥)</option>
          <option value="KR">South Korea — KRW (₩)</option>
          <option value="IN">India — INR (₹)</option>
          <option value="TH">Thailand — THB (฿)</option>
          <option value="PH">Philippines — PHP (₱)</option>
          <option value="CH">Switzerland — CHF</option>
          <option value="DE">Germany — EUR (€)</option>
          <option value="FR">France — EUR (€)</option>
          <option value="IT">Italy — EUR (€)</option>
          <option value="ES">Spain — EUR (€)</option>
          <option value="NL">Netherlands — EUR (€)</option>
          <option value="BE">Belgium — EUR (€)</option>
          <option value="AT">Austria — EUR (€)</option>
          <option value="IE">Ireland — EUR (€)</option>
          <option value="PT">Portugal — EUR (€)</option>
        </select><input placeholder="Address" value={shipping.address_line_1} onChange={e=>setShipping({...shipping,address_line_1:e.target.value})}/><input placeholder="Apartment / suite (optional)" value={shipping.address_line_2} onChange={e=>setShipping({...shipping,address_line_2:e.target.value})}/><input placeholder="City" value={shipping.city} onChange={e=>setShipping({...shipping,city:e.target.value})}/><input placeholder="State / Province" value={shipping.state} onChange={e=>setShipping({...shipping,state:e.target.value})}/><input placeholder="Postal code" value={shipping.postal_code} onChange={e=>setShipping({...shipping,postal_code:e.target.value})}/></div>
      </div>
      <div className="shipping-route-note"><b>RUTE PENGIRIMAN</b><span>{getShippingRoute(shipping).routeLabel}</span><small>{shipping.country_code === "MY" ? "Pesanan Malaysia diproses dari fulfillment Malaysia dan diarahkan ke Kuala Lumpur." : "Pesanan internasional diproses dari fulfillment Bandung, Indonesia."}</small></div>
      <div className="checkout-summary">
        {cart.map((x,i)=><div className="checkout-summary-row" key={i}><span>{x.product.name} × {x.qty}</span><strong>{money(x.product.price*x.qty,currency)}</strong></div>)}
        <div className="checkout-summary-row total"><span>TOTAL PEMBAYARAN · {currency}</span><strong>{money(total,currency)}</strong></div>
        <small>Prices are displayed in {currency} based on the selected shipping country. Exchange rates are estimates; PayPal may process the final charge in USD depending on your merchant account.</small>
      </div>
      <div className="payment-choice-heading">INTERNATIONAL PAYMENT</div>
      <div className="international-methods">
        <div className="international-method active"><div className="method-logo visa-logo">VISA</div><div><b>Visa</b><span>International credit & debit cards</span></div></div>
        <div className="international-method active"><div className="method-logo mc-logo"><i></i><i></i></div><div><b>Mastercard</b><span>International credit & debit cards</span></div></div>
        <div className="international-method active"><div className="method-logo amex-logo">AMEX</div><div><b>American Express</b><span>Available where supported</span></div></div>
        <div className="international-method active"><div className="method-logo paypal-logo">P</div><div><b>PayPal</b><span>Secure international checkout</span></div></div>
        <div className="international-method"><div className="method-logo apple-logo"></div><div><b>Apple Pay</b><span>Shown automatically when eligible</span></div></div>
        <div className="international-method"><div className="method-logo google-logo">G</div><div><b>Google Pay</b><span>Shown automatically when eligible</span></div></div>
      </div>
      {shipping.country_code === "MY" && <>
        <div className="payment-choice-heading">PEMBAYARAN MALAYSIA</div>
        <p className="checkout-intro malaysia-payment-note">Pembayaran Malaysia menggunakan <b>MYR (RM)</b>. Tampilan dan alur dibuat sama seperti pembayaran Indonesia, dengan metode Malaysia yang sesuai.</p>
        <MalaysiaPayment shipping={shipping} items={cart.map(x=>({productId:x.product.id,size:x.size,qty:x.qty}))} total={payableTotal} currency="MYR" onSuccess={(result)=>{
          try{
            const orderItems=cart.map(x=>({name:x.product.name,productId:x.product.id,qty:x.qty,price:Math.round(x.product.price*(CURRENCY_INFO.MYR?.rate||4.7)),size:x.size}));
            const order={...result,orderId:result.orderId,items:orderItems,shipping,currency:"MYR",amount:payableTotal,createdAt:new Date().toISOString(),shippingStatus:"MENUNGGU DIPROSES",courier:"",trackingNumber:"",trackingUrl:""};
            localStorage.setItem("16flames_receipt",JSON.stringify(order));
            const existing=JSON.parse(localStorage.getItem("16flames_orders")||"[]");
            localStorage.setItem("16flames_orders",JSON.stringify([order,...existing.filter(o=>o.orderId!==order.orderId)].slice(0,100)));
          }catch(e){}
          setCart([]);setCheckoutOpen(false);window.location.href="/checkout/receipt";
        }} onError={(err)=>setToast(err?.message || "Pembayaran Malaysia gagal")}/>
      </>}

      {shipping.country_code === "ID" && <>
        <div className="payment-choice-heading">PEMBAYARAN INDONESIA</div>
        <p className="checkout-intro indonesia-payment-note">QRIS dan Virtual Account langsung ke akun kamu menggunakan <b>IDR</b>. Kamu tetap bebas mengubah mata uang tampilan di navbar; pilih IDR saat ingin memakai pembayaran Indonesia.</p>
        {currency === "IDR" ? <div className="indonesia-payment-grid">
          <ManualPayment type="qris" shipping={shipping} items={cart.map(x=>({productId:x.product.id,size:x.size,qty:x.qty}))} total={payableTotal} currency="IDR" onSuccess={(result)=>{
            try{
              const orderItems=cart.map(x=>({name:x.product.name,productId:x.product.id,qty:x.qty,price:Math.round(x.product.price*(CURRENCY_INFO.IDR?.rate||15500)),size:x.size}));
              const order={...result,orderId:result.orderId,items:orderItems,shipping,currency:"IDR",amount:payableTotal,createdAt:new Date().toISOString(),shippingStatus:"MENUNGGU DIPROSES",courier:"",trackingNumber:"",trackingUrl:""};
              localStorage.setItem("16flames_receipt",JSON.stringify(order));
              const existing=JSON.parse(localStorage.getItem("16flames_orders")||"[]");
              localStorage.setItem("16flames_orders",JSON.stringify([order,...existing.filter(o=>o.orderId!==order.orderId)].slice(0,100)));
            }catch(e){}
            setCart([]);setCheckoutOpen(false);window.location.href="/checkout/receipt";
          }} onError={(err)=>setToast(err?.message || "QRIS gagal")}/>
          <DirectVAPayment shipping={shipping} items={cart.map(x=>({productId:x.product.id,size:x.size,qty:x.qty}))} total={payableTotal} currency="IDR" onSuccess={(result)=>{
            try{
              localStorage.setItem("16flames_receipt",JSON.stringify({
                ...result,
                items:cart.map(x=>({name:x.product.name,qty:x.qty,price:currency === "IDR" ? Math.round(x.product.price * (CURRENCY_INFO.IDR?.rate || 15500)) : x.product.price,size:x.size})),
                shipping,
                currency,
                createdAt:new Date().toISOString(),
                shippingStatus:"MENUNGGU DIPROSES",
                courier:"",
                trackingNumber:"",
                trackingUrl:""
              }));
              const existingOrders=JSON.parse(localStorage.getItem("16flames_orders")||"[]");
              const receiptOrder={
                ...result,
                items:cart.map(x=>({name:x.product.name,qty:x.qty,price:currency === "IDR" ? Math.round(x.product.price * (CURRENCY_INFO.IDR?.rate || 15500)) : x.product.price,size:x.size})),
                shipping,
                currency,
                createdAt:new Date().toISOString(),
                shippingStatus:"MENUNGGU DIPROSES",
                courier:"",
                trackingNumber:"",
                trackingUrl:""
              };
              localStorage.setItem("16flames_orders",JSON.stringify([receiptOrder,...existingOrders.filter(o=>o.orderId!==result.orderId)].slice(0,100)));
            }catch(e){}
            setCart([]);setCheckoutOpen(false);window.location.href="/checkout/receipt";
          }} onError={(err)=>setToast(err?.message || "Virtual Account gagal")}/>
        </div> : <div className="currency-payment-note">Untuk melanjutkan dengan QRIS atau Virtual Account Indonesia, ubah Currency menjadi <b>IDR</b> di bagian atas.</div>}
      </>}
      <div className="payment-choice-heading">KARTU KREDIT / DEBIT & INTERNATIONAL</div>
      <PayPalCheckout countryCode={shipping.country_code} shipping={shipping} items={cart.map(x=>({productId:x.product.id,size:x.size,qty:x.qty}))} onSuccess={(result)=>{
        try{
          const orderItems=cart.map(x=>({name:x.product.name,productId:x.product.id,qty:x.qty,price:Number(x.product.price)||0,size:x.size}));
          const amount=orderItems.reduce((sum,x)=>sum+(Number(x.price)||0)*(Number(x.qty)||1),0);
          const orderId=`16flames-PAYPAL-${result.orderID}`;
          const order={...result,orderId,items:orderItems,shipping,currency:"USD",amount,createdAt:new Date().toISOString(),shippingStatus:"MENUNGGU DIPROSES",courier:"",trackingNumber:"",trackingUrl:""};
          localStorage.setItem("16flames_receipt",JSON.stringify(order));
          const existing=JSON.parse(localStorage.getItem("16flames_orders")||"[]");
          localStorage.setItem("16flames_orders",JSON.stringify([order,...existing.filter(o=>o.orderId!==order.orderId)].slice(0,100)));
        }catch(e){}
        setCart([]);setCheckoutOpen(false);window.location.href="/checkout/receipt";
      }} onError={(err)=>setToast(err?.message || "Payment failed")}/>
      <div className="checkout-security">🔒 Secure international checkout. Card details are processed by the payment provider and are never stored by 16FLAMES. Available payment methods can vary by country, currency, account and device.</div>
    </div></div>}

    {sizeGuide && <div className="quick-overlay" onClick={()=>setSizeGuide(false)}><div className="size-guide-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSizeGuide(false)}>×</button><div className="eyebrow">FIND YOUR FIT</div><h2>SIZE GUIDE</h2><p>General body measurements. Compare with a garment you already own for the best result.</p><div className="size-table"><div className="size-table-head"><span>SIZE</span><span>BUST</span><span>WAIST</span><span>HIP</span></div>{[{s:"XS",b:"31–32 in",w:"24–25 in",h:"34–35 in"},{s:"S",b:"33–34 in",w:"26–27 in",h:"36–37 in"},{s:"M",b:"35–36 in",w:"28–29 in",h:"38–39 in"},{s:"L",b:"37–39 in",w:"30–32 in",h:"40–42 in"},{s:"XL",b:"40–42 in",w:"33–35 in",h:"43–45 in"},{s:"2XL",b:"43–45 in",w:"36–38 in",h:"46–48 in"},{s:"3XL",b:"46–48 in",w:"39–41 in",h:"49–51 in"}].map(r=><div className="size-table-row" key={r.s}><span>{r.s}</span><span>{r.b}</span><span>{r.w}</span><span>{r.h}</span></div>)}</div><div className="shoe-note"><b>SHOES:</b> EU 36–44 are available on selected styles. Measure from heel to longest toe and compare with the product's fit notes.</div></div></div>}

    {quick && <div className="quick-overlay" onClick={()=>setQuick(null)}><div className="quick-modal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>setQuick(null)}>×</button>
      <div className="quick-art quick-photo-layer">
        <Art type={quick.art} image={quick.image}/>
        <div className="photo-layer-help">PHOTO 01 · Tambahkan <code>{`/products/${quick.id}-2.jpg`}</code> &amp; <code>{`/products/${quick.id}-3.jpg`}</code> untuk foto tambahan.</div>
      </div>
      <div className="quick-info"><div className="eyebrow">{quick.category}</div><h2>{quick.name}</h2><h3>{money(quick.price,currency)}</h3><p>Premium materials, statement details and an easy everyday silhouette.</p><div className="detail-grid"><div><b>COLOR</b><span>{quick.colors?.join(" • ") || quick.color}</span></div><div><b>MATERIAL</b><span>{quick.material}</span></div><div><b>FIT</b><span>{quick.fit}</span></div><div><b>STOCK</b><span>{quick.stock} available</span></div></div><div className="size-heading"><b>{quick.sizeType==="shoes"?"SELECT SHOE SIZE":quick.sizeType==="one-size"?"SIZE":"SELECT SIZE"}</b>{quick.sizeType!=="one-size"&&<button className="size-guide-link" onClick={()=>setSizeGuide(true)}>SIZE GUIDE</button>}</div><div className="sizes">{quick.sizes.map(s=><button key={s} onClick={()=>{add(quick,s);setQuick(null)}}>{s}</button>)}</div>{quick.sizeType!=="one-size"&&<small className="size-note">Between sizes? Choose the larger size for a relaxed fit.</small>}<button className="black-btn" onClick={()=>{add(quick,quick.sizes[0]);setQuick(null)}}>ADD TO BAG</button></div>
    </div></div>}
  </div>
}
