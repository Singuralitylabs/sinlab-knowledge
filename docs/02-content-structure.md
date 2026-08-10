# Sinlab Knowledge — 設計ドキュメント (2) コンテンツ執筆ルール

本ドキュメントは、コンテンツ執筆者向けの**拡張ルール**（階層方針・追加手順・テンプレート・命名規約）を定義する。

実際のコンテンツ構成（テーマ・モジュール・レッスンの一覧）は `content/themes/` 自体が真実のソースであり、本ドキュメントには記載しない（`bun scripts/dev/print-tree.ts` でツリーを一覧できる）。frontmatter / メタ JSON の正確なフィールド定義は `lib/content/schema.ts` の zod スキーマを参照。

> **本サイトは「解説サイト」として構成する**。手順を追って手を動かすハンズオン形式は採用せず、読み物として完結する解説を主軸に据える。テーマは完全に独立管理とし、推奨閲覧順や対象者の案内は行わない。

## 1. 階層方針（前提）

全テーマで次の 2 階層を採用する:

- **解説（`type: lecture`）** — モジュール TOC に並ぶメインコンテンツ。ファイル型（`NN-slug.md`）または**ディレクトリ型**（`NN-slug/index.md` + 配下に詳細ファイル群）
- **詳細（`type: detail`）** — ディレクトリ型解説の配下に置く深掘りページ（`NN-slug.md`）

詳細を持つかどうかで解説の形式（ファイル型 / ディレクトリ型）を選ぶ。詳細への導線は、本文中に `::detail` ディレクティブでカードリンクを埋め込む方式を既定とする。詳細が自己完結したチートシート的性質を持つ場合（例: Markdown 記法一覧）は、解説末尾に一覧表を置く方式に切り替えてもよい。

### `::detail` ディレクティブ

ディレクトリ型解説の本文（`index.md`）から配下の詳細ページへ、カード型リンクをレンダリングするカスタム remark ディレクティブ。

```markdown
::detail{slug="what-is-git"}
```

- `slug` には詳細ファイルの `NN-` プレフィックスと拡張子を除いたスラグを指定する（`01-what-is-git.md` → `what-is-git`）
- カードのタイトル・説明文は詳細ページの frontmatter（`title` / `description`）から自動生成される。詳細ページの **`description` は必ず書く**こと（カードの説明文に使われる）
- 未知のスラグを指定すると赤いエラーブロックとして表示される。これは意図的な仕様で、執筆中にリンク切れを表面化させるためのもの

## 2. 新レッスン追加（最頻ケース）

### A. ファイル型解説を追加（詳細を持たない）

```bash
# content/themes/{theme}/{module}/lessons/NN-slug.md を作成し、
# 下記テンプレートの frontmatter と本文を書く
```

### B. ディレクトリ型解説 + 詳細を新規作成

```bash
mkdir -p content/themes/{theme}/{module}/lessons/NN-slug
# NN-slug/index.md      … 解説本体 (type: lecture)
# NN-slug/01-xxx.md     … 詳細 1 本目 (type: detail)
```

### C. 既存のディレクトリ型解説に詳細を追加

```bash
# content/themes/{theme}/{module}/lessons/NN-parent/NN-new-detail.md を作成
```

### frontmatter テンプレート

frontmatter は zod で厳密検証されるため、空ファイルや必須フィールド欠落は `check:content` / ビルドでエラーになる。新規レッスンは次のテンプレートから始める:

```yaml
---
title: タイトル
description: 一覧や ::detail カードに表示される説明文
order: 1                    # 必須。同一階層内の表示順
type: lecture               # lecture | detail | reference | cheatsheet
category: basics            # _module.json の categories[].key を参照（任意）
difficulty: beginner        # beginner | intermediate | advanced
tags: [git, fundamentals]   # 自由タグ（任意）
estimatedMinutes: 5         # 任意
status: draft               # draft | published | deprecated
---
```

- `order` は**必須**（省略すると検証エラー）
- `type` は基本的に `lecture` / `detail` の 2 値を使う。`reference` は移行期の互換値（`detail` と同様に扱われる）、`cheatsheet` はチートシート用
- `status: draft` は開発環境でのみ表示され、本番ビルドから除外される。公開時に `published` へ変更する

### 検証・確認

```bash
bun run check:content   # frontmatter / メタ JSON の zod 検証
bun run dev             # draft 含めてブラウザで表示確認
```

## 3. 新モジュール追加

```bash
mkdir -p content/themes/{theme}/NN-module-slug/lessons
# _module.json を作成（下記テンプレート）
```

`_module.json` テンプレート:

```json
{
  "slug": "NN-module-slug",
  "title": "モジュール名",
  "description": "モジュールの説明",
  "icon": "FileText",
  "order": 1,
  "categories": []
}
```

`categories` はレッスンをグルーピングしたい場合のみ `{ "key": "...", "label": "...", "description": "..." }` の配列を書く（不要なら空配列のまま）。

## 4. 新テーマ追加

```bash
mkdir -p content/themes/NN-theme-slug
# _theme.json を作成（下記テンプレート）、配下にモジュールを追加
```

`_theme.json` テンプレート:

```json
{
  "slug": "NN-theme-slug",
  "title": "テーマ名",
  "shortTitle": "短縮名",
  "description": "テーマの説明",
  "icon": "BookOpen",
  "color": "blue",
  "order": 1,
  "difficulty": "beginner",
  "estimatedHours": 8,
  "status": "draft"
}
```

`color` は `lib/theme-color.ts` が定義する 5 色（`blue` / `green` / `purple` / `orange` / `gray`）から選ぶ。執筆中は `status: "draft"` にしておき、公開時に `published` へ変更する（`status` を省略した場合は `published` 扱い）。

## 5. 命名規約

- ディレクトリ・ファイル: `NN-kebab-case`（例: `01-markdown`、`03-javascript`、`01-intro-basics/`、`02-headings.md`）
- ディレクトリ型解説のメインは `index.md` 固定（`NN-` プレフィックスは親ディレクトリ側に付ける）
- **英語スラグを推奨**。日本語ローマ字表記は避ける
  - ✅ `basics` / `advanced` / `practice` / `extensions`
  - ❌ `kiso` / `ouyou` / `jissen` / `kakucho`

## 6. URL 構造

- テーマ・モジュールの URL セグメントは `NN-` プレフィックスを含む（`01-web-basics`、`01-markdown`）
- **解説・詳細の URL セグメントは `NN-` を削除**して表示する
- 例:
  - 解説（ファイル型 / ディレクトリ型とも同じ URL）: `/themes/01-web-basics/02-git/intro-basics`
  - 詳細: `/themes/01-web-basics/02-git/intro-basics/what-is-git`（ファイル `01-what-is-git.md`）

## 7. 順序制御

- ディレクトリ・ファイル名の `NN-` プレフィックス → デフォルトソート
- frontmatter の `order` が表示順を決める（`order` は必須フィールド。通常はファイル名の `NN-` と一致させる）

## 8. 公開フロー

```bash
bun run dev                 # draft 含めて表示確認
# status: published に変更 → PR → Vercel Preview 確認 → main マージ → 自動デプロイ
```
