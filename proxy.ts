import { type NextRequest, NextResponse } from "next/server";
import { createProxySupabaseClient } from "@/lib/supabase/proxy";

// 認証必須ルート。ここに含まれないパスは認証チェックをスキップする。
const protectedPrefixes = ["/themes"];

function isProtected(pathname: string): boolean {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtected(pathname)) {
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
