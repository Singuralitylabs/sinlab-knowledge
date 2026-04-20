# CLAUDE.md

このファイルは、本リポジトリのコードを扱う際の Claude Code (claude.ai/code) へのガイダンスを提供します。

@AGENTS.md

## コミット方針

- **コミット前には必ずユーザーに確認を取ること。** 明示的な承認を得るまで `git commit` を実行してはいけません。変更内容の要約とコミットメッセージ案を提示し、承認を得てからコミットしてください。

## ランタイムとツール

- **Bun 1.x** はパッケージマネージャ **かつ** TS ランタイム — `bun install`、`bun run <script>`、`bun scripts/foo.ts` で TypeScript を直接実行できます（`tsx`/`ts-node` は不要）。
- **Biome** が ESLint+Prettier を置き換えます。設定: `biome.json`（2 スペース、100 列、ダブルクォート、末尾カンマ、LF）。`app/globals.css` は Biome の対象外です。
- **Next.js 16 (App Router) + React 19**。`AGENTS.md` を参照: API は旧バージョンの Next.js とは異なります。新しい Next 固有コードを書く前に `node_modules/next/dist/docs/`（特に `01-app/02-guides/upgrading/version-16.md`）を確認してください。

## コマンド

| コマンド | 用途 |
|---|---|
| `bun run dev` | `http://localhost:3000` で開発サーバを起動 |
| `bun run build` | 本番ビルド（Next.js のみ。設計ドキュメントに記載の Pagefind は **未接続**） |
| `bun run lint` | `biome check .` + `bun run check:content`（frontmatter 検証）。コミット前に実行してください。 |
| `bun run check` | `biome check --write .`（lint/format の自動修正） |
| `bun run format` | `biome format --write .` |
| `bun run check:content` | `bun scripts/check-content.ts` — すべての `_site.json` / `_theme.json` / `_module.json` / レッスン frontmatter を zod で検証。最初の失敗バッチで非ゼロ終了。 |
| `bun run migrate:web-skill` | `web-skill-lessons` ソースから Web基礎 テーマを再インポート |
| `bun run migrate:cc-website` | `claude-code-website` から AI駆動開発 Module 03 を再インポート |

テストランナーは構成されていません。

## 環境

`.env.local` には以下を定義する必要があります:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`lib/supabase/env.ts:resolveSupabaseEnv()` は、どちらかが欠けていると起動時に例外を投げます — これは意図的です（認証ゲートが黙って通過してはいけない）。Supabase プロジェクトは `singularity-lab-portal` と共有しています。

## アーキテクチャ

### コンテンツが真実のソース（ファイルシステム駆動）

中心となるルール: **コンテンツの追加 = `content/` 配下に Markdown ファイルを追加するだけ。コード変更は不要**。以下で強制されます:

- `content/themes/<NN-theme>/<NN-module>/lessons/*.md` — `NN-` プレフィックスでソート（URL スラグからは `lib/content/slug.ts:toUrlSlug` により除去）。
- 階層: `Site → Theme → Module → Lesson`。レクチャー種別はファイル配置ではなく frontmatter（`type: lecture | detail | reference | cheatsheet`）のみで区別します。
- **2 種類のレッスンレイアウト**（どちらも `lib/content/loader.ts:loadLessonsForModule` が処理）:
  - **ファイル型レクチャー**: `lessons/NN-slug.md`
  - **ディレクトリ型レクチャー**: `lessons/NN-slug/index.md` + 兄弟の `NN-*.md` ファイルが "details"（サブページ）になります。`index.md` が無い場合は検証エラーです。
- メタファイルは `_` プレフィックス（`_site.json`、`_theme.json`、`_module.json`）で、ディレクトリ走査から除外されます。
- **すべての frontmatter / メタ JSON は `lib/content/schema.ts` で zod 検証**。同じスキーマがビルド時（`loader.ts`）と `scripts/check-content.ts` の両方で動作します。
- **ステータスゲート**: レッスン/モジュール/テーマの `status: "draft"` は `process.env.NODE_ENV === "production"` の場合のみ非表示 — `bun run dev` では draft も表示されます。`status: "deprecated"` は表示されたままですが、UI 側でマークすべきです。

### レンダリングパイプライン

`lib/content/mdx.ts:renderMarkdown` は単一の MD→HTML エントリポイントです:

```
remark-parse → remark-gfm → remark-directive → remarkDetailDirective
  → remark-github-blockquote-alert → (H2/H3 → TOC collector)
  → remark-rehype (allowDangerousHtml)
  → rehype-raw → rehype-slug → rehypeExternalLinks
  → rehype-pretty-code (Shiki, theme: "github-light") → rehype-stringify
```

注意点:
- TOC の id は `GithubSlugger` で生成し、`rehype-slug` の重複排除動作を完全にミラーします（同じテキストが 2 回現れると TOC と見出し両方に `-1`、`-2` サフィックスが付与されます）。
- `::detail{slug="..."}` は **カスタム remark ディレクティブ** で、detail サブページへのカードリンクをレンダリングします。ページ側が `Map<slug, DetailRef>` をレンダリングコンテキスト経由で渡す必要があります。未知のスラグは赤いエラーブロックとして明示的に表示されます（意図的 — コンテンツのバグは執筆中に表面化させるため）。
- 外部リンク（`http(s)://...`）には自動的に `target="_blank"` + `rel="noopener noreferrer"` が付与されます。相対リンクは同一タブのままです。

### ローダーキャッシュ

`lib/content/loader.ts` の `loadContentTree()` は `React.cache` でラップされています。すべてのテーマ/モジュール/レッスン参照はここを経由するため、`content/` ツリーは **レンダリングごとに 1 回だけ** 走査されます。下流のヘルパ（`lib/themes.ts`）はそのツリー上での純粋なインメモリフィルタです。

隣接関係（`getAdjacentLessonsInModule`）はスコープ化されています:
- トップレベルのレクチャーはレクチャー同士でナビゲート（detail はスキップ）。
- detail は **兄弟の detail のみ** でナビゲート。
- モジュール/テーマの境界を越えない — 設計上の意図（テーマは独立）。

### ルーティング

- パブリック: `/`、`/about`
- **保護対象（認証ゲート付き）: `/themes/**`** — **両方必須**の 2 層で強制:
  1. `proxy.ts`（Next.js 16 で `middleware.ts` → `proxy.ts` にリネーム）: 楽観的な `supabase.auth.getUser()` チェック、未認証ユーザーを `/login?returnTo=<path>` にリダイレクト。マッチャーは `/themes/:path*`。
  2. `app/(protected)/layout.tsx`: `getServerAuth()` 経由のサーバサイド厳格チェック — `status === "active"` のユーザーのみ通過、`"rejected"` → `/rejected`、それ以外 → `/pending`。
- 認証ルートは `app/(auth)/` 配下 — ルートグループであり URL の一部ではありません。
- レッスン catch-all: `app/(protected)/themes/[themeSlug]/[...slug]/page.tsx`。

### 認証フローの詳細

- `lib/auth/server-auth.ts:getServerAuth()` は `React.cache` 化されています — レンダリング内で自由に呼んでよく、Supabase への往復は 1 回のみです。
- アローリストチェックは `users` テーブル（`auth_id`、`status`、`is_deleted`）から読み取ります。未知の `status` 文字列は `null` に強制変換されます（≒ pending）。
- OAuth の return URL ラウンドトリップは `sk_auth_return_to` クッキー（定数は `lib/auth/constants.ts`）を使用し、`redirectTo` クエリパラメータは使いません — Supabase の Redirect URL 許可リストはクエリ文字列を確実に受け付けないためです。ログインボタンがクッキーをセットし、`app/(auth)/callback/route.ts` が読み取って削除します。`/` で始まる値のみ受け入れます（オープンリダイレクト対策）。
- Supabase クライアントはコンテキストごとに分割され、すべて `resolveSupabaseEnv()` を経由します:
  - `lib/supabase/client.ts` — ブラウザ（`createBrowserClient`）
  - `lib/supabase/server.ts` — Server Components / Route Handlers / Server Actions（`createServerClient` + `next/headers` のクッキー。RSC からの書き込み失敗は黙って無視）
  - `lib/supabase/proxy.ts` — `proxy.ts` のリクエスト/レスポンスのクッキー配管

## 維持すべき規約

- **ESLint/Prettier 設定は入れない** — 追加しないでください。lint+format は Biome が所有します。
- **`@/*` パスエイリアス** はリポジトリルートを指します（`tsconfig.json`）。
- **レッスン/モジュール/テーマのリストをコードにハードコードしない。** 配列リテラルに手が伸びたら立ち止まってください — すべてのそうしたリストを `content/` から派生させるのが設計目標です。
- MDX パイプラインに触れるときは、TOC id と見出し id の重複排除の同期を保つこと（GithubSlugger ↔ rehype-slug）。
- `docs/design/01-architecture.md` と `docs/design/02-content-structure.md` が正規の設計ドキュメントです。アーキテクチャを変更する場合はこれらも更新してください。
