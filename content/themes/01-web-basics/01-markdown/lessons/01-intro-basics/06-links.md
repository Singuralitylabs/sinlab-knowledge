---
title: "リンク（Links）サンプル"
order: 6
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# リンク（Links）サンプル

## 解説

Webページや外部リソースへのリンクを作成します。

| 形式 | 記法 | 用途 |
|------|------|------|
| 基本リンク | `[text](url)` | 通常のリンク |
| タイトル付き | `[text](url "title")` | ホバー時に説明表示 |
| URL直接表示 | `<url>` | URLをそのまま表示 |

---

## 基本的なリンク

### 記法

```markdown
[Google](https://www.google.com)
[GitHub](https://github.com)
[Qiita](https://qiita.com)
```

### 表示結果

[Google](https://www.google.com)
[GitHub](https://github.com)
[Qiita](https://qiita.com)

---

## タイトル付きリンク

マウスを乗せると説明文が表示されます。

### 記法

```markdown
[Google](https://www.google.com "世界最大の検索エンジン")
[MDN Web Docs](https://developer.mozilla.org "Web技術のリファレンス")
```

### 表示結果

[Google](https://www.google.com "世界最大の検索エンジン")
[MDN Web Docs](https://developer.mozilla.org "Web技術のリファレンス")

---

## URLをそのまま表示

### 記法

```markdown
公式サイト：<https://www.example.com>
お問い合わせ：<support@example.com>
```

### 表示結果

公式サイト：<https://www.example.com>
お問い合わせ：<support@example.com>

---

## 参照形式のリンク

同じリンクを複数回使う場合に便利です。

### 記法

```markdown
[Google][1]は世界最大の検索エンジンです。
技術情報は[MDN][2]を参照してください。
開発には[VS Code][3]がおすすめです。

[1]: https://www.google.com
[2]: https://developer.mozilla.org
[3]: https://code.visualstudio.com
```

### 表示結果

[Google][1]は世界最大の検索エンジンです。
技術情報は[MDN][2]を参照してください。
開発には[VS Code][3]がおすすめです。

[1]: https://www.google.com
[2]: https://developer.mozilla.org
[3]: https://code.visualstudio.com

---

## 相対パスリンク（同じリポジトリ内）

### 記法

```markdown
[READMEを見る](./README.md)
[設定ファイル](../config/settings.json)
[ドキュメント一覧](/docs/)
```

---

## ページ内リンク（アンカーリンク）

見出しへのリンクを作成できます。

### 記法

```markdown
[解説へジャンプ](#解説)
[実習へジャンプ](#実習)
```

### ルール

- 見出しをすべて小文字に変換
- スペースはハイフン `-` に変換
- 日本語はそのまま使える（GitHub等）

---

## 実用例

### 目次（Table of Contents）

```markdown
## 目次

1. [はじめに](#はじめに)
2. [インストール](#インストール)
3. [使い方](#使い方)
4. [よくある質問](#よくある質問)

---

## はじめに
（内容）

## インストール
（内容）

## 使い方
（内容）

## よくある質問
（内容）
```

---

### 参考リンク集

```markdown
## 参考リンク

- [公式ドキュメント](https://example.com/docs)
- [チュートリアル](https://example.com/tutorial)
- [API リファレンス](https://example.com/api)
- [GitHub リポジトリ](https://github.com/example/repo)
```

---

## 実習

以下のリンク集を作成してみましょう。

```markdown
## お気に入りサイト

- [サイト名](URL)
- [サイト名](URL "説明")
- [サイト名](URL)

## 連絡先

- メール：<your-email@example.com>
- GitHub：<https://github.com/yourname>
```
