import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Outfit, Zen_Maru_Gothic } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getSite } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display / mono accents for the "Friendly / Light" design. Self-hosted via
// next/font (no render-blocking Google stylesheet, no IP leak, no layout shift).
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Japanese body face. `preload: false` — the CJK file is large and is not
// needed for first paint of the Latin wordmark.
const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zenmaru",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    title: { default: site.title, template: `%s — ${site.title}` },
    description: site.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSite();
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${jetBrainsMono.variable} ${zenMaruGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header siteTitle={site.title} navigation={site.navigation} />
        <div className="flex-1">{children}</div>
        <Footer
          siteTitle={site.title}
          description={site.description}
          navigation={site.navigation}
          copyright={site.footer.copyright}
        />
      </body>
    </html>
  );
}
