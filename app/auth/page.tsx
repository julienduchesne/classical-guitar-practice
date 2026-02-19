"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const wrong = searchParams.get("wrong") === "1";
  const [password, setPassword] = useState("");
  const [error, setError] = useState(wrong ? "Wrong password." : "");

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      const trimmed = password.trim();
      if (!trimmed) {
        setError("Enter a password.");
        return;
      }
      const url = new URL(next, window.location.origin);
      url.searchParams.set("password", trimmed);
      router.push(url.pathname + url.search);
    },
    [password, next, router]
  );

  return (
    <main style={{ padding: "2rem", maxWidth: "24rem", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Password required</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          style={{
            display: "block",
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        />
        {error && (
          <p style={{ color: "crimson", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Continue
        </button>
      </form>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<main style={{ padding: "2rem" }}>Loading…</main>}>
      <AuthForm />
    </Suspense>
  );
}
