/**
 * Maps theme color tokens (from `_theme.json`) to Tailwind classes.
 *
 * Theme colors are intentionally limited to a small palette so they can be
 * statically analyzed by Tailwind. Keep all class strings as full literals
 * (no string interpolation in JSX) so the JIT does not drop them.
 */

export type ThemeColor = "blue" | "green" | "purple" | "orange" | "gray";

const KNOWN_COLORS: ReadonlySet<ThemeColor> = new Set([
  "blue",
  "green",
  "purple",
  "orange",
  "gray",
]);

export function normalizeThemeColor(color: string | undefined | null): ThemeColor {
  if (color && (KNOWN_COLORS as Set<string>).has(color)) {
    return color as ThemeColor;
  }
  return "gray";
}

export interface ThemeColorClasses {
  /** Subtle tinted background (e.g. card backgrounds). */
  bgSoft: string;
  /** Border color for cards / pills. */
  border: string;
  /** Border color when hovered. */
  borderHover: string;
  /** Foreground text color (used for accents / titles). */
  text: string;
  /** Foreground text color used on dark surfaces. */
  textStrong: string;
  /** Solid background for badges / dots. */
  bgSolid: string;
  /** Ring color for focus / active states. */
  ring: string;
}

/**
 * Returns Tailwind class strings for a given theme color.
 * Designed for the dark theme (gray-950 base).
 */
export function getThemeColorClasses(color: string | undefined | null): ThemeColorClasses {
  switch (normalizeThemeColor(color)) {
    case "blue":
      return {
        bgSoft: "bg-blue-500/10",
        border: "border-blue-500/30",
        borderHover: "hover:border-blue-400/60",
        text: "text-blue-300",
        textStrong: "text-blue-200",
        bgSolid: "bg-blue-500",
        ring: "ring-blue-500/40",
      };
    case "green":
      return {
        bgSoft: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        borderHover: "hover:border-emerald-400/60",
        text: "text-emerald-300",
        textStrong: "text-emerald-200",
        bgSolid: "bg-emerald-500",
        ring: "ring-emerald-500/40",
      };
    case "purple":
      return {
        bgSoft: "bg-purple-500/10",
        border: "border-purple-500/30",
        borderHover: "hover:border-purple-400/60",
        text: "text-purple-300",
        textStrong: "text-purple-200",
        bgSolid: "bg-purple-500",
        ring: "ring-purple-500/40",
      };
    case "orange":
      return {
        bgSoft: "bg-orange-500/10",
        border: "border-orange-500/30",
        borderHover: "hover:border-orange-400/60",
        text: "text-orange-300",
        textStrong: "text-orange-200",
        bgSolid: "bg-orange-500",
        ring: "ring-orange-500/40",
      };
    default:
      return {
        bgSoft: "bg-gray-500/10",
        border: "border-gray-500/30",
        borderHover: "hover:border-gray-400/60",
        text: "text-gray-300",
        textStrong: "text-gray-100",
        bgSolid: "bg-gray-500",
        ring: "ring-gray-500/40",
      };
  }
}

/**
 * Resolve an icon string (from `_theme.json` / `_module.json`) to a small emoji
 * fallback. We deliberately avoid pulling in an icon library for Phase 1.
 */
export function iconFallback(name: string | undefined | null): string {
  if (!name) return "📚";
  const map: Record<string, string> = {
    BookOpen: "📖",
    Code: "💻",
    Sparkles: "✨",
    Globe: "🌐",
    FileText: "📄",
    Terminal: "⌨️",
    GitBranch: "🌿",
    Rocket: "🚀",
    Settings: "⚙️",
    Search: "🔍",
    Layers: "🧱",
    Wrench: "🔧",
    Brain: "🧠",
  };
  return map[name] ?? "📚";
}
