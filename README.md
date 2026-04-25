# Sinlab Knowledge

シンギュラリティ・ラボが運営する、エンジニアリング知識を体系的に学べる社内向け解説サイト。

Web 開発の基礎から AI 駆動開発まで、実務で使える知識を **テーマ → モジュール → レッスン** の 3 階層で整理し、Markdown ファイルとして蓄積していきます。コンテンツを追加するだけでサイトに反映される、ファイルシステム駆動のアーキテクチャを採用しています。

- 公開 URL: <https://sinlab-skills.vercel.app>
- **シンラボ会員専用**: `/themes/**` 配下のコンテンツはシンラボ会員のみがアクセス可能です。Supabase 認証のアローリストで保護されており、閲覧には承認済みのシンラボ会員アカウントでのログインが必要です。

## 収録テーマ

| # | テーマ | 内容 |
|---|---|---|
| 01 | **Web技術基礎** | Markdown・Git など、Web 開発を進める上で前提となる周辺スキル |
| 02 | **Web 開発基礎** | HTML / CSS / JavaScript の基本 |
| 03 | **Web 開発応用** | React・Next.js・スタイリング・データフェッチ・DB・フォーム・デプロイ |
| 04 | **AI 駆動開発** | AI コーディングツールの全体像と、Claude Code を軸にした実践 |

テーマ・モジュールは今後も追加されていきます。実際の構成は `content/themes/` を参照してください。

## 技術スタック

- **Next.js 16** (App Router) + **React 19**
- **TypeScript 5** (strict)
- **Tailwind CSS 4** + `@tailwindcss/typography`
- **Bun 1.x** — パッケージ管理 + TypeScript ランタイム
- **Biome** — lint + format (ESLint / Prettier は使わない)
- **unified** (remark + rehype) + **Shiki** — Markdown → HTML レンダリング
- **zod** — frontmatter / メタ JSON のスキーマ検証
- **Supabase** — 認証 (OAuth + アローリスト)
- **Vercel** — ホスティング

## アーキテクチャの要点

- **コンテンツが Single Source of Truth**: レッスンを増やすには `content/themes/<NN-theme>/<NN-module>/lessons/NN-slug.md` を追加するだけ。ルート定義やナビゲーションに手を入れる必要はありません。
- **2 種類のレッスン形式**: 単一ファイル型 (`NN-slug.md`) と、本文 + サブページ (details) を持つディレクトリ型 (`NN-slug/index.md`)。
- **frontmatter は zod で厳密検証**: ビルド時と `bun run check:content` の両方で同じスキーマが走ります。
- **二層の認証ゲート**: `proxy.ts` (旧 `middleware.ts`) による楽観的チェックと、`app/(protected)/layout.tsx` によるサーバサイドの厳格チェックを併用。
- 詳細は `docs/design/01-architecture.md` および `docs/design/02-content-structure.md` を参照。

## ディレクトリ構成

| 領域 | 場所 |
|---|---|
| ページ (App Router) | `app/` |
| UI コンポーネント | `components/` |
| ライブラリ (loader / mdx / themes / auth) | `lib/` |
| コンテンツ (SSOT) | `content/themes/` |
| 単発ページ (About 等) | `content/pages/` |
| サイトメタ | `content/_site.json` |
| 移行スクリプト | `scripts/migrate/` |
| 設計ドキュメント | `docs/design/` |

## 開発

### 必要環境

- Bun 1.x (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 20.x 以上 (Next.js 内部で使用)
- `.env.local` に Supabase の環境変数:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
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
| `bun run format` | Biome で全ファイルフォーマット |
| `bun run check` | Biome 自動修正 |
| `bun run check:content` | コンテンツ frontmatter 検証のみ |
| `bun run migrate:web-skill` | `web-skill-lessons` から Web技術基礎テーマを再生成 |
| `bun run migrate:cc-website` | `claude-code-website` から AI駆動開発 Module 03 を再生成 |

## コンテンツ追加

詳細は `docs/design/02-content-structure.md` の §6 拡張ルールを参照。最小手順:

```bash
# レッスンファイルを作成
touch content/themes/{theme}/{module}/lessons/NN-slug.md
# frontmatter (title / order / type / difficulty / tags / status) と本文を書く

bun run check:content   # 検証
bun run dev             # ブラウザ確認
```

`status: draft` を指定したコンテンツは、開発環境では表示されますが本番ビルドから自動的に除外されます。

## デプロイ (Vercel)

1. GitHub に push
2. Vercel ダッシュボードで GitHub リポジトリを Import
3. Install Command: `bun install` (lock ファイルから自動検出されることが多い)
4. Build Command: `next build` (デフォルト)
5. Production Branch: `main`
6. Environment Variables に Supabase の 2 変数を設定

PR ごとに Preview URL が自動生成されます。

## ライセンス

Proprietary (Singularity Lab)
