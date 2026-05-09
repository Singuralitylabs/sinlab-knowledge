---
title: "履歴の閲覧と Blame"
order: 5
type: detail
difficulty: intermediate
tags: [vscode, git, reference]
estimatedMinutes: 5
status: draft
---
# 履歴の閲覧と Blame

## 解説

VS Code 標準の履歴閲覧機能は **Timeline（タイムライン）ビュー** が中心で、できることはやや限定的です。`git log` のグラフ表示や `git blame` 相当の行単位の作者表示までやりたい場合は、**GitLens** などの拡張機能を併用するのが定石です。

---

## Timeline ビュー（標準機能）

エクスプローラーを開くと、**下部に「TIMELINE」セクション** が表示されます。

1. エクスプローラーでファイルを選択
2. 下部の `TIMELINE` セクションにそのファイルのコミット履歴が並ぶ
3. 各エントリをクリック → そのコミットでの変更差分が diff ビューで開く

![エクスプローラー下部の Timeline セクションでファイルのコミット履歴を時系列表示](/content-assets/01-web-basics/03-vscode/images/47-timeline-view.png)

Timeline には Git のコミット以外にも **VS Code のローカル変更履歴**（`Local History`（ローカル履歴）：保存ごとに自動記録される直近の変更）が混ざって表示されます。コミット前に「数分前の状態に戻したい」というときに便利です。

---

## ファイル単位の操作（標準コマンド）

コマンドパレット（`Cmd/Ctrl + Shift + P`）で次のコマンドが使えます。

| コマンド | 動作 |
|---------|------|
| `Git: View History (git log)`（Git: 履歴の表示） | Source Control タブにファイルの履歴を表示（拡張により挙動が変わる） |
| `Git: Open File from Previous Revision`（Git: 前のリビジョンからファイルを開く） | 過去のコミットのバージョンをエディタで開く |
| `Git: Compare with Selected`（Git: 選択範囲との比較） | 2 つのコミットや状態を比較 |

ただし VS Code 標準では **コミットグラフの可視化** や **行単位の blame** は提供されません。これらは拡張機能に委ねる方針です。

---

## GitLens（推奨拡張）

最も広く使われている Git 拡張機能で、標準機能の弱点をほぼ網羅します。

### 主な機能

| 機能 | 内容 |
|------|------|
| **インライン blame** | エディタの現在行末に「最終変更者・日時・コミットメッセージ」を表示 |
| **ファイル / リポジトリ履歴ビュー** | サイドバーから時系列でコミット一覧、フィルタ、検索 |
| **コミット間 / ブランチ間の比較** | 任意の 2 点を選んで差分表示 |
| **ホバーリッチ情報** | 変更マーカーや行番号にホバーすると、その変更のコミット詳細が表示される |
| **Visual File History** | ファイルの変遷をグラフィカルに可視化 |

### インストール

拡張機能ビュー（`Cmd/Ctrl + Shift + X`）で `GitLens` を検索 → インストール。再起動不要で機能が有効化されます。

> **Tips**：GitLens のインライン blame は人によっては情報量が多すぎると感じることもあります。設定 `gitlens.currentLine.enabled` で行末表示のオン/オフ、`gitlens.codeLens.enabled` で関数上の CodeLens 表示を制御できます。

---

## Git Graph（補助拡張）

ブランチの分岐・マージを **視覚的なグラフ** で見たい場合は `Git Graph` 拡張が便利です。

- ブランチがどこから分岐し、どこでマージされたかを一目で把握
- グラフ上のコミットからチェックアウト・チェリーピック・リバートなどの操作を直接実行
- コマンドパレット → `Git Graph: View Git Graph` で開く

CLI の `git log --graph --oneline --all` の代替として使うと理解が早いです。

---

## ありがちなつまずき

- 「Timeline に何も出ない」 → 開いているファイルが Git の管理下にないか、まだ 1 度もコミットされていない
- 「GitLens を入れたのに blame が出ない」 → `gitlens.currentLine.enabled` が `false` になっていないか確認。エディタの右下のステータスバーから個別にトグルもできる
- 「拡張機能が重い」 → GitLens は機能が多いため、不要な機能（CodeLens、ファイルツリーの装飾など）を設定でオフにすると体感が軽くなる
- 「過去のコミットの 1 ファイルだけ復元したい」 → `Git: Open File from Previous Revision` で開いて内容をコピー、または CLI の `git checkout <commit> -- <file>`
