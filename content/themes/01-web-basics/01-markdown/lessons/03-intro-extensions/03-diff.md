---
title: "diff構文（変更差分表示）の詳細"
order: 3
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# diff構文（変更差分表示）

## 解説

コードの変更箇所を視覚的に表示する記法です。追加・削除・変更された行を色分けして表示します。コードレビューや変更履歴の説明に便利です。

| 記号 | 意味 | 表示色（一般的） |
|------|------|------------------|
| `+` | 追加された行 | 緑色 |
| `-` | 削除された行 | 赤色 |
| `!` | 変更された行 | 黄色（一部環境） |
| `#` | コメント | グレー（一部環境） |
| （なし） | 変更なし | 通常色 |

---

## 基本的なdiff構文

### 記法

````markdown
```diff
  変更なしの行（先頭にスペース2つ）
- 削除された行
+ 追加された行
```
````

### 表示結果

```diff
  変更なしの行
- 削除された行
+ 追加された行
```

---

## コード変更の例

### JavaScript の修正例

````markdown
```diff
  function greet(name) {
-   console.log("Hello, " + name);
+   console.log(`Hello, ${name}!`);
  }
```
````

### 表示結果

```diff
  function greet(name) {
-   console.log("Hello, " + name);
+   console.log(`Hello, ${name}!`);
  }
```

---

## 設定ファイルの変更例

### package.json の依存関係更新

````markdown
```diff
  {
    "dependencies": {
-     "react": "^17.0.2",
+     "react": "^18.2.0",
-     "react-dom": "^17.0.2",
+     "react-dom": "^18.2.0",
      "axios": "^1.4.0"
    }
  }
```
````

### 表示結果

```diff
  {
    "dependencies": {
-     "react": "^17.0.2",
+     "react": "^18.2.0",
-     "react-dom": "^17.0.2",
+     "react-dom": "^18.2.0",
      "axios": "^1.4.0"
    }
  }
```

---

## 複数行の変更

### CSS の修正例

````markdown
```diff
  .button {
-   background-color: #007bff;
-   color: white;
-   padding: 8px 16px;
+   background-color: #0056b3;
+   color: #ffffff;
+   padding: 12px 24px;
+   border-radius: 4px;
+   transition: all 0.3s ease;
  }
```
````

### 表示結果

```diff
  .button {
-   background-color: #007bff;
-   color: white;
-   padding: 8px 16px;
+   background-color: #0056b3;
+   color: #ffffff;
+   padding: 12px 24px;
+   border-radius: 4px;
+   transition: all 0.3s ease;
  }
```

---

## 実用例

### コードレビューでの変更提案

````markdown
## 変更提案

セキュリティ向上のため、以下の修正を提案します：

```diff
  const password = req.body.password;
- const isValid = password === "admin123";
+ const isValid = await bcrypt.compare(password, user.hashedPassword);
```

理由：平文パスワードの比較は危険です。
````

### バージョンアップの変更点説明

````markdown
## v2.0.0 変更点

### 破壊的変更

APIのレスポンス形式が変更されました：

```diff
  {
-   "data": [...],
-   "count": 10
+   "results": [...],
+   "meta": {
+     "total": 10,
+     "page": 1
+   }
  }
```
````

### 設定ファイルのマイグレーションガイド

````markdown
## 設定ファイルの移行

`.eslintrc.json` を以下のように更新してください：

```diff
  {
-   "extends": "eslint:recommended",
+   "extends": ["eslint:recommended", "prettier"],
    "rules": {
-     "semi": "error"
+     "semi": ["error", "always"],
+     "quotes": ["error", "double"]
    }
  }
```
````

---

## 対応環境

| 環境 | 対応状況 |
|------|:--------:|
| GitHub | ✅ |
| GitLab | ✅ |
| VSCode | ✅ |
| Obsidian | ✅ |
| Notion | ❌ |
| Qiita | ✅ |

---

## 注意点

1. **先頭の記号は1文字目に**：`+` `-` は行の先頭に置く
2. **変更なしの行**：スペース2つで始めると見やすい
3. **シンタックスハイライトとの併用不可**：`diff` 指定時は言語ハイライトは効かない
4. **インデント維持**：元のコードのインデントを保持する

---

## 実習

以下の変更をdiff形式で書いてみましょう。

**変更前**：
```javascript
const message = "Hello";
console.log(message);
```

**変更後**：
```javascript
const message = "Hello, World!";
const count = 3;
console.log(message, count);
```

**解答例**：

````markdown
```diff
- const message = "Hello";
+ const message = "Hello, World!";
+ const count = 3;
- console.log(message);
+ console.log(message, count);
```
````
