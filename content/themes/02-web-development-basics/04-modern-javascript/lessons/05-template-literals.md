---
title: "テンプレートリテラル"
description: "バッククォートによる変数の埋め込みと複数行文字列を、従来の文字列連結と比較して学ぶ。"
order: 5
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 7
status: published
---
# テンプレートリテラル

## 解説

テンプレートリテラルは、バッククォート（`` ` ``）で囲む新しい文字列の書き方です。`${ }` の中に変数や式を直接埋め込めるため、`+` による連結が不要になります。

```js
const name = "田中";
const age = 25;

// 従来の文字列連結
const message1 = "私は" + name + "です。年齢は" + age + "歳です。";

// テンプレートリテラル
const message2 = `私は${name}です。年齢は${age}歳です。`;

console.log(message2); // 私は田中です。年齢は25歳です。
```

**ポイント**: 引用符を閉じたり開いたりせずに、文章の中に変数を差し込めるので、読み間違いやクォートの付け忘れが減ります。

---

## 式も埋め込める

`${ }` の中には、変数だけでなく計算式や関数の呼び出しなど、値を返す式なら何でも書けます。

```js
const price = 1000;
const quantity = 3;

console.log(`合計金額は${price * quantity}円です。`);
// 合計金額は3000円です。

const user = { firstName: "太郎", lastName: "山田" };
console.log(`氏名: ${user.lastName} ${user.firstName}`);
// 氏名: 山田 太郎

const score = 85;
console.log(`結果: ${score >= 60 ? "合格" : "不合格"}`);
// 結果: 合格
```

---

## 複数行の文字列

テンプレートリテラルは、改行をそのまま書けます。従来は `\n` を使うか文字列を連結する必要がありました。

```js
// 従来: \n や連結が必要
const text1 = "1行目\n2行目\n3行目";

// テンプレートリテラル: 見たままに改行できる
const text2 = `1行目
2行目
3行目`;

console.log(text2);
// 1行目
// 2行目
// 3行目
```

---

## 実用例: HTML の組み立て

変数を含む HTML 文字列を組み立てるときに、テンプレートリテラルは特に役立ちます。

```js
const product = {
  name: "ワイヤレスイヤホン",
  price: 8800,
  inStock: true,
};

const html = `
  <div class="card">
    <h2>${product.name}</h2>
    <p>価格: ${product.price.toLocaleString()}円</p>
    <p>${product.inStock ? "在庫あり" : "在庫切れ"}</p>
  </div>
`;

console.log(html);
```

> [!TIP]
> バッククォートはキーボードの「Shift + @」付近（環境により異なる）にあります。シングルクォート（`'`）と見間違えやすいので注意しましょう。

---

## まとめ

| 機能 | 従来の文字列 | テンプレートリテラル |
|------|--------------|----------------------|
| 変数の埋め込み | `"a" + x + "b"` | `` `a${x}b` `` |
| 式の埋め込み | 連結が必要 | `${price * 1.1}` |
| 複数行 | `\n` が必要 | 改行をそのまま記述 |
