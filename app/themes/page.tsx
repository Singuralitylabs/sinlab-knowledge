import type { Metadata } from "next";
import ThemeCard from "@/components/theme/ThemeCard";
import { getThemes } from "@/lib/themes";

export const metadata: Metadata = {
  title: "テーマ一覧",
  description: "Sinlab Skills の解説テーマ一覧",
};

export default function ThemesPage() {
  const themes = getThemes();
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">テーマ</h1>
        <p className="mt-2 text-sm text-gray-600">
          各テーマは独立した解説領域です。興味のあるテーマから自由に読み始められます。
        </p>
      </header>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <li key={theme.slug}>
            <ThemeCard theme={theme} />
          </li>
        ))}
      </ul>
    </main>
  );
}
