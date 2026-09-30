import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server-auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = await getServerAuth();

  if (!user) {
    redirect("/login");
  }

  // Allow-list: only "active" passes. "rejected" gets its own page; everything else
  // (pending / null / unexpected values) is routed to pending.
  if (status === "rejected") {
    redirect("/rejected");
  }

  if (status !== "active") {
    redirect("/pending");
  }

  return <>{children}</>;
}
