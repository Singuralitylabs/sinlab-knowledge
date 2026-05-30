---
title: DOM 操作
description: querySelector による要素の取得と、テキスト・属性・クラスの操作、要素の生成と追加を学ぶ。
order: 6
type: lecture
difficulty: beginner
tags: [javascript]
estimatedMinutes: 12
status: published
---

# DOM 操作

## 解説

**DOM（Document Object Model）**は、ブラウザが HTML を読み込んで作る「ページの構造を表すデータ」です。JavaScript は、この DOM を通じて HTML 要素を取得したり書き換えたりできます。これによって、ページの内容を動的に変えられるようになります。

たとえば、次のような HTML があるとします。

```html
<h1 id="title">こんにちは</h1>
<button class="btn">クリック</button>
<ul id="list"></ul>
```

この各要素を JavaScript から操作していきます。

---

## 要素を取得する

`document.querySelector()` で、CSS セレクタを使って要素を取得します。

```js
// id で取得（CSS と同じく # を付ける）
const title = document.querySelector("#title");

// class で取得（. を付ける）
const button = document.querySelector(".btn");

// タグ名で取得
const heading = document.querySelector("h1");
```

`querySelector` は、条件に合う**最初の 1 つ**を返します。複数まとめて取得したいときは `querySelectorAll` を使います。

```js
// 条件に合うすべての要素を取得
const items = document.querySelectorAll("li");

items.forEach((item) => {
  console.log(item.textContent);
});
```

> [!NOTE]
> `querySelectorAll` が返すのは厳密には配列ではありませんが、`forEach` で 1 つずつ処理できます。

---

## テキストを書き換える

`textContent` で、要素の中の文字を取得・変更できます。

```js
const title = document.querySelector("#title");

console.log(title.textContent); // こんにちは（現在の文字を取得）

title.textContent = "ようこそ"; // 文字を書き換える
```

> [!CAUTION]
> 似たプロパティに `innerHTML` がありますが、ユーザーの入力をそのまま `innerHTML` に渡すと、悪意あるスクリプトを埋め込まれる危険（XSS）があります。単なる文字の表示には、安全な `textContent` を使いましょう。

---

## 属性を操作する

`setAttribute` / `getAttribute` で、要素の属性を読み書きできます。`href` や `src` などの属性は、ドット記法でも操作できます。

```js
const link = document.querySelector("a");

// 属性を取得
console.log(link.getAttribute("href"));

// 属性を設定
link.setAttribute("href", "https://example.com");

// よく使う属性はドット記法でも操作できる
const img = document.querySelector("img");
img.src = "logo.png";
```

---

## クラスを操作する

見た目を変えるときは、CSS のクラスを付け外しするのが定石です。`classList` を使います。

```js
const button = document.querySelector(".btn");

button.classList.add("active"); // クラスを追加
button.classList.remove("active"); // クラスを削除
button.classList.toggle("active"); // あれば外す・なければ付ける

console.log(button.classList.contains("active")); // 含まれているか確認
```

**ポイント**

- スタイルは JavaScript で直接書くより、CSS でクラスごとに定義し、`classList` で切り替えるほうが管理しやすくなります。

---

## 要素を作って追加する

新しい要素を作り、ページに追加することもできます。

```js
const list = document.querySelector("#list");

// 1. 要素を作る
const li = document.createElement("li");

// 2. 中身を設定する
li.textContent = "新しい項目";

// 3. 親要素に追加する
list.appendChild(li);
```

複数の要素をまとめて追加する例です。

```js
const list = document.querySelector("#list");
const fruits = ["りんご", "みかん", "ぶどう"];

fruits.forEach((fruit) => {
  const li = document.createElement("li");
  li.textContent = fruit;
  list.appendChild(li);
});
```

---

## 要素を削除する

```js
const target = document.querySelector("#list li");
target.remove(); // その要素を削除
```

---

## まとめ

- DOM はブラウザが作るページの構造データで、JavaScript から取得・操作できる。
- 要素の取得は `querySelector`（最初の 1 つ）と `querySelectorAll`（すべて）。
- テキストは `textContent`、属性は `setAttribute` / `getAttribute`、見た目は `classList` で操作する。
- 要素は `createElement` で作り、`appendChild` で追加、`remove` で削除する。
