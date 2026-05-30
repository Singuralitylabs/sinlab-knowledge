---
title: "分割代入"
description: "配列やオブジェクトの要素をまとめて変数に取り出す分割代入の書き方と実用例を学ぶ。"
order: 5
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 9
status: published
---
# 分割代入

## 解説

分割代入（Destructuring）は、配列やオブジェクトの中身を一度に取り出して、それぞれの変数に代入する構文です。値を 1 つずつ取り出すよりも、短く書けます。

```js
const user = { name: "田中", age: 25, email: "tanaka@example.com" };

// 従来: 1つずつ取り出す
const name1 = user.name;
const age1 = user.age;

// オブジェクトの分割代入: まとめて取り出す
const { name, age } = user;
console.log(name); // "田中"
console.log(age); // 25
```

**ポイント**: `{ }` の中にプロパティ名を書くと、同じ名前の変数にその値が代入されます。

---

## 配列の分割代入

配列では、要素を「順番」で取り出します。

```js
const colors = ["赤", "緑", "青"];

// 従来
const first1 = colors[0];
const second1 = colors[1];

// 配列の分割代入: 位置で取り出す
const [first, second, third] = colors;
console.log(first); // "赤"
console.log(second); // "緑"
console.log(third); // "青"

// 不要な要素はカンマで飛ばせる
const [, , last] = colors;
console.log(last); // "青"
```

---

## デフォルト値と別名

取り出した値が `undefined` のときに使う**デフォルト値**を設定できます。また、オブジェクトでは別の変数名に**リネーム**もできます。

```js
const settings = { theme: "dark" };

// theme は存在するので "dark"、fontSize は無いので既定値 16
const { theme, fontSize = 16 } = settings;
console.log(theme); // "dark"
console.log(fontSize); // 16

// 別名（プロパティ名: 新しい変数名）
const user = { name: "田中" };
const { name: userName } = user;
console.log(userName); // "田中"
```

---

## 関数の引数での分割代入

関数の引数で分割代入を使うと、必要なプロパティだけを直接受け取れます。引数の順番を気にせず、名前で渡せるようになります。

```js
// オブジェクトをそのまま受け取り、中で分割代入
function printUser({ name, age }) {
  console.log(`${name}さん（${age}歳）`);
}

printUser({ name: "鈴木", age: 30 });
// 鈴木さん（30歳）

// デフォルト値も組み合わせられる
function createButton({ label, color = "blue" } = {}) {
  console.log(`[${label}] 色: ${color}`);
}

createButton({ label: "送信" }); // [送信] 色: blue
createButton({ label: "削除", color: "red" }); // [削除] 色: red
```

---

## 実用例: 値の入れ替え

配列の分割代入を使うと、一時変数なしで 2 つの値を入れ替えられます。

```js
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

---

## ネストした分割代入

入れ子になったオブジェクトからも、深い階層の値を直接取り出せます。

```js
const response = {
  data: {
    user: { id: 1, name: "佐藤" },
  },
};

const {
  data: {
    user: { name },
  },
} = response;

console.log(name); // "佐藤"
```

> [!TIP]
> React など多くのフレームワークでは、props や state の受け取りに分割代入が頻繁に使われます。早めに慣れておくと、サンプルコードがぐっと読みやすくなります。
