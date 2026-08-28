"use client";
import {useEffect,useRef,useState} from "react";

export default function PayPalCheckout({items,shipping,countryCode,onSuccess,onError}){
  const paypalRef=useRef(null);
  const cardRef=useRef(null);
  const cardInstance=useRef(null);
  const appleRef=useRef(null);
  const googleRef=useRef(null);
  const [ready,setReady]=useState(false);
  const [cardReady,setCardReady]=useState(false);
  const [tab,setTab]=useState("paypal");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    const clientId=process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if(!clientId || clientId.includes("CLIENT_ID_KAMU")){
      setMessage("PayPal Sandbox belum dikonfigurasi. Isi NEXT_PUBLIC_PAYPAL_CLIENT_ID dengan Client ID Sandbox PayPal.");
      return;
    }
    if(window.paypal){setReady(true);return;}
    const script=document.createElement("script");
    script.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&components=buttons,card-fields,funding-eligibility`;
    script.async=true;
    script.onload=()=>setReady(true);
    script.onerror=()=>setMessage("PayPal SDK gagal dimuat. Periksa internet dan Client ID Sandbox.");
    document.body.appendChild(script);
    return()=>{script.remove()};
  },[]);

  const createOrder=async()=>{
    const res=await fetch("/api/paypal/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items,shipping})});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error || "Tidak bisa membuat order");
    return data.id;
  };
  const capture=async(orderID)=>{
    if(!shipping?.full_name || !/^\S+@\S+\.\S+$/.test(String(shipping.email))) throw new Error("Masukkan nama dan email pembeli terlebih dahulu.");
    const res=await fetch("/api/paypal/capture-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderID,shipping,items})});
    const result=await res.json();
    if(!res.ok) throw new Error(result.error || "Pembayaran gagal");
    if(result.status!=="COMPLETED") throw new Error("Pembayaran belum selesai");
    return result;
  };
  const approve=async(data)=>{
    try{setBusy(true);const result=await capture(data.orderID);onSuccess?.(result)}
    catch(e){setMessage(e.message);onError?.(e)}finally{setBusy(false)}
  };

  useEffect(()=>{
    if(!ready || !window.paypal || !paypalRef.current) return;
    paypalRef.current.innerHTML="";
    const buttons=window.paypal.Buttons({
      style:{layout:"vertical",shape:"rect",label:"paypal",color:"gold"},
      createOrder,
      onApprove:approve,
      onError:(e)=>{setMessage(e?.message || "Pembayaran gagal");onError?.(e)},
      onCancel:()=>setMessage("Pembayaran dibatalkan. Keranjang tetap tersimpan.")
    });
    if(buttons.isEligible()) buttons.render(paypalRef.current);
  },[ready,items,shipping,onSuccess,onError]);

  useEffect(()=>{
    if(!ready || !window.paypal || !cardRef.current || !window.paypal.CardFields) return;
    cardRef.current.innerHTML="";
    const cardFields=window.paypal.CardFields({
      style:{input:{fontSize:"16px",fontFamily:"Arial, sans-serif",color:"#171317"},":focus":{color:"#111"},".invalid":{color:"#c21d61"}},
      createOrder,
      onApprove:approve,
      onError:(e)=>{setMessage(e?.message || "Card payment failed");onError?.(e)}
    });
    if(cardFields.isEligible()){
      for(const [method,id,label] of [["NameField","card-name","CARDHOLDER NAME"],["NumberField","card-number","CARD NUMBER"],["ExpiryField","card-expiry","EXPIRATION"],["CVVField","card-cvv","CVV"]]){
        const el=cardFields[method]?.({placeholder:label});
        if(el) el.render(`#${id}`);
      }
      cardInstance.current=cardFields;
      setCardReady(true);
    }else{
      cardInstance.current=null;
      setCardReady(false);
    }
    return()=>{cardInstance.current=null};
  },[ready,items,shipping,onSuccess,onError]);

  const submitCard=async()=>{
    if(!cardInstance.current) return;
    setMessage("");setBusy(true);
    try{await cardInstance.current.submit()}
    catch(e){setMessage(e?.message || "Data kartu tidak dapat diproses.");onError?.(e);setBusy(false)}
  };

  useEffect(()=>{
    if(!ready || !window.paypal || tab!=="more") return;
    const renderFunding=(ref,fundingSource)=>{
      if(!ref.current) return;
      ref.current.innerHTML="";
      const b=window.paypal.Buttons({fundingSource,style:{layout:"vertical",shape:"rect"},createOrder,onApprove:approve,onError:(e)=>setMessage(e?.message || "Pembayaran gagal")});
      if(b.isEligible()) b.render(ref.current);
    };
    renderFunding(appleRef,"applepay");
    renderFunding(googleRef,"googlepay");
  },[ready,tab,items,shipping,onSuccess,onError]);

  return <div className="payment-suite">
    <div className="payment-provider-title">SELECT A SECURE PAYMENT OPTION</div>
    <div className="payment-tabs">
      <button type="button" className={tab==="paypal"?"active":""} onClick={()=>setTab("paypal")}>PayPal</button>
      <button type="button" className={tab==="card"?"active":""} onClick={()=>setTab("card")}>Credit / Debit Card</button>
      <button type="button" className={tab==="more"?"active":""} onClick={()=>setTab("more")}>Wallets & Local</button>
    </div>
    {tab==="paypal"&&<div className="payment-panel"><div className="payment-title">Pay securely with PayPal</div><div ref={paypalRef}/><p className="payment-note">Use a PayPal Sandbox buyer account to test this checkout. No real money is charged in Sandbox.</p></div>}
    {tab==="card"&&<div className="payment-panel"><div className="payment-title">Credit or debit card</div>{cardReady?<div className="card-fields">
      <label>Cardholder name<div id="card-name"/></label>
      <label>Card number<div id="card-number"/></label>
      <div className="card-grid"><label>Expiration<div id="card-expiry"/></label><label>CVV<div id="card-cvv"/></label></div>
      <button type="button" className="card-submit" onClick={submitCard} disabled={busy}>{busy?"PROCESSING…":"PAY SECURELY BY CARD"}</button>
      <p className="payment-note">Card details are rendered inside PayPal-hosted secure fields. Your site does not receive the raw card number.</p>
    </div>:<div className="not-eligible">Card Fields are not enabled for this PayPal merchant account. Enable Advanced Card Payments in the PayPal Sandbox account, then reload the site.</div>}</div>}
    {tab==="more"&&<div className="payment-panel"><div className="payment-title">Wallets & country-specific methods</div>
      <div className="wallet-live"><div ref={appleRef}/><div ref={googleRef}/></div>
      <div className="method-grid"><div> <b>Apple Pay</b><span>Only appears when PayPal enables it for this merchant, country, domain and device.</span></div><div>G <b>Google Pay</b><span>Only appears when the merchant and buyer are eligible.</span></div><div>🌎 <b>International local methods</b><span>PayPal decides which supported methods are available for the buyer's country and currency.</span></div></div>
      <div className="payment-note">Current shipping country: <strong>{countryCode || "US"}</strong>.</div>
    </div>}
    {message&&<div className="paypal-message">{message}</div>}
  </div>;
}
