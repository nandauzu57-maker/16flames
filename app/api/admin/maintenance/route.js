import { NextResponse } from "next/server";
import crypto from "crypto";
import { getMaintenanceStatus, setMaintenanceStatus } from "../../../../lib/maintenance";
import { sameOrigin } from "../../../../lib/security";

export const runtime = "nodejs";
const COOKIE_NAME = "16flames_admin_session";
// Must match middleware.js and the local login route.
const LOCAL_ADMIN_SESSION_SECRET = "16flames_admin_session_secret_2026_local_secure_random_string";
const ADMIN_SESSION_SECRET = process.env.NODE_ENV === "production"
  ? (process.env.ADMIN_SESSION_SECRET || "")
  : LOCAL_ADMIN_SESSION_SECRET;

function b64urlToBuffer(input) {
  return Buffer.from(String(input).replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function validAdmin(req) {
  const secret = ADMIN_SESSION_SECRET;
  if (secret.length < 32) return false;
  const token = req.cookies.get(COOKIE_NAME)?.value || "";
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(sig); const b = Buffer.from(expected); if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(b64urlToBuffer(payload).toString("utf8"));
    return Boolean(data?.u && data?.exp && data.exp > Date.now());
  } catch { return false; }
}

export async function GET(req) {
  if (!validAdmin(req)) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  return NextResponse.json({ enabled: await getMaintenanceStatus() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req) {
  if (!sameOrigin(req) || !validAdmin(req)) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  try {
    const body = await req.json();
    const enabled = Boolean(body?.enabled);
    await setMaintenanceStatus(enabled);
    return NextResponse.json({ ok: true, enabled });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Gagal mengubah maintenance." }, { status: 503 });
  }
}
