---
title: "スプレッド構文とレスト構文"
description: "... 記号によるスプレッド（展開）とレスト（集約）の違いと、非破壊的なデータ操作を学ぶ。"
order: 7
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 9
status: published
---
# スプレッド構文とレスト構文

## 解説

`...` という同じ 3 点の記号が、使う場所によって 2 つの役割を持ちます。

- **スプレッド構文** … 配列やオブジェクトを「展開」して並べる
- **レスト構文** … 複数の値を 1 つの配列やオブジェクトに「集約」する

まずはスプレッド構文から見ていきます。

---

## スプレッド構文（展開）

配列やオブジェクトの中身を取り出して、別の場所に展開します。

```js
const nums = [1, 2, 3];

// 配列を展開して新しい配列を作る
const more = [0, ...nums, 4];
console.log(more); // [0, 1, 2, 3, 4]

// 配列のコピー（元の配列は変更されない）
const copy = [...nums];
copy.push(99);
console.log(nums); // [1, 2, 3]（元はそのまま）
console.log(copy); // [1, 2, 3, 99]

// 2つの配列を結合
const a = [1, 2];
const b = [3, 4];
console.log([...a, ...b]); // [1, 2, 3, 4]
```

オブジェクトでも同じように展開・結合できます。

```js
const base = { name: "田中", age: 25 };

// プロパティを引き継いで一部を上書き
const updated = { ...base, age: 26 };
console.log(updated); // { name: "田中", age: 26 }
console.log(base); // { name: "田中", age: 25 }（元はそのまま）

// 2つのオブジェクトを統合
const a = { x: 1 };
const b = { y: 2 };
console.log({ ...a, ...b }); // { x: 1, y: 2 }
```

**ポイント**: スプレッド構文は元のデータを壊さずに新しいデータを作ります。この「非破壊的（イミュータブル）」な操作は、状態管理で特に重要です。

---

## 関数呼び出しでのスプレッド

配列を、関数の個別の引数として渡せます。

```js
const numbers = [5, 2, 8, 1];

// 配列を個別の引数に展開
console.log(Math.max(...numbers)); // 8
// Math.max(5, 2, 8, 1) と同じ
```

---

## レスト構文（集約）

`...` を「受け取る側」で使うと、複数の値を 1 つの配列にまとめます。これがレスト構文です。

```js
// 残りの引数をまとめて配列で受け取る
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(10, 20, 30, 40)); // 100

// 最初の引数と「残り」を分ける
function greet(first, ...others) {
  console.log(`代表: ${first}`);
  console.log(`その他: ${others.join(", ")}`);
}

greet("田中", "鈴木", "佐藤");
// 代表: 田中
// その他: 鈴木, 佐藤
```

---

## 分割代入と組み合わせる

レスト構文は分割代入と組み合わせて、「一部を取り出して残りをまとめる」のに使えます。

```js
// 配列: 先頭を取り出し、残りを配列に
const [head, ...tail] = [1, 2, 3, 4];
console.log(head); // 1
console.log(tail); // [2, 3, 4]

// オブジェクト: 一部を除いた残りを取り出す
const user = { id: 1, name: "田中", password: "secret" };
const { password, ...safeUser } = user;
console.log(safeUser); // { id: 1, name: "田中" }
```

---

## スプレッドとレストの違い

| | スプレッド構文 | レスト構文 |
|---|----------------|------------|
| 役割 | 展開する | 集約する |
| 使う場所 | 配列・呼び出しの「中」 | 関数の引数・分割代入の「左辺」 |
| 例 | `[...arr]` `f(...arr)` | `function f(...args)` `[a, ...rest]` |

> [!NOTE]
> 記号はどちらも `...` で同じです。「値を作る側」ならスプレッド、「値を受け取る側」ならレスト、と覚えると区別しやすくなります。
