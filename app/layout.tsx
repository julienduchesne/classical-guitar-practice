import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classical Guitar Practice",
  description: "Classical guitar practice app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
