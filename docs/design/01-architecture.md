# Sinlab Knowledge — 設計ドキュメント (1) アーキテクチャ・コンテンツモデル

## 0. 設計の核となる方針

> **新コンテンツ追加 = `content/` にMarkdownファイルを置くだけ**
>
> コードを変更せず、ファイルシステムの規約とフロントマターだけで完結する設計とする。

既存`web-skill-lessons`の設計 (`lib/lessons.ts` に配列ハードコード) では、レッスン1本追加するたびに型・配列・ファイル名の3か所を同期させる必要があった。これを**ファイルシステム駆動 + フロントマター**に切り替えることで、執筆者がエンジニアリング知識なしでもコンテンツ追加できる構造にする。

### 用語と階層

```
Site
└── Theme           (例: 01-web-basics)        ★ 独立した知識領域
    └── Module      (例: 01-markdown)
        └── Lesson  (Markdownファイル1本)      ★ 解説記事も個別レッスンも全て "lesson"
```

- **Theme (テーマ)**: 独立した知識領域。「コース」のような順序学習を強制しない、各テーマ単独で完結する解説群
- **Module (モジュール)**: テーマ内の章立て
- **Lesson (レッスン)**: 解説記事 (lecture型) も個別記法 (reference型) もすべて "lesson" として扱う。型は frontmatter の `type` で区別

> **本サイトは解説サイトとして構成する**。手順を追って手を動かすハンズオン形式は採用しない。

---

## 1. 技術スタック (確定)

| レイヤ | 採用 | 備考 |
|---|---|---|
| Framework | Next.js 16 (App Router) | 既存サイトと同一、Server Componentsで MD 読込が最簡 |
| 言語 | TypeScript 5 (strict) | |
| パッケージ管理 / ランタイム | **Bun 1.x** | `bun install` / `bun run` / TS を直接実行可 (`tsx`不要) |
| Lint / Format | **Biome** | ESLint + Prettier 代替の単一ツール、Rust 製で高速 |
| スタイル | Tailwind CSS 4 + `@tailwindcss/typography` | `prose`で本文整形 |
| MD処理 | unified (remark + rehype) + Shiki | 生HTML混在に強い (MDX非採用) |
| フロントマター | gray-matter | YAML/JSON両対応 |
| コードハイライト | rehype-pretty-code + Shiki | テーマ: `github-dark-dimmed` |
| Mermaid | @theguild/remark-mermaid (ビルド時SVG) | 限定使用 (ロードマップ・Gitブランチ図) |
| GFM Alerts | remark-github-blockquote-alert | `> [!INFO]`等を変換 |
| 検索 | Pagefind (静的インデックス) | CJK対応 |
| デプロイ | **Vercel** | Next.js公式・プレビューURL自動生成 |
| 進捗機能 | **不採用** | |

---

## 2. ディレクトリ構造 (拡張性最優先)

```
sinlab-skills/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # 共通レイアウト
│   ├── page.tsx                      # トップページ
│   ├── globals.css
│   ├── themes/
│   │   ├── page.tsx                  # テーマ一覧
│   │   └── [themeSlug]/
│   │       ├── page.tsx              # テーマトップ
│   │       └── [...slug]/page.tsx    # モジュール / レッスン (catch-all)
│   ├── search/page.tsx
│   └── about/page.tsx
│
├── content/                          # ★ Single Source of Truth
│   ├── _site.json                    # サイトメタ (タイトル/説明/ナビ順)
│   ├── themes/
│   │   ├── 01-web-basics/
│   │   │   ├── _theme.json           # テーマメタ (title/description/icon/color/...)
│   │   │   ├── 01-markdown/
│   │   │   │   ├── _module.json      # モジュールメタ (title/description/categories)
│   │   │   │   └── lessons/
│   │   │   │       ├── 01-intro-kiso.md       # 解説記事 (type: lecture)
│   │   │   │       ├── 02-headings.md         # 個別記法 (type: reference)
│   │   │   │       ├── 03-paragraphs.md
│   │   │   │       └── ...
│   │   │   └── 02-git/
│   │   │       ├── _module.json
│   │   │       └── lessons/...
│   │   ├── 02-web-development/
│   │   │   ├── _theme.json
│   │   │   ├── 01-react-basics/
│   │   │   │   ├── _module.json
│   │   │   │   └── lessons/...
│   │   │   └── ...
│   │   └── 03-ai-driven-development/
│   │       ├── _theme.json
│   │       └── ...
│   └── pages/                        # 単発ページ用 (about/privacy等)
│       ├── about.md
│       └── privacy.md
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # ナビは _site.json から動的生成
│   │   ├── Footer.tsx
│   │   └── DocLayout.tsx             # 左Sidebar + 本文 + 右TOC
│   ├── nav/
│   │   ├── Sidebar.tsx               # モジュール内レッスン一覧 (自動生成)
│   │   ├── TOC.tsx                   # 右側目次 (見出し自動抽出)
│   │   ├── LessonNav.tsx             # 同モジュール内の前後リンク
│   │   └── Breadcrumb.tsx
│   ├── content/
│   │   ├── CodeBlock.tsx             # コピーボタン付き
│   │   ├── Callout.tsx               # GFM Alerts
│   │   ├── Mermaid.tsx
│   │   └── LessonCard.tsx
│   └── theme/
│       ├── ThemeCard.tsx
│       └── ModuleCard.tsx
│
├── lib/
│   ├── content/
│   │   ├── loader.ts                 # ★ content/ 全走査・キャッシュ
│   │   ├── frontmatter.ts            # gray-matter ラッパー
│   │   ├── mdx.ts                    # unified パイプライン
│   │   ├── toc.ts                    # 見出し抽出
│   │   ├── schema.ts                 # フロントマター型定義 + zod検証
│   │   └── slug.ts                   # ファイル名→slug変換
│   ├── site.ts                       # _site.json 読込
│   ├── themes.ts                     # themes/ 走査API
│   └── search.ts                     # Pagefind ヘルパ
│
├── scripts/
│   └── migrate/                      # 旧コンテンツ→content/ 移行
│       ├── import-web-skill.ts       # → 01-web-basics/{markdown,git}
│       ├── import-team-lessons.ts    # → 02-web-development/Module 01-05
│       ├── import-deploy.ts          # → 02-web-development/06-deployment
│       ├── import-ai-coding.ts       # → 03-ai-driven-development/01-overview
│       ├── import-claude-code-website.ts # → 03-ai-driven-development/02-claude-code
│       └── shared/{frontmatter,filename}.ts
│
├── public/
│   └── og/                           # OGP画像
│
├── docs/                             # 内部開発ドキュメント
│   ├── design/                       # ← このドキュメント
│   ├── AUTHORING.md                  # 執筆ガイド (新コンテンツ追加手順)
│   └── CONTRIBUTING.md
│
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── biome.json                        # Biome 設定 (lint + format)
└── CLAUDE.md
```

### 2.1 拡張性の鍵となる規約

1. **テーマ・モジュールは番号プレフィックスでソート**: `01-web-basics`, `02-web-development`...
2. **メタファイルは `_` プレフィックス**: `_theme.json`, `_module.json` (Markdown走査の対象外)
3. **レッスンは `lessons/NN-slug.md` の単一階層**: 解説記事も個別記法もすべて lessons/ 配下に統一
4. **フロントマターのみで挙動制御**: 配列ハードコード/型リテラルは禁止
5. **テーマは独立管理**: テーマ間の必須依存は持たせない (ロードマップで推奨順を示すのみ)
6. **新テーマ追加 = ディレクトリ追加のみ** (コード一切触らず)

---

## 3. コンテンツモデル

### 3.1 メタデータスキーマ

#### `_site.json` (サイト全体)

```json
{
  "title": "Sinlab Knowledge",
  "description": "シンギュラリティ・ラボが運営する、Web 開発や AI 活用などエンジニアリングの知識を体系的に学べる解説サイト。",
  "siteUrl": "https://skills.sinlab.dev",
  "author": "シンギュラリティ・ラボ",
  "navigation": [
    { "label": "テーマ", "href": "/themes" },
    { "label": "検索",   "href": "/search" },
    { "label": "About",  "href": "/about" }
  ],
  "footer": {
    "links": [
      { "label": "GitHub", "href": "https://github.com/..." },
      { "label": "プライバシー", "href": "/privacy" }
    ]
  }
}
```

#### `_theme.json` (テーマ定義)

```json
{
  "slug": "01-web-basics",
  "title": "Web基礎",
  "shortTitle": "Web基礎",
  "description": "MarkdownとGit。すべての出発点となる必須スキル。",
  "icon": "BookOpen",
  "color": "blue",
  "order": 1,
  "difficulty": "beginner",
  "estimatedHours": 8,
  "status": "published"
}
```

> **テーマ独立性**: テーマ間の依存関係 (`prerequisites` / `recommendedNext`) は持たせない。各テーマは完全に独立した解説領域として扱い、推奨閲覧順や対象者の案内も行わない。

#### `_module.json` (モジュール定義)

```json
{
  "slug": "01-markdown",
  "title": "Markdown",
  "description": "Markdown記法を3カテゴリで体系的に学習",
  "icon": "FileText",
  "order": 1,
  "categories": [
    { "key": "kiso",    "label": "基礎編",  "description": "見出し、リスト、リンクなど11種類" },
    { "key": "ouyou",   "label": "応用編",  "description": "折りたたみ、脚注、数式など10種類" },
    { "key": "kakucho", "label": "拡張編",  "description": "ハイライト、diff構文、フロントマターなど8種類" }
  ],
  "status": "published"
}
```

> モジュールは `categories` を任意で持つ (Sidebar / 一覧表示でグルーピング)。モジュールによっては不要な場合もあり、その時は省略可。

#### レッスンMD のフロントマター

```yaml
---
title: 見出し
description: '#'を使った6段階の見出し記法
order: 2
type: reference        # lecture | reference | cheatsheet
category: kiso         # _module.json の categories[].key を参照 (任意)
difficulty: beginner   # beginner | intermediate | advanced
tags:                  # 自由タグ (検索・フィルタ用)
  - markdown
  - syntax
estimatedMinutes: 5
status: published      # draft | published | deprecated
publishedAt: 2025-01-15
updatedAt: 2025-04-01
relatedLessons:        # 関連レッスンへのスラグ参照 (任意)
  - themes/01-web-basics/01-markdown/lessons/03-paragraphs
authors:               # 任意
  - name: シンギュラリティ・ラボ
---

# 見出し

本文...
```

#### `type` の意味と使い分け

| 値 | 意味 | 表示の特徴 (UI上の差) |
|---|---|---|
| `lecture` | 章のまとまった解説記事 (例: 「基礎編解説」) | 一覧で大きめのカード、`prose-lg` |
| `reference` | 個別記法・コマンド・概念のリファレンス記事 | 一覧でコンパクト、検索ヒット重み高め |
| `cheatsheet` | 一覧・チートシート系 | 印刷向けスタイル可 |

3者は同じ `lessons/` ディレクトリに混在し、`order` で順序を制御する。

### 3.2 zod スキーマによる検証

`lib/content/schema.ts` で全メタの型をzod定義し、ビルド時に検証。フロントマター不備があればビルド失敗 → 品質担保。

```typescript
// lib/content/schema.ts (抜粋イメージ)
export const lessonFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  order: z.number(),
  type: z.enum(["lecture", "reference", "cheatsheet"]),
  category: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.array(z.string()).default([]),
  estimatedMinutes: z.number().optional(),
  status: z.enum(["draft", "published", "deprecated"]).default("published"),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  relatedLessons: z.array(z.string()).default([]),
  authors: z.array(z.object({ name: z.string(), url: z.string().url().optional() })).default([]),
});
```

### 3.3 ステータス制御

| status | 挙動 |
|---|---|
| `draft` | 開発環境のみ表示 (本番ビルドで除外) |
| `published` | 通常表示 |
| `deprecated` | 表示するがバナーで「内容が古い可能性あり」を明示 |

`process.env.NODE_ENV === "production"` で `draft` を除外する判定をloader側で実装。

---

## 4. ルーティング設計

### 4.1 URL設計

| URL | 意味 | データソース |
|---|---|---|
| `/` | トップページ | 静的 + `content/themes/*/_theme.json` |
| `/themes` | テーマ一覧 | `content/themes/*/_theme.json` |
| `/themes/01-web-basics` | テーマトップ | `_theme.json` + 配下モジュール一覧 |
| `/themes/01-web-basics/01-markdown` | モジュールトップ | `_module.json` + 配下レッスン一覧 |
| `/themes/01-web-basics/01-markdown/02-headings` | レッスン本体 | MDファイル |
| `/search` | 検索 | Pagefindインデックス |
| `/about` | About | `content/pages/about.md` |
| `/tags/[tag]` | タグページ (Phase 2) | 全レッスンを横断 |

レッスンURLは `[themeSlug]/[...slug]/page.tsx` の **catch-all** で受ける。slugの深さがモジュールによって異なってもOK。

### 4.2 Next.js ルーティング実装ポリシー

- **すべて Static Generation** (`generateStaticParams`)
- レッスンページの `params` は `lib/themes.ts:getAllLessonPaths()` から生成
- ISR は不要 (デプロイで再ビルドする運用)
- Server Componentで MD 読込・パース → クライアントへは HTML を渡す

### 4.3 Pre-rendering フロー

```
build時
  ↓
lib/themes.ts:walkContent() が content/ を全走査
  ↓
zodで全フロントマター検証 (失敗ならビルドエラー)
  ↓
全URLパスを generateStaticParams で生成
  ↓
各ページで Server Component が MD 読込 → unified でHTML化
  ↓
.next/server/app/themes/.../*.html
```

---

## 5. コアAPI (`lib/`)

### 5.1 `lib/content/loader.ts`

`content/` を再帰走査し、テーマ・モジュール・レッスンの完全なツリーを返す。`React.cache` でビルド時1回のみ実行。

```typescript
export async function loadContentTree(): Promise<ContentTree>;
export async function loadTheme(themeSlug: string): Promise<Theme | null>;
export async function loadModule(themeSlug: string, moduleSlug: string): Promise<Module | null>;
export async function loadLesson(pathSegments: string[]): Promise<Lesson | null>;
export async function loadAllLessonPaths(): Promise<string[][]>;
```

### 5.2 `lib/themes.ts`

UIレイヤから呼ぶ高レベルAPI:

```typescript
export async function getThemesByOrder(): Promise<Theme[]>;
export async function getAdjacentLessonsInModule(lesson: Lesson): Promise<{prev: Lesson|null, next: Lesson|null}>;
export async function getLessonsByTag(tag: string): Promise<Lesson[]>;
export async function getRelatedLessons(lesson: Lesson): Promise<Lesson[]>;
```

> **注**: 前後リンク (`getAdjacentLessonsInModule`) はモジュール内に閉じる (テーマをまたいで自動遷移しない)。テーマ独立性の意図に沿わせる。

### 5.3 `lib/content/mdx.ts`

`web-skill-lessons/lib/mdx.ts` を流用 + Mermaid/GFM Alertsを追加:

```typescript
export async function renderMarkdown(source: string): Promise<{
  html: string;
  toc: TocItem[];
}>;
```

---

## 6. コンポーネント設計

### 6.1 既存資産の流用マッピング

| 既存ファイル | 新サイト配置 | 変更点 |
|---|---|---|
| `web-skill-lessons/lib/mdx.ts` | `lib/content/mdx.ts` | Mermaid/Alerts追加、TOC抽出 |
| `web-skill-lessons/components/CodeBlock.tsx` | `components/content/CodeBlock.tsx` | そのまま流用 |
| `web-skill-lessons/components/LessonNav.tsx` | `components/nav/LessonNav.tsx` | モジュール内前後リンクに対応 |
| `web-skill-lessons/components/LessonCard.tsx` | `components/content/LessonCard.tsx` | フロントマターから生成、type別スタイル |
| `claude-code-website/app/components/Header.tsx` | `components/layout/Header.tsx` | navは _site.json から |
| `claude-code-website/app/components/Footer.tsx` | `components/layout/Footer.tsx` | 同上 |

### 6.2 DocLayout

```tsx
<div className="grid grid-cols-1 md:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_240px]">
  <aside className="hidden md:block"><Sidebar /></aside>
  <main className="prose dark:prose-invert max-w-3xl mx-auto">
    <Breadcrumb />
    {children}
    <LessonNav />
  </main>
  <aside className="hidden xl:block"><TOC /></aside>
</div>
```

### 6.3 デザインシステム

`claude-code-website` のダークテーマ + テーマ色分けを継承:

| テーマ | 色 |
|---|---|
| `blue` | Web基礎 |
| `green` | 開発実践 |
| `purple` | AI駆動開発 |
| `gray` | 中立 (検索/About) |

`_theme.json` の `color` フィールドで指定、Tailwind classに動的マッピング (`bg-blue-500/10`, `border-blue-500/30`等)。

---

## 7. ビルド・CI

### 7.1 package.json scripts (Bun 実行)

```json
{
  "dev": "next dev",
  "build": "next build && pagefind --site .next/server/app",
  "start": "next start",
  "lint": "biome check . && bun run check:content",
  "format": "biome format --write .",
  "check": "biome check --write .",
  "check:content": "bun scripts/check-content.ts",
  "migrate:web-skill": "bun scripts/migrate/import-web-skill.ts",
  "migrate:team": "bun scripts/migrate/import-team-lessons.ts",
  "migrate:deploy": "bun scripts/migrate/import-deploy.ts",
  "migrate:ai-coding": "bun scripts/migrate/import-ai-coding.ts",
  "migrate:cc-website": "bun scripts/migrate/import-claude-code-website.ts"
}
```

> **Bun は TypeScript を直接実行できる**ため、移行スクリプトに `tsx` 等のラッパーは不要。`bun scripts/foo.ts` で直接実行。

### 7.2 デプロイ (Vercel)

- `main` ブランチ → Production
- 各PR → Preview URL自動生成
- 環境変数: なし (Phase 1)
- パッケージマネージャ: Vercel は `bun.lock` を自動検出して Bun を使用 (Install Command を `bun install` に明示しても可)
- ビルド設定: デフォルト (`next build`)
- ドメイン候補: `skills.sinlab.dev` (要確認) / 仮で `sinlab-skills.vercel.app`

### 7.3 GitHub Actions (任意)

- Pull Request 時: lint + build (Vercelに任せても可)
- フロントマター検証: `bun run check:content`

---

## 8. 実装フェーズ計画

### Phase 1 — MVP (目安2〜3週間)

1. **Day 1-2**: プロジェクト雛形 (Next.js 16 + Tailwind 4 + TypeScript) + `lib/content/*` 実装
2. **Day 3-4**: Header / Footer / DocLayout / Sidebar / TOC / LessonNav
3. **Day 5-6**: 移行スクリプト `import-web-skill.ts` 実装 → Markdown/Git 全レッスン取り込み
4. **Day 7-8**: 移行スクリプト `import-claude-code-website.ts` → Claude Code 8カテゴリ取り込み
5. **Day 9-10**: ホーム + テーマ一覧 (各テーマカードを並列表示)
6. **Day 11**: Vercelデプロイ・動作確認

### Phase 2 — 拡張 (目安2週間)

1. team-lessons 11ステップ取り込み
2. ai-coding-lessons 取り込み
3. deploy_lessons 取り込み
4. タグページ `/tags/[tag]`

### Phase 3 — 仕上げ (目安1週間)

1. Pagefind検索
2. OGP生成
3. アクセシビリティ・パフォーマンス監査 (Lighthouse 90+)
4. `docs/AUTHORING.md` 整備

---

## 9. 拡張シナリオの検証

### シナリオA: 「TypeScript」モジュールを Web基礎テーマに追加

```bash
mkdir -p content/themes/01-web-basics/03-typescript/lessons
cat > content/themes/01-web-basics/03-typescript/_module.json << EOF
{ "slug": "03-typescript", "title": "TypeScript", "order": 3, ... }
EOF
# レッスンMDを置く
echo "---\ntitle: 型注釈の基本\norder: 1\ntype: reference\n..." > content/themes/01-web-basics/03-typescript/lessons/01-type-annotation.md
```

→ コード変更なしで `/themes/01-web-basics/03-typescript/01-type-annotation` がビルド時に自動生成される。

### シナリオB: 「Tailwind CSS」テーマを新規追加

```bash
mkdir -p content/themes/04-tailwind/01-basics/lessons
# _theme.json と _module.json を作成
# レッスンMDを追加
```

→ テーマ一覧に自動的に登場。テーマ間依存は持たないため、独立した解説領域として公開可能。

### シナリオC: 既存レッスンの「下書き保存」

レッスンMDのフロントマター `status: draft` に変更
→ 本番ビルドから自動除外、開発環境では表示。

### シナリオD: 既存レッスンの「廃止」

`status: deprecated` に変更
→ ページ上部に廃止バナーが自動表示、検索結果は降格。
