# Sinlab Skills — 設計ドキュメント (3) 実装手順書

このドキュメントは Phase 1 (MVP) を中心に、各ステップの **目的 / 実施内容 / 完了条件** を順序立てて定義する。Phase 2 / Phase 3 は概要のみ示し、Phase 1 完了後に詳細化する。

> **前提となる設計**: `01-architecture.md` (技術アーキテクチャ・コンテンツモデル)、`02-content-structure.md` (コンテンツ詳細目次)
>
> **作業ディレクトリ**: `/Users/yamada/Documents/future_tech/sinlab-service/sinlab-skills/`

---

## 0. 前提と準備

### 0.1 必要環境

| ツール | バージョン | 確認コマンド | 備考 |
|---|---|---|---|
| Bun | 1.x 以上 | `bun -v` | パッケージ管理 + TS ランタイム |
| Node.js | 20.x 以上 | `node -v` | Next.js 内部および一部ツール用 |
| Git | 任意 | `git --version` | |

> Bun が未インストールの場合: `curl -fsSL https://bun.sh/install | bash`

### 0.2 リポジトリ初期化

```bash
cd /Users/yamada/Documents/future_tech/sinlab-service/sinlab-skills
git init
git branch -m main
echo "node_modules\n.next\n.vercel\n.DS_Store\n.env*.local" > .gitignore
```

### 0.3 主要依存パッケージ (Phase 1 で導入予定)

| カテゴリ | パッケージ |
|---|---|
| Framework | `next@^16`, `react@^19`, `react-dom@^19` |
| 言語 | `typescript@^5`, `@types/node`, `@types/react`, `@types/react-dom` |
| スタイル | `tailwindcss@^4`, `@tailwindcss/postcss`, `@tailwindcss/typography` |
| MD処理 | `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-raw`, `rehype-pretty-code`, `rehype-slug`, `rehype-stringify`, `shiki` |
| Frontmatter | `gray-matter` |
| GFM Alerts | `remark-github-blockquote-alert` |
| Mermaid (Phase 2 以降) | `@theguild/remark-mermaid` |
| 検証 | `zod` |
| Lint / Format | `@biomejs/biome` (devDependency) |

> 移行スクリプトやコンテンツ検証スクリプトは Bun が TS を直接実行できるため、`tsx` 等のラッパー依存は **不要**。

---

## 1. Phase 1: MVP 実装手順

**目標**: Web基礎テーマ (Markdown / Git) と AI駆動開発テーマの Module 03 (Claude Code) を Vercel に公開する

**期間目安**: 2〜3週間 (11作業日想定)

### Day 1: プロジェクト雛形

**目的**: Next.js プロジェクトを初期化し、基本動作を確認する

**実施内容**
1. `bunx create-next-app@latest .` を実行
   - TypeScript: Yes / **ESLint: No** (Biome を後から導入) / Tailwind CSS: Yes / `src/` ディレクトリ: No / App Router: Yes / Turbopack: Yes / import alias `@/*`: Yes
2. 自動生成された npm/pnpm用 lockfile を削除し、`bun install` を実行 (`bun.lock` 生成)
3. Biome を導入: `bun add -D @biomejs/biome` → `bunx biome init`
4. `biome.json` を編集: indentWidth=2, lineWidth=100, formatter有効, organizeImports有効、Next.js想定の除外設定 (`.next`, `node_modules`)
5. `package.json` の scripts を更新:
   - `lint`: `biome check .`
   - `format`: `biome format --write .`
   - `check`: `biome check --write .` (auto-fix付き)
6. `eslint.config.*` が残っていれば削除
7. 不要ファイル削除: `app/page.tsx`, `app/globals.css` の自動生成サンプル
8. `app/layout.tsx` をシンプル化、`app/page.tsx` に「Sinlab Skills」のプレースホルダ
9. `bun run dev` で `http://localhost:3000` 起動確認

**完了条件 (Done)**
- [ ] `bun run dev` でトップページが表示される
- [ ] `bun run build` が成功する
- [ ] `bun run lint` (= `biome check .`) がエラーゼロ
- [ ] `bun.lock` がコミット可能な状態

### Day 2: 設定整備とコンテンツディレクトリ準備

**目的**: 設計に沿った最小限のスケルトンを整える

**実施内容**
1. `tailwind.config.ts` 作成 — `@tailwindcss/typography` 有効化、ダークテーマ default、テーマ色 (blue/green/purple) を含める
2. `tsconfig.json` の `paths` に `@/lib/*`, `@/components/*`, `@/content/*` を追加
3. ディレクトリ作成: `app/themes`, `lib/content`, `components/{layout,nav,content,theme}`, `content/themes`, `scripts/migrate/shared`, `public/images`
4. `content/_site.json` を作成 (タイトル/ナビ定義)
5. `bun add` で MD処理系・gray-matter・zod・shiki などを導入:
   ```bash
   bun add unified remark-parse remark-gfm remark-rehype rehype-raw rehype-pretty-code rehype-slug rehype-stringify shiki gray-matter remark-github-blockquote-alert zod @tailwindcss/typography
   ```

**完了条件 (Done)**
- [ ] 上記ディレクトリが存在する
- [ ] `content/_site.json` が `01-architecture.md §3.1` のスキーマに沿っている

### Day 3: コンテンツローダ実装 (`lib/content/*`)

**目的**: `content/` を走査して全レッスンを読み出せる状態を作る

**実施内容**
1. `lib/content/schema.ts` — zod でフロントマター/`_theme.json`/`_module.json` の型定義
2. `lib/content/frontmatter.ts` — `gray-matter` ラッパー、zod 検証
3. `lib/content/slug.ts` — ファイル名 (`02-headings.md`) → スラグ (`02-headings`) 変換
4. `lib/content/loader.ts` — `content/themes/` を再帰走査し `ContentTree` を返す。`React.cache` で1回のみ実行
5. `lib/themes.ts` — UIから呼ぶ高レベルAPI (`getThemes`, `getTheme`, `getModule`, `getLesson`, `getAdjacentLessonsInModule`, `getAllLessonPaths`)
6. `lib/content/mdx.ts` — `web-skill-lessons/lib/mdx.ts` を流用し、TOC抽出を追加

**完了条件 (Done)**
- [ ] `bun scripts/dev/print-tree.ts` (一時スクリプト) で `content/` 配下を全走査できる
- [ ] zod 検証エラーが正しく出る
- [ ] dev環境で `draft` 表示、本番で除外される判定ができる

### Day 4: レイアウト基盤コンポーネント

**目的**: ヘッダ・フッタ・本文枠組みを作る

**実施内容**
1. `components/layout/Header.tsx` — `claude-code-website/app/components/Header.tsx` 流用、`navigation` を `_site.json` から動的化
2. `components/layout/Footer.tsx` — 同上
3. `components/layout/DocLayout.tsx` — `grid` で 左Sidebar + 本文 + 右TOC、モバイルはドロワー化
4. `components/nav/Sidebar.tsx` — モジュール内のレッスン一覧を生成、現在レッスンをハイライト
5. `components/nav/TOC.tsx` — 見出し抽出済みデータからリスト表示、IntersectionObserver でスクロール追従 (Client Component)
6. `components/nav/LessonNav.tsx` — `getAdjacentLessonsInModule` から前後リンク生成
7. `components/nav/Breadcrumb.tsx` — テーマ → モジュール → レッスン
8. `app/layout.tsx` に Header/Footer 組み込み

**完了条件 (Done)**
- [ ] ダミーレッスンページで Sidebar / TOC / LessonNav / Breadcrumb が動く
- [ ] モバイル幅で Sidebar がドロワーになる

### Day 5: コンテンツ表示コンポーネント

**目的**: Markdown 本文を整形して表示できるようにする

**実施内容**
1. `components/content/CodeBlock.tsx` — `web-skill-lessons/components/CodeBlock.tsx` 流用 (コピーボタン付き)
2. `components/content/Callout.tsx` — GFM Alerts `> [!INFO]` 等のスタイル
3. `components/content/LessonCard.tsx` — フロントマターからカード生成、`type` 別スタイル
4. `app/globals.css` に `prose` のカスタマイズ (テーマ色のリンク等)

**完了条件 (Done)**
- [ ] 1本のサンプル MD ファイルを `prose` で表示できる
- [ ] コードブロックのシンタックスハイライト + コピーボタンが動く
- [ ] アラート記法が見栄えよく表示される

### Day 6: 移行スクリプト (web-skill-lessons → 01-web-basics)

**目的**: Markdown / Git の全レッスン (約56本) を `content/themes/01-web-basics/` に取り込む

**実施内容**
1. `scripts/migrate/shared/frontmatter.ts` — フロントマター生成ヘルパ
2. `scripts/migrate/shared/filename.ts` — 元ファイル名 (`01_見出し.md`) → 新ファイル名 (`02-headings.md`) 変換マップ
3. `scripts/migrate/import-web-skill.ts` を実装 — 元 `lessons/web-skill-lessons/docs/01_markdown` と `02_git` を読み、`02-content-structure.md §01` のマッピング表に従って `content/themes/01-web-basics/` に出力
4. 冪等性: 出力先既存ファイルは上書き、手動編集分は別ディレクトリに退避するか warning
5. `_theme.json` (Web基礎) と各 `_module.json` (Markdown / Git) を作成
6. `bun run migrate:web-skill` で実行

**完了条件 (Done)**
- [ ] `content/themes/01-web-basics/01-markdown/lessons/` に32ファイル
- [ ] `content/themes/01-web-basics/02-git/lessons/` に32ファイル (講師メモは `status: draft`)
- [ ] zod 検証パス
- [ ] dev環境で各レッスンURLが200で表示

### Day 7: テーマ・モジュール・レッスンの動的ルート

**目的**: 移行したコンテンツに URL を割り当てる

**実施内容**
1. `app/themes/page.tsx` — テーマ一覧 (3カードを並列表示)
2. `app/themes/[themeSlug]/page.tsx` — テーマトップ (モジュール一覧)
3. `app/themes/[themeSlug]/[...slug]/page.tsx` — catch-all、モジュールトップとレッスン本体を分岐
4. 各ページで `generateStaticParams` を実装

**完了条件 (Done)**
- [ ] `/themes` で3テーマカードが表示
- [ ] `/themes/01-web-basics` でモジュール2つ表示
- [ ] `/themes/01-web-basics/01-markdown` でレッスン32本リスト
- [ ] `/themes/01-web-basics/01-markdown/02-headings` でレッスン本文表示

### Day 8: 移行スクリプト (claude-code-website → 03-claude-code)

**目的**: Claude Code 8カテゴリを `content/themes/03-ai-driven-development/03-claude-code/` に取り込む

**実施内容**
1. `scripts/migrate/import-claude-code-website.ts` — 元 `website/claude-code-website/app/features/{8カテゴリ}/page.tsx` を解析、ページ内 TS 配列 (`commandCategories` 等) を抽出 → MD + フロントマターに変換
2. 表/カードは Markdown のテーブル/リストで再現、複雑なものは別途手動補完
3. `_theme.json` (AI駆動開発) と `_module.json` (Module 01-03) を作成 — Module 01/02 は最小限の構造のみ (実コンテンツは Phase 2)
4. `bun run migrate:cc-website` で実行

**完了条件 (Done)**
- [ ] `content/themes/03-ai-driven-development/03-claude-code/lessons/` に9本 (basics, getting-started, commands, memory, skills, agents, mcp, hooks-plugins, advanced)
- [ ] 各ファイルで zod 検証パス
- [ ] dev環境で各URLが表示

### Day 9: トップページとテーマ一覧

**目的**: 入口ページを完成させる

**実施内容**
1. `app/page.tsx` — ヒーロー + 3テーマカード並列表示 (推奨順序や対象者は記載しない)
2. `components/theme/ThemeCard.tsx` — `_theme.json` からカード生成
3. `components/theme/ModuleCard.tsx` — モジュールカード
4. `app/about/page.tsx` — `content/pages/about.md` を表示

**完了条件 (Done)**
- [ ] トップ・テーマ一覧・テーマトップ・モジュールトップ・レッスン本体まで通しで遷移できる
- [ ] サイト全体のデザインが統一されている

### Day 10: フロントマター検証スクリプト

**目的**: ビルド前にコンテンツ品質を担保する

**実施内容**
1. `scripts/check-content.ts` — `content/` を走査し、zod で全フロントマター検証、エラーがあれば exit code 1
2. `package.json` の `lint` に `bun run check:content` を含める (例: `"lint": "biome check . && bun run check:content"`)
3. `next.config.ts` の `experimental.typedRoutes` を有効化 (任意)

**完了条件 (Done)**
- [ ] `bun run check:content` が成功
- [ ] フロントマター不備のテストファイルで `bun run check:content` がエラーになる
- [ ] `bun run lint` で Biome + content 検証が両方走る

### Day 11: Vercel デプロイ

**目的**: 本番URLで公開する

**実施内容**
1. GitHub に新規リポジトリ作成、`main` を push
2. Vercel ダッシュボードで GitHub リポジトリを Import
3. Install Command: `bun install` (Vercel が `bun.lock` を自動検出するが明示推奨)
4. Build Command: デフォルト (`next build`)、Output: デフォルト
5. Production Branch: `main`
5. Preview URL を確認、本番ドメイン (`sinlab-skills.vercel.app` or `skills.sinlab.dev`) を割り当て
6. 検証チェックリスト (§4) を実施

**完了条件 (Done)**
- [ ] 本番URLで全テーマ・モジュール・レッスンにアクセスできる
- [ ] PR作成時に自動でPreview URLが生成される
- [ ] Lighthouse スコア (Performance/Accessibility/Best Practices) が 80以上

---

## 2. Phase 2: 拡張 (目安2週間)

### 2.1 残りの移行スクリプト

- **`import-team-lessons.ts`**: `lessons/team-lessons/step01〜11/` を `content/themes/02-web-development/{01-react-basics..05-team-workflow}/lessons/` に取り込み
  - 各 step の README.md を本文骨子化
  - 主要コード (30〜80行) を抜粋して埋め込み
  - 末尾に GitHub リンク (元リポジトリの該当パス) を統一テンプレで付与
- **`import-deploy.ts`**: `lessons/deploy_lessons/deploy_by_*/` を `content/themes/02-web-development/06-deployment/lessons/` に取り込み
- **`import-ai-coding.ts`**: `lessons/ai-coding-lessons/step01_github_copilot/`, `step02_ai-tool-comparison/` を `03-ai-driven-development/02-tool-comparison/lessons/` に取り込み
- 新規執筆コンテンツ (デプロイ概論、Vercel編、AI駆動開発概論、ツール比較マトリクス) のドラフト作成

### 2.2 タグページ

- `app/tags/[tag]/page.tsx` 実装
- `lib/themes.ts:getLessonsByTag()` 利用
- `lib/content/tags.ts` で標準語彙辞書を作成、`check:content` で警告
- レッスン本体ページにタグリンクを表示

### 2.3 関連レッスン表示

- `lib/themes.ts:getRelatedLessons()` 実装 (frontmatter `relatedLessons` 参照 + タグ類似度フォールバック)
- レッスン本体下部に「関連レッスン」セクション

### 2.4 ナビゲーション改善

- Sidebar にカテゴリ別グルーピング (`_module.json:categories`)
- Breadcrumb に「テーマ > モジュール > カテゴリ > レッスン」表示
- 廃止 (`status: deprecated`) バナーの実装

---

## 3. Phase 3: 仕上げ (目安1週間)

### 3.1 検索 (Pagefind)

- `bun add -D pagefind`
- `package.json` の build スクリプトに `pagefind --site .next/server/app` を追加 (Next.js の出力構造に合わせて要調整)
- `app/search/page.tsx` で `@pagefind/default-ui` を読み込み
- 日本語精度向上のため、レッスン本文にキーワードを `data-pagefind-meta` で補強

### 3.2 OGP

- `app/opengraph-image.tsx` または `next/og` の `ImageResponse` でレッスン別OGP生成
- テーマ色とレッスン名を埋め込み

### 3.3 a11y / パフォーマンス監査

- Lighthouse 全主要ページで Performance / Accessibility 90+
- スキップリンク、`aria-current`、フォーカスリング、コントラスト比チェック
- 画像 (`next/image`) 最適化、フォントの `display: swap`

### 3.4 執筆ガイド整備

- `docs/AUTHORING.md` を作成
  - 新レッスン/新モジュール/新テーマ追加手順
  - フロントマター仕様
  - 命名規約
  - 図 (Mermaid) の使い方
  - スクリーンショット格納場所
- `docs/CONTRIBUTING.md` を作成 (PR フロー、レビュー観点)

### 3.5 (任意) 古いレッスン検出

- `scripts/check-stale.ts` — `updatedAt` が30日以上前のレッスンを一覧化
- 月次で実行、Slack/Issue 通知などへ拡張可

---

## 4. 検証チェックリスト (Phase 1 完了時)

### 4.1 機能

- [ ] `/` トップページが表示される
- [ ] `/themes` で3テーマカードが並列表示
- [ ] `/themes/01-web-basics` でモジュール2つが表示
- [ ] `/themes/01-web-basics/01-markdown` でレッスン32本がリスト表示
- [ ] `/themes/01-web-basics/01-markdown/02-headings` でレッスン本文 + Sidebar + TOC + LessonNav が表示
- [ ] `/themes/03-ai-driven-development/03-claude-code/03-commands` 等 Claude Code レッスンが表示
- [ ] `/about` が表示
- [ ] 404 ページが表示
- [ ] グローバルナビとフッタが全ページで表示

### 4.2 表示品質

- [ ] コードブロックのシンタックスハイライトが効いている
- [ ] コピーボタンが動作する
- [ ] アラート記法 (`> [!INFO]` 等) が見栄えよく表示
- [ ] テーマ色 (blue / green / purple) がカード/見出し/リンクに反映
- [ ] モバイル幅 (375px) で Sidebar がドロワーになる
- [ ] ダークテーマで視認性に問題ない

### 4.3 ビルド・品質

- [ ] `bun run build` が成功 (警告含めゼロ)
- [ ] `bun run lint` (Biome + check:content) がエラーゼロ
- [ ] `bun run format` で差分が出ない (整形済み)
- [ ] `next build` の所要時間が3分以内

### 4.4 デプロイ

- [ ] Vercel Production URL で全主要ページにアクセスできる
- [ ] PR で Preview URL が自動生成される
- [ ] OGP / favicon が設定されている
- [ ] Lighthouse Performance 80+, Accessibility 90+

---

## 5. 既知のリスクと判断ポイント

| 時点 | リスク / 判断ポイント | 対処 |
|---|---|---|
| Day 6 | 旧 `samples/01_見出し.md` 等の日本語ファイル名 → 英語スラグ変換 | 移行スクリプトで明示マッピングテーブルを持つ。曖昧な場合は手動レビュー |
| Day 8 | claude-code-website のページ内 TS 配列が複雑 (動的に生成されるテーブル等) | 単純な配列は自動変換、複雑なものは手動で MD 化 |
| Day 11 | ビルド時間が長くなりすぎる (50ページ超) | Vercel ビルドキャッシュ活用、必要なら `output: 'export'` を検討 |
| Phase 2 | team-lessons の実コードを抜粋する範囲 | 30〜80行を目安、超える場合はGitHubリンクのみに留める |
| Phase 3 | Pagefind の Next.js App Router 対応 | 公式ドキュメントを参照、出力先パスを正しく指定 |

---

## 6. 役割分担と進捗管理 (任意)

- 実装は Claude Code (本セッション) で逐次進める想定
- 大きなマイルストーン (Day 6, Day 8, Day 11) ごとにユーザーレビューを求める
- 各 Day の完了条件 (Done) を満たさない限り次の Day に進まない
- スコープ追加要望は次フェーズに繰り越し、Phase 1 は MVP に集中

---

## 7. 次のアクション

このドキュメントの承認後、**Day 1 (プロジェクト雛形)** から着手する。

- 各 Day の作業ログは別途 `docs/dev-log/` に残す (任意)
- 完了した Day はチェックリストとして本ドキュメントに反映していく
