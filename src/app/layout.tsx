import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mawan ai",
  description: "Chat dengan Cristiano Ronaldo muchas gracias afición esto es para Vosotros Siuuuu!",
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
