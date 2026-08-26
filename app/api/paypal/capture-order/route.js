import { NextResponse } from "next/server";
import { getProduct } from "../../../../lib/catalog";
import { sendOrderEmail } from "../../../../lib/email";

const paypalBase = process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function paypalAccessToken(){
  const client=process.env.PAYPAL_CLIENT_ID;
  const secret=process.env.PAYPAL_CLIENT_SECRET;
  if(!client || !secret) throw new Error("Missing PayPal credentials");
  const auth=Buffer.from(`${client}:${secret}`).toString("base64");
  const res=await fetch(`${paypalBase}/v1/oauth2/token`,{method:"POST",headers:{Authorization:`Basic ${auth}`,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials",cache:"no-store"});
  if(!res.ok) throw new Error(`PayPal auth failed: ${await res.text()}`);
  return (await res.json()).access_token;
}

export async function POST(request){
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
  }
}
