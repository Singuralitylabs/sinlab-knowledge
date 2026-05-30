---
title: "ES Modules (import / export)"
description: "export と import によるファイル分割の仕組みと、名前付き・デフォルトエクスポートの使い分けを学ぶ。"
order: 7
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 9
status: published
---
# ES Modules (import / export)

## 解説

ES Modules（ESM）は、JavaScript のコードを複数のファイル（モジュール）に分割し、必要なものだけを公開・取り込みする仕組みです。`export` で外部に公開し、`import` で別ファイルから読み込みます。

機能ごとにファイルを分けられるため、コードの見通しがよくなり、再利用もしやすくなります。

```js
// math.js（公開する側）
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

```js
// main.js（取り込む側）
import { add, multiply } from "./math.js";

console.log(add(2, 3)); // 5
console.log(multiply(2, 3)); // 6
```

**ポイント**: `import` のパスは、相対パス（`./` や `../`）またはパッケージ名を指定します。ファイル名の拡張子（`.js`）はブラウザでは必要です。

---

## 名前付きエクスポート

`export` を付けて公開する方法を「名前付きエクスポート」と呼びます。1 つのファイルから複数公開でき、取り込むときは同じ名前を `{ }` で指定します。

```js
// utils.js
export const PI = 3.14159;
export const greet = (name) => `こんにちは、${name}さん`;

// まとめてエクスポートする書き方もできる
const VERSION = "1.0.0";
function log(msg) {
  console.log(msg);
}
export { VERSION, log };
```

```js
// main.js
import { PI, greet } from "./utils.js";

console.log(PI); // 3.14159
console.log(greet("田中")); // こんにちは、田中さん

// 別名を付けて取り込む
import { greet as sayHello } from "./utils.js";
console.log(sayHello("鈴木")); // こんにちは、鈴木さん
```

---

## デフォルトエクスポート

1 ファイルにつき 1 つだけ指定できる「主役」を `export default` で公開します。取り込むときは `{ }` を使わず、好きな名前を付けられます。

```js
// User.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

```js
// main.js
// { } なし。名前は自由に決められる
import User from "./User.js";

const u = new User("田中");
console.log(u.name); // "田中"
```

名前付きとデフォルトは、同じファイルで併用もできます。

```js
// api.js
export default function request(url) {
  /* ... */
}
export const BASE_URL = "https://example.com";

// main.js
import request, { BASE_URL } from "./api.js";
```

---

## ブラウザでの読み込み

HTML から ES Modules を使うには、`<script>` タグに `type="module"` を付けます。

```html
<script type="module" src="./main.js"></script>
```

```html
<!-- インラインでも書ける -->
<script type="module">
  import { add } from "./math.js";
  console.log(add(1, 2));
</script>
```

> [!NOTE]
> `type="module"` を付けたスクリプトは、自動的に遅延読み込み（defer）され、変数がグローバルを汚さないなど、安全な動作になります。

---

## まとめ

| 種類 | エクスポート | インポート |
|------|--------------|------------|
| 名前付き | `export const x` | `import { x } from "..."` |
| デフォルト | `export default x` | `import x from "..."` |
| 別名 | — | `import { x as y } from "..."` |

> [!TIP]
> 1 つの機能・1 つのクラスを公開するファイルは `export default`、複数のユーティリティをまとめたファイルは名前付きエクスポート、と使い分けるのが一般的です。
