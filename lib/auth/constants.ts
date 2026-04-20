// OAuth リダイレクト後に遷移するパスを一時保存するための cookie 名。
// redirectTo に query string を含めると Supabase の Redirect URLs allowlist と
// 一致しない場合があるため、returnTo はこの cookie 経由で受け渡す。
export const RETURN_TO_COOKIE = "sk_auth_return_to";
