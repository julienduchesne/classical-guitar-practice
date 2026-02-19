import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classical Guitar Practice",
  description: "Classical guitar practice app",
};

import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={bodyStyle}>
        <Sidebar />
        <div style={contentStyle}>{children}</div>
      </body>
    </html>
  );
}

const bodyStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};
