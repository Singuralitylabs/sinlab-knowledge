import type { User } from "@supabase/supabase-js";
import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const USER_STATUSES = ["pending", "active", "rejected"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

function toUserStatus(value: unknown): UserStatus | null {
  return typeof value === "string" && (USER_STATUSES as readonly string[]).includes(value)
    ? (value as UserStatus)
    : null;
}

export interface ServerAuthResult {
  user: User | null;
  status: UserStatus | null;
}

// Server Component から同一レンダリング中に複数回呼ばれても、
// Supabase への往復は 1 回で済むよう React.cache でメモ化する。
export const getServerAuth = cache(async (): Promise<ServerAuthResult> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, status: null };
  }

  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("status")
    .eq("auth_id", user.id)
    .eq("is_deleted", false)
    .maybeSingle();

  if (userError || !userRow) {
    return { user, status: null };
  }

  // DB から来た未知の status 値は null 扱い（= pending 相当）として弾く。
  return { user, status: toUserStatus(userRow.status) };
});
