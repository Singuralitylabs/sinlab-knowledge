# Sinlab Skills — 設計ドキュメント (2) コンテンツ構成

このドキュメントは初期コンテンツ (Phase 1〜2) の **詳細目次** と、今後のコンテンツ追加を見据えた **拡張ルール** を定義する。

> **本サイトは「解説サイト」として構成する**。手順を追って手を動かすハンズオン形式は採用せず、**読み物として完結する解説 (lecture型)** と **個別記法・コマンド・概念のリファレンス (reference型)** を主軸に据える。
>
> **テーマは完全に独立管理**: 3つのテーマは互いに依存関係を持たない。推奨閲覧順や対象者の案内も行わず、各テーマは単独で完結する解説領域として扱う。ロードマップページは設けない。

---

## 0. 全体構成サマリ

| # | テーマ | 想定対象 | モジュール数 | レッスン数(目安) |
|---|---|---|---|---|
| 01 | **Web基礎** | プログラミング初学者 | 2 | 56 |
| 02 | **開発実践** | Web基礎習得者 | 6 | 16 |
| 03 | **AI駆動開発** | 開発実践者・エンジニア | 3 | 13 |
| 合計 | — | — | 11 | 約85 |

各テーマは完全に独立しており、推奨閲覧順は設けない。`/themes` ページで3テーマを並列に提示する。

---

## 01. Web基礎テーマ (`01-web-basics`)

### `_theme.json`

```json
{
  "slug": "01-web-basics",
  "title": "Web基礎",
  "shortTitle": "Web基礎",
  "description": "MarkdownとGit。すべての出発点となる必須スキルを体系的に学ぶ。",
  "icon": "BookOpen",
  "color": "blue",
  "order": 1,
  "difficulty": "beginner",
  "estimatedHours": 8
}
```

### Module 01: Markdown (32レッスン)

> **移行元**: `lessons/web-skill-lessons/docs/01_markdown/`

`lessons/` 配下に以下のファイルを配置 (`type` フィールドで区別)

#### 基礎編 (kiso, 12本)
| order | スラグ | type | タイトル | 元ファイル |
|---|---|---|---|---|
| 01 | `intro-kiso` | lecture | 解説記事 (基礎編) | `解説記事（基礎編）.md` |
| 02 | `headings` | reference | 見出し | `samples/01_見出し.md` |
| 03 | `paragraphs` | reference | 段落と改行 | `samples/02_段落と改行.md` |
| 04 | `lists` | reference | リスト | `samples/03_リスト.md` |
| 05 | `emphasis` | reference | 強調 | `samples/04_強調.md` |
| 06 | `code-blocks` | reference | コードブロック | `samples/05_コードブロック.md` |
| 07 | `links` | reference | リンク | `samples/06_リンク.md` |
| 08 | `quotes` | reference | 引用 | `samples/07_引用.md` |
| 09 | `tables` | reference | 表 | `samples/08_表.md` |
| 10 | `horizontal-rules` | reference | 水平線 | `samples/09_水平線.md` |
| 11 | `checklists` | reference | チェックリスト | `samples/10_チェックリスト.md` |
| 12 | `images` | reference | 画像 | `samples/11_画像.md` |

#### 応用編 (ouyou, 11本)
| order | スラグ | type | タイトル | 元ファイル |
|---|---|---|---|---|
| 13 | `intro-ouyou` | lecture | 解説記事 (応用編) | `解説記事（応用編）.md` |
| 14 | `details` | reference | 折りたたみ | `samples/12_折りたたみ.md` |
| 15 | `footnotes` | reference | 脚注 | `samples/13_脚注.md` |
| 16 | `alerts` | reference | アラート | `samples/14_アラート.md` |
| 17 | `math` | reference | 数式 | `samples/15_数式.md` |
| 18 | `mermaid` | reference | Mermaid | `samples/16_Mermaid.md` |
| 19 | `emojis` | reference | 絵文字 | `samples/17_絵文字.md` |
| 20 | `comments` | reference | コメント | `samples/18_コメント.md` |
| 21 | `escape` | reference | エスケープ | `samples/19_エスケープ.md` |
| 22 | `definition-lists` | reference | 定義リスト | `samples/20_定義リスト.md` |
| 23 | `toc-links` | reference | 目次リンク | `samples/21_目次リンク.md` |

#### 拡張編 (kakucho, 9本)
| order | スラグ | type | タイトル | 元ファイル |
|---|---|---|---|---|
| 24 | `intro-kakucho` | lecture | 解説記事 (拡張編) | `解説記事（拡張編）.md` |
| 25 | `highlight` | reference | ハイライト | `samples/22_ハイライト.md` |
| 26 | `superscript-subscript` | reference | 上付き・下付き | `samples/23_上付き下付き.md` |
| 27 | `diff` | reference | diff構文 | `samples/24_diff構文.md` |
| 28 | `inline-html` | reference | インラインHTML | `samples/25_インラインHTML.md` |
| 29 | `frontmatter` | reference | フロントマター | `samples/26_フロントマター.md` |
| 30 | `github-syntax` | reference | GitHub固有記法 | `samples/27_GitHub固有記法.md` |
| 31 | `abbreviations` | reference | 略語定義 | `samples/28_略語定義.md` |
| 32 | `slides` | reference | スライド作成 | `samples/29_スライド作成.md` |

### Module 02: Git (32レッスン)

> **移行元**: `lessons/web-skill-lessons/docs/02_git/`

#### 解説記事 (lecture, 7本)
| order | スラグ | タイトル | 元 |
|---|---|---|---|
| 01 | `intro-kiso` | 解説記事 (基礎編) | `解説記事（基礎編）.md` |
| 02 | `intro-jissen` | 解説記事 (実践編) | `解説記事（実践編）.md` |
| 03 | `intro-ouyou` | 解説記事 (応用編) | `解説記事（応用編）.md` |
| 04 | `intro-team` | 解説記事 (チーム開発編) | `解説記事（チーム開発編）.md` |
| 05 | `intro-vscode` | 解説記事 (VS Code編) | `解説記事（VS Code編）.md` |
| 06 | `team-workshop` | チーム開発の進め方 | `ハンズオン（チーム開発編）.md` を解説形式に再編集 |
| 07 | `instructor-notes` | 講師向けメモ (`status: draft`) | `講師メモ（チーム開発ハンズオン）.md` |

#### 個別レッスン (reference, 24本)
| order | スラグ | category |
|---|---|---|
| 08 | `what-is-git` | kiso |
| 09 | `install` | kiso |
| 10 | `init-and-clone` | kiso |
| 11 | `add-and-commit` | kiso |
| 12 | `status-and-log` | kiso |
| 13 | `branch-basics` | kiso |
| 14 | `merge-basics` | kiso |
| 15 | `remote-basics` | kiso |
| 16 | `push-and-pull` | jissen |
| 17 | `pull-request` | jissen |
| 18 | `code-review` | jissen |
| 19 | `merge-conflict` | jissen |
| 20 | `rebase` | jissen |
| 21 | `cherry-pick` | jissen |
| 22 | `stash` | ouyou |
| 23 | `tag` | ouyou |
| 24 | `revert-and-reset` | ouyou |
| 25 | `gitignore` | ouyou |
| 26 | `gitflow` | team |
| 27 | `issue-management` | team |
| 28 | `ci-cd` | team |
| 29 | `github-actions` | team |
| 30 | `troubleshooting` | ouyou |
| 31 | `git-config-and-alias` | ouyou |

> 上記スラグ・カテゴリ分類は仮案。移行時に元ファイル `samples/01〜24_*.md` の内容と照合して確定する。

---

## 02. 開発実践テーマ (`02-web-development`)

### `_theme.json`

```json
{
  "slug": "02-web-development",
  "title": "開発実践",
  "shortTitle": "開発実践",
  "description": "ReactからNext.js、Supabase、フォーム、Git実践、本番デプロイまで。実務で動くWebアプリ開発を体系化。",
  "icon": "Code",
  "color": "green",
  "order": 2,
  "difficulty": "intermediate",
  "estimatedHours": 35
}
```

### モジュール構成 (6モジュール)

> **移行元**: `lessons/team-lessons/step01〜11/` + `lessons/deploy_lessons/`
>
> 各 step の README.md を本文骨子とし、主要コンポーネント (30〜80行) を抜粋、実コードへのGitHubリンクを末尾に統一フォーマットで掲載する解説形式。

#### Module 01: React基礎 (`01-react-basics`)
| order | スラグ | type | タイトル | 元step |
|---|---|---|---|---|
| 01 | `components` | reference | コンポーネント設計 | step01_react1 |
| 02 | `props` | reference | Propsによるデータ受け渡し | step02_react2 |
| 03 | `hooks` | reference | useState / useEffect / useMemo / useCallback | step03_hooks |

#### Module 02: Next.js (`02-nextjs`)
| order | スラグ | type | タイトル | 元step |
|---|---|---|---|---|
| 01 | `create-project` | reference | Next.jsプロジェクト初期化 | step04_create_nextjs |
| 02 | `app-router` | reference | App Router / レイアウト設計 | step05_nextjs_app |
| 03 | `styling` | reference | Tailwind CSS / スタイリング | step06_styling |

#### Module 03: データ取得 (`03-data-fetching`)
| order | スラグ | type | タイトル | 元step |
|---|---|---|---|---|
| 01 | `fetch-api` | reference | REST API連携・非同期処理 | step07_fetch_data |
| 02 | `server-components` | reference | React Server Components | step08_rsc |

#### Module 04: バックエンド連携 (`04-backend`)
| order | スラグ | type | タイトル | 元step |
|---|---|---|---|---|
| 01 | `supabase` | reference | Supabaseで認証・DB・Realtime | step09_supabase |
| 02 | `forms` | reference | フォーム制御・バリデーション | step10_input_form |

#### Module 05: チーム開発 (`05-team-workflow`)
| order | スラグ | type | タイトル | 元step |
|---|---|---|---|---|
| 01 | `git-workflow` | reference | Git実践 / バージョン管理フロー | step11_git |

#### Module 06: デプロイ (`06-deployment`) ★旧04テーマを統合

> **移行元**: `lessons/deploy_lessons/`

| order | スラグ | type | 内容 | 元 |
|---|---|---|---|---|
| 01 | `intro` | lecture | デプロイプラットフォーム比較・選び方 | 新規執筆 |
| 02 | `vercel` | reference | Vercelへのデプロイ (本サイト自体がVercelデプロイ) | 新規執筆 |
| 03 | `cloudflare` | reference | Cloudflare Pagesへのデプロイ | deploy_by_cloudflare |
| 04 | `github-pages` | reference | GitHub Pagesへのデプロイ | deploy_by_github_pages |
| 05 | `netlify` | reference | Netlifyへのデプロイ | deploy_by_netlify |

> **拡張余地**: テスト、状態管理 (Zustand/Redux)、認証応用、決済、デザインシステム、AWS Amplify、Render、Fly.io などを Module 07+ として追加可能。

---

## 03. AI駆動開発テーマ (`03-ai-driven-development`)

### `_theme.json`

```json
{
  "slug": "03-ai-driven-development",
  "title": "AI駆動開発",
  "shortTitle": "AI駆動開発",
  "description": "AIコーディングツールの全体像を捉え、Claude Codeを軸にAI駆動開発を実践する。",
  "icon": "Sparkles",
  "color": "purple",
  "order": 3,
  "difficulty": "intermediate",
  "estimatedHours": 12
}
```

### モジュール構成 (3モジュール)

> **移行元**: `lessons/ai-coding-lessons/` + `website/claude-code-website/`
>
> ユーザー要望に基づき、**「概論 → ツール比較 → Claude Code 解説」** の流れで構成。**Claude Code の解説をメインコンテンツ** とする。

#### Module 01: 概論 (`01-overview`)

| order | スラグ | type | 内容 | ステータス |
|---|---|---|---|---|
| 01 | `introduction` | lecture | AIコーディング/AI駆動開発とは何か | 新規執筆 |
| 02 | `history` | lecture | 主要ツールの登場と発展の系譜 | 新規執筆 |
| 03 | `workflow-changes` | lecture | 開発ワークフローはどう変わるか | 新規執筆 |

#### Module 02: ツール比較 (`02-tool-comparison`)

| order | スラグ | type | 内容 | ステータス |
|---|---|---|---|---|
| 01 | `overview` | lecture | 主要ツールの全体像と選び方 | 新規執筆 |
| 02 | `github-copilot` | reference | GitHub Copilot — 補完中心の老舗 | `ai-coding-lessons/step01` + note記事から再編集 |
| 03 | `cursor` | reference | Cursor — IDE統合型エージェント | `ai-coding-lessons/step02` + note記事 |
| 04 | `codex` | reference | OpenAI Codex CLI | 同上 |
| 05 | `gemini-cli` | reference | Gemini CLI | 同上 |
| 06 | `claude-code-overview` | reference | Claude Code 概観 (詳細はModule 03へ誘導) | 新規執筆 |
| 07 | `comparison-matrix` | lecture | 機能・価格・得意領域の比較マトリクス | 新規執筆 |

#### Module 03: Claude Code (`03-claude-code`) ★メインコンテンツ

> **移行元**: `website/claude-code-website/app/features/` 全カテゴリ。ページ内のTS配列 (`commandCategories` 等) を移行スクリプトでMD + フロントマターに変換。

| order | スラグ | type | 内容 | 元 (claude-code-website) |
|---|---|---|---|---|
| 01 | `basics` | lecture | Claude Code とは・他ツールとの違い | features/basics |
| 02 | `getting-started` | lecture | インストールから初回起動まで | 新規執筆 |
| 03 | `commands` | reference | コマンド一覧 (`/help`, `/init`, `/memory`, `/model`, `/cost`等) | features/commands |
| 04 | `memory` | reference | メモリ機能とコンテキスト管理 | features/memory |
| 05 | `skills` | reference | カスタムスキル作成 | features/skills |
| 06 | `agents` | reference | サブエージェント | features/agents |
| 07 | `mcp` | reference | Model Context Protocol (Tools / Resources / Prompts) | features/mcp |
| 08 | `hooks-plugins` | reference | Hooks & Plugins | features/hooks-plugins |
| 09 | `advanced` | reference | Managed Agents / Batch API 等の高度な機能 | features/advanced |

> **拡張余地**:
> - Module 04: AI駆動開発のベストプラクティス (新規) — レビュー、テスト、セキュリティ
> - Module 05: 各ツールの深掘り (Cursor単独、Codex単独 等)
> - Claude Code の更新に追従する形で Module 03 のレッスンを継続的に拡充

---

## 4. テーマ一覧ページ (`/themes`)

ロードマップページは設けない。代わりに `/themes` ページで3テーマを並列に提示する。

```
[ Web基礎 (blue) ]   [ 開発実践 (green) ]   [ AI駆動開発 (purple) ]
  Markdown / Git       React〜デプロイ        概論〜比較〜Claude Code
  56レッスン            16レッスン            13レッスン
```

各テーマカードは `_theme.json` から自動生成される (タイトル / 短説明 / アイコン / 色 / レッスン数)。
推奨順序や対象者の案内は記載しない。トップページ (`/`) も同様にテーマカードを並列に並べる。

---

## 5. タグ体系

### 5.1 推奨タグ語彙

タグはフロントマターで自由に追加できるが、以下の **標準語彙** を推奨し、ブレを抑える:

**トピック系**
`markdown`, `git`, `github`, `react`, `nextjs`, `typescript`, `tailwindcss`, `supabase`, `forms`, `rsc`, `ai-coding`, `copilot`, `cursor`, `codex`, `gemini`, `claude-code`, `mcp`, `agents`, `skills`, `memory`, `hooks`, `deployment`, `vercel`, `cloudflare`, `netlify`, `github-pages`

**スキル系**
`fundamentals`, `intermediate`, `advanced`, `troubleshooting`, `best-practices`

**形式系**
`tutorial`, `concept`, `reference`, `comparison`, `cheatsheet`

### 5.2 タグの管理

- 標準語彙は `lib/content/tags.ts` に定義 (新タグ追加時に `check:content` で警告するための辞書)
- 警告のみで強制エラーにはしない (柔軟な追加を許可)
- タグページ `/tags/[tag]` は Phase 2 で実装

---

## 6. 拡張ルール (執筆者向けサマリ)

> 詳細は `docs/AUTHORING.md` (Phase 1終盤に作成) に集約予定。

### 新レッスン追加 (最頻ケース)

```bash
# 1. ファイル作成
touch content/themes/{theme}/{module}/lessons/NN-slug.md

# 2. フロントマター + 本文を記述
cat > content/themes/{theme}/{module}/lessons/NN-slug.md <<'EOF'
---
title: タイトル
order: NN
type: reference        # lecture | reference | cheatsheet
difficulty: beginner
tags: [topic-tag]
estimatedMinutes: 5
status: draft       # まずdraftで開発
---

本文...
EOF

# 3. 開発環境で確認 (draftはdev環境で表示)
pnpm dev

# 4. 公開準備ができたら status: published に変更してマージ
```

### 新モジュール追加

```bash
mkdir -p content/themes/{theme}/NN-module-slug/lessons
# _module.json を作成 (テンプレートを `docs/AUTHORING.md` から流用)
```

### 新テーマ追加

```bash
mkdir -p content/themes/NN-theme-slug
# _theme.json を作成
# 配下にモジュールを追加
```

### 命名規約

- ディレクトリ: `NN-kebab-case` (例: `01-markdown`)
- ファイル: `NN-kebab-case.md` (例: `02-headings.md`)
- スラグはURL末尾になる (`/themes/01-web-basics/01-markdown/02-headings`)

### 順序制御

- ディレクトリ・ファイル名の `NN-` プレフィックス → デフォルトソート
- フロントマターの `order` で上書き可能 (優先)

---

## 7. 既存サイトとのコンテンツ差分

| 領域 | 既存 | 新サイト | 差別化 |
|---|---|---|---|
| Markdown | web-skill-lessons | 同内容を移行、解説と個別記法を `lessons/` に統合 | 統合カリキュラムの一部に |
| Git | web-skill-lessons | 同内容 + チーム開発編を「解説」として再編集 | ハンズオン素材も読み物として整える |
| Claude Code | claude-code-website | 8カテゴリ + 概観 + 入門を移行 | AI駆動開発テーマのメインに位置付け、初心者導線を整備 |
| React/Next.js/Supabase/Forms | team-lessons (実コード) | 解説 + 抜粋 + GitHubリンク | サイト上は読み物として完結、実コードはGitHub参照 |
| デプロイ | deploy_lessons (実コード) | 開発実践テーマのModule 06に統合、+概論とVercel編を新規執筆 | 1テーマ内で「作って → 出す」が完結 |
| AIツール比較 | ai-coding-lessons step02 (未展開) | Module 02 として独立、5ツール × 比較マトリクス | 拡充の起点 |
| **新規領域** | — | AI駆動開発概論、ツール比較マトリクス、Vercel編、Claude Code入門 | 横断的な解説を追加 |

---

## 8. メンテナンス・運用

- **SSOT は新サイト `content/`** (既存サイトとは同期しない)
- 既存 `web-skill-lessons` は当面残し、Phase 3 完了後に301リダイレクトで集約検討
- 既存 `claude-code-website` は当面残し、深掘り版として併存可
- コンテンツ更新フロー: ブランチ → PR → Vercel Preview確認 → main マージ → 自動デプロイ
- Claude Code は更新が早いため、Module 03 のレッスンには `updatedAt` を必ず記載し、月次で「30日以上更新がないレッスン」を洗い出す `scripts/check-stale.ts` を Phase 3 で追加検討
