---
title: "設定の編集方法"
order: 1
type: detail
difficulty: beginner
tags: [vscode, settings, reference]
estimatedMinutes: 8
status: draft
---
# 設定の編集方法

## 解説

VS Code の設定は GUI でも JSON でも編集でき、どちらも **同じデータの別ビュー** です。実用的には次のように使い分けます。

| 入口 | 向いている用途 |
|------|---------------|
| **設定 UI** | 設定を探す / 名前が分からない項目を検索する / 真偽値や列挙型をクリックで切り替える |
| **`settings.json`** | 値がオブジェクト・配列の項目、言語別オーバーライド、まとめてコピペで共有したい場合 |

UI で見つけたあと歯車アイコンから JSON を開く、という往復もよくあります。

---

## 設定 UI で編集する

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 設定 UI を開く | `Cmd + ,` | `Ctrl + ,` |

タブで **User**（ユーザー全体）と **Workspace**（このプロジェクトのみ）を切り替えます。マルチルートワークスペースの場合はさらに **Folder** タブが追加されます。

検索バーにキーワードを入れると一致する設定が絞り込まれ、`@modified` と打つと **既定から変更されている設定だけ** を一覧できます。「自分が何を弄ったか」の確認に便利です。

値を変更すると **保存ボタン不要** で即時反映されます。各項目の歯車アイコンから既定値に戻したり、設定 ID を JSON 編集用にコピーしたりできます。設定 UI 右上の `{}` アイコンをクリックすれば、対応する JSON が直接開きます。

---

## settings.json で直接編集する

設定 UI に出ない複雑な値や言語別オーバーライドは、`settings.json` を直接編集します。

| コマンド | 対象 |
|---------|------|
| `Preferences: Open User Settings (JSON)` | ユーザー設定（全プロジェクト共通） |
| `Preferences: Open Workspace Settings (JSON)` | ワークスペース設定（`.vscode/settings.json`） |
| `Preferences: Open Default Settings (JSON)` | すべてのキーと既定値（読み取り専用、参考用） |

User 設定は OS のユーザーディレクトリ配下（macOS は `~/Library/Application Support/Code/User/`、Windows は `%APPDATA%\Code\User\`、Linux は `~/.config/Code/User/`）に置かれます。場所を覚えなくても、上のコマンドから開くのが確実です。

### JSONC の書式

```jsonc
{
  // 1 行コメントが書ける（JSONC = JSON with Comments）
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "files.eol": "\n",

  // 言語ごとの上書き
  "[markdown]": {
    "editor.wordWrap": "on"
  }
}
```

| 機能 | 説明 |
|------|------|
| **コメント** | `//` と `/* */` が使える |
| **末尾カンマ** | 末尾カンマは許容されない（書くと警告） |
| **言語別上書き** | キーを `"[<言語ID>]"` の形にして、その言語だけの設定をネスト |
| **複数言語の同時指定** | `"[typescript][javascript]"` のように連結 |

### IntelliSense

`settings.json` を VS Code で開くと、キーと値の自動補完、ホバー時の説明と既定値表示、未知のキーや型違いへの警告下線が自動で有効になります。完全に覚えていなくても、半分くらい打って候補から選ぶのが一番早い書き方です。

---

## よく使う設定例

最初に入れておくと体感が変わるものをまとめると、おおむね以下です。

```jsonc
{
  // エディタ
  "editor.fontSize": 14,
  "editor.minimap.enabled": false,
  "editor.bracketPairColorization.enabled": true,

  // 保存時の整形
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // ファイル
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // 言語別の上書き
  "[python]": { "editor.defaultFormatter": "ms-python.black-formatter" }
}
```

それぞれの設定の細かい候補値は、設定 UI からホバーすれば説明が出るので暗記する必要はありません。

---

## ありがちなつまずき

- 「設定したのに反映されない」 → User と Workspace で同じキーを別の値で設定していないか確認。優先順位は Folder > Workspace > User
- 「保存したら動かなくなった」 → JSON 構文エラーを確認。エディタ右下の `✕ 1` のような表示があれば該当行を修正。エラー時は VS Code は **設定全体を読み込まない**
- 「言語別オーバーライドが効かない」 → `"[<言語ID>]"` の言語 ID は表示名ではなく内部 ID。ステータスバーの言語モード表示をクリックすると正確な ID が分かる（例：JavaScript は `javascript`、JSON with Comments は `jsonc`）
- 「拡張機能の設定キーが分からない」 → 設定 UI で目的の項目を見つけ、歯車 › `Copy Setting ID` で取得
