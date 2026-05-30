---
title: イベント
description: addEventListener によるイベント処理、イベントオブジェクト、バブリングとイベント委譲を学ぶ。
order: 7
type: lecture
difficulty: beginner
tags: [javascript]
estimatedMinutes: 11
status: published
---

# イベント

## 解説

**イベント**とは、「ボタンがクリックされた」「キーが入力された」「フォームが送信された」といった、ページ上で起きる出来事のことです。JavaScript では、こうしたイベントが起きたときに実行する処理をあらかじめ登録しておきます。これがブラウザの「イベント駆動」の仕組みです。

---

## `addEventListener` で処理を登録する

要素に対して `addEventListener("イベント名", 処理)` を呼ぶと、そのイベントが起きたときに処理が実行されます。

```html
<button id="btn">クリックしてね</button>
```

```js
const button = document.querySelector("#btn");

button.addEventListener("click", () => {
  console.log("クリックされました");
});
```

ボタンがクリックされるたびに、登録した関数が呼び出されます。

### 主なイベントの種類

| イベント名 | 発生するタイミング |
|------------|--------------------|
| `click` | 要素がクリックされたとき |
| `input` | 入力欄の値が変わったとき |
| `submit` | フォームが送信されたとき |
| `keydown` | キーが押されたとき |
| `mouseover` | マウスが要素に乗ったとき |

---

## イベントオブジェクト

登録した処理には、イベントの情報を持つ**イベントオブジェクト**が引数として渡されます。慣習的に `event` や `e` という名前で受け取ります。

```js
const input = document.querySelector("#name");

input.addEventListener("input", (event) => {
  // event.target は、イベントが起きた要素
  console.log(event.target.value); // 入力された文字
});
```

- `event.target`: イベントが発生した要素そのもの。
- `event.target.value`: 入力欄なら、その入力値。

---

## `preventDefault`: デフォルト動作を止める

要素には、ブラウザがあらかじめ持っている「標準の動作」があります。たとえばフォームの送信ボタンは、押すとページを再読み込みします。これを止めたいときに `preventDefault()` を使います。

```html
<form id="form">
  <input id="name" type="text" />
  <button type="submit">送信</button>
</form>
```

```js
const form = document.querySelector("#form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // ページの再読み込みを止める

  const name = document.querySelector("#name").value;
  console.log(`送信された名前: ${name}`);
});
```

> [!TIP]
> JavaScript でフォームの内容を処理したいときは、`preventDefault()` で標準の送信（ページ遷移）を止めるのが定番です。

---

## バブリング

ある要素でイベントが起きると、そのイベントは**親要素へと順に伝わっていきます**。これを**バブリング（泡が上に上がるイメージ）**と呼びます。

```html
<div id="outer">
  <button id="inner">ボタン</button>
</div>
```

```js
document.querySelector("#outer").addEventListener("click", () => {
  console.log("outer がクリックされた");
});

document.querySelector("#inner").addEventListener("click", () => {
  console.log("inner がクリックされた");
});

// ボタンを押すと、両方が順に出力される:
// inner がクリックされた
// outer がクリックされた
```

ボタン（内側）を押しただけなのに、親の `div`（外側）のイベントも実行されます。これがバブリングです。

---

## イベント委譲

バブリングを活用すると、**親要素にイベントを 1 つ登録するだけで、子要素のクリックをまとめて扱える**ようになります。これを**イベント委譲（デリゲーション）**と呼びます。

```html
<ul id="list">
  <li>りんご</li>
  <li>みかん</li>
  <li>ぶどう</li>
</ul>
```

```js
const list = document.querySelector("#list");

// 親の ul に 1 つだけ登録する
list.addEventListener("click", (event) => {
  // クリックされたのが li なら処理する
  if (event.target.tagName === "LI") {
    console.log(`${event.target.textContent} がクリックされた`);
  }
});
```

**ポイント**

- 子要素 1 つ 1 つに `addEventListener` を付けなくて済みます。
- 後から追加された `li` でも、親のリスナーが処理してくれます。動的に要素が増えるリストで特に便利です。

---

## まとめ

- イベントは「クリック」「入力」などの出来事。`addEventListener("イベント名", 処理)` で処理を登録する。
- 処理にはイベントオブジェクト（`event`）が渡され、`event.target` で発生元の要素を参照できる。
- `event.preventDefault()` でフォーム送信などの標準動作を止められる。
- イベントは親へ伝わる（バブリング）。これを使い、親に 1 つ登録して子をまとめて扱うのがイベント委譲。
