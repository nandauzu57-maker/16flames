import { NextResponse } from "next/server";
import { getMaintenanceStatus } from "./lib/maintenance";

const COOKIE_NAME = "16flames_admin_session";
const LOCAL_SECRET = "16flames_admin_session_secret_2026_local_secure_random_string";
const SECRET = process.env.NODE_ENV === "production" ? (process.env.ADMIN_SESSION_SECRET || "") : LOCAL_SECRET;
function b64urlToBytes(input) { const pad = input.length % 4 === 2 ? "==" : input.length % 4 === 3 ? "=" : ""; const s = input.replace(/-/g, "+").replace(/_/g, "/") + pad; const bin = atob(s); return Uint8Array.from(bin, c => c.charCodeAt(0)); }
function textBytes(t) { return new TextEncoder().encode(t); }
async function verify(value, signature) { if (!SECRET) return false; const key = await crypto.subtle.importKey("raw", textBytes(SECRET), { name:"HMAC", hash:"SHA-256" }, false, ["verify"]); return crypto.subtle.verify("HMAC", key, b64urlToBytes(signature), textBytes(value)); }
async function isAdmin(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value || "";
  try {
    const [payload, sig] = token.split(".");
    if (payload && sig && await verify(payload, sig)) {
      const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
      return Boolean(data?.exp && data.exp > Date.now() && data?.u);
    }
  } catch {}
  return false;
}

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/_next/") || path === "/favicon.ico") return NextResponse.next();

  // Admin login and admin/API routes remain reachable during maintenance.
  if (path === "/admin/login" || path.startsWith("/api/admin/")) return NextResponse.next();

  if (await getMaintenanceStatus()) {
    if (await isAdmin(req)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  if (path === "/admin" || path.startsWith("/admin/")) {
    if (await isAdmin(req)) return NextResponse.next();
    const url = req.nextUrl.clone(); url.pathname = "/admin/login"; url.searchParams.set("next", path); return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
