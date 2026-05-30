import { describe, expect, test } from "bun:test";
import { resolveServerAuth, toUserStatus } from "@/lib/auth/server-auth";

interface StubOpts {
  user?: { id: string } | null;
  authError?: unknown;
  userRow?: { status: unknown } | null;
  userError?: unknown;
}

/** Minimal chainable Supabase stub matching the calls in resolveServerAuth. */
function makeStub(opts: StubOpts): Parameters<typeof resolveServerAuth>[0] {
  const chain = {
    select() {
      return chain;
    },
    eq() {
      return chain;
    },
    async maybeSingle() {
      return { data: opts.userRow ?? null, error: opts.userError ?? null };
    },
  };
  const stub = {
    auth: {
      async getUser() {
        return { data: { user: opts.user ?? null }, error: opts.authError ?? null };
      },
    },
    from() {
      return chain;
    },
  };
  return stub as unknown as Parameters<typeof resolveServerAuth>[0];
}

describe("toUserStatus", () => {
  test("accepts known statuses", () => {
    expect(toUserStatus("pending")).toBe("pending");
    expect(toUserStatus("active")).toBe("active");
    expect(toUserStatus("rejected")).toBe("rejected");
  });

  test("maps unknown / non-string values to null (≒ pending)", () => {
    expect(toUserStatus("admin")).toBeNull();
    expect(toUserStatus("")).toBeNull();
    expect(toUserStatus(undefined)).toBeNull();
    expect(toUserStatus(123)).toBeNull();
  });
});

describe("resolveServerAuth", () => {
  test("returns nulls on auth error", async () => {
    const result = await resolveServerAuth(makeStub({ authError: new Error("boom") }));
    expect(result).toEqual({ user: null, status: null });
  });

  test("returns nulls when there is no authenticated user", async () => {
    const result = await resolveServerAuth(makeStub({ user: null }));
    expect(result).toEqual({ user: null, status: null });
  });

  test("returns the user with null status when the row lookup errors", async () => {
    const result = await resolveServerAuth(
      makeStub({ user: { id: "u1" }, userError: new Error("db") }),
    );
    expect(result.user?.id).toBe("u1");
    expect(result.status).toBeNull();
  });

  test("returns the user with null status when no row is found", async () => {
    const result = await resolveServerAuth(makeStub({ user: { id: "u1" }, userRow: null }));
    expect(result.user?.id).toBe("u1");
    expect(result.status).toBeNull();
  });

  test("returns the mapped status for an active user", async () => {
    const result = await resolveServerAuth(
      makeStub({ user: { id: "u1" }, userRow: { status: "active" } }),
    );
    expect(result.user?.id).toBe("u1");
    expect(result.status).toBe("active");
  });

  test("nulls out an unknown status value from the database", async () => {
    const result = await resolveServerAuth(
      makeStub({ user: { id: "u1" }, userRow: { status: "superadmin" } }),
    );
    expect(result.status).toBeNull();
  });
});
