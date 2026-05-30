---
title: 配列とオブジェクト
description: 配列とオブジェクトの基本的な作り方・アクセス方法・要素の出し入れを学ぶ。
order: 5
type: lecture
difficulty: beginner
tags: [javascript]
estimatedMinutes: 10
status: published
---

# 配列とオブジェクト

## 解説

複数の値をまとめて扱う方法には、大きく 2 つあります。順番に並べて管理する**配列**と、名前を付けて管理する**オブジェクト**です。実用的なデータ処理では、この 2 つを組み合わせて使います。

---

## 配列の基本

配列は `[ ]` で値を並べて作ります。各値には `0` から始まる**インデックス（番号）**でアクセスします。

```js
const fruits = ["りんご", "みかん", "ぶどう"];

console.log(fruits[0]); // りんご（最初は 0 番）
console.log(fruits[2]); // ぶどう
console.log(fruits.length); // 3（要素の数）
```

---

## 要素の追加・削除

```js
const list = ["a", "b"];

list.push("c"); // 末尾に追加
console.log(list); // ["a", "b", "c"]

list.pop(); // 末尾を削除
console.log(list); // ["a", "b"]
```

| メソッド | 動作 |
|----------|------|
| `push` | 末尾に追加 |
| `pop` | 末尾を削除 |
| `unshift` | 先頭に追加 |
| `shift` | 先頭を削除 |

---

## 配列の要素をまとめて処理する

配列には `forEach`・`map`・`filter`・`reduce` など、要素を 1 つずつ処理する便利なメソッドが用意されています。これらは現在のコードで中心的に使われるモダンな書き方のため、本コースでは「モダンJavaScript」モジュールでまとめて解説します。

詳しくは [配列を操作するメソッド (map / filter / reduce)](/themes/02-web-development-basics/04-modern-javascript/array-methods) を参照してください。

---

## オブジェクトの基本

オブジェクトは `{ }` の中に「キー（名前）: 値」の組を並べて作ります。

```js
const user = {
  name: "田中",
  age: 25,
  isActive: true,
};
```

### プロパティへのアクセス

```js
// ドット記法（よく使う）
console.log(user.name); // 田中

// ブラケット記法
console.log(user["age"]); // 25

// 値の変更・追加
user.age = 26; // 変更
user.email = "tanaka@example.com"; // 追加
console.log(user.email); // tanaka@example.com
```

> [!NOTE]
> `const` で宣言したオブジェクトでも、中のプロパティは変更・追加できます。`const` が禁止するのは「変数自体に別の値を再代入すること」だけです。

---

## 値の取り出しをもっと簡潔に（分割代入）

オブジェクトや配列から、値をまとめて取り出す**分割代入**という書き方もあります。これも ES6 以降のモダンな文法のため、本コースでは「モダンJavaScript」モジュールで扱います。

詳しくは [分割代入](/themes/02-web-development-basics/04-modern-javascript/destructuring) を参照してください。

---

## まとめ

- 配列は `[ ]` で値を並べ、`0` から始まるインデックスでアクセスする。`push` / `pop` で出し入れする。
- オブジェクトは `{ キー: 値 }` で作り、`オブジェクト.キー` でアクセスする。
- `const` のオブジェクトでも、中のプロパティは変更・追加できる。
- 配列メソッド（`map` ほか）や分割代入といったモダンな書き方は、「モダンJavaScript」モジュールで詳しく学びます。
