import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CR7 AI — by Mr. Mawan PhD",
  description: "Chat dengan Cristiano Ronaldo AI versi parodi. SIUUUU!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
