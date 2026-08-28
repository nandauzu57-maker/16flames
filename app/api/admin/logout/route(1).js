import { NextResponse } from "next/server";
import { sameOrigin } from "../../../../lib/security";
export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Origin tidak diizinkan." }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("16flames_admin_session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
