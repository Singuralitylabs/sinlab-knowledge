---
title: 配列とオブジェクト
description: 配列の主要メソッドと、オブジェクトのプロパティアクセス・分割代入の基本を学ぶ。
order: 5
type: lecture
difficulty: beginner
tags: [javascript]
estimatedMinutes: 12
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

## 主要な配列メソッド

配列には、要素を 1 つずつ処理する便利なメソッドが用意されています。多くはアロー関数と組み合わせて使います。

### `forEach`: 1 つずつ処理する

```js
const fruits = ["りんご", "みかん", "ぶどう"];

fruits.forEach((fruit) => {
  console.log(fruit);
});
// 出力: りんご / みかん / ぶどう
```

### `map`: 各要素を変換して新しい配列を作る

```js
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);

console.log(doubled); // [2, 4, 6]
console.log(numbers); // [1, 2, 3]（元の配列は変わらない）
```

### `filter`: 条件に合う要素だけ取り出す

```js
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter((n) => n % 2 === 0);

console.log(evens); // [2, 4]
```

### `find`: 条件に最初に合う 1 つを探す

```js
const users = [
  { id: 1, name: "田中" },
  { id: 2, name: "鈴木" },
];

const found = users.find((user) => user.id === 2);
console.log(found); // { id: 2, name: "鈴木" }
```

| メソッド | 返すもの |
|----------|----------|
| `forEach` | なし（各要素に処理を実行するだけ） |
| `map` | 各要素を変換した新しい配列 |
| `filter` | 条件に合う要素だけの新しい配列 |
| `find` | 条件に最初に合った 1 つの要素 |

> [!TIP]
> `map` や `filter` は元の配列を変更せず、新しい配列を返します。元データを壊さずに加工できるので安心です。

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

## 分割代入の入口

オブジェクトや配列から、値を取り出して変数に入れる便利な書き方が**分割代入**です。

```js
const user = { name: "田中", age: 25 };

// 分割代入: プロパティ名と同じ名前の変数に取り出す
const { name, age } = user;
console.log(name); // 田中
console.log(age); // 25

// 配列でも使える
const colors = ["赤", "青"];
const [first, second] = colors;
console.log(first); // 赤
console.log(second); // 青
```

これがないと、`const name = user.name;` のように 1 つずつ書く必要があります。分割代入を使うとすっきり書けます。

> [!NOTE]
> 分割代入も ES6 以降のモダンな文法の一つです。ここでは「こう書ける」という入口の紹介にとどめ、応用は別モジュール「モダン JavaScript」で扱います。

---

## まとめ

- 配列は `[ ]` で値を並べ、`0` から始まるインデックスでアクセスする。`push` / `pop` で出し入れする。
- `forEach`（順に処理）・`map`（変換）・`filter`（絞り込み）・`find`（検索）が代表的なメソッド。
- オブジェクトは `{ キー: 値 }` で作り、`オブジェクト.キー` でアクセスする。
- 分割代入を使うと、オブジェクトや配列から値をまとめて取り出せる。
