---
title: "コマンド一覧 (チートシート)"
description: "スラッシュコマンド・CLIフラグ・キーボードショートカット・権限モードのリファレンス。"
order: 3
type: reference
difficulty: intermediate
tags: [claude-code, ai-coding, cheatsheet, reference]
estimatedMinutes: 10
status: published
---
Claude Code の対話モードや CLI から呼び出せるコマンドを、カテゴリ別にまとめたチートシートです。

## スラッシュコマンド

対話中に使えるビルトインコマンド

| コマンド | 説明 | 使い方 | Tip |
|---|---|---|---|
| `/help` | ヘルプ情報を表示 | `/help` | 利用可能なコマンド一覧を確認できます |
| `/init` | プロジェクト初期設定（CLAUDE.md 生成） | `/init` | プロジェクトのルートで実行すると CLAUDE.md が作成されます |
| `/clear` | 会話履歴をクリア | `/clear` |  |
| `/compact` | 会話を要約して圧縮 | `/compact` | 長い会話でコンテキストが不足した時に便利 |
| `/exit` | Claude Code を終了 | `/exit` |  |
| `/model` | 使用するモデルを切り替え | `/model` | Sonnet と Opus を切り替えられます |
| `/context` | コンテキスト使用量をカラーグリッドで可視化 | `/context` | コンテキストが埋まると応答品質が低下するため定期的に確認を |
| `/cost` | トークン使用量の統計を表示 | `/cost` | サブスクリプションプランではプラン情報のみ表示されます |
| `/memory` | CLAUDE.md メモリを編集 | `/memory` | プロジェクト固有の指示を永続化できます |
| `/config` | 設定の表示・変更 | `/config` |  |
| `/permissions` | 権限設定の表示・変更 | `/permissions` |  |

## CLI フラグ

ターミナルから起動時に指定するオプション

| コマンド | 説明 | 使い方 | Tip |
|---|---|---|---|
| `claude` | 対話モードを開始 | `claude` | 引数なしで実行すると対話モードに入ります |
| `-c / --continue` | 前回の会話を再開 | `claude -c` | 直前のセッションの文脈を引き継ぎます |
| `-r / --resume` | 過去の会話を選んで再開 | `claude -r` | 会話の一覧が表示され、再開したいものを選べます |
| `--model` | 使用するモデルを指定 | `claude --model sonnet` |  |

## キーボードショートカット

対話中に使える便利なキー操作

| コマンド | 説明 | 使い方 | Tip |
|---|---|---|---|
| `Ctrl + C` | 現在の処理を中断 | `実行中に Ctrl + C` | 長時間の処理を途中で止めたい時に |
| `Ctrl + D` | Claude Code を終了 | `プロンプトで Ctrl + D` |  |
| `Ctrl + L` | 画面をクリア | `プロンプトで Ctrl + L` |  |
| `\\ + Enter` | 複数行入力モード | `テキスト入力中に \\ + Enter` | 長い指示を改行しながら入力できます |
| `Option + Enter` | 複数行入力モード（Mac） | `テキスト入力中に Option + Enter` |  |
| `Shift + Tab` | 権限モードの切り替え | `プロンプトで Shift + Tab` | Plan モードと通常モードを素早く切り替え |

## 権限モード

ファイル操作やコマンド実行の許可レベル設定

| コマンド | 説明 | 使い方 | Tip |
|---|---|---|---|
| `default` | 操作のたびに確認を求める（デフォルト） | `初回起動時の標準設定` | 安全性を重視する場合におすすめ |
| `acceptEdits` | ファイル編集を自動承認 | `claude --allowedTools edit,write` | ファイル変更の都度確認が不要になります |
| `plan` | 計画のみ作成し、実際の変更は行わない | `Shift + Tab で切り替え` | 大きな変更前に計画を確認したい時に便利 |

---

**原典**: `claude-code-website/app/features/commands/page.tsx`
