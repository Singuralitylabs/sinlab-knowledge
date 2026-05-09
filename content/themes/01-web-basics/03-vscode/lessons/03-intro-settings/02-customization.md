---
title: "テーマとキーバインドのカスタマイズ"
order: 2
type: detail
difficulty: beginner
tags: [vscode, settings, reference]
estimatedMinutes: 6
status: published
---
# テーマとキーバインドのカスタマイズ

## 解説

VS Code の見た目（テーマ）と入力（キーバインド）は **個人の好みに合わせて自由に変えられます**。生産性に直結するわけではないですが、長く使うほど自分用に調整しておく方が快適です。

ここでは「最低限知っておくと便利な切替方法」だけを扱います。

---

## テーマ

VS Code の見た目は **3 種類のテーマ** で構成され、それぞれ独立に切り替えられます。

| 種類 | 何を変えるか | 設定キー |
|------|-------------|----------|
| **カラーテーマ** | エディタの構文色、UI 全体の配色 | `workbench.colorTheme` |
| **ファイルアイコンテーマ** | エクスプローラーや編集タブのファイルアイコン | `workbench.iconTheme` |
| **Product Icon テーマ** | アクティビティバーやメニューなどの UI アイコン | `workbench.productIconTheme` |

カラーテーマだけ変えてもアイコンは変わりません。逆もまた然りです。

### 切替方法

| 種類 | 操作 |
|------|------|
| カラーテーマ | `Cmd + K, Cmd + T` / `Ctrl + K, Ctrl + T` |
| ファイルアイコン | コマンド `Preferences: File Icon Theme` |
| Product Icon | コマンド `Preferences: Product Icon Theme` |

候補リストを `↑` `↓` で動かすと **その場でプレビュー** されます。Enter で確定、Esc で元のテーマに戻ります。実際に試して肌に合うものを選ぶのが一番早く、Marketplace で `@category:themes` を検索すれば外部テーマを大量に追加できます。

### OS の外観に追従させる

OS のライト / ダーク切替に合わせて自動で変えるには、次の 3 設定を組み合わせます。

```jsonc
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredDarkColorTheme": "Default Dark Modern",
  "workbench.preferredLightColorTheme": "Default Light Modern",
  // ハイコントラスト環境を併用する場合
  "workbench.preferredHighContrastColorTheme": "Default High Contrast",
  "workbench.preferredHighContrastLightColorTheme": "Default High Contrast Light"
}
```

OS が「外観：ダーク」のときは `preferredDarkColorTheme`、「ライト」のときは `preferredLightColorTheme` が自動適用されます。OS のハイコントラストモードに追従させたい場合は `preferredHighContrastColorTheme` / `preferredHighContrastLightColorTheme` も併せて指定します。

---

## キーバインド

VS Code のすべての操作は内部で **コマンド ID** に紐付いており、そこへ任意のキーを割り当てられます。標準のショートカットを変更したり、頻用のコマンドに新しいキーを追加したりできます。

### キーバインドエディタを開く

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| キーバインドエディタを開く | `Cmd + K, Cmd + S` | `Ctrl + K, Ctrl + S` |
| `keybindings.json` を直接開く | コマンド `Preferences: Open Keyboard Shortcuts (JSON)` | 同左 |

### Record Keys（キーから逆引き）

検索バー右の **キーボードアイコン** をクリックして「Record Keys」モードに入り、知りたいショートカットを実際に押すと、そのキーに割り当てられた **すべてのコマンド** が一覧されます。

「うっかり押してしまった謎のショートカット」を特定する一番速い方法で、知らないとなかなか辿り着けない隠れ機能です（モード解除は同じキーボードアイコンをもう一度クリック、または `Esc`）。

### `keybindings.json` の最小例

```jsonc
[
  {
    "key": "cmd+k cmd+f",
    "command": "editor.action.formatDocument",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "cmd+shift+p",
    "command": "-workbench.action.showCommands"
  }
]
```

| キー | 意味 |
|------|------|
| `key` | 割り当てるキー。`+` で同時押し、空白区切りで **連続押し**（chord） |
| `command` | 実行するコマンド ID |
| `when` | このキーが有効になる文脈条件 |

**`-` プレフィックス** を `command` の先頭に付けると、その既定割り当てを **無効化** できます。「まず `-` で外してから別コマンドに割り当てる」というパターンを覚えておくと衝突を避けられます。

`when` 句の網羅的な一覧は[公式の when 句リファレンス](https://code.visualstudio.com/api/references/when-clause-contexts)を参照してください。

---

## ありがちなつまずき

- 「アイコンが変わらない」 → カラーテーマとアイコンテーマは別物。`Preferences: File Icon Theme` で選び直す
- 「自動切替が効かない」 → `window.autoDetectColorScheme` を `true` にしているか、OS 側の外観モード切替が動作しているか確認
- 「日本語キーボードで一部のキーが動かない」 → `[`、`]`、`\`、`@` などは US 配列を前提にした記法と物理キー位置がずれることがある。実際にキーボードアイコン（Recording Keys）で何が認識されるか確認
