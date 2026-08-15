/**
 * `/themes/**` のうち認証必須の境界を判定する。
 *
 * 一覧ページ（`/themes`、`/themes/<theme>`、`/themes/<theme>/<module>`）はメタ情報のみで
 * 本文を含まないため公開とし、記事本文（`/themes/<theme>/<module>/<lesson>[/<detail>]`）
 * のみを認証必須にする。`proxy.ts` と `tests/auth/route-protection.test.ts` の両方から
 * 参照される単一の真実のソース。
 */
export function isProtectedPath(pathname: string): boolean {
  if (pathname !== "/themes" && !pathname.startsWith("/themes/")) return false;
  const segments = pathname.split("/").filter(Boolean).slice(1); // "themes" を除いた残り
  return segments.length >= 3;
}
