import { NextResponse } from "next/server";
import { sendOrderEmail } from "../../../lib/email";
<<<<<<< HEAD
import { rateLimit, sameOrigin } from "../../../lib/security";

export async function POST(req) {
  const limit=rateLimit(req,"test-order-email",3,60_000);
  if(!limit.ok) return NextResponse.json({ok:false,error:"Terlalu banyak permintaan."},{status:429});
  if(!sameOrigin(req)) return NextResponse.json({ok:false,error:"Origin tidak diizinkan."},{status:403});
  if(process.env.NODE_ENV === "production" && req.headers.get("x-test-email-secret") !== process.env.TEST_EMAIL_SECRET) return NextResponse.json({ok:false,error:"Endpoint test dinonaktifkan di production."},{status:404});
  try {
    const to=process.env.BRAND_ORDER_EMAIL || "";
    const result=await sendOrderEmail({orderId:`16flames-TEST-${Date.now()}`,paymentMethod:"QRIS",status:"TEST / MENUNGGU VERIFIKASI",shipping:{full_name:"Test Pembeli 16flames",email:to,address_line_1:"Alamat test",city:"Jakarta",state:"DKI Jakarta",postal_code:"10110",country_code:"ID"},items:[{name:"Test Product",productId:"test",size:"L",qty:1,price:1}],total:1,currency:"USD"});
    return NextResponse.json({ok:true,emailId:result.id,message:"Test pesanan berhasil dikirim."});
  } catch { return NextResponse.json({ok:false,error:"Gagal mengirim test pesanan."},{status:502}); }
=======

export async function POST() {
  try {
    const to = process.env.BRAND_ORDER_EMAIL || "";
    const result = await sendOrderEmail({
      orderId: `16flames-TEST-${Date.now()}`,
      paymentMethod: "QRIS",
      status: "TEST / MENUNGGU VERIFIKASI",
      shipping: {
        full_name: "Test Pembeli Veloura",
        email: to,
        address_line_1: "Alamat test",
        city: "Jakarta",
        state: "DKI Jakarta",
        postal_code: "10110",
        country_code: "ID"
      },
      items: [{ name: "Test Product", productId: "test", size: "L", qty: 1, price: 1 }],
      total: 1,
      currency: "USD"
    });
    return NextResponse.json({ ok: true, emailId: result.id, message: "Test pesanan berhasil dikirim. Cek Resend dan Gmail." });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.message || "Gagal mengirim test pesanan" }, { status: 502 });
  }
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
}
