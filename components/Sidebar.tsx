"use client";

import { Link } from "@/components/Link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/daily-practice", label: "Daily practice" },
  { href: "/exercises", label: "Exercises" },
  { href: "/sheet-music", label: "Sheet music" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" style={sidebarStyle}>
      <ul style={listStyle}>
        {nav.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} style={itemStyle}>
              <Link
                href={href}
                style={{
                  ...linkStyle,
                  ...(isActive ? linkActiveStyle : undefined),
                }}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const sidebarStyle: React.CSSProperties = {
  width: "12rem",
  flexShrink: 0,
  padding: "1rem 0",
  borderRight: "1px solid #ddd",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const itemStyle: React.CSSProperties = {
  margin: 0,
};

const linkStyle: React.CSSProperties = {
  display: "block",
  padding: "0.5rem 1rem",
  color: "inherit",
  textDecoration: "none",
};

const linkActiveStyle: React.CSSProperties = {
  fontWeight: 600,
  backgroundColor: "rgba(0,0,0,0.06)",
};
