---
title: Grid
description: display:grid による2次元レイアウトと、grid-template-columns（fr/repeat/minmax）・gap・配置、Flexbox との使い分けを学びます。
order: 5
type: lecture
difficulty: beginner
tags: [css]
estimatedMinutes: 10
status: published
---

# Grid

## 解説

**CSS Grid（グリッド）** は、**行と列の両方**を同時に扱う2次元のレイアウト手法です。1方向の並びが得意な Flexbox に対し、Grid は格子状の配置 ―― カード一覧、写真ギャラリー、ページ全体の骨組み ―― を得意とします。

親要素に `display: grid` を指定し、列（と必要なら行）の構成を決めることで、子要素を格子のマスに配置していきます。

```html
<div class="grid">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3列、均等幅 */
  gap: 16px;
}
```

これで6個のアイテムが3列×2行に並びます。実際の表示は次のようになります。

![3列のグリッドに6枚のカードが等間隔で並んだ表示例](/content-assets/02-web-development-basics/02-css/images/grid/grid-layout.png)

この並びを「トラック（行・列の帯）」という観点で見ると、次のような構造になっています。

![CSS Grid のトラックと gap の図。3つの列トラック（1fr）と2つの行トラック、その間の溝（gap）を示す](/content-assets/02-web-development-basics/02-css/images/grid/grid-tracks.svg)

---

## grid-template-columns：列の構成

列を何本、どんな幅で作るかを指定します。

### fr 単位（空きスペースの割合）

`fr`（fraction＝分数）は、利用可能なスペースを比率で分け合う単位です。

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3列を均等に */
}
```

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 2fr;  /* 左:右 = 1:2 の幅 */
}
```

### repeat()：繰り返しの省略

同じ指定を繰り返すときは `repeat()` で簡潔に書けます。

```css
/* 1fr 1fr 1fr 1fr と同じ */
.grid {
  grid-template-columns: repeat(4, 1fr);
}
```

### minmax()：最小・最大幅の指定

各列に「これ以上は縮まない／これ以上は広がらない」という範囲を与えられます。

```css
.grid {
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  /* 各列は最小 200px、空きがあれば 1fr で広がる */
}
```

`auto-fit` と組み合わせると、画面幅に応じて列数が自動で変わるレイアウトになります。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
/* 幅が広ければ列が増え、狭ければ自動で減る（メディアクエリ不要） */
```

> [!TIP]
> `repeat(auto-fit, minmax(200px, 1fr))` は、レスポンシブなカード一覧を**メディアクエリなし**で実現できる定番パターンです。覚えておくと便利です。

---

## gap：マスの間隔

行と列の間隔をまとめて指定できます。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;          /* 行・列とも 16px */
  /* row-gap: 16px; column-gap: 24px; と個別指定も可能 */
}
```

---

## 配置（行・列をまたぐ）

子要素に `grid-column` / `grid-row` を指定すると、複数のマスにまたがって配置できます。線の番号（左端が 1）で「どこからどこまで」を指定します。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.featured {
  grid-column: 1 / 3;  /* 1番目の線から3番目の線まで＝2列分 */
}

.tall {
  grid-row: 1 / 3;     /* 縦に2行分 */
}
```

`span` を使うと「いくつ分」という指定もできます。

```css
.featured {
  grid-column: span 2;  /* 2列分の幅を占める */
}
```

---

## 実用例：レスポンシブなカード一覧

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  padding: 24px;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}
```

```html
<div class="cards">
  <div class="card">カード1</div>
  <div class="card">カード2</div>
  <div class="card">カード3</div>
  <div class="card">カード4</div>
</div>
```

---

## Flexbox との使い分け

| 観点 | Flexbox | Grid |
|------|---------|------|
| 次元 | 1次元（横 or 縦） | 2次元（行 × 列） |
| 得意な場面 | ナビ、ボタン列、要素の並び | カード一覧、ページ全体の骨組み |
| 配置の基準 | コンテンツの量に合わせて流れる | あらかじめ格子を決めて配置する |

**ポイント**
- 「一列に並べたい」なら Flexbox、「行と列で組みたい」なら Grid、と考えると選びやすいです。
- 両者は対立するものではなく、Grid のマスの中で Flexbox を使うなど、組み合わせて使うのが一般的です。

---

## まとめ

- `display: grid` と `grid-template-columns` で、行と列からなる**2次元レイアウト**を作れます。
- 列幅は `fr`（割合）、`repeat()`（繰り返し）、`minmax()`（最小・最大）で柔軟に指定できます。
- `gap` で間隔、`grid-column` / `grid-row` で複数マスにまたがる配置ができます。
- 1次元なら **Flexbox**、2次元なら **Grid** と使い分け、必要に応じて組み合わせます。
