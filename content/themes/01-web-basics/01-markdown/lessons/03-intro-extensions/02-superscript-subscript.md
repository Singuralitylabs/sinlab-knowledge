---
title: "上付き・下付き文字（Superscript / Subscript）の詳細"
order: 2
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# 上付き・下付き文字（Superscript / Subscript）

## 解説

数式や化学式で使用する上付き文字（べき乗など）や下付き文字（化学式の添え字など）を表現します。

| 種類 | Markdown記法 | HTML記法 | 用途 |
|------|--------------|----------|------|
| 上付き | `^text^` | `<sup>text</sup>` | べき乗、注釈番号 |
| 下付き | `~text~` | `<sub>text</sub>` | 化学式、配列添え字 |

**注意**：`^` `~` 記法はPandocなど一部環境のみ対応。HTMLタグはより広く対応しています。

---

## 上付き文字（Superscript）

### Markdown記法（一部環境）

```markdown
x^2^ + y^2^ = z^2^

E = mc^2^

脚注のような表現^[1]^
```

### HTML記法（推奨）

```html
x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>

E = mc<sup>2</sup>

1st<sup>st</sup>, 2nd<sup>nd</sup>, 3rd<sup>rd</sup>
```

### 表示結果

x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>

E = mc<sup>2</sup>

1<sup>st</sup>, 2<sup>nd</sup>, 3<sup>rd</sup>

---

## 下付き文字（Subscript）

### Markdown記法（一部環境）

```markdown
H~2~O（水）

CO~2~（二酸化炭素）

配列の要素：a~1~, a~2~, a~n~
```

### HTML記法（推奨）

```html
H<sub>2</sub>O（水）

CO<sub>2</sub>（二酸化炭素）

配列の要素：a<sub>1</sub>, a<sub>2</sub>, a<sub>n</sub>
```

### 表示結果

H<sub>2</sub>O（水）

CO<sub>2</sub>（二酸化炭素）

配列の要素：a<sub>1</sub>, a<sub>2</sub>, a<sub>n</sub>

---

## 上付きと下付きの組み合わせ

### 記法

```html
水の化学式は H<sub>2</sub>O です。

アインシュタインの公式：E = mc<sup>2</sup>

元素記号：<sup>12</sup>C<sub>6</sub>（炭素12）
```

### 表示結果

水の化学式は H<sub>2</sub>O です。

アインシュタインの公式：E = mc<sup>2</sup>

元素記号：<sup>12</sup>C<sub>6</sub>（炭素12）

---

## 実用例

### 数学的な表現

```html
## 二次方程式

ax<sup>2</sup> + bx + c = 0 の解は

x = (-b ± √(b<sup>2</sup> - 4ac)) / 2a
```

### 化学式

```html
## 化学反応式

2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O

CH<sub>4</sub> + 2O<sub>2</sub> → CO<sub>2</sub> + 2H<sub>2</sub>O
```

### 単位表記

```html
面積：100 m<sup>2</sup>

体積：50 m<sup>3</sup>

速度：10 m/s<sup>2</sup>
```

### 序数表記（英語）

```html
1<sup>st</sup> place
2<sup>nd</sup> place
3<sup>rd</sup> place
4<sup>th</sup> place
```

---

## 対応環境

| 環境 | `^text^` / `~text~` | `<sup>` / `<sub>` |
|------|:-------------------:|:-----------------:|
| GitHub | ❌ | ✅ |
| Obsidian | プラグイン | ✅ |
| VSCode | ❌ | ✅ |
| Pandoc | ✅ | ✅ |
| Notion | ❌ | ❌ |

---

## 数式記法との比較

より複雑な数式には LaTeX 記法を使用することをおすすめします。

```markdown
<!-- 上付き・下付きで書く場合 -->
x<sup>2</sup> + y<sup>2</sup>

<!-- LaTeX で書く場合（対応環境） -->
$x^2 + y^2$
```

LaTeX記法はより美しく、複雑な数式も表現できます。

---

## 実習

以下の化学式と数式を上付き・下付き文字で書いてみましょう。

```html
## 練習問題

1. 水の化学式：H<sub>　</sub>O
2. 二酸化炭素：CO<sub>　</sub>
3. ピタゴラスの定理：a<sup>　</sup> + b<sup>　</sup> = c<sup>　</sup>
4. 面積の単位：km<sup>　</sup>

<!-- 答え -->
1. H<sub>2</sub>O
2. CO<sub>2</sub>
3. a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>
4. km<sup>2</sup>
```
