---
title: "折りたたみ（Details / Summary）の詳細"
order: 1
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# 折りたたみ（Details / Summary）

## 解説

長いコンテンツを折りたたんで表示できるHTML要素です。
クリックで展開/収納ができます。

- `<details>`: 折りたたみコンテナ
- `<summary>`: クリック可能なラベル部分

**対応環境**: GitHub、多くのMarkdownエディタ

---

## 基本的な折りたたみ

### 記法

```html
<details>
<summary>クリックして展開</summary>

ここに隠したい内容を書きます。
展開すると表示されます。

</details>
```

### 表示結果

<details>
<summary>クリックして展開</summary>

ここに隠したい内容を書きます。
展開すると表示されます。

</details>

---

## デフォルトで展開

`open` 属性を付けると、最初から展開された状態になります。

### 記法

```html
<details open>
<summary>最初から展開されています</summary>

この内容は最初から見えています。
クリックで閉じることができます。

</details>
```

### 表示結果

<details open>
<summary>最初から展開されています</summary>

この内容は最初から見えています。
クリックで閉じることができます。

</details>

---

## 折りたたみ内でのMarkdown記法

### 記法

```html
<details>
<summary>Markdownも使えます</summary>

### 見出しも書けます

- リスト項目1
- リスト項目2
- リスト項目3

**太字**や*斜体*も使えます。

| 列1 | 列2 |
|-----|-----|
| A   | B   |

</details>
```

### 表示結果

<details>
<summary>Markdownも使えます</summary>

### 見出しも書けます

- リスト項目1
- リスト項目2
- リスト項目3

**太字**や*斜体*も使えます。

| 列1 | 列2 |
|-----|-----|
| A   | B   |

</details>

---

## コードブロックの折りたたみ

### 記法

````html
<details>
<summary>長いコードを見る</summary>

```javascript
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('User data:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      throw error;
    });
}
```

</details>
````

### 表示結果

<details>
<summary>長いコードを見る</summary>

```javascript
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('User data:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      throw error;
    });
}
```

</details>

---

## 実用例

### FAQ（よくある質問）

```html
<details>
<summary>Q. 料金はいくらですか？</summary>

月額1,000円からご利用いただけます。
年払いの場合は10%割引となります。

</details>

<details>
<summary>Q. 解約はできますか？</summary>

はい、いつでも解約可能です。
日割りでの返金には対応しておりません。

</details>

<details>
<summary>Q. サポート対応時間は？</summary>

平日 9:00〜18:00 です。
土日祝日はお休みをいただいております。

</details>
```

### 表示結果

<details>
<summary>Q. 料金はいくらですか？</summary>

月額1,000円からご利用いただけます。
年払いの場合は10%割引となります。

</details>

<details>
<summary>Q. 解約はできますか？</summary>

はい、いつでも解約可能です。
日割りでの返金には対応しておりません。

</details>

<details>
<summary>Q. サポート対応時間は？</summary>

平日 9:00〜18:00 です。
土日祝日はお休みをいただいております。

</details>

---

### エラーログの折りたたみ

````html
<details>
<summary>エラーログ（クリックで展開）</summary>

```
Error: ENOENT: no such file or directory
    at Object.openSync (fs.js:476:3)
    at Object.readFileSync (fs.js:377:35)
    at loadConfig (/app/src/config.js:15:22)
    at Object.<anonymous> (/app/src/index.js:5:16)
```

</details>
````

---

## 注意点

1. **空行が必要**: `<summary>` の後と `</details>` の前には空行を入れる
2. **インデントに注意**: 折りたたみ内のMarkdownはインデントしない
3. **ネストも可能**: 折りたたみの中に折りたたみを入れることもできる

---

## 実習

以下のテンプレートを使って、FAQを作成してみましょう。

```html
<details>
<summary>Q. あなたの質問</summary>

ここに回答を書く

</details>
```
