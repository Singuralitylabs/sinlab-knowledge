import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server-auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = await getServerAuth();

  if (!user) {
    redirect("/login");
  }

  // allow-list 方式: "active" のみ保護コンテンツへ通す。
  // "rejected" は専用ページへ、それ以外（pending / null / 想定外値）は pending に寄せる。
  if (status === "rejected") {
    redirect("/rejected");
  }

  if (status !== "active") {
    redirect("/pending");
  }

  return <>{children}</>;
}
