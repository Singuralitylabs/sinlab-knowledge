---
title: Flexbox
description: display:flex による1次元レイアウトと、主軸・交差軸、justify-content・align-items・gap・flex プロパティを学びます。
order: 4
type: lecture
difficulty: beginner
tags: [css]
estimatedMinutes: 10
status: published
---

# Flexbox

## 解説

**Flexbox（フレックスボックス）** は、要素を**1方向（横一列または縦一列）** に並べ、間隔や揃え方を柔軟に制御するレイアウト手法です。ナビゲーションバー、ボタンの横並び、カード内の要素配置など、1次元の配置で活躍します。

親要素に `display: flex` を指定すると、その**直接の子要素**が自動的に横並びになります。

```html
<div class="container">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
</div>
```

```css
.container {
  display: flex;
}
```

これだけで、A・B・C が横一列に並びます。`display: flex` を指定した親を**フレックスコンテナ**、その子を**フレックスアイテム**と呼びます。

---

## 主軸と交差軸

Flexbox を理解する鍵は、2つの軸です。

- **主軸（main axis）**：アイテムが並ぶ方向。標準では**横（左→右）**
- **交差軸（cross axis）**：主軸に直交する方向。標準では**縦（上→下）**

並ぶ方向は `flex-direction` で変えられます。

```css
.container {
  display: flex;
  flex-direction: row;      /* 標準：横並び（主軸＝横） */
  /* flex-direction: column;   縦並び（主軸＝縦） */
}
```

この「主軸」と「交差軸」がどちらを向いているかで、次に紹介する `justify-content` と `align-items` の効く方向が決まります。

---

## justify-content：主軸方向の揃え

主軸方向（標準では横）のアイテムの配置を決めます。

```css
.container {
  display: flex;
  justify-content: center;  /* 中央に寄せる */
}
```

| 値 | 配置 |
|------|------|
| `flex-start` | 先頭に寄せる（標準） |
| `center` | 中央に寄せる |
| `flex-end` | 末尾に寄せる |
| `space-between` | 両端に寄せ、間を均等にあける |
| `space-around` | 各アイテムの周囲を均等にあける |
| `space-evenly` | すべての間隔を均等にする |

---

## align-items：交差軸方向の揃え

交差軸方向（標準では縦）のアイテムの揃え方を決めます。

```css
.container {
  display: flex;
  height: 200px;
  align-items: center;  /* 縦方向の中央に揃える */
}
```

| 値 | 配置 |
|------|------|
| `stretch` | 高さいっぱいに引き伸ばす（標準） |
| `flex-start` | 上端に揃える |
| `center` | 縦中央に揃える |
| `flex-end` | 下端に揃える |

> [!TIP]
> `justify-content: center` と `align-items: center` を組み合わせると、子要素を**上下左右ぴったり中央**に配置できます。中央寄せの定番テクニックです。

---

## gap：アイテム間の間隔

アイテム同士の間隔は `gap` でまとめて指定できます。margin と違って端には余白が付かず、間だけにあくので扱いやすいです。

```css
.container {
  display: flex;
  gap: 16px;  /* アイテム間を 16px あける */
}
```

---

## flex-wrap：折り返し

標準ではアイテムは1行に収まろうとして縮みます。`flex-wrap: wrap` を指定すると、入りきらないアイテムが次の行に折り返します。

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
```

---

## flex プロパティ：伸び縮みの比率

子要素側に指定する `flex` は、空きスペースをどう分け合うかを決めます。

```css
.item {
  flex: 1;  /* すべてのアイテムが均等な幅になる */
}
```

```css
.sidebar { flex: 1; }  /* 1 : 2 の比率で */
.main    { flex: 2; }  /* main が sidebar の2倍の幅になる */
```

`flex: 1` は「余ったスペースを受け取って伸びる」という意味です。複数のアイテムに数値を与えると、その比率で幅が配分されます。

---

## 実用例：ナビゲーションバー

```css
.nav {
  display: flex;
  justify-content: space-between;  /* ロゴを左、メニューを右へ */
  align-items: center;             /* 縦中央で揃える */
  padding: 12px 24px;
}

.nav-menu {
  display: flex;
  gap: 24px;  /* メニュー項目の間隔 */
}
```

```html
<nav class="nav">
  <div class="logo">サイト名</div>
  <div class="nav-menu">
    <a href="#">ホーム</a>
    <a href="#">About</a>
    <a href="#">お問い合わせ</a>
  </div>
</nav>
```

---

## まとめ

- 親に `display: flex` を指定すると、子要素が**1次元（横または縦）** に並びます。
- **主軸**＝アイテムが並ぶ方向、**交差軸**＝それに直交する方向。`flex-direction` で切り替えます。
- `justify-content` は主軸方向、`align-items` は交差軸方向の揃えを制御します。
- `gap` で間隔、`flex-wrap: wrap` で折り返し、子の `flex` で伸び縮みの比率を指定します。
