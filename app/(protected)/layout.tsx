import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server-auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = await getServerAuth();

  if (!user) {
    redirect("/login");
  }

  if (status === "pending" || status === null) {
    // users テーブルに未登録のユーザーも承認待ち扱いとする（ポータル側で初回登録される想定）
    redirect("/pending");
  }

  if (status === "rejected") {
    redirect("/rejected");
  }

  return <>{children}</>;
}
