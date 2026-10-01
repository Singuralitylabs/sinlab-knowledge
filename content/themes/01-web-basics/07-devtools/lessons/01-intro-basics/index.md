---
title: "DevTools入門 基礎編"
order: 1
type: lecture
difficulty: beginner
tags: [devtools, chrome, browser, debugging]
estimatedMinutes: 18
status: published
---
# DevTools入門 基礎編

## はじめに

> [!NOTE]
> 本記事の操作手順はGoogle Chromeを基準に解説しています。Edge・Safari等でも同様の機能がありますが、メニュー名やショートカットが一部異なる場合があります。

### DevTools（開発者ツール）とは？

**DevTools（開発者ツール）** は、ブラウザに標準搭載されているWebページの検証・デバッグ用ツールです。表示中のページのHTML/CSSをその場で書き換えたり、JavaScriptを実行したり、サーバーとの通信内容を確認したりできます。

### なぜDevToolsを学ぶのか？

- **レイアウト調整のスピードが上がる**：CSSの微調整をコード修正なしにその場で試せます
- **バグ原因の特定が速くなる**：エラーメッセージやスタックトレース、通信内容を直接確認できます
- **API連携のデバッグに必須**：フロントエンドとバックエンドのどちらに問題があるかを切り分けられます
- **業界標準のスキル**：フロントエンド・バックエンドを問わず、Web開発では日常的に使用します

この記事では、日常的な開発・デバッグ業務で頻繁に使用する **「Elements」「Console」「Network」** の3つの主要パネルを中心に、基本的な操作方法を解説します。

---

## DevToolsを開く（起動方法）

Google Chrome・Edgeでは、以下の方法で起動できます。

> [!TIP]
> Safariでは、事前に「設定」→「詳細」→「Web開発者向けの機能を表示」を有効にしないと、ショートカットでも右クリックでもDevTools（Webインスペクタ）を開けません。右クリックメニューの名前も「要素の詳細を表示」になります。

| 方法 | 操作 |
|------|------|
| ショートカットキー（Windows / Linux） | `F12` または `Ctrl` + `Shift` + `I` |
| ショートカットキー（Mac） | `Cmd` + `Option` + `I` |
| 右クリックメニュー | ページ上の調べたい要素を右クリック ➔ **「検証（Inspect）」** を選択 |

DevToolsを開くと、次のようにページの横にDevToolsが並んで表示されます。

![ページの右側にDevToolsを開いたブラウザのウィンドウ](/content-assets/01-web-basics/07-devtools/images/01-devtools-window.webp)

右クリックから「検証」で開くと、クリックした要素がElementsパネルで最初から選択された状態になるため、特定の要素を調べたいときに便利です。

![ページ上で右クリックしたときのメニュー（一番下に「検証」がある）](/content-assets/01-web-basics/07-devtools/images/02-context-menu-inspect.png)

---

## Elements パネル：HTML・CSSの即時編集と検証

**Elements（要素）パネル** では、現在表示されているページのDOM構造や適用されているCSSスタイルをリアルタイムで確認・編集できます。

要素をダブルクリックするとテキストや`class`属性をその場で書き換えられ、右側の`Styles`タブではCSSプロパティの追加・変更・チェックボックスによる有効/無効の切り替えができます。

> [!TIP]
> Elementsパネルで行った変更はメモリ上のみの編集です。ページをリロードすると元の状態に戻るため、試行錯誤の実験場として安心して活用できます。

::detail{slug="elements-html-edit"}

::detail{slug="elements-css-debug"}

---

## Console パネル：JavaScript実行とログ出力

**Console（コンソール）パネル** は、JavaScriptコードの実行環境として機能するほか、エラーメッセージやデバッグ情報の確認に使用します。

コンソールに直接コードを入力して`Enter`キーを押すと、その場で実行結果（評価値）が返されます。コード内に埋め込む`console.log()`などのログ出力コマンドも、この記事で使い分け方を解説します。

```javascript
// 画面上の全h2要素を取得する例
document.querySelectorAll("h2");
```

::detail{slug="console-basics"}

---

## Network パネル：通信状況とAPIレスポンスの確認

**Network（ネットワーク）パネル** は、Webページがサーバーとやり取りしているリクエスト/レスポンスのすべての通信履歴をログとして記録・表示します。

ページ読み込み時には多数のファイル（HTML、CSS、JS、画像など）が通信されるため、フィルターを使って目的の通信を絞り込み、`Headers` `Payload` `Response` の各タブで詳細を確認します。通信速度を疑似的に遅くする「Throttle機能」を使えば、低速回線での挙動も検証できます。

::detail{slug="network-inspect"}

::detail{slug="network-throttling"}

---

## 基本操作まとめ

| パネル | 主な用途 | 覚えておきたい操作 |
|--------|----------|--------------------|
| Elements | HTML/CSSの確認・編集 | 要素をダブルクリックで編集、`:hov`で擬似状態を確認 |
| Console | JS実行・ログ確認 | `console.log()` / `console.table()`、エラーの赤字表示 |
| Network | 通信の確認 | `Fetch/XHR`フィルター、`Headers`/`Response`タブ、Throttle |
| 共通 | パネルの起動 | `F12` または右クリック→「検証」 |

---

## 実践演習：3つのパネルを行き来してみる

任意のWebページ（自分のブログやドキュメントサイトなど）を開いた状態で、以下を順番に試してみましょう。

1. **Elements**：ページ内の見出し（`h1`や`h2`）をダブルクリックしてテキストを書き換え、表示が変わることを確認する
2. **Elements**：同じ見出しの`Styles`タブで`color`プロパティを追加し、文字色が変わることを確認する
3. **Console**：`document.title` と入力して`Enter`を押し、現在のページタイトルが返ってくることを確認する
4. **Console**：`console.table(["a", "b", "c"])`を実行し、配列が表形式で表示されることを確認する
5. **Network**：`Ctrl/Cmd + R`でページをリロードし、読み込まれたファイルの一覧が表示されることを確認する
6. **Network**：フィルターで`Doc`を選び、ページ本体のHTTPステータスコードが`200`であることを確認する

すべて完了したら、ページを再読み込みして元の状態に戻しておきましょう（Elementsでの編集はリロードで自動的に元に戻ります）。

---

## まとめ

- **Elements**：HTML/CSSのその場での構造変更・スタイル試行錯誤
- **Console**：JavaScriptの即時実行、ログ解析・デバッグ
- **Network**：APIレスポンスや画像・スクリプトなどの読み込み状態・パフォーマンスの検証

これら3つのパネルを使いこなせるようになると、Web制作・開発の効率が飛躍的に向上します。まずは日常の作業でElementsとConsoleを開く習慣をつけ、通信まわりのバグに出会ったときにNetworkパネルを確認する、という流れで慣れていきましょう。

### 次のステップ

- ターミナルから`curl`でリクエストを送り、Networkパネルで見えるリクエスト内容と比べてみましょう
- 実際のプロジェクトでAPI通信のバグに遭遇したら、まずNetworkパネルでステータスコードとレスポンス内容を確認する習慣をつけましょう

### 参考リソース

- [Chrome DevTools 公式ドキュメント](https://developer.chrome.com/docs/devtools)：機能全体の公式リファレンス
- [MDN: ブラウザ開発ツールを使う](https://developer.mozilla.org/ja/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools)：DevTools全般の入門解説
- [MDN: Console API](https://developer.mozilla.org/ja/docs/Web/API/console)：`console.log`等の全メソッド一覧

---

お疲れさまでした！DevToolsを使いこなせるようになると、日々のデバッグ作業がぐっとスムーズになります。
