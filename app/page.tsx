import Link from "next/link";
import ThemeCard from "@/components/theme/ThemeCard";
import { getSite } from "@/lib/site";
import { getThemes } from "@/lib/themes";

export default function Home() {
  const site = getSite();
  const themes = getThemes();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{site.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">{site.description}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/themes"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-200"
          >
            テーマを見る
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white"
          >
            このサイトについて
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
          テーマ
        </h2>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <li key={theme.slug}>
              <ThemeCard theme={theme} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
