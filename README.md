# Sinlab Knowledge

シンギュラリティ・ラボが運営する、Web 開発や AI 活用などエンジニアリングの知識を体系的に学べる解説サイト。

## 技術スタック

- Next.js 16 (App Router) + React 19
- TypeScript 5 (strict)
- Tailwind CSS 4 + `@tailwindcss/typography`
- Bun 1.x (パッケージ管理 + TS ランタイム)
- Biome (lint + format)
- unified (remark + rehype) + Shiki — Markdown レンダリング
- zod — フロントマター検証
- Vercel (デプロイ)

## 構成

| 領域 | 場所 |
|---|---|
| ページ (App Router) | `app/` |
| コンポーネント | `components/` |
| ライブラリ (loader / mdx / themes) | `lib/` |
| コンテンツ (SSOT) | `content/themes/` |
| 単発ページ | `content/pages/` |
| サイトメタ | `content/_site.json` |
| 移行スクリプト | `scripts/migrate/` |
| 設計ドキュメント | `docs/design/` |

詳細は `docs/design/01-architecture.md` を参照。

## 開発

### 必要環境

- Bun 1.x (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 20.x 以上 (Next.js 内部で使用)

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
| `bun run lint` | Biome + フロントマター検証 |
| `bun run format` | Biome で全ファイルフォーマット |
| `bun run check` | Biome 自動修正 |
| `bun run check:content` | コンテンツ frontmatter 検証 |
| `bun run migrate:web-skill` | web-skill-lessons から Web基礎テーマを再生成 |
| `bun run migrate:cc-website` | claude-code-website から AI駆動開発の Module 03 を再生成 |

## コンテンツ追加

詳細は `docs/design/02-content-structure.md` の §6 拡張ルールを参照。最小手順:

```bash
touch content/themes/{theme}/{module}/lessons/NN-slug.md
# frontmatter (title / order / type / difficulty / tags / status) と本文を書く
bun run check:content   # 検証
bun run dev             # ブラウザ確認
```

`status: draft` を指定すれば本番ビルドから自動除外されます。

## デプロイ (Vercel)

1. GitHub に push
2. Vercel ダッシュボードで GitHub リポジトリを Import
3. Install Command: `bun install` (lock ファイルから自動検出されることが多い)
4. Build Command: `next build` (デフォルト)
5. Production Branch: `main`

PR ごとに Preview URL が自動生成されます。

## ライセンス

Proprietary (Singularity Lab)
