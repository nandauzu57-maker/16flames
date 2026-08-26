import TestOrderEmailButton from "../../components/TestOrderEmailButton";

export const dynamic = "force-dynamic";

export default function TestOrderEmailPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <section style={{ maxWidth: 620, width: "100%", padding: 32, border: "1px solid #ddd", borderRadius: 20 }}>
        <h1>Test Notifikasi Pesanan</h1>
        <p>Ini hanya mengirim email simulasi. Tidak ada pembayaran dan tidak ada barang yang dibeli.</p>
        <TestOrderEmailButton />
      </section>
    </main>
  );
}
