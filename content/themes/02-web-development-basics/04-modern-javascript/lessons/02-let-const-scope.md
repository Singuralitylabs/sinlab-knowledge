---
title: "let / const とブロックスコープ"
description: "var との違いを踏まえ、let・const の使い分けとブロックスコープの仕組みを理解する。"
order: 2
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 8
status: published
---
# let / const とブロックスコープ

## 解説

ES6 より前の JavaScript では、変数の宣言に `var` しかありませんでした。ES6 では、より安全に使える `let` と `const` が追加され、現在では `var` はほとんど使われません。

- `let` … 後から **再代入できる** 変数
- `const` … 後から **再代入できない** 定数

```js
let count = 0;
count = 1; // OK: let は再代入できる

const name = "田中";
name = "鈴木"; // エラー: const は再代入できない
// TypeError: Assignment to constant variable.
```

**ポイント**: 基本は `const` を使い、ループのカウンタなど「再代入が必要なとき」だけ `let` を使います。こうすると「この変数は変わらない」という意図がコードから読み取れます。

---

## ブロックスコープ

`let` と `const` は、宣言された `{ }`（ブロック）の中だけで有効です。これを**ブロックスコープ**と呼びます。一方 `var` は関数全体で有効な**関数スコープ**で、ブロックを無視します。

```js
// var の場合: ブロックの外からでも参照できてしまう
if (true) {
  var a = 1;
}
console.log(a); // 1（ブロックの外なのに見える）

// let の場合: ブロックの外からは参照できない
if (true) {
  let b = 2;
}
console.log(b); // ReferenceError: b is not defined
```

**ポイント**: ブロックスコープのおかげで、変数の有効範囲が限定され、意図しない場所からの上書きを防げます。

---

## var の落とし穴: ループと var

`var` の関数スコープは、ループと組み合わせると分かりにくいバグを生みます。

```js
// var: ループ変数が共有されてしまう
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 出力: 3, 3, 3（期待は 0, 1, 2）

// let: 反復ごとに新しい i が作られる
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// 出力: 0, 1, 2
```

`let` はループの繰り返しごとに新しい変数を作るため、期待どおりの結果になります。

---

## const と「中身の変更」

`const` は「再代入できない」だけで、「中身を変更できない」わけではありません。オブジェクトや配列は、変数自体を入れ替えなければ中身を変更できます。

```js
const user = { name: "田中" };
user.name = "鈴木"; // OK: プロパティの変更は可能
console.log(user.name); // "鈴木"

user = { name: "佐藤" }; // エラー: 変数の再代入は不可
// TypeError: Assignment to constant variable.

const list = [1, 2, 3];
list.push(4); // OK: 配列への要素追加は可能
console.log(list); // [1, 2, 3, 4]
```

**ポイント**: `const` が固定するのは「変数とデータの結びつき」であって、データの中身そのものではありません。

---

## 使い分けのまとめ

| 宣言 | 再代入 | スコープ | 使いどころ |
|------|:------:|----------|------------|
| `const` | 不可 | ブロック | 既定。再代入しない値すべて |
| `let` | 可能 | ブロック | カウンタなど再代入する値 |
| `var` | 可能 | 関数 | 原則使わない（レガシー） |

> [!TIP]
> 「迷ったら `const`、再代入が必要になったら `let` に変える」と覚えておくと、安全で読みやすいコードになります。
