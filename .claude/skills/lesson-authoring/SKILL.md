---
name: lesson-authoring
description: sinlab-knowledge リポジトリの学習コンテンツ（`content/themes/**`）に、新しいモジュール・カテゴリ・レッスン記事を本リポジトリの文体・構成・規約に沿って生成する。「〜のモジュールを作って」「〜のレッスンを追加して」「記事を生成して」「/lesson-authoring」などの指示で使用する。探索 → 構成設計 → 方針確認（AskUserQuestion）→ 執筆 → 検証（check:content / lint）までを一貫して行い、コミットは必ずユーザー承認後に実施する。
---

## 前提

- 対象リポジトリ: `sinlab-knowledge`（Next.js 16 + ファイルシステム駆動コンテンツ）
- 作業ディレクトリ: リポジトリルート
- 真実のソース: **コンテンツの追加＝`content/` に Markdown / メタ JSON を置くだけ。コード変更は不要**
- 階層: `Site → Theme → Module → Lesson`
- このスキルは「**本リポジトリで統一された文体・構成・規約**」を以下に明記している。新規執筆時はこれを正とし、実装変更が疑われる箇所のみ実ファイル（`lib/content/schema.ts` 等）で確認する。

> [!IMPORTANT]
> コミットは必ずユーザーの明示的承認を得てから実行する（`CLAUDE.md` のコミット方針）。変更要約とコミットメッセージ案を提示し、承認後に `git commit`。作業はフィーチャーブランチで行う（main に直接コミットしない）。

---

## ワークフロー

### Step 1: リクエスト理解と探索

1. ユーザーの指示から「どのテーマ配下に」「何を題材に」「どこまでの範囲か」を把握する。
2. 追加先テーマの既存構造を確認する（モジュール数・命名・`order` の最大値 → 新規モジュールの `NN`）。
   - `find content/themes/<theme> -name "_module.json"` でモジュール一覧
   - 既存の近いモジュール（例: `02-git`）の `index.md` と詳細1本を Read し、文体・節構成の実例を掴む
3. **重複回避**: 既存レッスンと内容が被らないか確認する（例: VS Code モジュールの「統合ターミナル」は UI 解説、シェルコマンド基礎とは別物）。

> 既存構造が不明瞭・広範な場合は Explore サブエージェントを並列で使う。題材が明確で追加先が分かっている場合は直接 Read で足りる。

### Step 2: 構成設計

以下を決めて**構成案**を作る。

- `_module.json` の値（`slug` は `NN-kebab`、`title` はツール名・名詞、`description`、`icon`、`order`）
- カテゴリ数（＝ディレクトリ型レクチャー数）。**YAGNI**: 焦点が絞れていれば1カテゴリ。明確なスキル段階があれば複数（例: 基礎編 / 応用編）。
- 各カテゴリのレッスン一覧（ファイル名 `NN-slug.md`、`title`、`type`、内容1行、`estimatedMinutes`）を**教育的順序**で並べる。
- 各 `index.md`（レクチャー）の H2 構成と `::detail{}` 配置。

### Step 3: 方針確認（AskUserQuestion）

設計を確定させる前に、結果を左右する論点のみ `AskUserQuestion` で確認する。よくある論点:

- **スコープ**: どこまで含めるか（基礎のみ / 応用まで / カテゴリ数）
- **対象環境**: OS・前提ツールの扱い（例: Windows は Git Bash/WSL 一本化か、PowerShell 併記か）
- **タイトル表記**: ツール名（名詞）か説明的フレーズか

確認不要な明白な点は推奨を採用して進める（過剰に質問しない）。

### Step 4: 執筆

下記「規約リファレンス」に従って全ファイルを作成する。

1. `content/themes/<theme>/<NN-module>/_module.json`
2. 各カテゴリの `lessons/<NN-category>/index.md`（`type: lecture`、Git 方式で `::detail{}` を散文に埋め込む）
3. 各詳細ページ `lessons/<NN-category>/NN-slug.md`（`type: detail`、詳細節構成で執筆）

**未完成・TODO・プレースホルダを残さない**。各レッスンは単体で完結した実用記事として書き切る。

### Step 5: 検証

```bash
bun run check:content   # 全 frontmatter / _module.json を zod 検証
bun run lint            # biome check + check:content（コミット前必須）
```

- `index.md` 欠落・スキーマ違反・未知の `::detail` スラグ（赤エラー表示）が無いか確認。
- 可能なら `bun run dev` → `http://localhost:3000/themes/<theme>` でモジュール表示・TOC・`::detail` リンク・URL（`NN-` 除去）を目視確認。

### Step 6: 報告とコミット提案

作成ファイル一覧と検証結果を報告。コミットが必要ならブランチ・コミットメッセージ案を提示し、**承認を得てから**コミットする。

---

## 規約リファレンス（本リポジトリで統一済み）

### ディレクトリ構造とレッスン種別

- **メタファイル**: `_site.json` / `_theme.json` / `_module.json`（`_` プレフィックスで走査除外）。
- **ファイル型レクチャー**: `lessons/NN-slug.md`（サブページなし）。
- **ディレクトリ型レクチャー**（推奨・本リポジトリの主流）:
  ```
  lessons/NN-category/
    index.md        # type: lecture（モジュール TOC に掲載される概要）
    01-foo.md       # type: detail（サブページ）
    02-bar.md       # type: detail
  ```
  - `index.md` が無いとビルド検証エラー。
  - URL スラグは `NN-` プレフィックスを除去（`lib/content/slug.ts:toUrlSlug`）。ソートは `NN-` 順、`order` で上書き可。
- レクチャー種別は**ファイル配置ではなく frontmatter の `type`** で決まる。

### frontmatter スキーマ（`lib/content/schema.ts` 準拠）

**レッスン frontmatter**

| フィールド | 必須 | 型・値 |
|---|---|---|
| `title` | ✅ | string |
| `order` | ✅ | number（カテゴリ内の位置） |
| `type` | ✅ | `lecture` \| `detail` \| `reference`(レガシー) \| `cheatsheet` |
| `difficulty` | ✅ | `beginner` \| `intermediate` \| `advanced` |
| `description` | | string |
| `category` | | string（`_module.json` の `categories[].key` を参照） |
| `tags` | | string[]（既定 `[]`） |
| `estimatedMinutes` | | number |
| `status` | | `draft` \| `published` \| `deprecated`（既定 `published`） |
| `publishedAt` / `updatedAt` | | string（ISO） |
| `relatedLessons` | | string[]（例 `themes/01-web-basics/02-git/lessons/01-intro-basics/remote-basics`） |
| `authors` | | `{ name: string, url?: string }[]` |

**`_module.json`**: `slug`✅ / `title`✅ / `description`✅ / `order`✅（number）/ `icon` / `iconImage` / `categories`(既定 `[]`) / `status`。
**`_theme.json`**: `slug`✅ / `title`✅ / `description`✅ / `color`✅ / `order`✅ / `difficulty`✅ / `shortTitle` / `icon` / `estimatedHours` / `status`。

> `status: "draft"` は本番（`NODE_ENV=production`）でのみ非表示。`bun run dev` では draft も表示される。

### アイコンと色

`icon` は絵文字にマップされる（`lib/theme-color.ts:iconFallback`）。**マップ済みの名前のみ有効**:
`BookOpen`📖 / `Code`💻 / `Sparkles`✨ / `Globe`🌐 / `FileText`📄 / `Terminal`⌨️ / `GitBranch`🌿 / `Rocket`🚀 / `Settings`⚙️ / `Search`🔍 / `Layers`🧱 / `Wrench`🔧 / `Brain`🧠（未知名は📚）。
新しいアイコンが必要なら、まず `iconFallback` のマップに追加が必要（コード変更）。
テーマ `color` の有効値: `blue` / `green` / `purple` / `orange`。

### Markdown 機能

- **`::detail{slug="..."}`**: detail サブページへのカードリンク（remark ディレクティブ）。`slug` は detail ファイル名の `NN-` 除去後の値。未知スラグは**赤いエラーブロック**として表示されるので執筆中に気づける。
- **GitHub アラート**: `> [!NOTE]` / `[!TIP]` / `[!IMPORTANT]` / `[!WARNING]` / `[!CAUTION]`。注意喚起（特に破壊的操作の警告）に使う。
- **コードハイライト**: Shiki（`github-light`）。実行結果は ` ```text ` フェンスで表現（スクリーンショット画像は基本不要）。
- **TOC**: H2/H3 から自動生成。見出し id は GithubSlugger と rehype-slug で一致。
- 外部リンク（`http(s)://`）は自動で別タブ。

### 詳細ページ（type: detail）の本文節構成

本リポジトリの詳細記事は次の H2 構成で統一する（`02-git` の詳細記事が手本）:

```
# タイトル（H1、frontmatter の title と一致）

## 解説              … 概念・背景・図（```text のツリー/図解）・表
## コマンドサンプル     … ```bash で用途別にコメント付きコマンド
## 実行結果           … ```text で $ プロンプト付きの実行例
## よくある間違い      … ❌ / ✅ 形式で誤用と正しい書き方を対比
## 実用例            … 現実的なシナリオでの組み合わせ
## 実習              … 課題1, 課題2…（手を動かす課題。最後に後片付けも）
```

### レクチャー（type: lecture, index.md）の構成

「Git 方式」: 散文で概要を語りつつ、各概念の直後に `::detail{}` を配置して詳細へ誘導する。標準的な H2:

```
## はじめに          … 何か・なぜ学ぶか（必要なら冒頭に環境注意の > [!NOTE]）
## （主要トピックごとの H2）  … 要点 + サンプル + ::detail{}
## 基本コマンドまとめ   … コマンド/説明/使用例 の表
## 実践演習          … 1つの通し runnable ブロック
## まとめ            … 復習 + 次のステップ（隣接モジュールへリンク）+ 参考リソース
```

### 文体ガイド

- **です・ます調**。フォーマルだが平易。専門用語は初出で噛み砕く。
- 強調は **太字** と `インラインコード`。マーケティング誇張（「最速」「完全に安全」等）は使わない。
- **表を多用**（コマンド一覧・比較・用語定義はリストより表）。
- 破壊的操作（`rm` / `>` 上書き等）は必ず `> [!CAUTION]` で警告し、「実行前に `pwd`/`ls` で確認」を促す。
- コード例のコメントは `#`、命令は半角・小文字を徹底。

### クロスプラットフォーム方針

- macOS / Linux（bash・zsh）を主軸に**単一トラック**で執筆。
- Windows ユーザーには冒頭の `> [!NOTE]` で **Git Bash / WSL** の利用を案内し、`ls`/`cd`/`mkdir`/`rm` が同じ語彙で通るようにする。PowerShell 独自コマンドは深追いしない。
- 初心者が実際につまずく差分（パス区切り `/` vs `\`、`~`/`$HOME` など）だけインライン `> 補足` で注記。

### 維持すべき設計原則（CLAUDE.md より）

- レッスン/モジュール/テーマのリストを**コードにハードコードしない**（すべて `content/` から派生）。
- ESLint/Prettier を持ち込まない（lint/format は Biome が所有）。
- `@/*` パスエイリアスはリポジトリルート。

---

## 参考実装

- 手本（Git 方式レクチャー + `::detail`）: `content/themes/01-web-basics/02-git/lessons/01-intro-basics/index.md`
- 手本（詳細記事の節構成）: `content/themes/01-web-basics/02-git/lessons/01-intro-basics/04-add-and-commit.md`
- 本スキルで生成した完全例（2カテゴリ・基礎/応用）: `content/themes/01-web-basics/04-terminal/`
