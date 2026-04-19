---
title: "コードブロック（Code Blocks）サンプル"
order: 5
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# コードブロック（Code Blocks）サンプル

## 解説

プログラムのコードを表示するための記法です。

| 種類 | 記法 | 用途 |
|------|------|------|
| インラインコード | `` `code` `` | 文中の短いコード |
| コードブロック | ` ``` ` で囲む | 複数行のコード |

---

## インラインコード

### 記法

```markdown
`console.log()` は出力に使います。
ファイル名は `index.html` です。
`Ctrl + C` でコピーできます。
```

### 表示結果

`console.log()` は出力に使います。
ファイル名は `index.html` です。
`Ctrl + C` でコピーできます。

---

## コードブロック（言語指定なし）

### 記法

````markdown
```
これはコードブロックです
インデントや改行がそのまま保持されます
```
````

### 表示結果

```
これはコードブロックです
インデントや改行がそのまま保持されます
```

---

## コードブロック（言語指定あり）

言語を指定すると**シンタックスハイライト**（色分け）されます。

### JavaScript

````markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```
````

### 表示結果

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

---

### HTML

````markdown
```html
<!DOCTYPE html>
<html>
<head>
  <title>サンプル</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```
````

### 表示結果

```html
<!DOCTYPE html>
<html>
<head>
  <title>サンプル</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

---

### CSS

````markdown
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background-color: #007bff;
  color: white;
  border-radius: 4px;
}
```
````

### 表示結果

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background-color: #007bff;
  color: white;
  border-radius: 4px;
}
```

---

### Python

````markdown
```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 出力: 120
```
````

### 表示結果

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 出力: 120
```

---

### JSON

````markdown
```json
{
  "name": "山田太郎",
  "age": 25,
  "skills": ["JavaScript", "Python", "HTML"]
}
```
````

### 表示結果

```json
{
  "name": "山田太郎",
  "age": 25,
  "skills": ["JavaScript", "Python", "HTML"]
}
```

---

### Bash / Shell

````markdown
```bash
# ディレクトリ作成
mkdir my-project
cd my-project

# npmの初期化
npm init -y

# パッケージのインストール
npm install express
```
````

### 表示結果

```bash
# ディレクトリ作成
mkdir my-project
cd my-project

# npmの初期化
npm init -y

# パッケージのインストール
npm install express
```

---

## よく使う言語指定一覧

| 言語 | 指定名 |
|------|--------|
| JavaScript | `javascript` または `js` |
| TypeScript | `typescript` または `ts` |
| Python | `python` または `py` |
| HTML | `html` |
| CSS | `css` |
| JSON | `json` |
| Bash | `bash` または `shell` |
| SQL | `sql` |
| Markdown | `markdown` または `md` |

---

## 実習

以下のコードをコードブロックで書いてみましょう。

1. 好きな言語で「Hello World」を出力するコード
2. 簡単な関数の定義

```markdown
```javascript
// ここにコードを書く
```
```
