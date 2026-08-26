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
}
