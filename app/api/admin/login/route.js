<<<<<<< HEAD
import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit, sameOrigin, requireEnv, verifyPassword } from "../../../../lib/security";

export const runtime = "nodejs";
const COOKIE_NAME = "16flames_admin_session";
const SESSION_TTL = 12 * 60 * 60;

// Local development defaults so the admin page works immediately without .env.local.
// Production still requires secure environment variables.
const LOCAL_ADMIN_USERNAME = "16flames";
const LOCAL_ADMIN_PASSWORD_HASH = "scrypt$16flames_admin_local_salt_2026$d0cced773dd222ccd30794a790a420845b01de6e36d1b16ef317b3e9736d5cfd3fc7a1419594feed95c0112fe3a5cfaf53c26b7c78bc365e9d2277e6c7f669a3";
const LOCAL_ADMIN_SESSION_SECRET = "16flames_admin_session_secret_2026_local_secure_random_string";

function adminConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return {
      secret: requireEnv("ADMIN_SESSION_SECRET", 32),
      username: requireEnv("ADMIN_USERNAME", 3),
      passwordHash: requireEnv("ADMIN_PASSWORD_HASH", 20),
    };
  }

  // Local development: use fixed credentials so .env.local mistakes cannot break login.
  return {
    secret: LOCAL_ADMIN_SESSION_SECRET,
    username: LOCAL_ADMIN_USERNAME,
    passwordHash: LOCAL_ADMIN_PASSWORD_HASH,
  };
}

function b64(v) { return Buffer.from(v).toString("base64url"); }
function sign(v, secret) { return crypto.createHmac("sha256", secret).update(v).digest("base64url"); }

export async function POST(req) {
  const limit = rateLimit(req, "admin-login", 5, 15 * 60_000);
  if (!limit.ok) return NextResponse.json({ error: "Terlalu banyak percobaan login. Coba lagi nanti." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Origin tidak diizinkan." }, { status: 403 });

  try {
    const { secret, username, passwordHash } = adminConfig();
    const body = await req.json();
    const suppliedUsername = String(body?.username || "").slice(0, 100);
    const suppliedPassword = String(body?.password || "");
    if (suppliedUsername !== username || !verifyPassword(suppliedPassword, passwordHash)) {
      return NextResponse.json({ error: "Username atau password admin salah." }, { status: 401 });
    }

    const payload = b64(JSON.stringify({ u: username, iat: Date.now(), exp: Date.now() + SESSION_TTL * 1000 }));
    const token = `${payload}.${sign(payload, secret)}`;
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_TTL,
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message || "Login belum dikonfigurasi dengan aman." }, { status: 500 });
  }
=======
import {NextResponse} from "next/server";
import crypto from "crypto";
const COOKIE_NAME="16flames_admin_session";
const SECRET=process.env.ADMIN_SESSION_SECRET||"Mex1SAs64oClhSKZUQ_lq1DxutLVDHYrSvhUr8DtgjJLRgDe9xVPWykERShgBjYo";
const USERNAME=process.env.ADMIN_USERNAME||"admin";
const PASSWORD=process.env.ADMIN_PASSWORD||"16flames@2026";
const b64=v=>Buffer.from(v).toString("base64url");
const sign=v=>crypto.createHmac("sha256",SECRET).update(v).digest("base64url");
export async function POST(req){
  try{const body=await req.json();const username=String(body?.username||"");const password=String(body?.password||"");
    if(username!==USERNAME||password!==PASSWORD)return NextResponse.json({error:"Username atau password admin salah."},{status:401});
    const payload=b64(JSON.stringify({u:username,exp:Date.now()+43200000}));const token=`${payload}.${sign(payload)}`;
    const res=NextResponse.json({ok:true});res.cookies.set(COOKIE_NAME,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:43200});return res;
  }catch{return NextResponse.json({error:"Permintaan login tidak valid."},{status:400});}
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
}
