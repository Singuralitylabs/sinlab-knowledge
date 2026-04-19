---
title: "スライド作成（Markdown Slides）の詳細"
order: 8
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# スライド作成（Markdown Slides）

## 解説

Markdownを使ってプレゼンテーションスライドを作成できます。PowerPointを使わずに、テキストベースでスライドを管理できるため、Gitでのバージョン管理も容易です。

| ツール | 特徴 | 環境 |
|--------|------|------|
| Marp | シンプル、VSCode拡張あり | VSCode / CLI |
| Slidev | Vue.js製、インタラクティブ | Node.js |
| reveal.js | 高機能、カスタマイズ性高い | ブラウザ / Node.js |
| Remark | 軽量、ブラウザのみ | ブラウザ |
| Deckset | 美しいデザイン | Mac専用（有料） |

---

## Marp（推奨）

最も手軽に始められるツールです。VSCode拡張機能をインストールするだけで使えます。

### セットアップ

1. VSCodeで拡張機能「Marp for VS Code」をインストール
2. `.md` ファイルを作成
3. フロントマターに `marp: true` を追加
4. プレビューでスライド表示を確認

### 基本構文

```markdown
---
marp: true
---

# スライドタイトル

発表者名
2025年2月

---

## 2枚目のスライド

内容を書く

---

## 3枚目のスライド

- 箇条書き1
- 箇条書き2
```

**ポイント**：`---`（水平線）でスライドを区切ります。

---

## Marpの設定オプション

### フロントマター設定

```markdown
---
marp: true
theme: default
paginate: true
header: 'ヘッダーテキスト'
footer: '© 2025 Your Name'
backgroundColor: #fff
color: #333
---
```

| 設定 | 説明 | 値の例 |
|------|------|--------|
| `marp` | Marp有効化 | `true` |
| `theme` | テーマ | `default`, `gaia`, `uncover` |
| `paginate` | ページ番号表示 | `true`, `false` |
| `header` | ヘッダー | テキスト |
| `footer` | フッター | テキスト |
| `backgroundColor` | 背景色 | `#ffffff`, `black` |
| `size` | スライドサイズ | `16:9`, `4:3` |

---

## スライドの装飾

### 見出しとテキスト

```markdown
---

# 大見出し（タイトルスライド向け）

---

## 中見出し（通常スライド）

本文テキスト

**太字**で強調、*斜体*も使えます

---

### 小見出し

詳細な説明
```

### 箇条書きとリスト

```markdown
---

## 箇条書き

- ポイント1
- ポイント2
  - サブポイント
- ポイント3

---

## 番号付きリスト

1. 最初のステップ
2. 次のステップ
3. 最後のステップ
```

---

## 画像の配置

### 通常の画像

```markdown
---

## 画像を表示

![説明](./image.png)
```

### 背景画像

```markdown
---

![bg](./background.jpg)

# 背景画像付きスライド

テキストが画像の上に表示される
```

### 画像の位置指定

```markdown
---

![bg left](./image.png)

## 左に画像、右にテキスト

- 説明文1
- 説明文2

---

![bg right:40%](./image.png)

## 右40%に画像

左側にテキストを配置
```

### 画像サイズ調整

```markdown
---

![bg contain](./image.png)

---

![bg cover](./image.png)

---

![bg fit](./image.png)

---

![bg 50%](./image.png)
```

---

## コードブロック

### シンタックスハイライト

````markdown
---

## コード例

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```
````

### 複数言語の比較

````markdown
---

## Python vs JavaScript

<div class="columns">

```python
def greet(name):
    print(f"Hello, {name}!")
```

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

</div>
````

---

## 表とグラフ

### 表の作成

```markdown
---

## 比較表

| 項目 | プランA | プランB |
|------|:-------:|:-------:|
| 価格 | ¥1,000 | ¥2,000 |
| 容量 | 10GB | 50GB |
| サポート | メール | 24時間 |
```

---

## スタイルのカスタマイズ

### インラインスタイル

```markdown
---

<!-- _backgroundColor: #264653 -->
<!-- _color: white -->

# ダークスライド

このスライドだけ背景色を変更
```

### CSSクラスの適用

```markdown
---

<!-- _class: lead -->

# リードスライド

中央揃えの大きなタイトル
```

---

## Slidev（開発者向け）

Vue.jsベースの高機能スライドツールです。

### セットアップ

```bash
npm init slidev@latest
```

### 基本構文

```markdown
---
theme: seriph
background: https://example.com/bg.jpg
class: text-center
---

# Slidevへようこそ

開発者のためのプレゼンテーション

---

# コード実行

```ts {monaco-run}
console.log('Hello, Slidev!')
```

---
layout: two-cols
---

# 左カラム

::right::

# 右カラム
```

### Slidevの特徴

- ライブコーディング対応
- アニメーション豊富
- LaTeX数式サポート
- 録画機能内蔵

---

## reveal.js

HTMLベースの高機能プレゼンテーション。

### Markdownでの使用

```html
<section data-markdown>
  <textarea data-template>
    ## スライド1

    内容

    ---

    ## スライド2

    - ポイント1
    - ポイント2
  </textarea>
</section>
```

### 特徴

- 縦横のスライド移動
- 豊富なトランジション
- プラグインシステム
- PDFエクスポート

---

## ツール比較

| 機能 | Marp | Slidev | reveal.js |
|------|:----:|:------:|:---------:|
| 学習コスト | 低 | 中 | 高 |
| カスタマイズ性 | 中 | 高 | 高 |
| VSCode統合 | ✅ | ✅ | ❌ |
| PDFエクスポート | ✅ | ✅ | ✅ |
| ライブコード | ❌ | ✅ | プラグイン |
| アニメーション | 基本 | 豊富 | 豊富 |
| オフライン動作 | ✅ | ✅ | ✅ |

---

## 実用例

### 技術発表スライド

```markdown
---
marp: true
theme: gaia
paginate: true
footer: 'Tech Meetup 2025'
---

# Markdownで始める<br>スライド作成

山田太郎
2025年2月

---

## 今日のアジェンダ

1. なぜMarkdownスライドか？
2. Marpの基本
3. 実践デモ
4. まとめ

---

## なぜMarkdownスライドか？

- **テキストベース**：Gitで管理できる
- **ポータブル**：どこでも編集可能
- **高速**：デザインに悩まない
- **再利用**：コンテンツの流用が簡単

---

## デモ

```javascript
const slides = markdown.split('---');
slides.forEach(render);
```

---

<!-- _class: lead -->

# ありがとうございました

質問はありますか？
```

---

## エクスポート

### MarpでPDF出力

1. VSCodeでスライドを開く
2. コマンドパレット（`Ctrl+Shift+P`）
3. 「Marp: Export Slide Deck...」を選択
4. PDF、PPTX、HTMLから選択

### CLIでの出力

```bash
# Marp CLIをインストール
npm install -g @marp-team/marp-cli

# PDFに変換
marp slide.md -o slide.pdf

# HTMLに変換
marp slide.md -o slide.html

# PPTXに変換
marp slide.md -o slide.pptx
```

---

## 参考リンク

- [Marp公式](https://marp.app/)
- [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
- [Slidev公式](https://sli.dev/)
- [reveal.js公式](https://revealjs.com/)
- [Remark公式](https://remarkjs.com/)

---

## 実習

以下のテンプレートを使って、自己紹介スライドを作成してみましょう。

```markdown
---
marp: true
theme: default
paginate: true
---

# 自己紹介

あなたの名前

---

## プロフィール

- 名前：
- 職業：
- 趣味：

---

## スキル

| 技術 | レベル |
|------|--------|
| HTML/CSS | ⭐⭐⭐ |
| JavaScript | ⭐⭐ |
| Python | ⭐ |

---

<!-- _class: lead -->

# よろしくお願いします！
```

VSCodeでMarp拡張をインストールし、プレビュー表示（`Ctrl+Shift+V`）で確認してみましょう。
