---
title: "解説記事 (拡張編)"
order: 24
type: lecture
category: kakucho
difficulty: beginner
tags: [markdown, fundamentals, concept]
estimatedMinutes: 15
status: published
---
# マークダウン拡張記法リファレンス

基礎編・応用編で紹介した記法以外にも、特定のプラットフォームやエディタで使える拡張記法があります。

環境によって対応状況が大きく異なるため、使用前に動作確認をしてください。

---

## ハイライト（蛍光マーカー）

テキストを蛍光ペンでマークしたように強調します。

```markdown
これは==重要なテキスト==です。
```

**表示結果（対応環境の場合）**：
これは==重要なテキスト==です。

**対応環境**：Obsidian、一部のマークダウンエディタ（Marked 2、iA Writer）

**注意**：GitHubやVSCodeでは対応していません。代替として `<mark>` タグを使用できます。

```html
これは<mark>重要なテキスト</mark>です。
```

---

## 上付き・下付き文字

数式や化学式で使用する上付き・下付き表記です。

```markdown
H~2~O（水の化学式）
x^2^（xの2乗）
```

**表示結果（対応環境の場合）**：
- H~2~O（下付き文字）
- x^2^（上付き文字）

**対応環境**：Pandoc、一部のマークダウンエディタ

**代替方法**：HTMLタグを使用

```html
H<sub>2</sub>O（下付き）
x<sup>2</sup>（上付き）
```

---

## diff構文（変更差分表示）

コードの変更箇所を視覚的に表示します。コードレビューやドキュメントで差分を示すのに便利です。

````markdown
```diff
  変更なしの行
- 削除された行（赤色で表示）
+ 追加された行（緑色で表示）
! 変更・注意が必要な行（一部環境）
# コメント行（一部環境）
```
````

**表示結果**：

```diff
  const name = "太郎";
- const age = 25;
+ const age = 26;
  console.log(name, age);
```

**対応環境**：GitHub、GitLab、多くのコードハイライト対応エディタ

**用途例**：
- コードレビューでの変更提案
- バージョンアップの変更点説明
- 設定ファイルの修正内容の共有

---

## インラインHTML

Markdownでは表現できない書式をHTMLタグで直接記述できます。

### キーボードキー

```html
<kbd>Ctrl</kbd> + <kbd>C</kbd> でコピー
<kbd>Ctrl</kbd> + <kbd>V</kbd> で貼り付け
```

**表示結果**：<kbd>Ctrl</kbd> + <kbd>C</kbd> でコピー

### ハイライト（マーカー）

```html
これは<mark>重要な部分</mark>です。
```

### ルビ（ふりがな）

```html
<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>の読み方
```

### 詳細・要約（折りたたみの別形式）

```html
<details>
<summary>詳細を見る</summary>

ここに詳細な内容を記述します。
マークダウン記法も使えます。

</details>
```

**対応環境**：GitHub、多くのマークダウンレンダラー

**注意**：一部の環境（Slack、Discordなど）ではHTMLタグは無視されます。

---

## YAMLフロントマター

ファイルの先頭にメタデータを記述します。静的サイトジェネレーターやドキュメント管理で使用されます。

```yaml
---
title: 記事タイトル
author: 著者名
date: 2025-01-31
tags:
  - markdown
  - tutorial
  - documentation
draft: false
---

# ここから本文

本文の内容が始まります。
```

**用途**：
- **Jekyll / Hugo / Gatsby**：ブログ記事のメタデータ
- **Obsidian**：ノートのプロパティ管理
- **VuePress / Docusaurus**：ドキュメントの設定

**対応環境**：静的サイトジェネレーター全般、Obsidian、Notion（インポート時）

**主なプロパティ例**：

| プロパティ | 説明 | 例 |
|------------|------|-----|
| title | 記事タイトル | `"Getting Started"` |
| date | 作成日 | `2025-01-31` |
| author | 著者 | `"山田太郎"` |
| tags | タグ（配列） | `[markdown, tutorial]` |
| draft | 下書きフラグ | `true` / `false` |
| description | 説明文 | `"マークダウンの入門記事"` |

---

## GitHub固有の記法

GitHub上で使える特殊な自動リンク機能です。

### ユーザーメンション

```markdown
@username にレビューをお願いします。
```

GitHubのユーザー名を `@` 付きで書くと、そのユーザーへのリンクと通知が生成されます。

### Issue / Pull Request 参照

```markdown
#123 で報告されたバグを修正しました。
GH-456 でも同様の問題がありました。
```

`#番号` で同一リポジトリのIssue/PRにリンクします。

### 他リポジトリへの参照

```markdown
owner/repo#123 の実装を参考にしました。
```

### コミット参照

```markdown
コミット a1b2c3d でこの問題は解決されています。
```

7文字以上のコミットSHAは自動的にリンクになります。

### 自動Issue/PRクローズ

```markdown
Fixes #123
Closes #456
Resolves #789
```

コミットメッセージやPRの説明にこれらのキーワードを含めると、マージ時にIssueが自動的にクローズされます。

**対応環境**：GitHub専用

---

## 略語定義

文書内で使用する略語に説明を付けることができます。

```markdown
HTML仕様ではセマンティックなマークアップが推奨されています。
CSSでスタイルを適用します。

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets
```

対応環境では、略語にマウスを乗せると説明がツールチップで表示されます。

**対応環境**：PHP Markdown Extra、Pandoc（拡張機能）、一部のマークダウンエディタ

**注意**：GitHub、Obsidianでは対応していません。

---

## スライド作成（Marp / Slidev）

Markdownでプレゼンテーションスライドを作成できます。

### Marp（推奨）

```markdown
---
marp: true
theme: default
paginate: true
---

# スライドタイトル

発表者名

---

## 2枚目のスライド

- ポイント1
- ポイント2
- ポイント3

---

## コードも表示可能

```javascript
console.log("Hello!");
```
```

`---` でスライドを区切ります。VSCode拡張「Marp for VS Code」をインストールするだけで使えます。

### 主なツール

| ツール | 特徴 |
|--------|------|
| Marp | シンプル、VSCode統合 |
| Slidev | Vue.js製、高機能 |
| reveal.js | カスタマイズ性高い |

**対応環境**：各ツールのCLI / VSCode拡張 / ブラウザ

---

## 対応環境まとめ

| 記法 | GitHub | Obsidian | VSCode | Pandoc | Hugo/Jekyll |
|------|:------:|:--------:|:------:|:------:|:-----------:|
| ハイライト `==` | ❌ | ✅ | ❌ | 拡張 | テーマ依存 |
| 上付き・下付き | ❌ | プラグイン | ❌ | ✅ | テーマ依存 |
| diff構文 | ✅ | ✅ | ✅ | ✅ | ✅ |
| インラインHTML | ✅ | ✅ | ✅ | ✅ | ✅ |
| フロントマター | ❌ | ✅ | 拡張 | ✅ | ✅ |
| GitHubメンション | ✅ | ❌ | ❌ | ❌ | ❌ |
| 略語定義 | ❌ | ❌ | ❌ | 拡張 | プラグイン |
| スライド作成 | ❌ | ❌ | Marp拡張 | ❌ | ❌ |

---

## 代替手段のまとめ

対応していない環境での代替方法です。

| やりたいこと | 標準的な代替方法 |
|--------------|------------------|
| ハイライト | `<mark>テキスト</mark>` |
| 上付き文字 | `<sup>2</sup>` |
| 下付き文字 | `<sub>2</sub>` |
| キーボードキー | `<kbd>Ctrl</kbd>` |
| 略語の説明 | 脚注 `[^1]` を使用 |

---

## 参考リンク

- [CommonMark Spec](https://spec.commonmark.org/)：Markdown標準仕様
- [GitHub Flavored Markdown](https://github.github.com/gfm/)：GitHub版マークダウン仕様
- [Pandoc User's Guide](https://pandoc.org/MANUAL.html)：Pandocの拡張記法
- [Obsidian Help](https://help.obsidian.md/)：Obsidianのマークダウン対応
