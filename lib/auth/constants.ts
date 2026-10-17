// Cookie carrying the post-OAuth return path. A query string in redirectTo may not match the
// Supabase Redirect URLs allow-list, so returnTo is passed through this cookie instead.
export const RETURN_TO_COOKIE = "sk_auth_return_to";
