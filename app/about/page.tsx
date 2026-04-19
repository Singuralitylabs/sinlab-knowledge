import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Prose from "@/components/content/Prose";
import { renderMarkdown } from "@/lib/content/mdx";
import { loadStaticPage } from "@/lib/pages";

export const metadata: Metadata = {
  title: "About",
  description: "Sinlab Knowledge について",
};

export default async function AboutPage() {
  const source = loadStaticPage("about");
  if (!source) notFound();

  const { html } = await renderMarkdown(source);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Prose html={html} />
    </main>
  );
}
