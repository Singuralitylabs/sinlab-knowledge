---
title: "数式（LaTeX記法）サンプル"
order: 4
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# 数式（LaTeX記法）サンプル

## 解説

LaTeX（ラテック/ラテフ）記法を使って数学的な式を表現できます。

- **インライン数式**: 文中に埋め込む `$...$`
- **ブロック数式**: 独立した行に表示 `$$...$$`

**対応環境**: GitHub、Notion、Obsidian、Jupyter Notebook

---

## インライン数式

文中に数式を埋め込みます。

### 記法

```markdown
アインシュタインの有名な公式 $E = mc^2$ は、質量とエネルギーの等価性を示しています。

円の面積は $S = \pi r^2$ で計算できます。
```

### 表示結果

アインシュタインの有名な公式 $E = mc^2$ は、質量とエネルギーの等価性を示しています。

円の面積は $S = \pi r^2$ で計算できます。

---

## ブロック数式

数式を独立した行に表示します。

### 記法

```markdown
二次方程式の解の公式：

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### 表示結果

二次方程式の解の公式：

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

---

## 基本的な記法

### 上付き・下付き文字

```markdown
上付き：$x^2$, $e^{i\pi}$
下付き：$x_1$, $a_{n+1}$
両方：$x_1^2$, $\sum_{i=1}^{n}$
```

### 表示結果

上付き：$x^2$, $e^{i\pi}$
下付き：$x_1$, $a_{n+1}$
両方：$x_1^2$, $\sum_{i=1}^{n}$

---

### 分数

```markdown
インライン：$\frac{1}{2}$, $\frac{a+b}{c}$

ブロック：
$$
\frac{n!}{k!(n-k)!}
$$
```

### 表示結果

インライン：$\frac{1}{2}$, $\frac{a+b}{c}$

ブロック：
$$
\frac{n!}{k!(n-k)!}
$$

---

### 平方根

```markdown
$\sqrt{2}$, $\sqrt{x^2 + y^2}$, $\sqrt[3]{8}$（3乗根）
```

### 表示結果

$\sqrt{2}$, $\sqrt{x^2 + y^2}$, $\sqrt[3]{8}$（3乗根）

---

### ギリシャ文字

```markdown
$\alpha$, $\beta$, $\gamma$, $\delta$, $\epsilon$
$\theta$, $\lambda$, $\mu$, $\pi$, $\sigma$, $\omega$
$\Gamma$, $\Delta$, $\Theta$, $\Lambda$, $\Pi$, $\Sigma$, $\Omega$
```

### 表示結果

$\alpha$, $\beta$, $\gamma$, $\delta$, $\epsilon$
$\theta$, $\lambda$, $\mu$, $\pi$, $\sigma$, $\omega$
$\Gamma$, $\Delta$, $\Theta$, $\Lambda$, $\Pi$, $\Sigma$, $\Omega$

---

### 演算子・記号

```markdown
基本：$+$, $-$, $\times$, $\div$, $\pm$, $\mp$
比較：$=$, $\neq$, $<$, $>$, $\leq$, $\geq$, $\approx$
集合：$\in$, $\notin$, $\subset$, $\supset$, $\cup$, $\cap$
矢印：$\rightarrow$, $\leftarrow$, $\Rightarrow$, $\Leftrightarrow$
その他：$\infty$, $\partial$, $\nabla$, $\forall$, $\exists$
```

### 表示結果

基本：$+$, $-$, $\times$, $\div$, $\pm$, $\mp$
比較：$=$, $\neq$, $<$, $>$, $\leq$, $\geq$, $\approx$
集合：$\in$, $\notin$, $\subset$, $\supset$, $\cup$, $\cap$
矢印：$\rightarrow$, $\leftarrow$, $\Rightarrow$, $\Leftrightarrow$
その他：$\infty$, $\partial$, $\nabla$, $\forall$, $\exists$

---

### 総和・積分

```markdown
総和：
$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$

積分：
$$
\int_{0}^{\infty} e^{-x} dx = 1
$$

極限：
$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$
```

### 表示結果

総和：
$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$

積分：
$$
\int_{0}^{\infty} e^{-x} dx = 1
$$

極限：
$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

---

## 実用例

### 統計学の公式

```markdown
## 基本統計量

平均値：
$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

分散：
$$
\sigma^2 = \frac{1}{n}\sum_{i=1}^{n} (x_i - \bar{x})^2
$$

標準偏差：$\sigma = \sqrt{\sigma^2}$
```

---

### 機械学習の損失関数

```markdown
## 損失関数

クロスエントロピー損失：
$$
L = -\sum_{i=1}^{n} y_i \log(\hat{y}_i)
$$

二乗誤差：
$$
MSE = \frac{1}{n}\sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$
```

---

### 行列

```markdown
$$
A = \begin{pmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{pmatrix}
$$
```

### 表示結果

$$
A = \begin{pmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{pmatrix}
$$

---

## よく使う記号一覧

| 記法 | 表示 | 意味 |
|------|:----:|------|
| `\sum` | $\sum$ | 総和 |
| `\prod` | $\prod$ | 総乗 |
| `\int` | $\int$ | 積分 |
| `\frac{a}{b}` | $\frac{a}{b}$ | 分数 |
| `\sqrt{x}` | $\sqrt{x}$ | 平方根 |
| `x^n` | $x^n$ | べき乗 |
| `x_i` | $x_i$ | 添字 |
| `\infty` | $\infty$ | 無限大 |
| `\pi` | $\pi$ | 円周率 |

---

## 注意点

1. **`$` の前後にスペース**: 日本語との境界ではスペースを入れると安定
2. **エスケープ**: `$` を文字として表示するには `\$`
3. **環境差異**: レンダリング結果は環境によって若干異なる

---

## 参考リンク

- [KaTeX Supported Functions](https://katex.org/docs/supported.html)
- [LaTeX数式チートシート](https://www.codecogs.com/latex/eqneditor.php)

---

## 実習

以下の公式を数式で書いてみましょう。

1. ピタゴラスの定理：a² + b² = c²
2. 円の円周：C = 2πr
3. 速度の公式：v = d/t
