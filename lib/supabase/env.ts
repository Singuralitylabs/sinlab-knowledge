// Supabase の必須環境変数を解決する。
// - NEXT_PUBLIC_* はクライアントではビルド時に静的リテラルへ置換されるため、
//   ここでは直接参照し、未設定時は明示的に throw して起動を失敗させる。
// - 認証ゲートで空文字のまま動かすと被害が大きいため、
//   開発時も本番時も同じ挙動（早期 throw）で揃える。
export function resolveSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must both be set.",
    );
  }

  return { url, anonKey };
}
