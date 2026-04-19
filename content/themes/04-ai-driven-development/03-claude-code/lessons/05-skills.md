---
title: "カスタムスキル (Skills)"
description: "プロジェクト固有のスキルを定義して Claude Code を拡張する方法と運用パターン。"
order: 5
type: lecture
category: extension
difficulty: intermediate
tags: [claude-code, ai-coding, skills]
estimatedMinutes: 18
status: published
---

# カスタムスキル (Skills)

再利用可能なワークフローと知識をマークダウンで定義し、Claude Code を拡張するための仕組みです。

## このページで学べること

- Skills が解決する問題とユースケース
- CLAUDE.md・サブエージェントとの使い分け
- バンドルスキルと公式スキルの活用方法
- 最初のスキルを自作する手順
- 手動・自動の呼び出し方と引数の渡し方
- フロントマター全フィールド（リファレンス）
- `context: fork` による独立実行など発展機能

## A. なぜ Skills を使うのか

Skills は「繰り返し使うワークフローや知識を一度定義して、いつでも呼び出せる」仕組みです。以下のような場面で特に役立ちます。

| よくある課題 | 内容 |
| --- | --- |
| 同じ指示を毎回コピペしている | 「セキュリティ・パフォーマンス・可読性の 3 観点でレビューして」を毎回入力している |
| CLAUDE.md が肥大化してきた | デプロイ手順や API 仕様が混在して毎回のコンテキストを圧迫している |
| チームで手順を共有したい | デプロイ手順やレビューチェックリストをリポジトリに入れて、チーム全員が同じように使えるようにしたい |

Skills を使えば、これらを `SKILL.md` に一度書くだけで `/review` や `/deploy` のスラッシュコマンドとして何度でも呼び出せます。

> [!TIP]
> CLAUDE.md は「常にアクティブなルール」、Skills は「必要な時だけ呼び出すワークフロー」です。CLAUDE.md が 500 行を超えてきたら、詳細な手順を Skills に移すサインです。

## B. CLAUDE.md・サブエージェントとの使い分け

Claude Code には似た機能が複数あります。それぞれの特徴を理解して適切に使い分けましょう。

| 比較項目 | CLAUDE.md | Skills | サブエージェント |
| --- | --- | --- | --- |
| ロードタイミング | 常時自動 | 呼び出し時 or 自動検出 | 明示的に起動 |
| 主な用途 | ルール・規約・常にやること | 再利用ワークフロー・手順書 | 独立した並列タスク実行 |
| 会話履歴 | 共有 | 共有（fork 時は非共有） | 非共有 |
| チーム共有 | 可（コミット可） | 可（コミット可） | 可（コミット可） |
| 向いている例 | 「TypeScript を使うこと」 | 「/deploy の手順」 | 大量ファイルの並列処理 |

## C. 既存スキルを活用する

自分でゼロから作る前に、すでに使えるスキルを確認しましょう。Claude Code には標準でいくつかのスキルが組み込まれており、さらに公式リポジトリから追加もできます。

### バンドルスキル（標準搭載）

インストール不要でどのセッションでも使えるスキルです。

| コマンド | 用途 |
| --- | --- |
| `/simplify` | コードのシンプル化・品質改善 |
| `/debug` | 体系的なデバッグ支援 |
| `/loop` | 指定した処理を繰り返し実行 |
| `/claude-api` | Claude API / Anthropic SDK を使ったアプリ開発支援 |

### 公式リポジトリのスキル（anthropics/skills）

Anthropic が公開している公式スキル集です。プラグイン経由で追加できます。

```bash
# 汎用スキル集を追加
/plugin install example-skills@anthropic-agent-skills

# ドキュメント操作スキルを追加
/plugin install document-skills@anthropic-agent-skills
```

| スキル名 | 用途 | パッケージ |
| --- | --- | --- |
| `/skill-creator` | 対話形式でスキルを作成 | `example-skills` |
| `/mcp-builder` | MCP サーバーの作成ガイド | `example-skills` |
| `/frontend-design` | 高品質な UI・フロントエンド設計 | `example-skills` |
| `/docx` / `/pdf` | Word・PDF ファイルの操作・生成 | `document-skills` |
| `/pptx` / `/xlsx` | PowerPoint・Excel ファイルの操作・生成 | `document-skills` |

### スキルを探す：skills.sh

Vercel が運営する [skills.sh](https://skills.sh) は、Claude Code をはじめ複数のエージェントに対応したスキルのオープンディレクトリです。インストール数のランキングから人気スキルを発見でき、CLI で手軽に導入できます。

```bash
# skills.sh のスキルをインストール
npx skills add <owner/repo>

# 例：Vercel 公式スキル集を追加
npx skills add vercel-labs/agent-skills
```

**おすすめ: `find-skills`（by vercel-labs）** — skills.sh で最多インストールクラスのスキルです。「〜ができるスキルはある？」と聞くだけで関連スキルを検索して、インストールコマンドまで提示してくれます。スキルを探すためのスキルという逆転の発想が面白く、エコシステムへの入口として最適です。

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

> [!WARNING]
> コミュニティスキルはメンテナンス品質にばらつきがあります。skills.sh はインストール数が可視化されているので、実績のあるスキルを選ぶ際の参考になります。

## D. 最初の Skill を自作する

スキルはシンプルなマークダウンファイルで作れます。2 つの方法を紹介します。

### 方法①：手動で作る（3 ステップ）

#### 1. ディレクトリを作成する

```bash
# プロジェクト固有のスキル（チームで共有できる）
mkdir -p .claude/skills/review

# 個人スキル（全プロジェクトで使える）
mkdir -p ~/.claude/skills/review
```

#### 2. SKILL.md を書く

```markdown
---
name: review
description: コードレビューを実行する。レビュー依頼や PR のチェックを求められたときに使用。
---
# Code Review Skill

以下の観点でコードレビューを行ってください：

1. **セキュリティ**: SQLインジェクション、XSS、認証漏れ
2. **パフォーマンス**: N+1クエリ、不要な再レンダリング
3. **可読性**: 命名規則、関数の長さ、コメントの適切さ
4. **テスト**: テストカバレッジ、エッジケースの網羅

重要度（高/中/低）と具体的な修正案を必ず含めてください。
```

フロントマターの主なフィールド:

| フィールド | 説明 |
| --- | --- |
| `name` | スラッシュコマンド名。`name: review` と書くと `/review` で呼び出せるようになります。省略するとディレクトリ名が使われます |
| `description` | Claude が自動呼び出しを判定する際に使用します。「何をするか」だけでなく「どんな状況で使うか」まで書くと精度が上がります |
| `disable-model-invocation` | デプロイや外部 API など、意図しないタイミングで動いてほしくないスキルは `true` に設定します（詳細は後述） |

#### 3. 呼び出す

```bash
/review
```

保存後すぐに使えます（セッション再起動不要）。

### 方法②：/skill-creator を使う

`/skill-creator` を入力すると、Claude が対話形式でスキルの目的・内容・設定をヒアリングし、`SKILL.md` を自動生成してくれます。`example-skills` プラグインが必要です。

> [!TIP]
> 迷ったらまず手動で書いてみましょう。シンプルなスキルなら数分でできます。複雑な構成を考えたいときや、どう書けばよいか分からないときに `/skill-creator` が役立ちます。

## E. 呼び出し方

スキルの呼び出し方は 2 種類あります。

| 呼び出し方 | 概要 | 例 |
| --- | --- | --- |
| 手動呼び出し | スラッシュコマンドで明示的に実行。ディレクトリ名（または `name`）がコマンド名になります | `/review` |
| 自動呼び出し | 会話の文脈に応じて Claude が自動ロード。`description` と会話内容が一致すると自動検出 | 「このコードレビューして」 |

### 自動呼び出しを無効にする

デプロイや外部 API コールなど、意図しないタイミングで実行されると困るスキルは `disable-model-invocation: true` を設定して手動専用にできます。

```markdown
---
name: deploy
description: 本番環境にデプロイする
disable-model-invocation: true   # 手動呼び出し専用
---
```

> [!IMPORTANT]
> `description` の内容が自動呼び出しの精度を決めます。「何をするスキルか」「どんな状況で使うか」を具体的に書くほど、Claude が適切なタイミングで呼び出してくれます。250 文字を超えると切り詰められます。

## F. 引数の渡し方

スラッシュコマンドの後に続けてテキストを入力すると、スキル内で参照できます。

| 変数 | 内容 | 例：`/deploy staging` |
| --- | --- | --- |
| `$ARGUMENTS` | 引数全体の文字列 | `"staging"` |
| `$ARGUMENTS[0]` / `$0` | 最初の引数 | `"staging"` |
| `$ARGUMENTS[1]` / `$1` | 2 番目の引数 | （この例では空） |

```markdown
---
name: deploy
description: 指定環境にデプロイする
disable-model-invocation: true
---

$ARGUMENTS 環境にデプロイします：

1. テスト実行: `npm run test`
2. ビルド: `npm run build`
3. $0 へデプロイ: `npm run deploy:$0`
```

> [!TIP]
> スペースを含む引数はクォートで囲みます。例: `/skill "hello world" second` → `$0 = "hello world"`、`$1 = "second"`。

## G. リファレンス

このセクションは使いながら参照する辞書としてご活用ください。最初から全部覚える必要はありません。

### ディレクトリ構造

```text
~/.claude/skills/            # ユーザースキル（全プロジェクト共通）
  review/
    SKILL.md
  format/
    SKILL.md

.claude/skills/              # プロジェクトスキル（リポジトリ固有）
  deploy/
    SKILL.md
    scripts/
      validate.sh            # 補助スクリプト（省略可）
  api-docs/
    SKILL.md
    reference.md             # 補助ファイル（省略可）
```

### 設置場所と優先順位

| 優先度 | 場所 | パス | 適用範囲 |
| --- | --- | --- | --- |
| 1（最高） | Enterprise | managed settings 経由 | 組織全ユーザー |
| 2 | Personal | `~/.claude/skills/` | 自分の全プロジェクト |
| 3 | Project | `.claude/skills/` | そのリポジトリのみ（コミット可） |
| 4 | Plugin | `<plugin>/skills/` | プラグインが有効な場所 |

### フロントマター フィールド一覧

| フィールド | 説明 | デフォルト |
| --- | --- | --- |
| `name` | スラッシュコマンド名。省略するとディレクトリ名を使用（小文字・数字・ハイフン、最大 64 文字） | ディレクトリ名 |
| `description` | Claude が自動呼び出しを判定する際に使用。250 文字を超えると切り詰められる | 推奨 |
| `argument-hint` | オートコンプリート時に表示される引数ヒント（例: `[filename] [format]`） | （省略可） |
| `disable-model-invocation` | `true` にすると Claude による自動呼び出しを無効化し、手動（`/name`）でのみ実行可能にする | `false` |
| `user-invocable` | `false` にすると `/` メニューから非表示。Claude のみが呼び出せるバックグラウンド知識向け | `true` |
| `allowed-tools` | スキル実行中に承認なしで使えるツール。スペース区切りで指定（例: `Bash(git *) Read`） | （省略可） |
| `model` | スキル実行時に使用するモデルを上書き | （省略可） |
| `effort` | 思考レベルを上書き。`low` / `medium` / `high` / `max`（`max` は Opus 4.6 のみ） | セッション設定を継承 |
| `context` | `fork` を指定すると独立したサブエージェントコンテキストで実行 | （省略可） |
| `agent` | `context: fork` 使用時に実行するサブエージェントの種類（例: `Explore`、`Plan`、カスタム名） | `general-purpose` |
| `paths` | スキルを自動起動するファイルパターン（glob）。対象ファイルを操作中のみ自動ロード | （省略可） |
| `hooks` | このスキルのライフサイクルにスコープされた Hooks の定義 | （省略可） |

## H. 発展機能：フォークコンテキスト

フロントマターに `context: fork` を設定すると、スキルの内容がサブエージェントへのプロンプトになり、独立した環境で実行されます。結果だけがメインの会話に返ってくるため、大量のファイル処理など重い作業をメインの会話を汚さずに実行できます。

```markdown
---
name: deep-research
description: トピックをコードベースから徹底的に調査する
context: fork
agent: Explore
allowed-tools: Glob Grep Read
---

$ARGUMENTS を徹底調査してください：

1. Glob・Grep で関連ファイルを探索
2. コードを読み込んで分析
3. 具体的なファイル参照を含めて結果をまとめる
```

### `agent:` に指定できる値

| `agent:` の値 | 特徴 |
| --- | --- |
| `general-purpose` | デフォルト。フルツールアクセス |
| `Explore` | 読み取り専用ツール最適化。コードベース探索向け |
| `Plan` | 計画・設計タスク向け |
| （カスタム名） | `.claude/agents/` に定義したカスタムサブエージェント |

> [!IMPORTANT]
> `context: fork` は「〜を調査して」「〜を分析して」のようなタスク指向のスキルに適しています。「この API を使うこと」のような知識・ガイドライン系のスキルには向きません。サブエージェントはプロンプトを受け取りますが、実行する具体的なタスクがないと意味のある結果を返せません。

## トラブルシューティング

| 症状 | 原因と対処 |
| --- | --- |
| スラッシュコマンドとして表示されない | ディレクトリ名（または `name`）が小文字・数字・ハイフンかを確認。`user-invocable: false` になっていないかを見直す |
| 自動呼び出しされない | `description` が抽象的すぎる可能性。250 文字以内で「何をするか」「どんなときに使うか」を具体化する |
| 想定外のタイミングで実行される | `disable-model-invocation: true` を設定し、手動呼び出し専用に切り替える |
| 毎回ツール承認を求められる | `allowed-tools` に必要なツール（例: `Bash(git *) Read`）を列挙して承認を省略する |

## 関連ページ

- [Skills（公式ドキュメント）](https://code.claude.com/docs/en/skills)
- [Commands & bundled skills](https://code.claude.com/docs/en/commands)
- [Plugins（Skills の配布）](https://code.claude.com/docs/en/plugins)
