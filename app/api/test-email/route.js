import { NextResponse } from "next/server";
import { sendOrderEmail } from "../../../lib/email";
import { rateLimit, sameOrigin } from "../../../lib/security";

async function run(req) {
  const limit = rateLimit(req, "test-email", 3, 60_000);
  if (!limit.ok) return NextResponse.json({ ok:false, error:"Terlalu banyak permintaan." }, { status:429 });
  if (!sameOrigin(req)) return NextResponse.json({ ok:false, error:"Origin tidak diizinkan." }, { status:403 });
  if (process.env.NODE_ENV === "production" && req.headers.get("x-test-email-secret") !== process.env.TEST_EMAIL_SECRET) return NextResponse.json({ ok:false, error:"Endpoint test dinonaktifkan di production." }, { status:404 });
  try {
    const to = process.env.BRAND_ORDER_EMAIL || "";
    const result = await sendOrderEmail({ orderId:`TEST-${Date.now()}`, paymentMethod:"TEST", status:"TEST EMAIL", shipping:{full_name:"Tes 16flames",email:to,address_line_1:"Test address",city:"Jakarta",state:"DKI Jakarta",postal_code:"10110",country_code:"ID"}, items:[{name:"Test Product",size:"OS",qty:1,price:1}], total:1, currency:"USD" });
    return NextResponse.json({ ok:true, message:"Email test berhasil dikirim.", emailId:result.id });
  } catch { return NextResponse.json({ ok:false, error:"Gagal mengirim email test." }, { status:502 }); }
}
export async function GET(req){ return run(req); }
export async function POST(req){ return run(req); }
