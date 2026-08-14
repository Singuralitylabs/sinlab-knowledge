import Link from "next/link";
import type { ComponentType, CSSProperties, SVGProps } from "react";
import { ArrowIcon, BookIcon, CodeIcon, GlobeIcon, SparkIcon } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import { getSite } from "@/lib/site";
import { normalizeThemeColor, type ThemeColor } from "@/lib/theme-color";
import { getThemes } from "@/lib/themes";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Theme accent → gradient stop pair (icon swatch, number, hover accent).
const THEME_HEX: Record<ThemeColor, [string, string]> = {
  blue: ["#3b82f6", "#60a5fa"],
  orange: ["#f59e0b", "#fbbf24"],
  green: ["#10b981", "#34d399"],
  purple: ["#8b5cf6", "#a78bfa"],
  gray: ["#9ca3af", "#cbd5e1"],
};

// Frontmatter icon name → ported icon component.
const THEME_ICON: Record<string, IconComponent> = {
  BookOpen: BookIcon,
  Globe: GlobeIcon,
  Code: CodeIcon,
  Sparkles: SparkIcon,
};

export default function Home() {
  const site = getSite();
  const themes = getThemes();

  const totalModules = themes.reduce((sum, t) => sum + t.modules.length, 0);
  const totalLessons = themes.reduce(
    (sum, t) => sum + t.modules.reduce((a, m) => a + m.lessons.length, 0),
    0,
  );

  const stats = [
    { num: themes.length, unit: "テーマ", label: "Learning Themes" },
    { num: totalModules, unit: "モジュール", label: "Modules" },
    { num: totalLessons, unit: "レッスン", label: "Lessons" },
  ];

  return (
    <>
      <ScrollReveal />

      {/* ---------- Hero ---------- */}
      <section className="hero" id="top">
        <div className="wrap hero__in">
          <div className="kicker reveal">SINGULARITY LAB · KNOWLEDGE</div>
          <h1 className="hero__title reveal">
            つくる力を、<span className="accent">体系的</span>に。
          </h1>
          <p className="hero__lead reveal">{site.description}</p>

          <div className="hero__stats reveal">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__num">
                  {s.num}
                  <span className="unit">{s.unit}</span>
                </div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Themes ---------- */}
      <section className="section" id="themes">
        <div className="wrap">
          <div className="section__head reveal">
            <div>
              <span className="section__eyebrow">01 — Themes</span>
              <h2 className="section__title">
                学びの<span className="accent">テーマ</span>
              </h2>
            </div>
            <p className="section__note">
              基礎から実践まで。興味のある領域から、順番に進められます。
            </p>
          </div>

          <ul className="themes__grid">
            {themes.map((theme, i) => {
              const color = normalizeThemeColor(theme.meta.color);
              const [c, c2] = THEME_HEX[color];
              const Icon = THEME_ICON[theme.meta.icon ?? ""] ?? BookIcon;
              const no = String(i + 1).padStart(2, "0");
              const moduleCount = theme.modules.length;
              const lessonCount = theme.modules.reduce((a, m) => a + m.lessons.length, 0);
              const isDraft = theme.meta.status === "draft";
              const cardStyle = { "--c": c, "--c2": c2 } as CSSProperties;

              const inner = (
                <>
                  <div className="card__top">
                    <span className="card__icon">
                      <Icon />
                    </span>
                    <span className="card__no">{no}</span>
                  </div>
                  <div className="card__body">
                    {isDraft ? <span className="card__badge">執筆予定</span> : null}
                    <h3 className="card__title">{theme.meta.title}</h3>
                    <p className="card__desc">{theme.meta.description}</p>
                  </div>
                  <div className="card__foot">
                    <div className="card__meta">
                      {moduleCount} モジュール <span className="dot" /> {lessonCount} レッスン
                    </div>
                    {isDraft ? null : (
                      <span className="card__go">
                        <ArrowIcon />
                      </span>
                    )}
                  </div>
                </>
              );

              return (
                <li className="reveal" key={theme.slug} style={{ transitionDelay: `${i * 90}ms` }}>
                  {isDraft ? (
                    <div className="card card--draft" style={cardStyle} aria-disabled="true">
                      {inner}
                    </div>
                  ) : (
                    <Link className="card" href={`/themes/${theme.slug}`} style={cardStyle}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
