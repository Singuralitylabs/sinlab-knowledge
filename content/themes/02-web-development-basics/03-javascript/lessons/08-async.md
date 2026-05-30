---
title: 非同期処理
description: 同期と非同期の違いから Promise・async/await・fetch によるAPI取得とエラーハンドリングまでを学ぶ。
order: 8
type: lecture
difficulty: beginner
tags: [javascript]
estimatedMinutes: 12
status: published
---

# 非同期処理

## 解説

サーバーとの通信のように**時間のかかる処理**を、結果が返るまで画面を止めて待っていると、その間ユーザーは何も操作できなくなってしまいます。これを避けるため、JavaScript は時間のかかる処理を**バックグラウンドで進め、結果が出たら続きを実行する**仕組みを持っています。これが**非同期処理**です。

---

## 同期と非同期の違い

- **同期処理**: 上から順に、1 つ終わってから次へ進む。途中で時間がかかると、その間すべて止まる。
- **非同期処理**: 時間のかかる処理の完了を待たずに、先に進む。完了したら、登録しておいた続きの処理が実行される。

```js
console.log("1");

setTimeout(() => {
  console.log("2（1秒後）"); // 1秒後に実行される
}, 1000);

console.log("3");

// 出力順: 1 → 3 → 2
// 「2」を待たずに「3」が先に実行される
```

`setTimeout` は「指定時間後に処理を実行する」非同期の代表例です。

---

## コールバックから Promise へ

かつては「処理が終わったら呼ぶ関数（コールバック）」を渡す方法が主流でしたが、処理が連なると入れ子が深くなり読みにくくなりました。これを整理するために登場したのが **Promise（プロミス）**です。

Promise は「いずれ結果が出る約束」を表すオブジェクトで、`then`（成功時）と `catch`（失敗時）で結果を受け取ります。

```js
fetch("https://api.example.com/users")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // 取得したデータ
  })
  .catch((error) => {
    console.log("エラー", error);
  });
```

---

## `async` / `await`

Promise をさらに読みやすく書けるのが **`async` / `await`** です。非同期処理を、まるで同期処理のように上から順に書けます。

```js
async function getUsers() {
  const response = await fetch("https://api.example.com/users");
  const data = await response.json();
  console.log(data);
}

getUsers();
```

- 関数の前に `async` を付けると、その中で `await` が使えるようになる。
- `await` を付けると、その Promise の結果が出るまで**待ってから**次の行へ進む（ただし画面は止まらない）。

---

## `fetch` で API からデータを取得する

`fetch` は、サーバーにリクエストを送ってデータを取得する関数です。返ってくるのは Promise なので、`await` と組み合わせて使います。

```js
async function getUser() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await response.json(); // JSON を JavaScript のオブジェクトに変換
  console.log(user.name);
}
```

**ポイント**

- `fetch` の結果（`response`）から実データを取り出すには、`response.json()` を呼ぶ。これも非同期なので `await` が必要。

---

## エラーハンドリング: `try` / `catch`

通信は、サーバーが落ちていたり、ネットワークが切れていたりして失敗することがあります。`try` / `catch` で失敗時の処理を用意しておきます。

```js
async function getUser() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

    if (!response.ok) {
      throw new Error(`通信エラー: ${response.status}`);
    }

    const user = await response.json();
    console.log(user.name);
  } catch (error) {
    console.log("取得に失敗しました", error);
  }
}
```

- `try { }` の中で失敗（例外）が起きると、`catch (error) { }` に処理が移る。
- `response.ok` は、通信が成功（ステータス 200 番台）かどうかを表す。`404` などは `fetch` 自体は成功扱いになるため、ここで明示的にチェックする。

> [!IMPORTANT]
> `fetch` は、サーバーが `404` や `500` を返しても「通信自体は成功した」とみなし、エラーにはなりません。`response.ok` のチェックを忘れないようにしましょう。

---

## 実例: ボタンクリックでデータを取得して表示する

ここまでの「DOM 操作」「イベント」「非同期処理」を組み合わせた例です。ボタンを押すと API からユーザー情報を取得し、画面に表示します。

```html
<button id="load">ユーザーを取得</button>
<p id="result">ここに結果が表示されます</p>
```

```js
const button = document.querySelector("#load");
const result = document.querySelector("#result");

button.addEventListener("click", async () => {
  result.textContent = "読み込み中...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!response.ok) {
      throw new Error(`通信エラー: ${response.status}`);
    }
    const user = await response.json();
    result.textContent = `名前: ${user.name}`;
  } catch (error) {
    result.textContent = "取得に失敗しました";
    console.log(error);
  }
});
```

この例では、次の流れが連携しています。

1. **イベント**: ボタンのクリックを `addEventListener` で受け取る。
2. **非同期処理**: `await fetch(...)` でデータを取得し、その間「読み込み中...」を表示。
3. **DOM 操作**: 取得結果を `textContent` で画面に反映する。

---

## まとめ

- 非同期処理は、時間のかかる処理を待たずに先へ進み、完了したら続きを実行する仕組み。画面を止めずに済む。
- コールバック → Promise（`then` / `catch`）→ `async` / `await` と、書き方は読みやすく進化してきた。
- `fetch` で API からデータを取得し、`response.json()` で JavaScript のデータに変換する。
- 通信は失敗しうるため、`try` / `catch` と `response.ok` のチェックでエラーに備える。
