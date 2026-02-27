"use client";

import { Link } from "@/components/Link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const nav = [
  { href: "/daily-practice", label: "Daily Practice" },
  { href: "/exercises", label: "Exercises" },
  { href: "/pieces", label: "Pieces" },
] as const;

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
    >
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close navigation"
      >
        ✕
      </button>

      <div className={styles.logo}>
        <span className={styles.logoIcon}>🎸</span>
        Guitar Practice
      </div>

      <ul className={styles.navList}>
        {nav.map(({ href, label }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className={styles.navItem}>
              <Link
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                onClick={onClose}
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
