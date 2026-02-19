import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classical Guitar Practice",
  description: "Classical guitar practice app",
};

import { AppShell } from "@/components/AppShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
