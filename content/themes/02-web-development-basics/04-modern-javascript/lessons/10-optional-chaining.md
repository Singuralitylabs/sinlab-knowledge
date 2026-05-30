---
title: "オプショナルチェイニングとNull合体演算子"
description: "?. による安全なプロパティアクセスと、?? による既定値の指定方法を学ぶ。"
order: 10
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 8
status: published
---
# オプショナルチェイニングとNull合体演算子

## 解説

API から受け取ったデータなど、「プロパティが存在するか分からない」値を扱うとき、従来はエラーを避けるための長いチェックが必要でした。ES2020 で追加された `?.` と `??` を使うと、これを安全かつ簡潔に書けます。

---

## オプショナルチェイニング（?.）

`?.` は、左側の値が `null` または `undefined` のときに、エラーを出さず `undefined` を返します。途中のプロパティが無くても安全にアクセスできます。

```js
const user = {
  name: "田中",
  address: {
    city: "東京",
  },
};

// 従来: 途中が無いとエラーになるため、何段もチェックが必要
const zip1 = user && user.address && user.address.zipcode;

// オプショナルチェイニング: 1行で安全に
const zip2 = user?.address?.zipcode;
console.log(zip2); // undefined（エラーにならない）

console.log(user?.address?.city); // "東京"
```

`?.` を付けずにアクセスすると、途中で `undefined` に当たった時点でエラーになります。

```js
const data = {};
console.log(data.user.name); // TypeError: Cannot read properties of undefined
console.log(data.user?.name); // undefined（安全）
```

---

## メソッドや配列にも使える

`?.` は、メソッドの呼び出しや配列の要素アクセスにも使えます。

```js
const obj = {
  greet() {
    return "こんにちは";
  },
};

// メソッドが存在すれば呼び、無ければ undefined
console.log(obj.greet?.()); // "こんにちは"
console.log(obj.sayBye?.()); // undefined（エラーにならない）

// 配列アクセス
const list = null;
console.log(list?.[0]); // undefined（list が null でも安全）
```

---

## Null合体演算子（??）

`??` は、左側の値が `null` または `undefined` のときだけ、右側の既定値を使う演算子です。

```js
const settings = { volume: 0, theme: null };

// volume は 0 だが「指定済み」なので 0 のまま
const volume = settings.volume ?? 50;
console.log(volume); // 0

// theme は null なので既定値を使う
const theme = settings.theme ?? "light";
console.log(theme); // "light"
```

---

## || との違い

よく似た `||`（論理OR）は、`null` / `undefined` に加えて `0`・空文字・`false` も「偽」として既定値に置き換えてしまいます。`??` は `null` / `undefined` のときだけ反応するため、`0` や空文字を有効な値として扱えます。

```js
const count = 0;

console.log(count || 10); // 10（0 を偽として既定値に置き換えてしまう）
console.log(count ?? 10); // 0（0 はそのまま残る）

const text = "";
console.log(text || "未入力"); // "未入力"
console.log(text ?? "未入力"); // ""（空文字を有効な値として扱う）
```

> [!WARNING]
> 「0 や空文字を有効な値として残したい」場合は `||` ではなく `??` を使います。数量や入力値の既定値設定でよく問題になるポイントです。

---

## 組み合わせて使う

`?.` と `??` を組み合わせると、「安全に取り出して、無ければ既定値」を 1 行で表現できます。

```js
const response = { data: { user: { name: "田中" } } };

const userName = response?.data?.user?.name ?? "ゲスト";
console.log(userName); // "田中"

const empty = {};
const emptyName = empty?.data?.user?.name ?? "ゲスト";
console.log(emptyName); // "ゲスト"
```

---

## まとめ

| 演算子 | 役割 | 反応する値 |
|--------|------|------------|
| `?.` | 安全なアクセス | `null` / `undefined` で `undefined` を返す |
| `??` | 既定値の指定 | `null` / `undefined` のときだけ右側を使う |
| `\|\|` | 既定値の指定（旧来） | `null`/`undefined`/`0`/`""`/`false` で右側を使う |
