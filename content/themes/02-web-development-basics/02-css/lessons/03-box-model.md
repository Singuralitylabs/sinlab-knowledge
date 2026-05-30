---
title: ボックスモデル
description: content・padding・border・margin からなるボックスモデルと、box-sizing・margin の相殺を理解します。
order: 3
type: lecture
difficulty: beginner
tags: [css]
estimatedMinutes: 9
status: published
---

# ボックスモデル

## 解説

CSS では、すべての要素が四角い「箱（ボックス）」として扱われます。この箱は内側から外側に向かって、次の4つの領域でできています。

- **content（内容）**：テキストや画像などの中身そのもの
- **padding（パディング）**：内容と枠線の間の**内側の余白**
- **border（ボーダー）**：箱を囲む**枠線**
- **margin（マージン）**：枠線の外側、他の要素との**間隔**

イメージとしては、中身（content）を「枠線（border）」で囲み、中身と枠線の間に「内側の余白（padding）」、枠線の外に「外側の余白（margin）」がある、という入れ子構造です。

```
┌─────────── margin ───────────┐
│  ┌──────── border ────────┐  │
│  │  ┌───── padding ─────┐  │  │
│  │  │     content       │  │  │
│  │  └───────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

---

## 各領域を指定する

```css
.box {
  width: 200px;
  padding: 16px;              /* 内側の余白 */
  border: 2px solid #2563eb;  /* 枠線（太さ 種類 色） */
  margin: 24px;               /* 外側の余白 */
}
```

`padding` や `margin` は、上下左右を個別に指定することもできます。

```css
.box {
  /* 値が4つ：上 右 下 左（時計回り） */
  padding: 8px 16px 8px 16px;

  /* 値が2つ：上下 左右 */
  margin: 16px 24px;

  /* 個別指定 */
  padding-top: 8px;
  margin-left: 24px;
}
```

---

## box-sizing：幅の数え方を変える

ここが初学者のつまずきやすいポイントです。標準の設定（`content-box`）では、`width` は **content の幅だけ**を指します。そのため padding や border を足すと、要素の見た目の幅はそれより大きくなります。

```css
/* content-box（標準）の場合 */
.box {
  width: 200px;
  padding: 16px;
  border: 2px solid #000;
}
/* 実際の横幅 = 200 + 16×2 + 2×2 = 236px になってしまう */
```

これを「指定した `width` の中に padding と border を含める」ように変えるのが `box-sizing: border-box` です。

```css
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 16px;
  border: 2px solid #000;
}
/* 実際の横幅 = 200px のまま（中身が自動的に縮む） */
```

> [!TIP]
> 多くのプロジェクトでは、最初にすべての要素へ `border-box` を適用してしまうのが定番です。幅の計算が直感的になり、レイアウト崩れを防げます。
>
> ```css
> *,
> *::before,
> *::after {
>   box-sizing: border-box;
> }
> ```

---

## margin の相殺（マージンの重なり）

**上下**に隣り合う要素の margin は、合算されずに**大きいほうだけが適用**されます。これを「margin の相殺（collapsing margins）」と呼びます。

```css
.first  { margin-bottom: 30px; }
.second { margin-top: 20px; }
```

```html
<p class="first">上の段落</p>
<p class="second">下の段落</p>
```

この場合、2つの段落の間隔は `30px + 20px = 50px` ではなく、**大きいほうの 30px** になります。

**ポイント**
- 相殺が起きるのは**縦方向（上下）の margin** だけです。左右の margin は相殺されません。
- 「思ったより間隔が広い／狭い」と感じたら、相殺を疑ってみましょう。padding に置き換えたり、`gap`（Flexbox/Grid）を使うと相殺を避けられます。

---

## まとめ

- ボックスは内側から **content → padding → border → margin** の4層構造です。
- `padding` は内側の余白、`margin` は外側の余白、`border` は枠線。値は「上 右 下 左」の時計回りで指定できます。
- `box-sizing: border-box` を使うと、`width` の中に padding と border が含まれ、幅の計算が直感的になります。
- 上下に隣り合う **margin は相殺**され、大きいほうだけが残ります。
