---
title: "VS Code で Git を扱う"
order: 4
type: lecture
difficulty: intermediate
tags: [vscode, git, intermediate, concept]
estimatedMinutes: 20
status: draft
---
# VS Code で Git を扱う

## はじめに

### このレッスンのゴール

VS Code には Git 機能が標準で組み込まれています。ターミナルで `git` コマンドを叩く代わりに、サイドバーの **Source Control パネル** から GUI でステージング・コミット・プッシュ・差分確認・コンフリクト解決まで一通り行えます。

このレッスンでは、Git の基本（add / commit / push / branch / merge）を理解している前提で、VS Code 上での GUI 操作に焦点を当てます。

---

## CLI と GUI の使い分け

| 観点 | CLI（ターミナル） | GUI（VS Code） |
|------|-------------------|-----------------|
| 操作感 | コマンド入力 | マウス + ボタン |
| 差分確認 | `git diff`（テキスト） | 色付きの並列ビュー |
| コンフリクト解決 | テキストエディタで手動編集 | ボタンで選択（Accept Current / Incoming） |
| 高度な操作 | すべての Git コマンドが使える | 基本操作が中心 |
| 学習効果 | Git の仕組みを深く理解できる | 視覚的にわかりやすい |

**おすすめの使い分け**：日常の基本操作（ステージング、コミット、プッシュ、差分確認）は VS Code の GUI、複雑な操作（リベース、チェリーピック、reflog）は CLI、というのが効率的です。

> **前提**：VS Code には Git クライアント機能が同梱されていますが、**Git 本体** は別途 PC にインストールが必要です。ターミナルで `git --version` を実行して、Git が使えることを確認してください。

---

## 標準フローの俯瞰

VS Code 上での Git 操作の典型的な流れは次のようになります。

```
1. ファイルを編集
   ↓
2. Source Control パネルで変更を確認
   ↓
3. ステージング（+ ボタン）
   ↓
4. コミットメッセージを入力 → コミット
   ↓
5. Sync Changes（プッシュ + プル）
```

複数ファイルを一気にステージングしたり、変更の中の一部の行だけをステージングしたり（hunk staging）、すべて GUI で完結します。

---

## トピック一覧

### 1. Source Control パネルの読み方

サイドバーの分岐アイコン（`Cmd + Shift + G` / `Ctrl + Shift + G`）で開く Source Control パネルの構成。`M`（Modified）/ `U`（Untracked）/ `D`（Deleted）/ `A`（Added）などのバッジ、ステージ済み / 変更 / マージの 3 リスト、上部のメッセージ欄。

::detail{slug="source-control-panel"}

### 2. ステージングとコミット

`+` ボタンでステージング、`−` でアンステージ。ファイル単位だけでなく、**変更の中の一部の行だけ** をステージングする操作（hunk staging / line staging）は VS Code の GUI が特に便利な領域です。コミット後の `Sync Changes` ボタンでプッシュ + プルが一括で走ります。

::detail{slug="stage-commit"}

### 3. 差分表示とマージコンフリクト

ファイルをクリックすると、編集前 / 編集後を **並列または上下で** 比較できます。エディタ左端のガターには変更マーカー（追加 = 緑、変更 = 青、削除 = 赤の三角）が表示されます。コンフリクト時は `Accept Current Change` / `Accept Incoming Change` / `Accept Both Changes` / `Compare Changes` のインラインボタンが表示され、クリックひとつで解決できます。

::detail{slug="diff-merge"}

### 4. ブランチ操作とリモート同期

ステータスバー左端のブランチ名をクリックするとブランチ切替・新規作成・チェックアウトが可能です。フェッチ・プル・プッシュは Source Control パネル右上の `…` メニュー、もしくはステータスバーの同期アイコンから実行できます。

::detail{slug="branch-remote"}

### 5. 履歴の閲覧と Blame

エクスプローラー下部の **Timeline ビュー** でファイル単位のコミット履歴を確認できます。`git blame`（誰がいつその行を変更したか）相当の表示は標準では限定的なので、**GitLens** などの拡張機能を併用するのが一般的です。

::detail{slug="history-blame"}

---

## まとめ

- VS Code の Source Control パネルで、日常的な Git 操作はほぼ完結する
- 行単位のステージングや視覚的な差分確認は GUI ならではの強み
- 履歴・Blame など踏み込んだ操作は GitLens などの拡張機能で補強する
- 複雑な操作（リベース、チェリーピック）は素直に CLI を使う
