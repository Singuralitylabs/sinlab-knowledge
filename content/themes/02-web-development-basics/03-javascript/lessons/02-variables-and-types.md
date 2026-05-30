---
title: 変数と型
description: let / const による変数宣言と、JavaScript の基本的な型を学ぶ。
order: 2
type: lecture
difficulty: beginner
tags: [javascript]
estimatedMinutes: 10
status: published
---

# 変数と型

## 解説

**変数**は、データを入れておく名前付きの「箱」です。値を変数に入れておけば、後からその名前で取り出したり、計算に使ったりできます。

そして、変数に入れる値には**型**（データの種類）があります。「文字列なのか」「数値なのか」によって、できる操作が変わります。まずは変数の作り方から見ていきましょう。

---

## 変数の宣言: `let` と `const`

JavaScript で変数を作るときは、`let` または `const` を使います。

```js
let count = 0; // 後から変更できる変数
const name = "田中"; // 後から変更できない変数（定数）

count = 1; // OK: let は再代入できる
console.log(count); // 1
```

- **`const`**: 値を**変更しない**変数に使います。一度入れた値を後から変えられません。
- **`let`**: 値を**後から変更する**変数に使います。

```js
const pi = 3.14;
pi = 3.15; // エラー: const には再代入できない
```

**ポイント**

- 基本は **`const` を使い、変更が必要なときだけ `let`** に切り替えるのがおすすめです。意図しない書き換えを防げます。

> [!WARNING]
> 古い教材では `var` という宣言も登場しますが、予期しない動作の原因になりやすいため、現在は使わないことが推奨されています。これから書くコードでは `let` / `const` を使いましょう。

---

## プリミティブ型

JavaScript の値は、大きく「プリミティブ型」と「オブジェクト」に分かれます。プリミティブ型は、それ以上分解できない基本的な値です。代表的なものは次の 5 つです。

```js
const text = "こんにちは"; // string（文字列）
const age = 25; // number（数値）
const isActive = true; // boolean（真偽値）
const nothing = null; // null（値が「ない」ことを意図的に表す）
let notDefined; // undefined（まだ値が入っていない）
```

| 型 | 意味 | 例 |
|------|------|------|
| string | 文字列 | `"hello"`, `'こんにちは'` |
| number | 数値（整数も小数も） | `42`, `3.14`, `-7` |
| boolean | 真偽値（はい / いいえ） | `true`, `false` |
| null | 「値がない」ことを表す | `null` |
| undefined | 値が未設定 | （宣言だけして未代入） |

**ポイント**

- 文字列はシングルクォート `'...'` でもダブルクォート `"..."` でも書けます。
- 数値は整数と小数を区別しません。どちらも `number` 型です。
- `null` は「意図的に空にした」、`undefined` は「まだ何も入っていない」という違いがあります。

---

## オブジェクト

プリミティブ以外の値は、まとめて**オブジェクト**と呼ばれます。複数の値を 1 つにまとめて扱えます（配列もオブジェクトの一種です）。詳しくは「配列とオブジェクト」で扱います。

```js
const user = {
  name: "田中",
  age: 25,
};

console.log(user.name); // 田中
```

---

## 型を調べる: `typeof`

ある値がどの型なのかは、`typeof` 演算子で調べられます。

```js
console.log(typeof "hello"); // "string"
console.log(typeof 42); // "number"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof { name: "田中" }); // "object"
```

> [!NOTE]
> `typeof null` は歴史的な理由で `"object"` と表示されます。直感に反しますが、JavaScript の有名な仕様です。

---

## テンプレートリテラル

文字列の中に変数の値を埋め込みたいときは、バッククォート（`` ` ``）で囲む**テンプレートリテラル**が便利です。`${ }` の中に変数や式を書けます。

```js
const name = "田中";
const age = 25;

// テンプレートリテラル（推奨）
const message = `${name}さんは${age}歳です`;
console.log(message); // 田中さんは25歳です

// 従来の文字列結合（+ でつなぐ）
const message2 = name + "さんは" + age + "歳です";
console.log(message2); // 田中さんは25歳です
```

**ポイント**

- `+` でつなぐ方法に比べ、テンプレートリテラルのほうが読みやすく、書き間違いも減ります。
- 改行をそのまま含めることもできます。

```js
const text = `1行目
2行目`;
```

---

## まとめ

- 変数は `const`（変更しない）と `let`（変更する）で宣言する。`var` は使わない。
- 基本の型は string / number / boolean / null / undefined の 5 つ。複数の値をまとめるのがオブジェクト。
- `typeof` で型を調べられる。
- 文字列に値を埋め込むなら、テンプレートリテラル `` `${変数}` `` が便利。
