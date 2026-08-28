import { NextResponse } from "next/server";
import { getProduct } from "../../../../lib/catalog";
import { rateLimit, sameOrigin } from "../../../../lib/security";
import { normalizeShipping, getShippingRoute } from "../../../../lib/shipping";

const paypalBase = process.env.PAYPAL_ENV === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function paypalAccessToken(){
  const client = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if(!client || !secret) throw new Error("Missing PayPal credentials");
  const auth = Buffer.from(`${client}:${secret}`).toString("base64");
  const res = await fetch(`${paypalBase}/v1/oauth2/token`, {
    method:"POST",
    headers:{Authorization:`Basic ${auth}`,"Content-Type":"application/x-www-form-urlencoded"},
    body:"grant_type=client_credentials",
    cache:"no-store"
  });
  if(!res.ok) throw new Error(`PayPal auth failed: ${await res.text()}`);
  return (await res.json()).access_token;
}

export async function POST(request){
  const limit=rateLimit(request,"paypal-create",20,60_000);
  if(!limit.ok) return NextResponse.json({error:"Terlalu banyak permintaan. Silakan coba lagi."},{status:429,headers:{"Retry-After":String(limit.retryAfter)}});
  if(!sameOrigin(request)) return NextResponse.json({error:"Origin tidak diizinkan."},{status:403});
  try{
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const shippingAddress = body.shipping && typeof body.shipping === "object" ? normalizeShipping(body.shipping) : null;
    if(!items.length) return NextResponse.json({error:"Cart is empty"},{status:400});

    const normalized = items.map(item => {
      const product = getProduct(item.productId);
      const qty = Math.max(1, Math.min(20, Number(item.qty) || 1));
      if(!product) throw new Error("Invalid product in cart");
      return {product, qty, size:String(item.size || "OS")};
    });

    const subtotal = normalized.reduce((sum,x)=>sum + x.product.price*x.qty,0);
    const shipping = 0;
    const total = Number((subtotal + shipping).toFixed(2));

    const accessToken = await paypalAccessToken();
    const order = await fetch(`${paypalBase}/v2/checkout/orders`,{
      method:"POST",
      headers:{Authorization:`Bearer ${accessToken}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        intent:"CAPTURE",
        purchase_units:[{
          reference_id:`VELOURA-${Date.now()}`,
          description:`Veloura fashion order — ${getShippingRoute(shippingAddress).routeLabel}`,
          amount:{currency_code:"USD",value:total.toFixed(2),breakdown:{item_total:{currency_code:"USD",value:subtotal.toFixed(2)},shipping:{currency_code:"USD",value:shipping.toFixed(2)}}},
          items:normalized.map(x=>({name:x.product.name,unit_amount:{currency_code:"USD",value:x.product.price.toFixed(2)},quantity:String(x.qty),category:"PHYSICAL_GOODS"})),
          ...(shippingAddress?.address_line_1 ? {shipping:{name:{full_name:String(shippingAddress.full_name||"").slice(0,300)},address:{address_line_1:String(shippingAddress.address_line_1).slice(0,300),address_line_2:String(shippingAddress.address_line_2||"").slice(0,300),admin_area_2:String(shippingAddress.city||"").slice(0,120),admin_area_1:String(shippingAddress.state||"").slice(0,120),postal_code:String(shippingAddress.postal_code||"").slice(0,60),country_code:String(shippingAddress.country_code||"").toUpperCase().slice(0,2)}}} : {})
        }],
        application_context:{
          brand_name:"Veloura",
          shipping_preference:"GET_FROM_FILE",
          user_action:"PAY_NOW",
          return_url:`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success`,
          cancel_url:`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/cancel`
        }
      }),
      cache:"no-store"
    });
    const data = await order.json();
    if(!order.ok) return NextResponse.json({error:"Could not create PayPal order"},{status:500});
    return NextResponse.json({id:data.id});
  }catch(error){
    return NextResponse.json({error:"Checkout gagal diproses. Silakan coba lagi."},{status:500});
  }
}
