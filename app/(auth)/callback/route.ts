import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { RETURN_TO_COOKIE } from "@/lib/auth/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    // A tampered cookie can hold a malformed %XX sequence; treat it as absent instead of 500.
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // returnTo is set by google-login-button; only values starting with "/" are accepted.
  const cookieStore = await cookies();
  const returnToRaw = cookieStore.get(RETURN_TO_COOKIE)?.value;
  const returnTo = returnToRaw ? safeDecode(returnToRaw) : null;
  const safeReturnTo = returnTo?.startsWith("/") ? returnTo : "/themes";
  // One-shot: delete now instead of waiting for Max-Age expiry.
  cookieStore.delete(RETURN_TO_COOKIE);

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("認証エラー:", error);
    return NextResponse.redirect(`${origin}/login`);
  }

  return NextResponse.redirect(`${origin}${safeReturnTo}`);
}
