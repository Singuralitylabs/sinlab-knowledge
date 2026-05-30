---
title: "配列を操作するメソッド (map / filter / reduce)"
description: "forEach・map・filter・reduce など、配列を宣言的に処理するメソッドを体系的に学ぶ。"
order: 4
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 12
status: published
---
# 配列を操作するメソッド (map / filter / reduce)

## 解説

配列の要素を1つずつ処理するとき、従来は `for` 文を使っていました。しかし JavaScript の配列には、**「何をしたいか」をそのまま表現できる便利なメソッド**が用意されています。

```js
const numbers = [1, 2, 3, 4, 5];

// for 文（手続き的：手順を細かく書く）
const doubled1 = [];
for (let i = 0; i < numbers.length; i++) {
  doubled1.push(numbers[i] * 2);
}

// 配列メソッド（宣言的：やりたいことを書く）
const doubled2 = numbers.map((n) => n * 2);
// [2, 4, 6, 8, 10]
```

どちらも結果は同じですが、`map` を使った書き方は「各要素を2倍にした新しい配列を作る」という**意図がそのまま読み取れます**。これらのメソッドはいずれも**コールバック関数**（要素ごとに実行する関数）を受け取り、[アロー関数](arrow-functions)と組み合わせると非常に簡潔になります。

> [!NOTE]
> `forEach` / `map` / `filter` は「JavaScript（基礎）」モジュールでは名前だけ紹介しています。配列メソッドの本格的な解説はこの記事で行います。

---

## forEach：1つずつ処理する

`forEach` は配列の各要素に対して処理を実行します。**戻り値はありません**（`undefined`）。新しい配列は作らず、「各要素について何かをする」場面で使います。

```js
const fruits = ["りんご", "みかん", "ぶどう"];

fruits.forEach((fruit, index) => {
  console.log(`${index + 1}: ${fruit}`);
});
// 1: りんご
// 2: みかん
// 3: ぶどう
```

コールバックは第1引数に**要素**、第2引数に**インデックス**を受け取ります。

---

## map：各要素を変換する

`map` は各要素をコールバックで変換し、**同じ長さの新しい配列**を返します。元の配列は変更しません。

```js
const prices = [100, 250, 80];

const withTax = prices.map((price) => Math.round(price * 1.1));
// [110, 275, 88]

const users = [
  { name: "田中", age: 28 },
  { name: "佐藤", age: 34 },
];
const names = users.map((user) => user.name);
// ["田中", "佐藤"]
```

**ポイント**
- 「全要素を別の形に変換したい」ときは `map`。
- 戻り値を返さないと `undefined` の配列になってしまうので、コールバックで必ず値を返します。

---

## filter：条件に合う要素だけ取り出す

`filter` はコールバックが `true` を返した要素だけを集めた**新しい配列**を返します。

```js
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter((n) => n % 2 === 0);
// [2, 4, 6]

const adults = users.filter((user) => user.age >= 30);
// [{ name: "佐藤", age: 34 }]
```

条件（`true` / `false` を返す式）を書くのがコツです。

---

## find / findIndex：最初の1件を探す

`find` は条件に合う**最初の要素そのもの**を返します。見つからなければ `undefined` です。`findIndex` は同じ条件で**位置（インデックス）**を返します（見つからなければ `-1`）。

```js
const found = users.find((user) => user.name === "佐藤");
// { name: "佐藤", age: 34 }

const index = users.findIndex((user) => user.name === "佐藤");
// 1
```

`filter` は「該当する**すべて**」を配列で返すのに対し、`find` は「**最初の1件**」だけを返す点が違います。

---

## reduce：1つの値にまとめる

`reduce` は配列を**1つの値に集約**します。コールバックは「これまでの累積値（accumulator）」と「現在の要素」を受け取り、次の累積値を返します。第2引数で**初期値**を指定します。

```js
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((total, n) => total + n, 0);
// 15

const cart = [
  { name: "本", price: 1500 },
  { name: "ペン", price: 200 },
];
const totalPrice = cart.reduce((total, item) => total + item.price, 0);
// 1700
```

合計・最大値・オブジェクトへの変換など、「配列から1つの結果を導く」処理に幅広く使えます。

---

## some / every：条件を満たすか判定する

`some` は「**1つでも**条件を満たすか」、`every` は「**すべてが**条件を満たすか」を `true` / `false` で返します。

```js
const scores = [80, 95, 60];

scores.some((s) => s >= 90);   // true（90以上が1つある）
scores.every((s) => s >= 70);  // false（60があるため）
```

---

## メソッドチェーン

これらのメソッドは新しい配列を返すため、**つなげて書く（チェーンする）**ことができます。処理を左から右へ順に読めるのが利点です。

```js
const orders = [
  { item: "本", price: 1500, paid: true },
  { item: "ペン", price: 200, paid: false },
  { item: "ノート", price: 400, paid: true },
];

// 支払い済みの金額だけを合計する
const paidTotal = orders
  .filter((order) => order.paid)        // 支払い済みだけ残す
  .map((order) => order.price)          // 金額の配列にする
  .reduce((total, price) => total + price, 0); // 合計する
// 1900
```

---

## 非破壊（元の配列を変えない）

`map` / `filter` / `reduce` などは**元の配列を変更せず、新しい値を返します**。これは予期しない副作用を防ぐ、安全な書き方です。

一方で、`sort` や `reverse`、`push` などは**元の配列を直接書き換える（破壊的）**点に注意してください。元の配列を残したい場合は、[スプレッド構文](spread-rest)でコピーしてから操作します。

```js
const nums = [3, 1, 2];

const sorted = [...nums].sort((a, b) => a - b); // コピーを並べ替え
// sorted → [1, 2, 3]、nums は [3, 1, 2] のまま
```

> [!TIP]
> 数値の並べ替えで `sort()` をそのまま使うと文字列として比較され、想定外の順になります。数値順にするには `sort((a, b) => a - b)` のように比較関数を渡します。

---

## まとめ

- **forEach**：各要素を処理する（戻り値なし）。
- **map**：各要素を変換して新しい配列を作る。
- **filter**：条件に合う要素だけを集める。
- **find / findIndex**：条件に合う最初の要素・位置を探す。
- **reduce**：配列を1つの値に集約する（合計など）。
- **some / every**：条件を満たすかを判定する。
- これらは元の配列を変えない**非破壊的**なメソッドで、**チェーン**して読みやすく書けます。`sort` など破壊的なメソッドはコピーしてから使うと安全です。
