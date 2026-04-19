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
  /** Foreground text color used on tinted surfaces. */
  textStrong: string;
  /** Solid background for badges / dots. */
  bgSolid: string;
  /** Ring color for focus / active states. */
  ring: string;
}

/**
 * Returns Tailwind class strings for a given theme color.
 * Designed for the light theme (white base).
 */
export function getThemeColorClasses(color: string | undefined | null): ThemeColorClasses {
  switch (normalizeThemeColor(color)) {
    case "blue":
      return {
        bgSoft: "bg-blue-50",
        border: "border-blue-200",
        borderHover: "hover:border-blue-400",
        text: "text-blue-700",
        textStrong: "text-blue-800",
        bgSolid: "bg-blue-600",
        ring: "ring-blue-500/40",
      };
    case "green":
      return {
        bgSoft: "bg-emerald-50",
        border: "border-emerald-200",
        borderHover: "hover:border-emerald-400",
        text: "text-emerald-700",
        textStrong: "text-emerald-800",
        bgSolid: "bg-emerald-600",
        ring: "ring-emerald-500/40",
      };
    case "purple":
      return {
        bgSoft: "bg-purple-50",
        border: "border-purple-200",
        borderHover: "hover:border-purple-400",
        text: "text-purple-700",
        textStrong: "text-purple-800",
        bgSolid: "bg-purple-600",
        ring: "ring-purple-500/40",
      };
    case "orange":
      return {
        bgSoft: "bg-orange-50",
        border: "border-orange-200",
        borderHover: "hover:border-orange-400",
        text: "text-orange-700",
        textStrong: "text-orange-800",
        bgSolid: "bg-orange-600",
        ring: "ring-orange-500/40",
      };
    default:
      return {
        bgSoft: "bg-gray-50",
        border: "border-gray-200",
        borderHover: "hover:border-gray-400",
        text: "text-gray-700",
        textStrong: "text-gray-900",
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
