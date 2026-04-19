---
title: "インラインHTML（Inline HTML）サンプル"
order: 4
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# インラインHTML（Inline HTML）サンプル

## 解説

Markdownでは表現できない書式をHTMLタグで直接記述できます。多くのMarkdownレンダラーはHTMLをそのまま処理します。

| 用途 | HTMLタグ | 説明 |
|------|----------|------|
| キーボードキー | `<kbd>` | キーボードショートカット表示 |
| ハイライト | `<mark>` | 蛍光マーカー風強調 |
| 下線 | `<u>` | 下線付きテキスト |
| ルビ | `<ruby>` | ふりがな |
| 上付き | `<sup>` | 上付き文字 |
| 下付き | `<sub>` | 下付き文字 |
| 改行 | `<br>` | 強制改行 |

---

## キーボードキー（kbd）

キーボードショートカットを視覚的に表現します。

### 記法

```html
<kbd>Ctrl</kbd> + <kbd>C</kbd> でコピー

<kbd>Ctrl</kbd> + <kbd>V</kbd> で貼り付け

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> でコマンドパレット

Mac: <kbd>Cmd</kbd> + <kbd>S</kbd> で保存
```

### 表示結果

<kbd>Ctrl</kbd> + <kbd>C</kbd> でコピー

<kbd>Ctrl</kbd> + <kbd>V</kbd> で貼り付け

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> でコマンドパレット

Mac: <kbd>Cmd</kbd> + <kbd>S</kbd> で保存

---

## ハイライト（mark）

重要な部分を蛍光マーカー風に強調します。

### 記法

```html
この文章の<mark>重要な部分</mark>をハイライトします。

<mark>警告：この操作は取り消せません。</mark>
```

### 表示結果

この文章の<mark>重要な部分</mark>をハイライトします。

<mark>警告：この操作は取り消せません。</mark>

---

## 下線（u）

テキストに下線を引きます。

### 記法

```html
これは<u>下線付きテキスト</u>です。

<u>重要な用語</u>を強調します。
```

### 表示結果

これは<u>下線付きテキスト</u>です。

<u>重要な用語</u>を強調します。

**注意**：リンクと紛らわしいため、下線の使用は控えめにしましょう。

---

## ルビ・ふりがな（ruby）

漢字にふりがなを付けます。

### 記法

```html
<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>にふりがなを付ける

<ruby>東京<rp>(</rp><rt>とうきょう</rt><rp>)</rp></ruby>は日本の首都です。

<ruby>Claude<rp>(</rp><rt>クロード</rt><rp>)</rp></ruby>はAIアシスタントです。
```

### 表示結果

<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>にふりがなを付ける

<ruby>東京<rp>(</rp><rt>とうきょう</rt><rp>)</rp></ruby>は日本の首都です。

<ruby>Claude<rp>(</rp><rt>クロード</rt><rp>)</rp></ruby>はAIアシスタントです。

**補足**：`<rp>` はルビ非対応環境で括弧を表示するためのフォールバックです。

---

## 中央揃え・右揃え

テキストの配置を変更します。

### 記法

```html
<div align="center">
中央揃えのテキスト
</div>

<div align="right">
右揃えのテキスト
</div>

<p align="center">
<strong>中央揃えの太字テキスト</strong>
</p>
```

### 表示結果

<div align="center">
中央揃えのテキスト
</div>

<div align="right">
右揃えのテキスト
</div>

---

## 折りたたみ（details / summary）

クリックで展開するコンテンツを作成します。

### 記法

```html
<details>
<summary>クリックして詳細を表示</summary>

ここに隠したい内容を書きます。

- リスト項目1
- リスト項目2

コードブロックも使えます：

```python
print("Hello!")
```

</details>
```

### 表示結果

<details>
<summary>クリックして詳細を表示</summary>

ここに隠したい内容を書きます。

- リスト項目1
- リスト項目2

</details>

### デフォルトで開いた状態

```html
<details open>
<summary>最初から開いている</summary>

この内容は最初から表示されています。

</details>
```

---

## 画像のサイズ指定

Markdownの画像記法ではサイズを指定できませんが、HTMLなら可能です。

### 記法

```html
<!-- サイズ指定 -->
<img src="image.png" width="300" height="200">

<!-- 幅のみ指定（アスペクト比維持） -->
<img src="image.png" width="50%">

<!-- alt属性付き -->
<img src="image.png" alt="説明文" width="400">
```

---

## 実用例

### ショートカットキーのドキュメント

```html
## キーボードショートカット

| 操作 | Windows | Mac |
|------|---------|-----|
| コピー | <kbd>Ctrl</kbd>+<kbd>C</kbd> | <kbd>Cmd</kbd>+<kbd>C</kbd> |
| 貼り付け | <kbd>Ctrl</kbd>+<kbd>V</kbd> | <kbd>Cmd</kbd>+<kbd>V</kbd> |
| 保存 | <kbd>Ctrl</kbd>+<kbd>S</kbd> | <kbd>Cmd</kbd>+<kbd>S</kbd> |
| 検索 | <kbd>Ctrl</kbd>+<kbd>F</kbd> | <kbd>Cmd</kbd>+<kbd>F</kbd> |
```

### FAQセクション

```html
## よくある質問

<details>
<summary>Q: インストール方法は？</summary>

以下のコマンドを実行してください：

```bash
npm install package-name
```

</details>

<details>
<summary>Q: 動作環境は？</summary>

- Node.js 18以上
- npm 9以上

</details>
```

---

## 対応環境

| タグ | GitHub | Obsidian | VSCode | Notion |
|------|:------:|:--------:|:------:|:------:|
| `<kbd>` | ✅ | ✅ | ✅ | ❌ |
| `<mark>` | ✅ | ✅ | ✅ | ❌ |
| `<ruby>` | ✅ | ✅ | ✅ | ❌ |
| `<details>` | ✅ | ✅ | ✅ | ❌ |
| `<sup>`/`<sub>` | ✅ | ✅ | ✅ | ❌ |

---

## 実習

以下のドキュメントをHTMLタグを使って作成してみましょう。

```html
## ショートカット一覧

ファイルを保存：<kbd>Ctrl</kbd> + <kbd>S</kbd>

<mark>重要</mark>：保存前に確認してください。

<details>
<summary>詳細な手順を見る</summary>

1. ファイルを編集
2. <kbd>Ctrl</kbd> + <kbd>S</kbd> で保存
3. 変更を確認

</details>
```
