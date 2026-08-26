import {NextResponse} from "next/server";
const COOKIE_NAME="16flames_admin_session";
const SECRET=process.env.ADMIN_SESSION_SECRET||"Mex1SAs64oClhSKZUQ_lq1DxutLVDHYrSvhUr8DtgjJLRgDe9xVPWykERShgBjYo";
function b64urlToBytes(input){const pad=input.length%4===2?"==":input.length%4===3?"=":"";const s=input.replace(/-/g,"+").replace(/_/g,"/")+pad;const bin=atob(s);return Uint8Array.from(bin,c=>c.charCodeAt(0));}
function textBytes(t){return new TextEncoder().encode(t);}
async function verify(value,signature){const key=await crypto.subtle.importKey("raw",textBytes(SECRET),{name:"HMAC",hash:"SHA-256"},false,["verify"]);return crypto.subtle.verify("HMAC",key,b64urlToBytes(signature),textBytes(value));}
export async function middleware(req){if(req.nextUrl.pathname==="/admin/login")return NextResponse.next();const token=req.cookies.get(COOKIE_NAME)?.value||"";let valid=false;try{const [payload,sig]=token.split(".");if(payload&&sig&&await verify(payload,sig)){const data=JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));valid=Boolean(data?.exp&&data.exp>Date.now());}}catch{}if(valid)return NextResponse.next();const url=req.nextUrl.clone();url.pathname="/admin/login";url.searchParams.set("next",req.nextUrl.pathname);return NextResponse.redirect(url);}
export const config={matcher:["/admin/:path*"]};
