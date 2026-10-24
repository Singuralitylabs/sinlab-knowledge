---
title: "JSONで使える6つのデータ型"
order: 2
type: detail
difficulty: beginner
tags: [json, data-types]
estimatedMinutes: 6
status: published
---
# JSONで使える6つのデータ型

## 解説

JSONの値として使えるのは、次の6種類のデータ型だけです。

| データ型 | 解説 | 例 |
|----------|------|----|
| **文字列 (String)** | ダブルクォートで囲まれたテキスト | `"Hello"` |
| **数値 (Number)** | 整数または浮動小数点数（引用符なし） | `42`, `3.14`, `-5` |
| **真偽値 (Boolean)** | 小文字の `true` または `false` | `true`, `false` |
| **配列 (Array)** | `[` と `]` で囲まれた値の順序付きリスト | `["apple", "banana"]` |
| **オブジェクト (Object)** | `{}` で囲まれたキーと値のペアの集まり | `{"key": "value"}` |
| **null** | 値が存在しないことを示す | `null` |

文字列・数値・真偽値・null は1つの値を表す **単純な型**、配列とオブジェクトは複数の値をまとめる **入れ物の型** です。入れ物の中には6種類のどの値でも入れられるため、配列の中にオブジェクトを入れたり、オブジェクトの中に配列を入れたり（**ネスト**）して複雑なデータを表現します。

---

## サンプル

### ネストしたデータの例

```json
{
  "shopName": "Sinlab Store",
  "isOpen": true,
  "rating": 4.5,
  "products": [
    { "id": 1, "name": "ノート", "price": 300, "tags": ["文房具"] },
    { "id": 2, "name": "ペン", "price": 150, "tags": [] }
  ],
  "closedReason": null
}
```

| キー | 型 |
|------|----|
| `shopName` | 文字列 |
| `isOpen` | 真偽値 |
| `rating` | 数値 |
| `products` | 配列（中身はオブジェクト） |
| `products[0].tags` | 配列（中身は文字列） |
| `closedReason` | null |

---

## よくある間違い

### 1. 数値や真偽値をクォートで囲んでしまう

```text
❌ { "age": "25", "isStudent": "true" }   ← どちらも「文字列」になる

✅ { "age": 25, "isStudent": true }
```

`"25"` は数値ではなく文字列です。受け取ったプログラム側で計算や条件分岐をするときに想定外の動きになるため、型を意識して書き分けます。

### 2. 真偽値や null を大文字で書く

```text
❌ { "isStudent": True, "note": NULL }

✅ { "isStudent": true, "note": null }
```

`true` / `false` / `null` は必ず小文字です。

### 3. JSONにない型を使おうとする

```text
❌ { "createdAt": new Date(), "callback": function() {}, "value": undefined }

✅ { "createdAt": "2026-10-24T10:00:00Z" }
```

日付・関数・`undefined` はJSONの型にはありません。日付は `"2026-10-24T10:00:00Z"` のような **ISO 8601形式の文字列** で表すのが一般的です。

---

## 実用例

### 「値がない」の表し方を使い分ける

APIのレスポンスでは、同じ「値がない」でも表し方によって意味が変わります。

| 書き方 | 意味の例 |
|--------|----------|
| `"note": null` | 項目はあるが、値が設定されていない |
| `"tags": []` | リストはあるが、要素が0件 |
| `"name": ""` | 文字列はあるが、空文字 |
| キー自体がない | その項目自体が存在しない |

レスポンスを読むときは、これらの違いを意識すると不具合の原因を見つけやすくなります。

---

## 実習

### 課題1

次の情報を、適切なデータ型を使ってJSONで表現してください。

- 書籍名は「はじめてのJSON」
- 価格は1980円
- 在庫あり
- 著者は「山田」と「佐藤」の2名
- 出版社の情報（名前は「Sinlab出版」、所在地は「東京」）
- 続編は未定

解答例：

```json
{
  "title": "はじめてのJSON",
  "price": 1980,
  "inStock": true,
  "authors": ["山田", "佐藤"],
  "publisher": {
    "name": "Sinlab出版",
    "location": "東京"
  },
  "sequel": null
}
```
