---
title: "Elements：CSSスタイルデバッグ"
order: 2
type: detail
difficulty: beginner
tags: [devtools, elements, css, ui]
estimatedMinutes: 7
status: published
---
# Elements：CSSスタイルデバッグ

## 解説

要素を選択した状態でElementsパネルの右側を見ると、`Styles`タブと`Computed`タブが並んでいます。この2つを使い分けることで、CSSのデバッグが格段に速くなります。

### `Styles`タブ：適用中のルールを確認・変更する

その要素に適用されているCSSルールが、優先順位（詳細度）の高い順に一覧表示されます。プロパティ名や値をクリックすると直接書き換えられ、チェックボックスのオン/オフで一時的に無効化することもできます。取り消し線が引かれているプロパティは、より優先度の高い別のルールに上書きされていることを示します。

![.site-header .titleのcolorに上書きされ、.titleのcolorに取り消し線が付いたStylesタブ](/content-assets/01-web-basics/07-devtools/images/04-styles-strikethrough.png)

### `Computed`タブ：最終的な数値を確認する

複数のCSSルールが競合した結果、**最終的にどの値が適用されているか**を一つの数値として確認できます。ボックスモデル（`margin` → `border` → `padding` → `content`の入れ子構造）も図で表示されるため、余白のズレを調べるときに便利です。

![Computedタブのボックスモデル図（margin・border・padding・contentの入れ子）](/content-assets/01-web-basics/07-devtools/images/05-computed-box-model.png)

### 擬似状態（`:hover`・`:focus`等）の強制適用

通常、`:hover`は要素にマウスを乗せている間しかスタイルを確認できません。`Styles`タブ右上の**`:hov`ボタン**をクリックすると、`:hover` `:active` `:focus` `:visited`などの状態を疑似的にオンのままにでき、マウスを動かさずにスタイルを確認・編集できます。

![:hovボタンで:hoverを固定し、.btn:hoverのスタイルが適用された状態](/content-assets/01-web-basics/07-devtools/images/06-hov-hover.png)

---

## ありがちなつまずき

### 1. 取り消し線に気づかず「効いていない」と勘違いする

```text
❌ Stylesタブでプロパティに取り消し線が付いているのを見落とし、
   「このCSSは無視されている」と誤解して無関係な箇所を調べ続ける

✅ 取り消し線＝詳細度がより高い別ルールに上書きされているサイン。
   上に表示されている別のルールを確認する
```

### 2. `:hov`で確認した状態のまま忘れる

`:hov`ボタンで`:hover`を固定した状態は、そのタブを閉じるかチェックを外すまで残り続けます。他の要素を調べ始めてから見た目がおかしいと感じたら、まずこの設定を疑いましょう。

---

## 実用例

### margin/paddingの余白ズレを特定する

「なぜかここだけ余白が広い」と感じたら、`Computed`タブのボックスモデル図を確認します。`margin`と`padding`のどちらが原因かが視覚的に一目で分かります。

### ホバー時のデザイン崩れを確認する

ボタンにマウスを乗せた瞬間だけ文字がはみ出す、といった不具合は再現が難しいものです。`:hov`ボタンで`:hover`状態を固定してしまえば、マウスを動かさずにじっくりCSSを調整できます。
