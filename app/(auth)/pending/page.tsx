import type { Metadata } from "next";
import Link from "next/link";
import SignOutButton from "../components/sign-out-button";

export const metadata: Metadata = {
  title: "承認待ち",
  description: "管理者による承認をお待ちください",
};

export default function PendingPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">承認待ちです</h1>
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p>現在、管理者による承認待ちの状態です。</p>
          <p>
            シンギュラリティ・ラボ
            ポータルサイトでの承認が完了すると、本サイトの全てのコンテンツを閲覧できるようになります。
          </p>
          <p>
            <Link
              href="https://singularity-lab-portal.vercel.app"
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              ポータルサイトを開く
            </Link>
          </p>
        </div>
        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
