"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Pieces.module.css";

function ModalInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function close() {
    const password = searchParams.get("password");
    router.push(password ? `/pieces?password=${encodeURIComponent(password)}` : "/pieces");
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const password = searchParams.get("password");
        router.push(password ? `/pieces?password=${encodeURIComponent(password)}` : "/pieces");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchParams, router]);

  return (
    <div className={styles.modalBackdrop} onClick={close}>
      <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button type="button" className={styles.modalClose} onClick={close} aria-label="Close">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ModalInner>{children}</ModalInner>
    </Suspense>
  );
}
