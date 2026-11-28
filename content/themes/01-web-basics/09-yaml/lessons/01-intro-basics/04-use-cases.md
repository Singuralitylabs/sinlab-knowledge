---
title: "YAMLの主な用途とJSONとの使い分け"
order: 4
type: detail
difficulty: beginner
tags: [yaml, json, github-actions, docker-compose, frontmatter]
estimatedMinutes: 7
status: published
---
# YAMLの主な用途とJSONとの使い分け

## 解説

YAMLは **人間が手で書いて、読んで、管理する設定ファイル** で特に広く使われています。インデントで構造が一目でわかり、コメントも書けるため、「なぜこの設定にしたか」を残しながらチームで編集するのに向いています。

### 代表的な用途

| 用途 | ファイル例 | 内容 |
|------|-----------|------|
| **CI/CD** | `.github/workflows/*.yml` | GitHub Actions のテスト・ビルド・デプロイ手順 |
| **コンテナ構成** | `compose.yaml` | Docker Compose で起動する複数コンテナの定義 |
| **インフラ定義** | Kubernetes のマニフェスト | アプリの配置・台数・ネットワークの定義 |
| **フロントマター** | Markdown 先頭の `---` 〜 `---` | 記事のタイトル・タグ・公開日などのメタ情報 |
| **ツールの設定** | `.prettierrc.yaml`, `pnpm-workspace.yaml` など | 各種開発ツールの設定 |

### JSONとの比較

YAMLとJSONは表現できるデータの種類がほぼ同じで、相互に変換できます（YAML 1.2 は JSON を包含するよう設計されており、ほとんどのJSONはそのままYAMLとしても読めます）。

| 観点 | YAML | JSON |
|------|------|------|
| 構造の表し方 | インデント | `{}` と `[]` |
| コメント | `#` で書ける | 書けない |
| クォート | 基本不要 | キー・文字列に必須 |
| 文法の厳格さ | 柔軟（その分、型の誤解釈が起きやすい） | 厳格（曖昧さがない） |
| 主な用途 | 人が編集する設定ファイル | プログラム間のデータ交換（Web APIなど） |

> [!NOTE]
> どちらを使うかは、多くの場合ツール側で決まっています（GitHub Actions はYAML、`package.json` はJSON）。自分で選べる場合は「人が頻繁に書き換えるならYAML、プログラムが読み書きするならJSON」を目安にしましょう。

---

## サンプル

### GitHub Actions のワークフロー

`push` されるたびにテストを実行する設定です。マッピング・シーケンス・ネストがすべて登場します。

```yaml
name: test                 # ワークフローの名前

on:
  push:
    branches: [main]       # main への push で実行

jobs:
  test:
    runs-on: ubuntu-latest
    steps:                 # 手順はシーケンスの中にマッピング
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

### Docker Compose の構成ファイル

Webアプリとデータベースの2つのコンテナを起動する設定です。

```yaml
services:
  web:
    image: node:22
    ports:
      - "3000:3000"        # 「:」を含むのでクォートで囲む
    depends_on:
      - db
  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: example
```

### Markdown のフロントマター

本サイトのレッスン記事も、先頭にYAMLのフロントマターを持っています。

```markdown
---
title: "YAML入門 基礎編"
order: 1
type: lecture
difficulty: beginner
tags: [yaml, data-format, config]
---
# YAML入門 基礎編

ここから本文…
```

`---` で囲まれた部分だけがYAMLとして読み込まれ、記事一覧のタイトルやタグ表示などに使われます。

---

## よくある間違い

### 1. ポート番号の指定をクォートで囲まない

```text
❌ ports:
     - 3000:3000

✅ ports:
     - "3000:3000"
```

古いYAML 1.1 の仕様では、`:` 区切りの数字が **60進数** として数値に変換されることがあります（例：`22:22` が `1342` になる）。Docker Compose の公式ドキュメントでも、ポート指定は文字列で書くことが推奨されています。

### 2. フロントマターの区切り線を忘れる・位置がずれる

```text
❌ title: "記事タイトル"       ← 先頭の --- がない
   ---

❌ （空行）
   ---                       ← ファイルの1行目ではない
   title: "記事タイトル"
   ---

✅ ---
   title: "記事タイトル"
   ---
```

フロントマターは **ファイルの1行目** の `---` から始める必要があります。

### 3. 拡張子で別物だと思い込む

```text
❌ 「.yml と .yaml は文法が違う」
✅ どちらも同じYAML。ツールが読み込むファイル名（例: compose.yaml）に合わせる
```

---

## 実用例

### 既存プロジェクトのYAMLを読み解く

新しいプロジェクトに参加したら、まずリポジトリ内のYAMLファイルを探して開いてみましょう。CIで何が自動実行されているか、どのようなサービスが連携しているかがわかります。

```bash
# リポジトリ内の YAML ファイルを一覧表示する
find . -name "*.yml" -o -name "*.yaml" | grep -v node_modules
```

```text
$ find . -name "*.yml" -o -name "*.yaml" | grep -v node_modules
./.github/workflows/lint.yml
./.github/workflows/test.yml
./compose.yaml
```

> [!TIP]
> コマンドの使い方は [ターミナル](/themes/01-web-basics/04-terminal) モジュールで解説しています。

---

## 実習

### 課題1

自分が使っているGitHubリポジトリ（またはこのサイトのリポジトリ）の `.github/workflows/` 配下のYAMLファイルを1つ開き、次の問いに答えてください。

- `on:` の下には何が書かれていますか？（どのタイミングで実行されるか）
- `steps:` の中にはいくつの要素（`- ` で始まる手順）がありますか？
- マッピング・シーケンス・ネストがそれぞれどこに使われているか指摘してください

### 課題2

次のフロントマターをYAMLの文法に注意して完成させてください。条件：タイトルは「はじめてのYAML: 入門」、タグは `yaml` と `beginner` の2つ、公開日は `2026-11-28`（文字列）。

解答例：

```yaml
---
title: "はじめてのYAML: 入門"
tags: [yaml, beginner]
publishedAt: "2026-11-28"
---
```

タイトルに `: ` が含まれるため、クォートで囲む必要があります。
