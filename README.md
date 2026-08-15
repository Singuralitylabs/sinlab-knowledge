# Sinlab Knowledge

シンギュラリティ・ラボが運営する、エンジニアリング知識を体系的に学べる社内向け解説サイト。

Web 開発の基礎から AI 駆動開発まで、実務で使える知識を **テーマ → モジュール → レッスン** の 3 階層で整理し、Markdown ファイルとして蓄積していきます。コンテンツを追加するだけでサイトに反映される、ファイルシステム駆動のアーキテクチャを採用しています。

- 公開 URL: <https://sinlab-skills.vercel.app>
- **記事本文はシンラボ会員専用**: テーマ・モジュール・レッスンの一覧ページは誰でも閲覧できますが、記事本文（`/themes/<theme>/<module>/<lesson>[/<detail>]`）はシンラボ会員のみがアクセス可能です。Supabase 認証のアローリストで保護されており、閲覧には承認済みのシンラボ会員アカウントでのログインが必要です。

収録テーマの実際の構成は `content/themes/`（各テーマの `_theme.json`）を参照してください。テーマ・モジュールは今後も追加されていきます。

## 技術スタック

- **Next.js 16** (App Router) + **React 19**
- **TypeScript 5** (strict)
- **Tailwind CSS 4** + `@tailwindcss/typography`
- **Bun 1.x** — パッケージ管理 + TypeScript ランタイム + テストランナー
- **Biome** — lint + format (ESLint / Prettier は使わない)
- **unified** (remark + rehype) + **Shiki** — Markdown → HTML レンダリング
- **zod** — frontmatter / メタ JSON のスキーマ検証
- **Supabase** — 認証 (OAuth + アローリスト)
- **Vercel** — ホスティング

## アーキテクチャの要点

- **コンテンツが Single Source of Truth**: レッスンを増やすには `content/themes/<NN-theme>/<NN-module>/lessons/` 配下に Markdown ファイルを追加するだけ。ルート定義やナビゲーションに手を入れる必要はありません。
- **2 種類のレッスン形式**: 単一ファイル型 (`NN-slug.md`) と、本文 + サブページ (details) を持つディレクトリ型 (`NN-slug/index.md`)。
- **frontmatter は zod で厳密検証**: ビルド時と `bun run check:content` の両方で同じスキーマが走ります。
- **二層の認証ゲート**: `proxy.ts` (旧 `middleware.ts`) による楽観的チェックと、`app/(protected)/layout.tsx` によるサーバサイドの厳格チェックを併用。
- 詳細は `docs/01-architecture.md` (アーキテクチャ)、`docs/02-content-structure.md` (執筆ルール)、`docs/03-testing.md` (テスト設計) を参照。

## ディレクトリ構成

| 領域 | 場所 |
|---|---|
| ページ (App Router) | `app/` |
| UI コンポーネント | `components/` |
| ライブラリ (loader / mdx / themes / auth) | `lib/` |
| コンテンツ (SSOT) | `content/themes/` |
| 単発ページ (About 等) | `content/pages/` |
| サイトメタ | `content/_site.json` |
| ユニットテスト | `tests/` |
| 開発用スクリプト (`check-content.ts` / `dev/print-tree.ts`) | `scripts/` |
| 設計ドキュメント | `docs/` |

## 開発

### 必要環境

- Bun 1.x (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 20.x 以上 (Next.js 内部で使用)
- Supabase の環境変数 (`.env.local.example` をコピーして値を設定):
  ```bash
  cp .env.local.example .env.local
  # NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY を記入
  ```

### セットアップ

```bash
bun install
bun run dev
# http://localhost:3000
```

### よく使うコマンド

| コマンド | 内容 |
|---|---|
| `bun run dev` | 開発サーバ起動 |
| `bun run build` | 本番ビルド |
| `bun run start` | 本番起動 |
| `bun run lint` | Biome + frontmatter 検証（コミット前に実行） |
| `bun run typecheck` | 型チェック (`tsc --noEmit`) |
| `bun test` | ユニットテスト (`tests/` 配下) |
| `bun run format` | Biome で全ファイルフォーマット |
| `bun run check` | Biome 自動修正 |
| `bun run check:content` | コンテンツ frontmatter 検証のみ |

CI (`.github/workflows/`) では lint / content / typecheck / test / build が PR ごとに自動実行されます。

## コンテンツ追加

詳細な手順・frontmatter / メタ JSON のテンプレートは `docs/02-content-structure.md` を参照。最小手順:

```bash
# レッスンファイルを作成
touch content/themes/{theme}/{module}/lessons/NN-slug.md
# frontmatter (title / order / type / difficulty / status など) と本文を書く
# ※ 新規モジュール / テーマの場合は _module.json / _theme.json も必要

bun run check:content   # 検証
bun run dev             # ブラウザ確認
```

`status: draft` を指定したコンテンツは、開発環境では表示されますが本番ビルドから自動的に除外されます。

## ライセンス

Proprietary (Singularity Lab)
