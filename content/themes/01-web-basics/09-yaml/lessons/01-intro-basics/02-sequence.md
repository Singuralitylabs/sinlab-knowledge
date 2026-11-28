---
title: "シーケンス（リスト）の書き方"
order: 2
type: detail
difficulty: beginner
tags: [yaml, syntax, sequence]
estimatedMinutes: 5
status: published
---
# シーケンス（リスト）の書き方

## 解説

**シーケンス**（Sequence）は、値を順番に並べたリストです。JSONの配列に相当します。各要素を **`- `（ハイフン＋半角スペース）** で始まる行として並べます。

```text
fruits:          ← リスト全体のキー
  - apple        ← 1番目の要素
  - banana       ← 2番目の要素
  - orange       ← 3番目の要素（順番が保持される）
```

### 2つの書き方

YAMLのシーケンスには、行ごとに書く **ブロックスタイル** と、JSONのように `[]` で1行に書く **フロースタイル** があります。

| スタイル | 書き方 | 向いている場面 |
|----------|--------|----------------|
| **ブロックスタイル** | 1行に1要素、`- ` で始める | 要素が多い・長い、要素にコメントを付けたい |
| **フロースタイル** | `[a, b, c]` | 短い値を2〜3個並べるだけのとき |

```yaml
# ブロックスタイル
tags:
  - yaml
  - config

# フロースタイル（上と同じ意味）
tags: [yaml, config]
```

> [!NOTE]
> キーの直下の `- ` は、キーと同じ深さに書いても（`tags:` の次の行の行頭に `- `）文法上は有効です。ただし本記事では、親子関係が見やすい **2スペース字下げ** の書き方で統一します。プロジェクト内ではどちらかに揃えましょう。

---

## サンプル

### さまざまな型を並べる

シーケンスの要素には、文字列・数値・真偽値・null を混在させることもできます。

```yaml
scores:
  - 80
  - 95
  - 72

mixed:
  - text
  - 42
  - true
  - null
```

### ファイル全体をシーケンスにする

キーを付けずに、ファイル全体を1つのリストとして書くこともできます。

```yaml
- 月曜日
- 火曜日
- 水曜日
```

これはJSONの `["月曜日", "火曜日", "水曜日"]` と同じ意味です。

---

## よくある間違い

### 1. ハイフンの後ろにスペースがない

```text
❌ fruits:
     -apple
     -banana

✅ fruits:
     - apple
     - banana
```

`- ` になっていないため、2行がつながって `fruits` の値は `-apple -banana` という1つの文字列になり、リストになりません。

### 2. 要素ごとにインデントがずれている

```text
❌ fruits:
     - apple
      - banana

✅ fruits:
     - apple
     - banana
```

❌ の書き方は **エラーにならず**、2行目が1つ目の要素の続きとみなされて `apple - banana` という1つの要素だけのリストになります。黙って意味が変わるため気づきにくいミスです。同じリストの要素は、`- ` の位置を必ず揃えます。

### 3. フロースタイルでカンマを忘れる

```text
❌ tags: [yaml config]
✅ tags: [yaml, config]
```

`[yaml config]` は「`yaml config` という1つの要素」のリストになってしまいます。

---

## 実用例

### 対象ブランチや対象OSを列挙する

GitHub Actions では、ワークフローを動かすブランチやテストを実行するOSをシーケンスで指定します。

```yaml
on:
  push:
    branches:
      - main
      - develop

jobs:
  test:
    strategy:
      matrix:
        # 短いリストはフロースタイルもよく使われる
        os: [ubuntu-latest, macos-latest, windows-latest]
```

`os` は `jobs` ➔ ジョブ名 ➔ `strategy` ➔ `matrix` の下に書く決まりです。このような入れ子の書き方は [ネスト（入れ子）とインデントのルール](/themes/01-web-basics/09-yaml/intro-basics/nesting) で解説します。

### マッピングのフロースタイル

シーケンスの `[]` と同じように、マッピングも `{}` を使って1行で書けます。

```yaml
# ブロックスタイル
point:
  x: 10
  y: 20

# フロースタイル（上と同じ意味）
point: {x: 10, y: 20}
```

---

## 実習

### 課題1

次のYAMLを、同じ意味のフロースタイルに書き換えてください。

```yaml
languages:
  - Python
  - Go
  - Rust
```

解答例：

```yaml
languages: [Python, Go, Rust]
```

### 課題2

次のYAMLの誤りを2つ見つけて直してください。

```text
colors:
  - red
  -green
    - blue
```

解答例：

```yaml
colors:
  - red
  - green
  - blue
```
