import "./globals.css";

export const metadata = {
  title: "16flames | Y2K Fashion",
  description: "A complete original Y2K-inspired fashion storefront demo."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}