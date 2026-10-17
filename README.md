# Sinlab Knowledge

シンギュラリティ・ラボが運営する、エンジニアリング知識を体系的に学べる社内向け解説サイト。

Web 開発の基礎から AI 駆動開発まで、実務で使える知識を **テーマ → モジュール → レッスン** の 3 階層で整理し、Markdown ファイルとして蓄積していきます。コンテンツを追加するだけでサイトに反映される、ファイルシステム駆動のアーキテクチャを採用しています。

- 公開 URL: <https://knowledge.future-tech-association.org>（<https://sinlab-skills.vercel.app> でも到達可能）
- **シンラボ会員専用**: `/themes/**` 配下のコンテンツはシンラボ会員のみがアクセス可能です。Supabase 認証のアローリストで保護されており、閲覧には承認済みのシンラボ会員アカウントでのログインが必要です。

収録テーマの構成は `content/themes/`（各テーマの `_theme.json`）を参照してください。

## セットアップ

Bun 1.x が必要です。

```bash
cp .env.local.example .env.local   # NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY を記入
bun install
bun run dev                        # http://localhost:3000
```

開発ルール・コマンド・アーキテクチャは [AGENTS.md](./AGENTS.md) を、コンテンツの書き方は [docs/02-content-structure.md](./docs/02-content-structure.md) を参照してください。

## ライセンス

Proprietary (Singularity Lab)
