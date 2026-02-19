"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const bodyStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/auth";

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <div style={bodyStyle}>
      <Sidebar />
      <div style={contentStyle}>{children}</div>
    </div>
  );
}
