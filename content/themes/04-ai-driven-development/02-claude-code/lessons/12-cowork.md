---
title: "Claude Cowork"
description: "Claude Code のエージェント基盤をコーディング以外の知識労働に拡張した Claude Cowork の機能・Claude Code との関係・基本的な使い方を解説。"
order: 12
type: lecture
category: extension
difficulty: intermediate
tags: [claude-code, cowork, anthropic, agent]
estimatedMinutes: 15
status: published
---

# Claude Cowork

Claude Cowork は、Claude Code を支えているのと同じエージェント技術を、コーディング以外の知識労働――資料作成・ファイル整理・定型業務の自動化など――に拡張した Anthropic のプロダクトです。ターミナルは不要で、フォルダへのアクセスを許可し、タスクを言葉で指示するだけで、Claude が計画を立てて実行し、成果物としてまとめてくれます。

> [!NOTE]
> 本記事の内容は **2026 年 8 月時点** のものです。Claude Cowork は一般提供後も Web・モバイル版の展開が進行中であり、対応プラン・機能・提供形態は今後も変更される可能性があります。対応プランなどの最新状況は公式ドキュメントを確認してください。

## このページで学べること

- Claude Cowork とは何か、どのような経緯で提供されてきたか
- Claude Code との役割分担と、両者を横断する Dispatch の仕組み
- フォルダ共有からタスク実行・承認までの基本的な使い方
- コネクタ・プラグイン・Computer Use・プロジェクト・スケジュールタスクといった主な機能
- 業務での活用例
- 安全に使うための注意点と、現時点での制限事項

## A. Claude Cowork とは何か

Claude Cowork は、Claude Code のエージェント基盤を非エンジニア向けの知識労働に転用したプロダクトです。ユーザーがデスクトップアプリでローカルフォルダへのアクセスを許可すると、Claude はそのフォルダの中でファイルの読み取り・編集・作成を行い、複数ステップのタスクを自律的に進めます。

| 時期 | できごと |
| --- | --- |
| 2026 年 1 月 12 日 | Anthropic Labs が研究プレビューとして発表（デスクトップアプリ、macOS） |
| 2026 年 2 月 24 日 | プラグインマーケットプレイスを追加 |
| 2026 年 3 月 23 日 | Computer Use を研究プレビューとして追加（Pro / Max、macOS・Windows） |
| 2026 年 4 月 9 日 | 一般提供（GA）を開始。ロールベースのアクセス制御・グループ支出上限・OpenTelemetry 対応などエンタープライズ向け機能も同時公開 |
| 2026 年 7 月 7 日 | Web 版・モバイルアプリ（ベータ）の展開を開始。セッションの実行基盤がクラウド常駐方式に移行 |

公式の利用状況データでは、Cowork の利用の 9 割以上がコーディング以外の業務（資料作成・業務運用など）だとされています。

## B. Claude Code との関係

Claude Code と Claude Cowork は同じエージェント基盤の上に構築されていますが、対象とするタスクとインターフェースが異なります。

| 比較項目 | Claude Code | Claude Cowork |
| --- | --- | --- |
| 主な役割 | コードの実装・編集・運用 | ファイル操作・資料作成など非開発の知識労働 |
| 主な成果物 | ソースコード・コミット・PR | 資料・スプレッドシート・整理されたフォルダ・レポート |
| 想定ユーザー | エンジニア | 非エンジニアを含む幅広い職種（マーケティング・財務・PM など） |
| インターフェース | ターミナル（CLI） | デスクトップアプリ / Web / モバイル（チャットに近い UI） |
| 操作対象 | リポジトリ・コード | ローカルフォルダ・コネクタ経由の外部ツール |

この表はあくまで「どちらに最適化されているか」という役割分担であり、**Cowork がコードを扱えないという意味ではありません**。基盤が同じであるため、Cowork でもコードの編集や簡単な開発作業は実行できます。ただし、ターミナルからの操作・IDE 統合・CI 連携など開発向けの機能は Claude Code 側に集約されており、本格的な開発タスクは Claude Code で行うのが前提です。実際、前述の利用状況データが示すように、Cowork の利用の中心はコーディング以外の業務です。

両者をまたぐ仕組みが **Dispatch** です。スマートフォンからでもデスクトップからでも、ユーザーは 1 つの継続した会話スレッドとして Claude にタスクを投げられます。Claude はタスクの内容を判断し、**開発タスクは Claude Code のセッションへ、知識労働は Cowork のセッションへ自動的に振り分けます**。通勤中にスマホでタスクを依頼し、着席後にデスクトップで続きを確認する、という使い方が同じ会話の中で完結します。

## C. 基本的な使い方

デスクトップアプリでの基本的な流れは次の通りです。

```text
1. デスクトップアプリでフォルダへのアクセスを許可
       ↓
2. メッセージボックスで「Cowork」を選択し、タスクを指示
       ↓
3. Claude が実行計画を提示
       ↓
4. 承認モードに応じて実行（下表）
       ↓
5. 進捗をリアルタイムに確認・必要なら途中で介入
       ↓
6. 完成した成果物をレビュー
```

Cowork はチャットと同じメッセージボックスから起動します。タスクの実行中は、開いているファイルや使用しているツールがステップごとに表示され、途中で介入したり他の画面から進捗を確認したりできます。

実行中の承認は 3 つのモードから選べます。

| モード | 内容 |
| --- | --- |
| Manual（手動承認） | アクションごとに承認を求める |
| Auto（自動承認） | Claude が安全性を自己チェックしてから実行する。削除操作は常に確認が入る |
| Skip all（承認スキップ） | 承認なしで実行する。最もリスクが高いモード |

> [!CAUTION]
> Skip all は速度と引き換えにリスクが最も高いモードです。重要なファイルを含むフォルダや、送金・メッセージ送信などの不可逆操作を伴うタスクでは使わないでください。

## D. 主な機能

> [!NOTE]
> ローカルファイルの読み書きと Computer Use は、デスクトップアプリ上で動作する機能です。Web・モバイルのクラウドセッションからこれらを使う場合も、**デスクトップアプリを開いた状態にしておく必要**があります。

### ファイルの読み取り・編集・作成

許可したフォルダの中で、Claude が直接ファイルを読み書きします。専用の作業用フォルダを用意し、機密書類や財務データ、認証情報を含むフォルダへは広くアクセスを許可しないことが推奨されています。

### Computer Use（研究プレビュー）

2026 年 3 月 23 日に追加された機能で、Claude がデスクトップ画面を直接操作します（クリック・入力・アプリの起動・画面遷移）。コネクタ経由の連携がある場合はそちらを優先し、なければブラウザ操作、それでも難しければ画面への直接操作、という優先順位で最も確実な手段を選びます。アプリケーションごとにアクセス許可が必要で、投資・トレーディング系や暗号資産系のアプリはデフォルトでブロックされています。

### コネクタ

Slack・Gmail・Google Drive・Microsoft 365・GitHub・Linear・1Password など、多数のツールと連携できます。コネクタは Cowork に対象システムの文脈を与え、実際にアクションを起こす権限も渡します。利用できるコネクタは [claude.ai/connectors](https://claude.ai/connectors) の一覧（Connectors Directory）から確認できます。

### プラグイン

プラグインは、特定の業務向けにスキル・コネクタ・サブエージェントをひとまとめにしたパッケージです。既定では「Knowledge Work」マーケットプレイスが追加されており、Financial Services・Legal・Life Sciences など Anthropic 提供の他マーケットプレイスや、GitHub リポジトリからのプラグイン追加も可能です。プラグインには Google Drive・Gmail・Slack・DocuSign といった関連コネクタがあらかじめ組み込まれており、個別に設定し直す手間がかかりません。

### プロジェクト

「プロジェクト」は指示・コンテキスト・メモリを持つ永続的な作業スペースです。ローカルフォルダを指定するか、既存の Chat プロジェクトを取り込むか、新規に作成して使います。現時点ではデスクトップのみでローカル保存され、クラウド同期やチームでの共有はできません。

### スケジュールタスク

毎朝メールを確認する、週次で指標を集計する、といった定型業務を繰り返し自動実行できます。ユーザーが端末をオフラインにしていても、クラウドセッション上でタスクが進行します。

Claude Code 側にも同種の仕組みとして **Routines** があります。こちらはリポジトリを対象とし、スケジュールに加えて **API 呼び出しや GitHub イベント** でも起動できる点が異なります。「フォルダとコネクタに対する自動化」が Cowork のスケジュールタスク、「リポジトリに対する自動化」が Routines、という住み分けです。詳しくは [Routines とスケジュール実行](/themes/04-ai-driven-development/02-claude-code/routines) を参照してください。

## E. 活用例

- **レポートの定期作成**：週次・月次のレポートをスケジュールタスクで自動生成する
- **スプレッドシートの突合・照合**：複数のスプレッドシート間の不整合をチェックする
- **契約書の一括レビュー**：社内プレイブックと契約書を照合し、逸脱点を洗い出す
- **商談メモの分析**：営業通話の記録を横断的に分析し、傾向をまとめる
- **フォルダ整理**：散らかったファイル群を命名規則に沿って整理する
- **マーケティング資料・財務資料の作成**：既存資料や数値データをもとに資料のドラフトを作る

## F. 注意点と落とし穴

Cowork はファイルやアプリケーションに直接アクセスできる分、通常のチャットより注意すべき点が多くなります。

> [!WARNING]
> **プロンプトインジェクションのリスク**：メール・Web ページ・ドキュメントなど Claude が読み取る外部コンテンツに悪意ある指示が埋め込まれていると、それに従って意図しない操作をしてしまう可能性があります。「信頼できないコンテンツを読める」かつ「重要な操作を行う権限がある」の両方がそろったときにリスクが高まります。

> [!CAUTION]
> **Computer Use にはサンドボックスがありません**。画面を直接操作するため、スクリーンショットを通じて画面上に表示されている情報が Claude に渡ります。銀行・医療・行政などの機密性が高いアプリは Computer Use の対象から外し、確認前に機密情報を含むファイルは閉じておいてください。メモリにはパスワード・財務情報・健康情報は保存されません。

| 症状・制限 | 回避策 |
| --- | --- |
| Web / モバイルでローカルファイル・Computer Use が使えない | デスクトップアプリを開いた状態にし、クラウドセッションから利用する |
| スケジュールタスクが意図しない挙動をする | 低リスクなタスクから始め、実行履歴を定期的にレビューする。送金・メッセージ送信・不可逆操作は自動化の対象にしない |
| プロジェクトをチームで共有できない | 現状はデスクトップのローカル保存のみ。共有が必要な場合は Chat プロジェクトの活用を検討する |

Cowork が行った操作の結果（コンテンツの公開・金銭のやり取り・データの変更など）は、最終的にユーザー自身の責任になります。承認モードを Skip all にする前に、対象フォルダとタスクの範囲を必ず確認しましょう。

## まとめ

- Claude Cowork は Claude Code と同じエージェント基盤を、非開発の知識労働に拡張したプロダクト。2026 年 1 月に研究プレビュー、4 月に一般提供
- Cowork でもコードの編集は可能だが、本格的な開発タスクは Claude Code が担う役割分担。**Dispatch** が開発タスクと知識労働タスクを自動的に振り分ける
- 基本の流れは **フォルダ共有 → タスク指示 → 承認モードに応じた実行 → レビュー**
- 主な機能は **ファイル操作・Computer Use・コネクタ・プラグイン・プロジェクト・スケジュールタスク**
- 直接ファイル・アプリを操作する分、**プロンプトインジェクション**や**サンドボックスのない Computer Use** のリスクに注意し、承認モードと対象フォルダを適切に設定する

## 関連ページ

- [サブエージェント (Agents)](/themes/04-ai-driven-development/02-claude-code/agents) — Claude Code 内のサブエージェントの仕組み。Agent Teams と Cowork の位置づけを紹介
- [Routines とスケジュール実行](/themes/04-ai-driven-development/02-claude-code/routines) — Claude Code 側の定期実行・自動起動の仕組み。Cowork のスケジュールタスクとの違いを解説
- [Claude Design との連携](/themes/04-ai-driven-development/02-claude-code/claude-design) — 同じ「関連プロダクト紹介」枠の先行例
- [Get started with Claude Cowork (Claude Help Center)](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)
- [Use Claude Cowork safely (Claude Help Center)](https://support.claude.com/en/articles/13364135-use-claude-cowork-safely)
- [Use Claude Cowork on web, desktop, and mobile (Claude Help Center)](https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile)
- [Let Claude use your computer in Cowork (Claude Help Center)](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork)
- [Organize your tasks with projects in Claude Cowork (Claude Help Center)](https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork)
- [Assign tasks from anywhere in Claude Cowork (Claude Help Center)](https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork)
- [Claude Cowork (製品ページ)](https://claude.com/product/cowork)
- [Claude Cowork on web and mobile: hand off work anywhere](https://claude.com/blog/cowork-web-mobile)
