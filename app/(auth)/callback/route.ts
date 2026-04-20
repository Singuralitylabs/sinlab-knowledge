import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { RETURN_TO_COOKIE } from "@/lib/auth/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    // cookie が書き換えられて不正な %XX シーケンスになっている場合も
    // フォールバックで null 扱いとし 500 を返さない。
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // returnTo は Cookie から取り出す（google-login-button で保存される）
  const cookieStore = await cookies();
  const returnToRaw = cookieStore.get(RETURN_TO_COOKIE)?.value;
  const returnTo = returnToRaw ? safeDecode(returnToRaw) : null;
  const safeReturnTo = returnTo?.startsWith("/") ? returnTo : "/themes";
  // 使い終わったら消す（Max-Age で自動失効するが即座に削除する）
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
