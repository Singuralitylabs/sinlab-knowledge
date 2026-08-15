import { type NextRequest, NextResponse } from "next/server";
import { isProtectedPath } from "@/lib/auth/route-protection";
import { createProxySupabaseClient } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const { supabase, response } = createProxySupabaseClient(request);

  // Supabase のベストプラクティス: cookie の自動更新のため必ず getUser() を呼ぶ。
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 厳密な status チェックは Server Component (app/(protected)/layout.tsx) 側で行う。
  // proxy は optimistic チェックに留める（Next.js 16 の推奨パターン）。
  return response;
}

export const config = {
  // 認証チェックが必要なパスにのみ proxy を走らせる。
  matcher: ["/themes/:path*"],
};
