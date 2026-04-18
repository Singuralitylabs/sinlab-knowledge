---
title: "定義リスト サンプル"
order: 22
type: reference
category: ouyou
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# 定義リスト サンプル

## 解説

用語とその定義をセットで表示するリストです。
用語の次の行に `: ` で始まる定義を書きます。

**対応環境**: 一部（Pandoc、PHP Markdown Extra、一部のエディタ）
**非対応**: GitHub、標準Markdown

---

## 基本的な定義リスト

### 記法

```markdown
Markdown
: 軽量マークアップ言語の一種。テキストに簡単な記号を加えて書式を表現する。

HTML
: HyperText Markup Languageの略。Webページの構造を記述する言語。

CSS
: Cascading Style Sheetsの略。Webページの見た目を装飾する言語。
```

### 表示結果（対応環境の場合）

Markdown
: 軽量マークアップ言語の一種。テキストに簡単な記号を加えて書式を表現する。

HTML
: HyperText Markup Languageの略。Webページの構造を記述する言語。

CSS
: Cascading Style Sheetsの略。Webページの見た目を装飾する言語。

---

## 複数の定義

一つの用語に複数の定義を付けられます。

### 記法

```markdown
API
: Application Programming Interfaceの略。
: ソフトウェア間でデータをやり取りするための仕組み。
: 外部サービスの機能を利用するための窓口。
```

### 表示結果（対応環境の場合）

API
: Application Programming Interfaceの略。
: ソフトウェア間でデータをやり取りするための仕組み。
: 外部サービスの機能を利用するための窓口。

---

## 複数行の定義

### 記法

```markdown
フレームワーク
: アプリケーション開発の土台となるソフトウェア。

  共通の機能があらかじめ用意されており、
  開発者はビジネスロジックに集中できる。

  例：React、Vue、Django、Rails
```

---

## 実用例

### 用語集（Glossary）

```markdown
# 用語集

## A

AJAX
: Asynchronous JavaScript and XMLの略。非同期通信技術。

API
: Application Programming Interfaceの略。

## B

Backend
: サーバーサイドの処理を担当する部分。

Browser
: Webページを閲覧するためのソフトウェア。
```

---

### 技術仕様書

```markdown
## パラメータ説明

userId
: ユーザーを一意に識別するID。必須パラメータ。

limit
: 取得する件数の上限。省略時は20件。

offset
: 取得開始位置。ページネーションに使用。
```

---

### FAQ形式

```markdown
## よくある質問

料金について
: 月額1,000円からご利用いただけます。年払いで10%割引。

解約方法
: 設定画面から「解約」を選択してください。日割り返金はありません。

対応ブラウザ
: Chrome、Firefox、Safari、Edgeの最新版に対応しています。
```

---

## 非対応環境での代替手法

GitHubなど定義リストが使えない環境では、以下の代替方法を使います。

### 代替1: 太字 + 説明

```markdown
**Markdown**
軽量マークアップ言語の一種。テキストに簡単な記号を加えて書式を表現する。

**HTML**
HyperText Markup Languageの略。Webページの構造を記述する言語。
```

**Markdown**
軽量マークアップ言語の一種。テキストに簡単な記号を加えて書式を表現する。

**HTML**
HyperText Markup Languageの略。Webページの構造を記述する言語。

---

### 代替2: 見出し + 説明

```markdown
### Markdown
軽量マークアップ言語の一種。

### HTML
HyperText Markup Languageの略。
```

---

### 代替3: 表形式

```markdown
| 用語 | 定義 |
|------|------|
| Markdown | 軽量マークアップ言語の一種 |
| HTML | HyperText Markup Languageの略 |
| CSS | Cascading Style Sheetsの略 |
```

| 用語 | 定義 |
|------|------|
| Markdown | 軽量マークアップ言語の一種 |
| HTML | HyperText Markup Languageの略 |
| CSS | Cascading Style Sheetsの略 |

---

### 代替4: リスト形式

```markdown
- **Markdown**: 軽量マークアップ言語の一種
- **HTML**: HyperText Markup Languageの略
- **CSS**: Cascading Style Sheetsの略
```

- **Markdown**: 軽量マークアップ言語の一種
- **HTML**: HyperText Markup Languageの略
- **CSS**: Cascading Style Sheetsの略

---

## 対応状況まとめ

| 環境 | 定義リスト | 代替推奨 |
|------|:----------:|----------|
| GitHub | ❌ | 太字+説明 or 表 |
| GitLab | ✅ | - |
| Obsidian | ✅ | - |
| VS Code | ❌ | 太字+説明 or 表 |
| Notion | ❌ | トグル機能 |
| Pandoc | ✅ | - |

---

## 注意点

1. **環境確認**: 使用前に対応環境か確認する
2. **代替を用意**: 非対応環境向けに代替表現を考慮
3. **一貫性**: プロジェクト内で表現方法を統一

---

## 実習

以下のテンプレートを使って、用語集を作成してみましょう。

### 対応環境向け
```markdown
用語1
: 定義1

用語2
: 定義2
```

### 非対応環境向け（代替）
```markdown
- **用語1**: 定義1
- **用語2**: 定義2
```
