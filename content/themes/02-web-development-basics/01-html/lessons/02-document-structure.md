---
title: 文書の基本構造
description: HTML 文書の基本構造を理解する。
order: 2
type: lecture
difficulty: beginner
tags: [html]
estimatedMinutes: 8
status: published
---

# 文書の基本構造

## 解説

すべての HTML ファイルは、決まった「骨組み」から始まります。
この骨組みは、どんなページでもほぼ共通です。まずは最小構成のテンプレートを見てみましょう。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ページのタイトル</title>
  </head>
  <body>
    <h1>こんにちは、HTML！</h1>
    <p>これは最初のHTMLページです。</p>
  </body>
</html>
```

**表示結果**

ブラウザのタブには「ページのタイトル」と表示され、画面には大きな見出し「こんにちは、HTML！」と段落「これは最初のHTMLページです。」が表示されます。

> [!TIP]
> このテンプレートは丸ごと覚えてしまって構いません。新しい HTML ファイルを作るときは、まずこの形を書き写すところから始めます。

この構造を図にすると、次のようなツリー（入れ子）になります。

![HTML 文書のツリー構造。html 要素の下に head（meta・title）と body（h1・p）が入れ子で並ぶ](/content-assets/02-web-development-basics/01-html/images/document-structure/document-tree.svg)

---

## 各部分の役割

### `<!DOCTYPE html>`

ファイルの一番上に書く「これは HTML5 の文書です」という宣言です。
ブラウザに正しい解釈モードで表示させるために必要です。タグではなく宣言なので、閉じタグはありません。

### `<html>`

文書全体を囲む、いちばん外側の要素です。
`lang` 属性でページの言語を指定します。日本語のページなら `lang="ja"` とします。

```html
<html lang="ja">
  ...
</html>
```

> [!NOTE]
> `lang` 属性は、スクリーンリーダーが正しい言語で読み上げたり、ブラウザが翻訳機能を提供したりするために使われます。アクセシビリティの観点からも重要です。

### `<head>`

ページの**設定情報（メタ情報）**を書く場所です。ここに書いた内容は、原則として画面には直接表示されません。

| 要素 | 役割 |
|------|------|
| `<meta charset="UTF-8">` | 文字コードの指定。日本語の文字化けを防ぐ |
| `<meta name="viewport" ...>` | スマホなどで適切な表示にするための設定 |
| `<title>` | ブラウザのタブや検索結果に表示されるタイトル |

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>サンプルページ</title>
</head>
```

**ポイント**

- `<meta charset="UTF-8">` は、できるだけ `<head>` の先頭に書きます。これがないと日本語が文字化けすることがあります。
- `<meta name="viewport" ...>` は、スマートフォンで見たときに文字が極端に小さくならないようにするための設定です。レスポンシブ対応の入り口になります。

### `<body>`

ブラウザの画面に**実際に表示される内容**を書く場所です。
見出し・段落・画像・リンク・フォームなど、ユーザーが目にするものはすべて `<body>` の中に入れます。

```html
<body>
  <h1>見出し</h1>
  <p>本文の段落です。</p>
</body>
```

---

## 要素の入れ子（ネスト）

HTML は要素の中に要素を入れる「入れ子（ネスト）」構造で書きます。
開始タグと閉じタグの順序が交差しないように注意します。

```html
<!-- 正しい入れ子 -->
<p>これは<strong>重要な</strong>文章です。</p>

<!-- 誤った入れ子（タグが交差している） -->
<p>これは<strong>重要な文章です。</p></strong>
```

> [!WARNING]
> 閉じタグを書き忘れたり、入れ子の順序を間違えたりすると、表示が崩れる原因になります。インデント（字下げ）を付けて階層を見やすくすると、ミスに気づきやすくなります。

---

## まとめ

- HTML ファイルは `<!DOCTYPE html>` 宣言から始まる。
- `<html>` の中に `<head>`（設定情報）と `<body>`（表示内容）が並ぶ。
- `<head>` には `charset`・`viewport`・`<title>` などのメタ情報を書く。
- 画面に表示したいものはすべて `<body>` の中に書く。
- 要素は入れ子（ネスト）で構成し、タグの開閉順序を守る。
