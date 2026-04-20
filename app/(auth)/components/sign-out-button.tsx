"use client";

import { useState } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";

interface Props {
  label?: string;
  className?: string;
}

export default function SignOutButton({
  label = "ログアウト",
  className = "w-full rounded-md bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-60",
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    const supabase = createClientSupabaseClient();
    await supabase.auth.signOut();
    // サインアウト後はトップに戻す（SSG のため再検証不要）
    window.location.href = "/";
  };

  return (
    <button type="button" className={className} disabled={isLoading} onClick={handleSignOut}>
      {isLoading ? "..." : label}
    </button>
  );
}
