"use client";

import { useState } from "react";

export default function TestOrderEmailButton() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  async function send() {
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch("/api/test-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      setResult({
        ok: response.ok && data.ok,
        text: data.message || data.error || `Server mengembalikan HTTP ${response.status}`,
      });
    } catch (error) {
      setResult({ ok: false, text: `Tidak bisa terhubung ke server: ${error?.message || "unknown error"}` });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={send}
        disabled={busy}
        style={{ padding: "14px 20px", borderRadius: 10, cursor: busy ? "wait" : "pointer", border: "1px solid #888", background: "white" }}
      >
        {busy ? "MENGIRIM..." : "KIRIM TEST PESANAN"}
      </button>
      {result && (
        <div
          role="status"
          style={{ marginTop: 20, padding: 16, borderRadius: 12, background: result.ok ? "#e8f7ed" : "#fdecec" }}
        >
          <b>{result.ok ? "BERHASIL" : "GAGAL"}</b>
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{result.text}</div>
        </div>
      )}
    </>
  );
}
