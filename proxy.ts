import { type NextRequest, NextResponse } from "next/server";
import { createProxySupabaseClient } from "@/lib/supabase/proxy";

// Paths outside these prefixes skip the auth check.
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

  // Always call getUser(): it also refreshes the session cookie (Supabase recommendation).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // The strict status check lives in app/(protected)/layout.tsx; proxy stays optimistic
  // (Next.js 16 recommended pattern).
  return response;
}

export const config = {
  // Run the proxy only on paths that need the auth check.
  matcher: ["/themes/:path*"],
};
