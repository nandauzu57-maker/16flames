import { NextResponse } from "next/server";
import { sendOrderEmail } from "../../../lib/email";

async function run(){
  const to = process.env.BRAND_ORDER_EMAIL || "";
  const result = await sendOrderEmail({
    orderId:`TEST-${Date.now()}`,
    paymentMethod:"TEST",
    status:"TEST EMAIL",
    shipping:{full_name:"Tes Veloura",email:to,address_line_1:"Test address",city:"Jakarta",state:"DKI Jakarta",postal_code:"10110",country_code:"ID"},
    items:[{name:"Test Product",size:"OS",qty:1,price:1}],
    total:1,
    currency:"USD"
  });
  return {ok:true,message:"Email test berhasil dikirim. Cek Inbox dan Spam.",emailId:result.id,to};
}

export async function GET(){
  try{return NextResponse.json(await run())}
  catch(error){return NextResponse.json({ok:false,error:error.message,help:"Jika menggunakan onboarding@resend.dev, alamat tujuan biasanya harus sama dengan email akun Resend. Untuk tujuan lain, verifikasi domain pengirim di Resend lalu gunakan email dari domain tersebut sebagai BRAND_FROM_EMAIL."},{status:502})}
}
export async function POST(){return GET()}
