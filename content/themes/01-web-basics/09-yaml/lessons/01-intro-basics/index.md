---
title: "YAML入門 基礎編"
order: 1
type: lecture
difficulty: beginner
tags: [yaml, data-format, config, github-actions, docker]
estimatedMinutes: 15
status: published
---
# YAML入門 基礎編

## はじめに

### YAMLとは？

**YAML**（YAML Ain't Markup Language、読み方は「ヤムル」）は、人間が読み書きしやすいことを重視したデータ記述フォーマットです。`{}` や `"` を多用するJSONと違い、**インデント（字下げ）と記号 `:`・`-`** だけでデータの構造を表現するため、見た目がすっきりしていて手で編集しやすいのが特徴です。

ファイルの拡張子は `.yaml` または `.yml` です（どちらでも同じ意味で、プロジェクトの慣習に合わせます）。

### なぜYAMLを学ぶのか？

- **設定ファイルの定番**：GitHub Actions、Docker Compose、Kubernetes など、開発・運用ツールの設定はYAMLで書くものが多数あります
- **Markdownのフロントマター**：ブログや本サイトのレッスン記事の先頭にある `---` で囲まれたメタ情報もYAMLです
- **インデントのミスが致命的**：見た目はシンプルですが、スペース1つのズレで意味が変わったりエラーになったりするため、文法を正しく理解しておく必要があります

この記事では、YAMLの3つの基本要素である **マッピング・シーケンス・ネスト** を押さえたうえで、実際にどのような場面で使われているかを解説します。

> [!TIP]
> YAMLはJSONと同じ種類のデータ（キーと値、配列、入れ子）を表現できます。先に [JSON](/themes/01-web-basics/08-json) モジュールを学んでおくと、両者を比較しながら理解できます。

---

## マッピング（キーと値のペア）

YAMLの最も基本的な単位は、**`キー: 値`** の形で書く **マッピング**（JSONのオブジェクトに相当）です。コロン `:` の後ろには **必ず半角スペース** を入れます。

```yaml
# 「#」から行末まではコメント
name: suzuki_taro
age: 25
isStudent: false
note: null
```

値の文字列は基本的にクォート不要で、数値・真偽値・null は自動的に判定されます。

| 書き方 | 解釈される型 | 例 |
|--------|--------------|----|
| そのまま書いた文字 | 文字列 | `Tokyo` |
| 数字 | 数値 | `25`, `3.14` |
| `true` / `false` | 真偽値 | `true` |
| `null` または `~` | null | `null` |
| クォートで囲んだ値 | 文字列（強制） | `"25"`, `'yes'` |

::detail{slug="mapping"}

---

## シーケンス（リスト）

複数の値を順番に並べたいときは、**`- `（ハイフン＋半角スペース）** で始まる行を並べる **シーケンス**（JSONの配列に相当）を使います。

```yaml
skills:
  - HTML
  - CSS
  - JavaScript
```

短いリストは、JSONと同じ `[]` を使った1行の書き方（**フロースタイル**）でも表現できます。

```yaml
skills: [HTML, CSS, JavaScript]
```

::detail{slug="sequence"}

---

## ネスト（入れ子）とインデント

マッピングやシーケンスの中に、さらにマッピングやシーケンスを入れることを **ネスト** といいます。YAMLでは **インデント（半角スペース）の深さ** で親子関係を表します。

```yaml
user:
  name: suzuki_taro
  profile:
    age: 25
    location: Tokyo
  projects:
    - name: portfolio
      language: TypeScript
    - name: blog
      language: Markdown
```

| ルール | 内容 |
|--------|------|
| インデントは半角スペース | **タブ文字は使用禁止**（エラーになる） |
| 同じ階層は同じ深さ | 1つでもズレると別の階層として解釈されるかエラーになる |
| 深さは2スペースが一般的 | 2でも4でも文法上は可だが、ファイル内で統一する |

::detail{slug="nesting"}

---

## YAMLの主な用途

YAMLは主に **人間が手で書いて管理する設定ファイル** で使われます。プログラム同士のデータ交換（Web APIなど）はJSON、人が編集する設定はYAML、という使い分けが一般的です。

| 用途 | ファイル例 | 内容 |
|------|-----------|------|
| CI/CD | `.github/workflows/*.yml` | GitHub Actions の自動テスト・デプロイ手順 |
| コンテナ | `compose.yaml` | Docker Compose の複数コンテナ構成 |
| インフラ | Kubernetes のマニフェスト | サーバー・アプリの配置定義 |
| 記事のメタ情報 | Markdown の先頭 `---` 〜 `---` | タイトル・タグ・公開日などのフロントマター |

::detail{slug="use-cases"}

---

## 基本文法まとめ

| 要素 | 書き方 | 内容 |
|------|--------|------|
| マッピング | `key: value` | コロンの後ろに半角スペースが必須 |
| シーケンス | `- item` | ハイフンの後ろに半角スペースが必須 |
| ネスト | インデント（半角スペース） | タブ禁止、同じ階層は同じ深さ |
| コメント | `# コメント` | `#` から行末までが無視される |
| フロースタイル | `[a, b]` / `{key: value}` | JSON風の1行表記 |
| 文字列の強制 | `"..."` / `'...'` | 数値や `yes` などを文字列として扱いたいとき |

---

## 実践演習：YAMLでプロフィールを書いてみる

1. VS Codeで新しいファイル `profile.yaml` を作成し、以下を貼り付けます

   ```yaml
   # 自己紹介データ
   name: your_name
   age: 20
   isStudent: true
   hobbies:
     - reading
     - music
   address:
     city: Tokyo
     zip: "100-0001"
   nickname: null
   ```

2. `name` の値を自分の名前に書き換え、`hobbies` に好きな趣味を1つ追加する（`- ` の位置を既存の行に揃える）
3. `address` の下に `country: Japan` を追加する（`city` と同じ深さにする）
4. わざと `city` の行のインデントをスペース1つ分ずらし、保存して何が起こるか（エディタの警告やハイライトの変化）を確認してから元に戻す
5. 同じ内容をJSONで書いた [JSON入門の演習](/themes/01-web-basics/08-json/intro-basics) の `profile.json` と見比べ、`{}`・`"`・`,` がどこに消えたかを確認する

---

## まとめ

- **YAML** はインデントと `:`・`-` でデータを表現する、人間が読み書きしやすいフォーマット
- **マッピング** は `キー: 値`、**シーケンス** は `- 値` で書き、どちらも記号の後ろに半角スペースが必要
- **ネスト** はインデントの深さで表現し、タブは使えない
- GitHub Actions・Docker Compose・フロントマターなど、**人が編集する設定ファイル** で広く使われている

### 次のステップ

- [Git](/themes/01-web-basics/02-git) でリポジトリを管理しているなら、`.github/workflows/` 配下のYAMLファイルを開いて構造を読んでみましょう
- [マークダウン](/themes/01-web-basics/01-markdown) で記事を書く際、先頭にフロントマターを付けてメタ情報を管理してみましょう

### 参考リソース

- [YAML 公式サイト（yaml.org）](https://yaml.org/)：仕様書（YAML 1.2）へのリンク集
- [Learn YAML in Y minutes](https://learnxinyminutes.com/yaml/)：文法を短時間で一覧できるチートシート
- [GitHub Docs: GitHub Actions のワークフロー構文](https://docs.github.com/ja/actions/reference/workflows-and-actions/workflow-syntax)：YAMLの代表的な利用例
