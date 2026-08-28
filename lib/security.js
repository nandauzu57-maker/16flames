import crypto from "crypto";

const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 100);
}

export function rateLimit(request, key, max = MAX_REQUESTS, windowMs = WINDOW_MS) {
  const now = Date.now();
  const id = `${key}:${getClientIp(request)}`;
  const current = buckets.get(id);
  if (!current || now - current.start >= windowMs) {
    buckets.set(id, { start: now, count: 1 });
    return { ok: true, remaining: max - 1 };
  }
  current.count += 1;
  if (current.count > max) return { ok: false, remaining: 0, retryAfter: Math.ceil((windowMs - (now - current.start)) / 1000) };
  return { ok: true, remaining: Math.max(0, max - current.count) };
}

export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function requireEnv(name, minLength = 1) {
  const value = String(process.env[name] || "").trim();
  if (value.length < minLength) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function verifyPassword(password, storedHash) {
  const [scheme, salt, hash] = String(storedHash || "").split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  try {
    const derived = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

export function createPasswordHash(password) {
  if (!password || password.length < 12) throw new Error("Password admin minimal 12 karakter.");
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}
