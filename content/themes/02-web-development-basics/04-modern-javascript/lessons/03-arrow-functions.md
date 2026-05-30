---
title: "アロー関数"
description: "=> を使った簡潔な関数定義と、this を引き継ぐ性質を従来の関数と比較して学ぶ。"
order: 3
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 8
status: published
---
# アロー関数

## 解説

アロー関数は `=>`（矢印）を使った関数の書き方です。従来の `function` 式より短く書け、`this` の扱いもシンプルになります。

```js
// 従来の関数式
const add1 = function (a, b) {
  return a + b;
};

// アロー関数
const add2 = (a, b) => {
  return a + b;
};

console.log(add1(2, 3)); // 5
console.log(add2(2, 3)); // 5
```

---

## 省略記法

アロー関数は条件によってさらに短く書けます。

```js
// 引数が1つのときは ( ) を省略できる
const square = x => x * x;

// 本体が「式を1つ返すだけ」なら { } と return を省略できる
const double = x => x * 2;

console.log(square(4)); // 16
console.log(double(5)); // 10

// 引数がない／複数あるときは ( ) が必要
const greet = () => "こんにちは";
const sum = (a, b) => a + b;
```

オブジェクトをそのまま返したいときは、`{ }` がブロックと解釈されないよう `( )` で囲みます。

```js
const makeUser = (name) => ({ name: name, active: true });
console.log(makeUser("田中")); // { name: "田中", active: true }
```

**ポイント**: 1 行で値を返す短い関数ほど、アロー関数の省略記法が効きます。

---

## 配列メソッドでの活用

アロー関数は、`map` や `filter` などの配列メソッドに渡すコールバックで特に読みやすくなります。

```js
const numbers = [1, 2, 3, 4, 5];

// 従来の書き方
const doubled1 = numbers.map(function (n) {
  return n * 2;
});

// アロー関数
const doubled2 = numbers.map((n) => n * 2);

console.log(doubled2); // [2, 4, 6, 8, 10]

const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4]
```

---

## this を引き継ぐ性質

アロー関数の最大の特徴は、**自分専用の `this` を持たない**ことです。アロー関数の中の `this` は、外側のスコープの `this` をそのまま使います。これにより、コールバックの中で `this` がずれる問題を回避できます。

```js
// 従来の関数: コールバック内の this が変わってしまう
const counter1 = {
  count: 0,
  start() {
    setInterval(function () {
      this.count++; // this は counter1 ではない（undefined など）
      console.log(this.count); // NaN
    }, 1000);
  },
};

// アロー関数: 外側の this（counter2）を引き継ぐ
const counter2 = {
  count: 0,
  start() {
    setInterval(() => {
      this.count++; // this は counter2 を指す
      console.log(this.count); // 1, 2, 3, ...
    }, 1000);
  },
};
```

> [!WARNING]
> アロー関数は `this` を固定するため、オブジェクトのメソッドそのものや、`this` を切り替えたいイベントハンドラには向きません。その場合は従来の `function` を使います。

---

## 使い分けのまとめ

| 用途 | おすすめ |
|------|----------|
| 配列メソッドのコールバック | アロー関数 |
| 短い処理を渡す関数 | アロー関数 |
| 外側の `this` を使いたい | アロー関数 |
| オブジェクトのメソッド定義 | `function`（メソッド記法） |
