"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Modal.module.css";

function ModalInner({
  children,
  closePath,
}: {
  children: React.ReactNode;
  closePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function close() {
    const password = searchParams.get("password");
    router.push(
      password ? `${closePath}?password=${encodeURIComponent(password)}` : closePath
    );
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const password = searchParams.get("password");
        router.push(
          password ? `${closePath}?password=${encodeURIComponent(password)}` : closePath
        );
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchParams, router, closePath]);

  return (
    <div className={styles.modalBackdrop} onClick={close}>
      <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.modalClose}
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export function Modal({
  children,
  closePath,
}: {
  children: React.ReactNode;
  closePath: string;
}) {
  return (
    <Suspense fallback={null}>
      <ModalInner closePath={closePath}>{children}</ModalInner>
    </Suspense>
  );
}
