import type { Metadata } from "next";
import SignOutButton from "../components/sign-out-button";

export const metadata: Metadata = {
  title: "アクセス不可",
  description: "アクセスが許可されていません",
};

export default function RejectedPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">アクセスが許可されていません</h1>
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p className="font-semibold text-red-600">本サイトへのアクセスは承認されませんでした。</p>
          <p>詳細は管理者までお問い合わせください。</p>
          <p>
            <a href="mailto:admin@singularitylab.jp" className="text-blue-600 underline">
              admin@singularitylab.jp
            </a>
          </p>
        </div>
        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
