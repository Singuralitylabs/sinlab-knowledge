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
    return <div className="nav__skeleton" aria-hidden="true" />;
  }

  if (state === "signedOut") {
    return (
      <a className="nav__cta" href="/login">
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
    <button className="nav__link" type="button" onClick={handleSignOut} disabled={isSigningOut}>
      {isSigningOut ? "..." : "ログアウト"}
    </button>
  );
}
