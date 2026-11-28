---
title: "ネスト（入れ子）とインデントのルール"
order: 3
type: detail
difficulty: beginner
tags: [yaml, syntax, nesting, indent]
estimatedMinutes: 7
status: published
---
# ネスト（入れ子）とインデントのルール

## 解説

マッピングやシーケンスの値として、さらにマッピングやシーケンスを入れることを **ネスト**（入れ子）といいます。YAMLでは `{}` や `[]` の代わりに、**インデント（行頭の半角スペース）の深さ** で親子関係を表します。

```text
user:                 ← 深さ0：親のキー
  name: Taro          ← 深さ2：user の子
  profile:            ← 深さ2：user の子（値はマッピング）
    age: 25           ← 深さ4：profile の子
    location: Tokyo   ← 深さ4：profile の子
  skills:             ← 深さ2：user の子（値はシーケンス）
    - HTML            ← 深さ4：skills の要素
    - CSS
```

### インデントのルール

| ルール | 内容 |
|--------|------|
| **半角スペースのみ** | タブ文字は使用禁止。多くのツールでパースエラーになる（エラーにならず意味が変わるツールもある） |
| **同じ階層は同じ深さ** | 兄弟関係にある要素は、行頭の位置を1文字の狂いもなく揃える |
| **子は親より深く** | 何スペース深くするかは自由だが、2スペースが一般的 |
| **ファイル内で統一** | 2スペースと4スペースを混在させない |

### ネストの4パターン

| パターン | 意味 | JSONでの対応 |
|----------|------|--------------|
| マッピングの中にマッピング | 項目のグループ化 | `{"a": {"b": 1}}` |
| マッピングの中にシーケンス | 項目に複数の値 | `{"a": [1, 2]}` |
| シーケンスの中にマッピング | 同じ形のデータの一覧 | `[{"a": 1}, {"a": 2}]` |
| シーケンスの中にシーケンス | 表のような二次元データ | `[[1, 2], [3, 4]]` |

> [!IMPORTANT]
> 3つ目の **「シーケンスの中にマッピング」** は実務で最も頻出で、最もつまずきやすい形です。`- ` の後ろに最初のキーを書き、2つ目以降のキーは **最初のキーと同じ位置** に揃えます。

---

## サンプル

### シーケンスの中にマッピング（オブジェクトの一覧）

```yaml
projects:
  - name: portfolio      # 1つ目の要素の開始
    language: TypeScript # name と同じ位置に揃える
    public: true
  - name: blog           # 2つ目の要素の開始
    language: Markdown
    public: false
```

同じデータをJSONで書くと次のようになります。

```json
{
  "projects": [
    { "name": "portfolio", "language": "TypeScript", "public": true },
    { "name": "blog", "language": "Markdown", "public": false }
  ]
}
```

### 深いネスト

```yaml
company:
  name: Sinlab
  departments:
    - name: 開発部
      members:
        - Taro
        - Hanako
    - name: 営業部
      members: [Jiro]
```

---

## よくある間違い

### 1. タブでインデントしている

```text
❌ user:
   →name: Taro        （→ はタブ文字）

✅ user:
     name: Taro       （半角スペース2つ）
```

YAMLの仕様ではタブによるインデントは禁止されており、多くのツールはエラーを出します。たとえば Python のYAMLライブラリ（PyYAML）では `found character '\t' that cannot start any token` と表示されます。ツールによってはエラーを出さずに別の構造として読み込んでしまうこともあるため、「エラーが出ないから大丈夫」とは限りません。

### 2. 兄弟要素の深さがずれている

```text
❌ profile:
     age: 25
      location: Tokyo

✅ profile:
     age: 25
     location: Tokyo
```

### 3. シーケンス内マッピングで2つ目のキーの位置がずれている

```text
❌ projects:
     - name: portfolio
     language: TypeScript     ← 「- 」の位置に揃えてしまっている

❌ projects:
     - name: portfolio
       - language: TypeScript ← 「- 」が新しい要素の開始とみなされ、位置が合わずエラーになる

✅ projects:
     - name: portfolio
       language: TypeScript   ← name の位置に揃える
```

### 4. 親のキーにインデントを付けすぎる・付け忘れる

```text
❌ user:
   name: Taro                 ← 子なのに user と同じ深さ（インデントなし）

✅ user:
     name: Taro
```

インデントがないと `name` は `user` の子ではなく兄弟とみなされ、`user` の値は null になります。エラーにならずに意味だけが変わるため、特に気づきにくいミスです。

---

## 実用例

### VS Codeでインデントを見やすくする

インデントのミスを防ぐには、エディタの設定を活用します。

| 機能 | 操作 |
|------|------|
| 空白文字を表示する | コマンドパレット ➔ `View: Toggle Render Whitespace` |
| タブをスペースに変換する | コマンドパレット ➔ `Convert Indentation to Spaces` |
| 階層を折りたたむ | 行番号の右の矢印 `>` をクリック |

> [!TIP]
> Red Hat 社の拡張機能 **YAML**（`redhat.vscode-yaml`）を入れると、インデントの誤りや、GitHub Actions・Docker Compose などのファイルで書けないキーを赤い波線で教えてくれます。

---

## 実習

### 課題1

次のJSONを、同じ意味のYAMLに書き換えてください。

```json
{
  "team": "frontend",
  "members": [
    { "name": "Taro", "role": "leader" },
    { "name": "Hanako", "role": "member" }
  ]
}
```

解答例：

```yaml
team: frontend
members:
  - name: Taro
    role: leader
  - name: Hanako
    role: member
```

### 課題2

次のYAMLは意図どおりに解釈されません。どこが問題か説明し、直してください。

```text
server:
host: localhost
  port: 3000
```

解答例：`host` にインデントがないため `server` の子になりません（`server` の値は null になります）。さらに、`host` より深くインデントされた `port: 3000` の行は `localhost` という値の続きとみなされ、その中の `: ` が不正なためエラーになります。

```yaml
server:
  host: localhost
  port: 3000
```
