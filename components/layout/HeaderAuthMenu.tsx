"use client";

import { useEffect, useState } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";

export default function HeaderAuthMenu() {
  const [state, setState] = useState<"loading" | "signedIn" | "signedOut">("loading");
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClientSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setState(user ? "signedIn" : "signedOut");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session?.user ? "signedIn" : "signedOut");
    });
    return () => subscription.unsubscribe();
  }, []);

  if (state === "loading") {
    return <div className="h-8 w-20 animate-pulse rounded-md bg-gray-100" aria-hidden="true" />;
  }

  if (state === "signedOut") {
    return (
      <a
        href="/login"
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-gray-700"
      >
        ログイン
      </a>
    );
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClientSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
    >
      {isSigningOut ? "..." : "ログアウト"}
    </button>
  );
}
