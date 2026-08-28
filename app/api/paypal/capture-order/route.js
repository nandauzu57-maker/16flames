import { NextResponse } from "next/server";
import { getProduct } from "../../../../lib/catalog";
<<<<<<< HEAD
import { rateLimit, sameOrigin } from "../../../../lib/security";
import { sendOrderEmail } from "../../../../lib/email";
import { normalizeShipping } from "../../../../lib/shipping";
=======
import { sendOrderEmail } from "../../../../lib/email";
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585

const paypalBase = process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function paypalAccessToken(){
  const client=process.env.PAYPAL_CLIENT_ID;
  const secret=process.env.PAYPAL_CLIENT_SECRET;
  if(!client || !secret) throw new Error("Missing PayPal credentials");
  const auth=Buffer.from(`${client}:${secret}`).toString("base64");
  const res=await fetch(`${paypalBase}/v1/oauth2/token`,{method:"POST",headers:{Authorization:`Basic ${auth}`,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials",cache:"no-store"});
<<<<<<< HEAD
  if(!res.ok) throw new Error("PayPal auth failed");
=======
  if(!res.ok) throw new Error(`PayPal auth failed: ${await res.text()}`);
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
  return (await res.json()).access_token;
}

export async function POST(request){
<<<<<<< HEAD
  const limit=rateLimit(request,"paypal-capture",20,60_000);
  if(!limit.ok) return NextResponse.json({error:"Terlalu banyak permintaan. Silakan coba lagi."},{status:429,headers:{"Retry-After":String(limit.retryAfter)}});
  if(!sameOrigin(request)) return NextResponse.json({error:"Origin tidak diizinkan."},{status:403});
  try{
    const body=await request.json();
    const orderID=String(body?.orderID||"").trim();
    const shipping=normalizeShipping(body?.shipping && typeof body.shipping === "object" ? body.shipping : {});
    const rawItems=Array.isArray(body?.items)?body.items.slice(0,50):[];
    if(!/^[A-Z0-9-]{8,80}$/i.test(orderID)) return NextResponse.json({error:"Order ID tidak valid."},{status:400});
    if(!shipping.full_name || !shipping.email) return NextResponse.json({error:"Nama dan email pembeli wajib diisi."},{status:400});
    if(!/^\S+@\S+\.\S+$/.test(String(shipping.email).slice(0,200))) return NextResponse.json({error:"Format email pembeli tidak valid."},{status:400});

    const items=rawItems.map(x=>{const p=getProduct(x.productId); return p?{name:p.name,productId:p.id,size:String(x.size||"OS").slice(0,20),qty:Math.max(1,Math.min(20,Number(x.qty)||1)),price:Number(p.price)||0}:null}).filter(Boolean);
    if(!items.length) return NextResponse.json({error:"Item order tidak valid."},{status:400});
    const total=Number(items.reduce((sum,x)=>sum+x.price*x.qty,0).toFixed(2));

    const token=await paypalAccessToken();
    const detailRes=await fetch(`${paypalBase}/v2/checkout/orders/${encodeURIComponent(orderID)}`,{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
    const detail=await detailRes.json().catch(()=>({}));
    if(!detailRes.ok) return NextResponse.json({error:"PayPal order tidak ditemukan."},{status:404});
    const expectedTotal=Number(detail?.purchase_units?.[0]?.amount?.value);
    const expectedCurrency=String(detail?.purchase_units?.[0]?.amount?.currency_code||"").toUpperCase();
    if(expectedCurrency!=="USD" || !Number.isFinite(expectedTotal) || Math.abs(expectedTotal-total)>0.01) return NextResponse.json({error:"Total pembayaran tidak cocok dengan keranjang."},{status:409});

    const res=await fetch(`${paypalBase}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},cache:"no-store"});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) return NextResponse.json({error:"Payment capture failed"},{status:500});
    if(data.status!=="COMPLETED") return NextResponse.json({error:"Pembayaran belum selesai",status:data.status},{status:400});

    const captureTotal=Number(data?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value);
    if(!Number.isFinite(captureTotal) || Math.abs(captureTotal-total)>0.01) return NextResponse.json({error:"Jumlah pembayaran tidak cocok."},{status:409});

    const orderId=`16flames-PAYPAL-${orderID}`;
    try{
      const sent=await sendOrderEmail({orderId,paymentMethod:"paypal/card",status:"COMPLETED",shipping,items,total,paypalOrderId:orderID});
      return NextResponse.json({status:data.status,orderID:data.id,emailSent:true,emailId:sent.id});
    }catch{
      return NextResponse.json({status:data.status,orderID:data.id,emailSent:false,emailError:"Email not sent"},{status:502});
    }
  }catch{
    return NextResponse.json({error:"Checkout gagal diproses. Silakan coba lagi."},{status:500});
=======
  try{
    const body=await request.json();
    const orderID=body?.orderID;
    const shipping=body?.shipping || {};
    const rawItems=Array.isArray(body?.items)?body.items:[];
    if(!orderID) return NextResponse.json({error:"Missing orderID"},{status:400});
    if(!shipping.full_name || !shipping.email) return NextResponse.json({error:"Nama dan email pembeli wajib diisi."},{status:400});
    if(!/^\S+@\S+\.\S+$/.test(String(shipping.email))) return NextResponse.json({error:"Format email pembeli tidak valid."},{status:400});

    const token=await paypalAccessToken();
    const res=await fetch(`${paypalBase}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},cache:"no-store"});
    const data=await res.json();
    if(!res.ok) return NextResponse.json({error:data.message || "Payment capture failed",details:data},{status:500});
    if(data.status!=="COMPLETED") return NextResponse.json({error:"Pembayaran belum selesai",status:data.status,details:data},{status:400});

    const items=rawItems.map(x=>{const p=getProduct(x.productId); return p?{name:p.name,productId:p.id,size:String(x.size||"OS"),qty:Math.max(1,Math.min(20,Number(x.qty)||1)),price:Number(p.price)||0}:null}).filter(Boolean);
    const subtotal=items.reduce((sum,x)=>sum+x.price*x.qty,0);
    const shippingCost=0;
    const total=Number((subtotal+shippingCost).toFixed(2));
    const orderId=`16flames-PAYPAL-${orderID}`;
    let emailSent=false;
    let emailId=null;
    try{
      const sent=await sendOrderEmail({orderId,paymentMethod:"paypal/card",status:"COMPLETED",shipping,items,total,paypalOrderId:orderID});
      emailSent=true; emailId=sent.id;
    }catch(emailError){
      return NextResponse.json({status:data.status,orderID:data.id,emailSent:false,emailError:emailError.message},{status:502});
    }
    return NextResponse.json({status:data.status,orderID:data.id,emailSent,emailId,details:data});
  }catch(error){
    return NextResponse.json({error:error.message || "Capture error"},{status:500});
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
  }
}
