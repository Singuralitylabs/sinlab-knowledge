---
title: 制御構文
description: if / else による条件分岐と、for / while などのループを学ぶ。
order: 3
type: lecture
difficulty: beginner
tags: [javascript]
estimatedMinutes: 11
status: published
---

# 制御構文

## 解説

プログラムは、上から下へ順番に実行されるのが基本です。しかし実際のアプリでは、**「条件によって処理を変える」「同じ処理を繰り返す」**といった制御が欠かせません。これを実現するのが制御構文です。

---

## 条件分岐: `if` / `else`

条件が成り立つ（`true` になる）かどうかで処理を分けます。

```js
const score = 75;

if (score >= 80) {
  console.log("合格（優）");
} else if (score >= 60) {
  console.log("合格");
} else {
  console.log("不合格");
}
// 出力: 合格
```

- `if (条件) { ... }`: 条件が `true` のとき中の処理を実行。
- `else if (条件)`: 前の条件が `false` のとき、別の条件を試す。
- `else`: どの条件にも当てはまらなかったとき。

---

## 比較演算子

条件を作るときに使う演算子です。

| 演算子 | 意味 | 例 |
|--------|------|------|
| `===` | 厳密に等しい | `1 === 1` → `true` |
| `!==` | 厳密に等しくない | `1 !== 2` → `true` |
| `>` `<` | 大なり・小なり | `3 > 2` → `true` |
| `>=` `<=` | 以上・以下 | `2 >= 2` → `true` |

**`===` を使う（`==` は避ける）**

JavaScript には `===`（厳密等価）と `==`（等価）の 2 種類があります。`==` は型が違っても自動で変換して比較するため、直感に反する結果になることがあります。

```js
console.log(1 === "1"); // false（数値と文字列なので異なる）
console.log(1 == "1"); // true（== は型変換してしまう）

console.log(0 == ""); // true（混乱のもと）
console.log(0 === ""); // false（こちらが安全）
```

> [!IMPORTANT]
> 比較には原則として `===` と `!==` を使いましょう。`==` は予期しない型変換でバグを生みやすく、避けるのが定石です。

---

## 論理演算子

複数の条件を組み合わせます。

```js
const age = 20;
const hasTicket = true;

// && (かつ): 両方 true なら true
if (age >= 18 && hasTicket) {
  console.log("入場できます");
}

// || (または): どちらか true なら true
const isWeekend = false;
const isHoliday = true;
if (isWeekend || isHoliday) {
  console.log("休みです");
}

// ! (否定): true と false を反転
console.log(!true); // false
```

| 演算子 | 意味 |
|--------|------|
| `&&` | かつ（AND） |
| `\|\|` | または（OR） |
| `!` | 否定（NOT） |

---

## ループ: `for`

決まった回数だけ繰り返すときに使います。

```js
// 0, 1, 2, 3, 4 を順に出力
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

`for` の括弧には 3 つの部分があります。

1. `let i = 0`: 最初に 1 回だけ実行（カウンタの初期化）
2. `i < 5`: 繰り返しを続ける条件（`true` の間ループ）
3. `i++`: 1 回ごとに実行（`i` を 1 増やす）

---

## ループ: `while`

条件が `true` の間ずっと繰り返します。回数が決まっていないときに便利です。

```js
let count = 3;

while (count > 0) {
  console.log(`残り ${count}`);
  count--; // 1 ずつ減らす
}
// 出力: 残り 3 / 残り 2 / 残り 1
```

> [!WARNING]
> ループの中で条件が変化しないと、永遠に終わらない「無限ループ」になります。`while` を使うときは、必ず条件がいつか `false` になるようにしましょう。

---

## ループ: `for...of`

配列などの要素を 1 つずつ取り出して繰り返します。カウンタを使わないぶん、配列の処理ではこちらが読みやすくなります。

```js
const fruits = ["りんご", "みかん", "ぶどう"];

for (const fruit of fruits) {
  console.log(fruit);
}
// 出力: りんご / みかん / ぶどう
```

---

## 複数分岐: `switch`

1 つの値を、複数の候補と比較して分岐します。`if / else if` が多くなる場合に見やすくなります。

```js
const day = "月";

switch (day) {
  case "土":
  case "日":
    console.log("週末");
    break;
  case "月":
    console.log("週のはじまり");
    break;
  default:
    console.log("平日");
}
// 出力: 週のはじまり
```

**ポイント**

- 各 `case` の最後に `break` を書かないと、次の `case` まで処理が続いてしまいます（意図的にまとめる場合を除く）。
- どの `case` にも当てはまらないときは `default` が実行されます。

---

## まとめ

- 条件分岐は `if` / `else if` / `else`、多分岐は `switch`。
- 比較は `===` / `!==` を使う。`==` は型変換でバグを生むため避ける。
- 条件の組み合わせは `&&`（かつ）・`||`（または）・`!`（否定）。
- 繰り返しは回数が決まっているなら `for`、条件次第なら `while`、配列の要素を順に処理するなら `for...of`。
