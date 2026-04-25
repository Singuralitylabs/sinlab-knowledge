---
title: "Hooks"
description: "Claude Code のイベント駆動自動化 Hooks の仕組みと作り方を解説。"
order: 8
type: lecture
category: automation
difficulty: intermediate
tags: [claude-code, ai-coding, hooks]
estimatedMinutes: 15
status: published
---
# Hooks

Claude Code のエージェントループ内で発生するイベントに対して、決定論的にシェルコマンド等を実行する仕組み「Hooks」の使い方を解説します。Skills や MCP が「LLM の判断を伴う柔軟な拡張」であるのに対し、Hooks は「必ず実行したい処理を事前に定義する」役割を担います。

## このページで学べること

- Hooks の仕組みと、LLM を介さない決定論的自動化の基本概念
- 主要なイベントタイプ（PreToolUse / PostToolUse / UserPromptSubmit / Stop など）とそれぞれのタイミング
- `settings.json` の `hooks` フィールドと `matcher` を使った設定方法
- ファイル編集後の自動フォーマット、応答完了の効果音通知、自動レビューなどの典型ユースケース
- スキルやエージェントのフロントマターに Hooks を埋め込む方法
- どこに Hooks を定義するか（user / project / local / plugin / skill）と、その使い分け

## Hooks の基本概念

Hooks は、Claude Code のエージェントループ内で特定のイベントが発生したときに、**決定論的にシェルスクリプトを実行する仕組み**です。LLM（大規模言語モデル）を介さずに動作するため、毎回確実に同じ処理が実行されます。

Hooks の実行自体は LLM を介さないため、基本的にコンテキストをほとんど消費しません（Hooks が `additionalContext` などを通じて結果を Claude に渡す場合は除きます）。フォーマッターの実行やログ記録のような定型的な自動化に最適で、コスト面でも予測可能です。

### LLM 判断 vs 決定論的処理の比較

| 観点 | Skills / MCP（LLM 判断） | Hooks（決定論的） |
| --- | --- | --- |
| 判断主体 | LLM が文脈に応じて柔軟に判断 | シェルが matcher に基づいて実行 |
| コンテキスト消費 | 消費する | ゼロ |
| 結果の再現性 | 毎回変わる可能性あり | 完全に予測可能 |
| 向いている用途 | 複雑な判断、動的な意思決定 | フォーマットや lint など定型処理 |

### Hooks の実行フロー

```text
イベント発生 → matcher の条件評価 → シェルコマンド実行
```

`matcher` に一致した場合のみスクリプトが実行されます。LLM はこのフローに関与しません。

> [!TIP]
> Hooks は Claude Code の中でもユニークな位置づけです。他の拡張機能（Skills、MCP、サブエージェント）はすべて LLM が判断に関与しますが、Hooks だけは完全に LLM の外で動作します。「必ず実行したい処理」の自動化にこそ使う価値があります。

## Hooks の種類

エージェントループの随所に発火ポイントが用意されています。ブロック可能な Hooks（`exit 2` で処理を中断できるもの）と、情報収集や後処理に使う Hooks に大別できます。下表は発火順に並べています（`InstructionsLoaded` や `Stop`、`SubagentStart/Stop` などは省略）。

| # | Hooks | タイミング | ブロック可能 | 用途例 |
| --- | --- | --- | --- | --- |
| 1 | `SessionStart` | セッション開始時 | - | 環境チェック、Git 状態の確認 |
| 2 | `UserPromptSubmit` | ユーザーのプロンプト送信時 | ✓ | 入力バリデーション、機密語のフィルタ |
| 3 | `PreToolUse` | ツール実行前 | ✓ | 危険なコマンドのブロック、承認判定 |
| 4 | `PermissionRequest` | 権限要求時 | ✓ | 自動承認 / 自動拒否の判定 |
| 5 | `PermissionDenied` | パーミッション拒否時 | - | 拒否ログの記録、通知 |
| 6 | `PostToolUse` | ツール実行後 | △ (実行後ブロック) | 編集後の自動フォーマット、lint |
| 7 | `PreCompact` | コンテキスト圧縮前 | ✓ | 圧縮対象の調整、通知 |
| 8 | `PostCompact` | コンテキスト圧縮後 | - | 圧縮結果の記録 |
| 9 | `SessionEnd` | セッション終了時 | - | サマリ保存、ログのアーカイブ |

テーブルだけでは見えにくい「ループ構造」と「分岐」を図にすると次のようになります。`UserPromptSubmit` から `PostToolUse` までは 1 ターン内で複数回繰り返され、これがエージェントループの本質です。

![Claude Code Hooks の実行タイミングを示すフローチャート](/images/ai-driven-development/hooks-plugins/hook-timing.png)

> [!NOTE]
> ブロック可能な Hooks で `exit 2` を返すと、対応する処理（ツール実行やプロンプト処理）は中止されます。`exit 0` を返した場合は通常通り続行します。`exit 1` は「ブロックしないエラー」として扱われ、処理は継続される点に注意してください。

## Hooks の設定

Hooks は `settings.json` の `hooks` フィールドで設定します。発火させたいイベント名（`PostToolUse` など）をキーに、`matcher` と `hooks` を持つオブジェクトの配列を指定する形が基本です。

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command' | grep -q 'rm -rf' && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

### 設定キーの意味

| キー | 役割 |
| --- | --- |
| イベント名（例: `PostToolUse`） | 発火させる Hooks イベント。値は配列で、複数の `matcher` 設定を並べられる |
| `matcher` | 対象ツール名のパターン。`Write\|Edit` のようにパイプで OR 指定、`*` または省略で全ツールマッチ。`mcp__memory__.*` のような正規表現も可 |
| `hooks` | マッチ時に実行するハンドラの配列。複数登録すると順番に実行される |
| `type` | ハンドラの種類。基本は `"command"`（シェルコマンド実行）。他に `"http"`、`"mcp_tool"`、`"prompt"`、`"agent"` などがある |
| `command` | `type: "command"` 時に実行するシェル文字列 |

### Hooks への入力

Hooks 発火時、ツール入力やセッション情報などは **標準入力に JSON** で渡されます。`jq` で必要な値を抽出して利用してください。

```bash
FILE=$(jq -r '.tool_input.file_path')
```

合わせて以下の環境変数も参照できます。

| 環境変数 | 内容 |
| --- | --- |
| `$CLAUDE_PROJECT_DIR` | プロジェクトルートのパス |
| `$CLAUDE_PLUGIN_ROOT` | プラグインのインストール先（プラグイン由来の Hooks のみ） |
| `$CLAUDE_PLUGIN_DATA` | プラグインの永続データ用ディレクトリ |

JSON や `jq`、環境変数の表記に馴染みがない場合は、以下を展開してください。

<details>
<summary>JSON とは？</summary>

JSON (JavaScript Object Notation) は、データを構造化して書くためのテキスト形式です。`{ "キー": "値" }` の形でデータを記述します。Hooks 発火時に Claude Code から渡されてくるデータも、この形式です。

```json
{
  "session_id": "abc123",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.ts",
    "old_string": "before",
    "new_string": "after"
  }
}
```

- `{ }` で **オブジェクト**（キーと値の組）を表す
- `[ ]` で **配列**（順序のある値のリスト）を表す
- 値は文字列・数値・真偽値・配列・オブジェクトをネストできる
- ネストされた値は `tool_input.file_path` のように **ドットで階層を辿って** 参照する

</details>

<details>
<summary>jq コマンドとは？</summary>

`jq` は **JSON を扱うためのコマンドラインツール** です。標準入力から流れてきた JSON から、欲しい値だけを取り出すのに使います。

```bash
# サンプル: パイプで JSON を流し込み、name フィールドを抜き出す
echo '{"name": "Alice", "age": 30}' | jq '.name'
# => "Alice"

# ネストされた値はドットで辿る
echo '{"user": {"name": "Alice"}}' | jq '.user.name'
# => "Alice"
```

よく使うオプション:

- `-r` (raw): 出力からダブルクォートを外し、生の文字列として返す。シェル変数に代入するときはこれが必要

Hooks 内では標準入力にすでに JSON が来ているので、パイプを書かずにそのまま `jq` を呼べます。

```bash
# Claude が編集したファイルのパスを取り出す
FILE=$(jq -r '.tool_input.file_path')
```

macOS / Linux には標準で入っていない場合があります。Mac なら `brew install jq` でインストールできます。

</details>

<details>
<summary>環境変数とは？</summary>

環境変数 (environment variable) は、シェルから参照できる名前付きの値です。`$VAR_NAME` または `${VAR_NAME}` の形で読み出します。

```bash
echo $HOME
# => /Users/yourname

echo $PATH
# => /usr/bin:/usr/local/bin:...
```

Claude Code は Hooks を起動する直前に、文脈に応じた値を環境変数として自動で設定します。たとえば `$CLAUDE_PROJECT_DIR` には現在のプロジェクトの絶対パスが入ります。

```bash
# プロジェクト直下の audit.log にイベントを書き出す例
echo "edited at $(date)" >> "$CLAUDE_PROJECT_DIR/audit.log"
```

</details>

## Hooks の作り方

新しい Hooks を導入する流れは、**どこに書くかを決める → 編集する → 動作を確認する** の 3 ステップに集約できます。

### 1. どこに定義するか

Hooks を書ける場所は 5 つあり、目的に応じて使い分けます。同じイベントに複数の場所の Hooks がマッチした場合、上書きではなく **すべてが順番に発火** します。

| 場所 | パス | 適用範囲 | コミット | 主な用途 |
| --- | --- | --- | --- | --- |
| ユーザー設定 | `~/.claude/settings.json` | 自分の全プロジェクト | - | 個人用の自動フォーマットなど |
| プロジェクト設定 | `.claude/settings.json` | 単一プロジェクト | ✓ リポジトリにコミット | チーム共有のルール |
| ローカル設定 | `.claude/settings.local.json` | 単一プロジェクト | ✗ gitignore 対象 | 個人用の試験設定 |
| プラグイン | `<plugin>/hooks/hooks.json` | プラグイン有効時のみ | プラグイン経由で配布 | 拡張パッケージとして配布 |
| スキル / エージェント | `SKILL.md` の frontmatter | スキル active 時のみ | スキルと一緒 | スキル固有の自動化 |

優先順位というよりは「適用範囲（スコープ）が違う」と捉えるのが正確です。狭いスコープ（プラグイン、スキル）から広いスコープ（プロジェクト、ユーザー）へと書き分けます。

> [!TIP]
> チームで共有したい Hooks は `.claude/settings.json`、自分だけ試したい Hooks は `.claude/settings.local.json` に書きます。`*.local.json` は `.gitignore` 済みなので、個人用パスや実験中の設定を置いても他メンバーに影響しません。

### 2. 編集ワークフロー

#### A. 手書きで編集する

最もストレートな方法です。エディタで対象の `settings.json` を開き、`hooks` フィールドに追記します。

```bash
# プロジェクトスコープに追加する場合
mkdir -p .claude
$EDITOR .claude/settings.json
```

ファイルを保存すると Claude Code 側のウォッチャーが変更を拾うため、再起動は不要です。

#### B. Claude 自身に編集を依頼する

JSON の構文を覚えていない、あるいは記述ミスを避けたい場合は、Claude にお願いするのが楽です。

```
PostToolUse に Write/Edit が走るたびに prettier を実行する Hooks を
.claude/settings.json に追加してください。
```

Claude は Read で現在の設定を読み、Edit ツールで Hooks を追記します。生成された JSON は **必ず一度内容を確認してから採用** してください（`matcher` のスペル違い、`exit 1` / `exit 2` の取り違えなどは起こりがちです）。

### 3. 作成後の確認方法

#### `/hooks` で一覧を見る

Claude Code 内で `/hooks` を実行すると、現在ロードされている全 Hooks が一覧表示されます。各エントリには定義元のスコープが付記されるので、どこに書いた Hooks が効いているかひと目で分かります。

| ラベル | 出どころ |
| --- | --- |
| `User` | `~/.claude/settings.json` |
| `Project` | `.claude/settings.json` |
| `Local` | `.claude/settings.local.json` |
| `Plugin` | プラグイン同梱の `hooks/hooks.json` |
| `Session` | セッション中だけ登録された一時 Hooks |
| `Built-in` | Claude Code 組み込み |

> [!IMPORTANT]
> `/hooks` は **閲覧専用** です。このメニューから追加・編集・削除はできません。「設定したはずの Hooks が一覧に出ない」場合は、JSON の構文エラーかパスの誤りを疑ってください。

#### `disableAllHooks` で一時停止する

トラブルが Hooks 起因かどうか切り分けたいときは、`settings.json` に以下を追加すると全 Hooks を止められます。

```json
{
  "disableAllHooks": true
}
```

確認が終わったら忘れずに削除してください。

> [!NOTE]
> 組織が管理者権限で配布した Hooks（managed settings 経由）は、ユーザー側の `disableAllHooks` では止められません。セキュリティ上の意図的な仕様です。

## Hooks の実用例

### 1. ファイル編集後の自動フォーマット（format-on-write）

Claude がファイルを編集（Write または Edit）するたびに Prettier を自動実行してコードスタイルを統一します。`PostToolUse` はツール実行後に発火するため、フォーマットに失敗しても既に編集自体は完了しています。

```json
{
  "matcher": "Write|Edit",
  "hooks": [
    {
      "type": "command",
      "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
    }
  ]
}
```

### 2. 応答完了時の効果音通知

Claude が応答を返し終えたタイミングで通知音を鳴らします。長めのタスクを任せてターミナルから目を離していても、完了を音で気付けるので便利です。Hooks の典型的な活用パターンの 1 つで、`Stop` イベント（応答完了直後に発火）を使います。

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

> [!NOTE]
> `afplay` は macOS の組み込みコマンドです。Linux なら `paplay`、Windows なら PowerShell の `[System.Media.SystemSounds]::Asterisk.Play()` などに置き換えてください。サウンドファイルは `/System/Library/Sounds/` 配下から好みのものを選べます（`Glass`、`Ping`、`Funk` など）。

### 3. ファイル編集後の自動レビュー（`prompt` 型）

`type` には `"command"` 以外も指定できます。`"prompt"` を使うと、シェルコマンドではなく **Claude 自身に自然言語で指示を渡す** 形で自動化を組めます。シェルスクリプトに不慣れでも書きやすく、機械的な判定では難しいコードレビューのような処理に向いています。

下記は、ファイル編集のたびに Claude 自身に簡易レビューを依頼する例です。

```json
{
  "matcher": "Write|Edit",
  "hooks": [
    {
      "type": "prompt",
      "prompt": "直前に編集したファイルにバグや脆弱性、命名の不整合がないか確認してください。問題があれば指摘し、なければ「問題なし」とだけ返してください。"
    }
  ]
}
```

> [!NOTE]
> `prompt` 型や `agent` 型は LLM を呼び出すため、`command` 型と違ってトークンとコンテキストを消費します。決定論的な定型処理（フォーマット、lint、ブロック判定）は `command` 型、自然言語の判断や柔軟なレビューが必要な処理は `prompt` / `agent` 型、と使い分けるのが基本です。

## スキル・エージェント内 Hooks 定義

近年の Claude Code では、スキルやエージェントの Markdown ファイル内のフロントマターで直接 Hooks を定義できます。関連する Hooks をスキルと一緒にパッケージ化できるため、スキルの振る舞いと自動化処理をまとめて管理できます。

```yaml
---
description: コードレビュースキル
hooks:
  PostToolUse:
    - matcher: "Edit"
      hooks:
        - type: command
          command: "jq -r '.tool_input.file_path' | xargs npx eslint --fix"
---

# コードレビュースキル

コードの品質をチェックし、改善提案を行います。
編集後に自動で ESLint が実行されます。
```

| メリット | 説明 |
| --- | --- |
| スキルと一緒に管理 | スキルに必要な Hooks がスキルファイル内で完結するため、設定の分散を防げます。 |
| スキル有効時のみ発火 | フロントマターで定義した Hooks は、そのスキルがアクティブなときだけ実行されます。 |

> [!TIP]
> `settings.json` の Hooks はグローバルに常時有効です。一方、スキル内の Hooks はそのスキルが有効な間だけ動作します。「どんなスキルでも常にフォーマットしたい」場合は `settings.json` に、「このスキルを使うときだけ lint したい」場合はスキル内に定義しましょう。

## 関連ページ

- [Hooks（公式ドキュメント）](https://code.claude.com/docs/en/hooks)
- [Settings（permissions など `settings.json` 全体仕様）](https://code.claude.com/docs/en/settings)
