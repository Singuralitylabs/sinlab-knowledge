---
title: "YAMLフロントマター（Front Matter）サンプル"
order: 5
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# YAMLフロントマター（Front Matter）サンプル

## 解説

ファイルの先頭に `---` で囲んだYAML形式のメタデータを記述できます。静的サイトジェネレーター（Hugo、Jekyll、Gatsby）やナレッジベース（Obsidian）で使用されます。

| 用途 | 説明 |
|------|------|
| 記事のメタデータ | タイトル、著者、日付など |
| 表示設定 | テンプレート、レイアウト指定 |
| 分類情報 | タグ、カテゴリ |
| 公開設定 | 下書きフラグ、公開日時 |

---

## 基本的なフロントマター

### 記法

```yaml
---
title: 記事のタイトル
author: 山田太郎
date: 2025-01-31
---

# ここから本文

本文の内容が始まります。
```

**注意**：
- 必ずファイルの**最初の行**から始める
- 開始と終了は `---`（ハイフン3つ）
- YAML形式で記述（`キー: 値`）

---

## よく使うプロパティ

### ブログ記事向け

```yaml
---
title: マークダウン入門ガイド
description: 初心者向けマークダウンの基本を解説
author: 山田太郎
date: 2025-01-31
lastmod: 2025-02-01
categories:
  - プログラミング
  - ドキュメント
tags:
  - markdown
  - 入門
  - チュートリアル
draft: false
---
```

### 技術ドキュメント向け

```yaml
---
title: APIリファレンス
sidebar_position: 3
sidebar_label: API
toc_max_heading_level: 4
pagination_prev: getting-started
pagination_next: examples
---
```

### Obsidian向け

```yaml
---
aliases:
  - マークダウン
  - MD記法
tags:
  - 技術
  - 文書作成
created: 2025-01-31
updated: 2025-02-01
status: published
---
```

---

## データ型

### 文字列

```yaml
---
title: シンプルな文字列
description: "コロンを含む場合は: クォートで囲む"
multiline: |
  複数行の
  テキストも
  書けます
---
```

### 数値・真偽値

```yaml
---
version: 2.0
count: 100
draft: false
featured: true
---
```

### 配列（リスト）

```yaml
---
# インライン形式
tags: [markdown, tutorial, beginner]

# ブロック形式
categories:
  - プログラミング
  - Web開発
  - ドキュメント
---
```

### 日付

```yaml
---
date: 2025-01-31
datetime: 2025-01-31T10:30:00+09:00
---
```

---

## 静的サイトジェネレーター別の例

### Hugo

```yaml
---
title: "Hugoで作るブログ"
date: 2025-01-31T10:00:00+09:00
draft: false
weight: 10
categories: ["技術"]
tags: ["Hugo", "静的サイト"]
author: "山田太郎"
description: "Hugoの基本的な使い方"
thumbnail: "/images/hugo-thumb.png"
---
```

### Jekyll

```yaml
---
layout: post
title: "Jekyllで作るブログ"
date: 2025-01-31 10:00:00 +0900
categories: [blog, tutorial]
tags: [jekyll, ruby]
author: yamada
excerpt: "Jekyllの基本的な使い方を解説"
published: true
---
```

### Gatsby / MDX

```yaml
---
title: Gatsbyで作るブログ
slug: /blog/gatsby-intro
date: 2025-01-31
author: 山田太郎
hero_image: ./hero.png
hero_image_alt: ヒーロー画像の説明
---
```

### Docusaurus

```yaml
---
id: intro
title: はじめに
sidebar_label: イントロ
sidebar_position: 1
description: ドキュメントの概要
keywords:
  - docs
  - tutorial
---
```

---

## Obsidianでの活用

### ノートのプロパティ管理

```yaml
---
aliases:
  - マークダウン入門
  - Markdown基礎
tags:
  - 技術/マークダウン
  - 学習/進行中
created: 2025-01-31
modified: 2025-02-01
status: draft
priority: high
related:
  - "[[HTML入門]]"
  - "[[CSS入門]]"
---
```

### Dataviewプラグインとの連携

```yaml
---
type: book
title: プログラミング入門
author: 山田太郎
rating: 4
read_date: 2025-01-15
status: completed
---
```

Dataviewクエリで読書リストを自動生成できます：

````markdown
```dataview
TABLE author, rating, read_date
FROM "books"
WHERE status = "completed"
SORT read_date DESC
```
````

---

## 対応環境

| 環境 | 対応状況 | 用途 |
|------|:--------:|------|
| Hugo | ✅ | ブログ・ドキュメント |
| Jekyll | ✅ | ブログ・GitHub Pages |
| Gatsby | ✅ | Reactサイト |
| Docusaurus | ✅ | 技術ドキュメント |
| Obsidian | ✅ | ナレッジベース |
| GitHub | ❌ | 表示されない |
| VSCode | プレビューのみ | メタデータ確認 |

---

## 注意点

1. **ファイルの先頭に配置**：1行目から始めないと認識されない
2. **YAML構文エラー**：インデントやコロンに注意
3. **環境依存**：プロパティ名は環境によって異なる
4. **日本語の扱い**：文字化けに注意（UTF-8で保存）

---

## 実習

以下のテンプレートを使って、ブログ記事のフロントマターを作成してみましょう。

```yaml
---
title: "あなたの記事タイトル"
date: 2025-01-31
author: "あなたの名前"
description: "記事の概要を書く"
tags:
  - タグ1
  - タグ2
draft: true
---

# 本文タイトル

ここから本文を書き始めます。
```
