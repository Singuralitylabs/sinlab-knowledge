import type { Metadata } from "next";
import GoogleLoginButton from "./google-login-button";

export const metadata: Metadata = {
  title: "ログイン",
  description: "Sinlab Knowledge にログインします",
};

interface Props {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { returnTo } = await searchParams;
  const safeReturnTo = returnTo?.startsWith("/") ? returnTo : undefined;

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sinlab Knowledge</h1>
          <p className="mt-3 text-base text-gray-700">
            本サイトのレッスンはシンギュラリティ・ラボの会員のみ閲覧できます。
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLoginButton returnTo={safeReturnTo} />
        </div>

        <div className="mx-auto max-w-md rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-gray-700">
          <p className="mb-1 font-semibold text-blue-900">ログイン時のご連絡</p>
          <p className="leading-relaxed">
            Google アカウント選択画面では Supabase
            認証の仕様上、下記ドメインが表示されます。本サイトへのログイン処理ですので、安心してお進みください。
          </p>
        </div>
      </div>
    </main>
  );
}
