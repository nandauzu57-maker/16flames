const KEY = "16flames:maintenance";

export async function getMaintenanceStatus() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["GET", KEY]),
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = await res.json();
    return String(data?.result || "false") === "true";
  } catch {
    return false;
  }
}

export async function setMaintenanceStatus(enabled) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN belum diatur di Vercel.");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["SET", KEY, enabled ? "true" : "false"]),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal menyimpan status maintenance ke Upstash Redis.");
  return Boolean(enabled);
}
