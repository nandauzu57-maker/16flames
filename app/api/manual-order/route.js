import {NextResponse} from "next/server";
import {getProduct} from "../../../lib/catalog";
import {sendOrderEmail} from "../../../lib/email";
import {rateLimit, sameOrigin} from "../../../lib/security";
import { normalizeShipping } from "../../../lib/shipping";

export async function POST(req){
  const limit=rateLimit(req,"manual-order",15,60_000);
  if(!limit.ok) return NextResponse.json({error:"Terlalu banyak permintaan. Silakan coba lagi."},{status:429,headers:{"Retry-After":String(limit.retryAfter)}});
  if(!sameOrigin(req)) return NextResponse.json({error:"Origin tidak diizinkan."},{status:403});
  try{
    const body=await req.json();
    if(!["qris","virtual_account","duitnow_qr","bank_transfer_my"].includes(body?.type)) return NextResponse.json({error:"Metode pembayaran tidak tersedia."},{status:400});
    const s=normalizeShipping(body.shipping || {});
    if(!s.full_name || !s.email || !s.address_line_1 || !s.city || !s.postal_code || !s.country_code) return NextResponse.json({error:"Lengkapi nama, email, dan alamat pengiriman terlebih dahulu."},{status:400});
    if(!/^\S+@\S+\.\S+$/.test(String(s.email))) return NextResponse.json({error:"Format email pembeli tidak valid."},{status:400});
    const rawItems=Array.isArray(body.items)?body.items.slice(0,50):[];
    if(!rawItems.length) return NextResponse.json({error:"Keranjang kosong."},{status:400});
    const items=rawItems.map(x=>{
      const p=getProduct(x.productId);
      if(!p) throw new Error("Produk dalam keranjang tidak valid.");
      return {name:p.name,productId:p.id,size:String(x.size||"OS"),qty:Math.max(1,Math.min(20,Number(x.qty)||1)),price:Number(p.price)||0};
    });
    const subtotal=items.reduce((sum,x)=>sum+x.price*x.qty,0);
    const shippingCost=0;
    // Product catalog prices are stored in USD. Manual Indonesian payments must be charged in IDR.
    // Keep this rate aligned with the storefront's displayed IDR rate.
    const currency=String(body.currency||"IDR").toUpperCase();
    const idrRate=15500;
    const myrRate=4.70;
    const total=currency === "IDR"
      ? Math.round((subtotal+shippingCost)*idrRate)
      : currency === "MYR"
        ? Number(((subtotal+shippingCost)*myrRate).toFixed(2))
        : Number((subtotal+shippingCost).toFixed(2));
    const emailItems=currency === "IDR"
      ? items.map(x=>({...x,price:Math.round(x.price*idrRate)}))
      : currency === "MYR"
        ? items.map(x=>({...x,price:Number((x.price*myrRate).toFixed(2))}))
        : items;
    const prefix=body.type==="virtual_account" ? "VA" : body.type==="duitnow_qr" ? "DUITNOW" : body.type==="bank_transfer_my" ? "MYBANK" : "QRIS";
    const orderId=`16flames-${prefix}-${Date.now().toString(36).toUpperCase()}`;
    const status="PENDING_VERIFICATION";

    let emailResult;
    try{
      emailResult=await sendOrderEmail({orderId,paymentMethod:body.type,status,shipping:s,items:emailItems,total,currency});
    }catch(emailError){
      return NextResponse.json({error:emailError.message,orderId,emailSent:false},{status:502});
    }
    return NextResponse.json({ok:true,orderId,status,paymentMethod:body.type,bank:body.bank||"",emailSent:true,emailId:emailResult.id});
  }catch(error){
    return NextResponse.json({error:"Data order tidak valid atau terjadi kesalahan server."},{status:400});
  }
}
