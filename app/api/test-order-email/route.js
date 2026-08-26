import { NextResponse } from "next/server";
import { sendOrderEmail } from "../../../lib/email";

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
}
