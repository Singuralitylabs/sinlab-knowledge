---
title: "Claude Design との連携"
description: "Anthropic Labs の Claude Design でデザイン・プロトタイプを作成し、Claude Code に引き継いで実装するまでのワークフローを解説。スタンドアロン版 claude.ai/design の終了（2026-12-14）と移行にも対応。"
order: 11
type: lecture
category: extension
difficulty: intermediate
tags: [claude-code, claude-design, anthropic-labs, design, prototype]
estimatedMinutes: 20
status: published
---

# Claude Design との連携

Claude Design は 2026 年 4 月に Anthropic Labs から発表されたビジュアル制作向けの AI プロダクトです。**クリック可能なインタラクティブプロトタイプ**、ワンページャー、モックアップなどを会話ベースで生成でき、完成したデザインを **Claude Code にハンドオフして実装まで一気通貫で進められる** のが特徴です。

当初は [claude.ai/design](https://claude.ai/design) の単体サイト（スタンドアロン版）として提供されていましたが、現在は **Claude の Artifact のテンプレートの 1 つ** として、普段のチャット・Artifacts タブ・Claude Code から使う形が基本になっています。

> [!IMPORTANT]
> **スタンドアロン版 [claude.ai/design](https://claude.ai/design) は 2026 年 12 月 14 日に終了します。** 終了後は読み取り専用になり、新しいプロジェクトは作れません。スタンドアロン版でデザインシステムやプロジェクトを作っている場合は、終了前に Claude へ移行してください（B 節の「スタンドアロン版からの移行」参照）。

> [!NOTE]
> 最終チェック：**2026 年 11 月**。Claude Design は提供形態の変化が速い製品です。UI・機能名・利用条件は今後も変わる可能性があるため、実際に利用する際は最新の公式ドキュメントも確認してください。なお、プレゼンテーション（スライド）作成は現在 **Claude Slides** という別のテンプレートに分かれています。

## このページで学べること

- Claude Design がカバーする領域と Claude Code との役割分担
- 利用条件・利用量の数え方と有効化の方法
- スタンドアロン版 claude.ai/design の終了と Claude への移行
- アクセスからオンボーディング・プロジェクト作成（Wireframe / High Fidelity）までの手順
- 左右 2 ペイン UI（チャット ＋ キャンバス）の基本操作
- 5 ステップで進めるデザイン制作ワークフロー
- 効果的なプロンプトの書き方
- デザインシステムをセットアップしてチームで共有する手順
- キャンバスの 4 つの編集モード（Mark up / Comments / Edit / Tweaks）とチャットの使い分け
- エクスポート形式・組織内共有と Claude Code への引き継ぎ方
- 既知の制限事項

## A. Claude Design とは何か

Claude Design は、デザイン経験のないファウンダー・PM・エンジニアでもアイデアを素早くビジュアルに落とし込めるようにすることを目的とした製品です。Claude Code が「実装」を担当するのに対し、Claude Design は「実装前のビジュアル設計」を担当します。

| 比較項目 | Claude Code | Claude Design |
| --- | --- | --- |
| 主な役割 | コードの実装・編集・運用 | デザイン・プロトタイプ・資料の作成 |
| 主な成果物 | ソースコード・コミット・PR | インタラクティブプロトタイプ・画面モック・ワンページャー |
| 利用シーン | 実装・リファクタ・デバッグ | アイデア共有・要件すり合わせ・社内資料 |
| ハンドオフ | Claude Design からバンドルを受け取る | Claude Code へのエクスポートが可能 |

## B. 利用条件とスタンドアロン版からの移行

### 利用できるプラン

Claude Design は Artifact のテンプレートの 1 つで、**Free・Pro・Max・Ultra・Team・Enterprise のすべてのプラン** で利用できます。チャット・Artifacts タブ・Claude Code・モバイルアプリなど複数の入口から開けます（C 節）。

Team / Enterprise では、組織の設定で有効・無効を切り替えられます。

- **Team プラン**：既定でオンです。
- **Enterprise プラン**：2026 年 10 月 15 日から既定でオンになりました（オーナーが無効にしている場合を除く）。
- 設定場所は 2 つあり、それぞれ独立しています。Artifact のテンプレートとしての Claude Design は **Organization settings > Artifacts**、スタンドアロン版 [claude.ai/design](https://claude.ai/design) は **Organization settings > Claude Design** です。片方を有効にしても、もう片方は有効になりません。

### 利用量の数え方

Claude Design の利用量は **チャットや Claude Code と同じ、プラン共通の利用上限** にカウントされます。Claude Design 専用の枠はありません。上限に達すると、リセットされるまで Claude Design も使えなくなります。[usage credits](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans) を有効にしていれば、上限を超えても作業を続けられます。大きなコードベースを読み込むプロジェクトや反復回数が多いプロジェクトほど、多く消費します。

> [!NOTE]
> 以前の Claude Design には、他の利用量とは別の週次枠がありました。現在はすべてプラン共通の上限に合算されています。

### スタンドアロン版からの移行

スタンドアロン版 [claude.ai/design](https://claude.ai/design) は **2026 年 12 月 14 日に終了** し、それ以降は読み取り専用になります。スタンドアロン版を使っていた場合は、次の対応が必要です。

| 対象 | やること |
| --- | --- |
| デザインシステム | Claude の **Artifacts** ページのバナー（「Move team design systems」）から移行する。1 回の移行で組織内のデザインシステムがまとめて移り、誰が実行してもよい |
| プロジェクト | スタンドアロン版でプロジェクトを開き、表示される案内から Claude へ移す（**プロジェクトのオーナーのみ**。有料プランから順次展開中）。移したプロジェクトは Artifact になり、スタンドアロン版の側は読み取り専用になる |
| チャット・コメント | Claude へは移らない。スタンドアロン版の終了までは元のプロジェクトで読める |

> [!WARNING]
> ゼロデータ保持（ZDR）の組織はプロジェクトを移行できません。HIPAA 対応構成の組織も現時点では移行できません。必要なプロジェクトは終了前に .zip でダウンロードしておきましょう。詳しくは公式の [Move from standalone Claude Design to Claude](https://support.claude.com/en/articles/17440474-move-from-standalone-claude-design-to-claude) を参照してください。

### ハンドオフバンドル

Claude Code へのハンドオフ時は **ハンドオフバンドル** に構造・コンポーネント・デザイントークン・実装指示がまとまるため、Claude Code がデザイン意図を解釈しやすくなります（I 節）。

## C. 使い始める：アクセスとオンボーディング

### アクセスの入り口

次のいずれかでアクセスします。

- **会話の中**：「この提案書からワンページャーを作って」のように頼むと、会話の横にデザインが作られます。メッセージ欄で **Output > Design** を選ぶこともできます。
- **Artifacts タブ**：Design のテンプレートを選んで始めます。
- **Claude Code**：アイデアをデザインにするよう頼むか、`/design` コマンドで作成・編集・同期します（I 節参照）。
- **iOS / Android の Claude アプリ**：会話でデザインを頼み、Artifacts タブで全画面表示・編集できます（共有設定の変更は Web かデスクトップで行います）。
- **スタンドアロン版 [claude.ai/design](https://claude.ai/design)**：**2026 年 12 月 14 日に終了** します。新しく始める場合は上の入口を使いましょう。

> [!NOTE]
> 本ページのスクリーンショットは、スタンドアロン版 claude.ai/design で撮影したものです。Claude の Artifact として開いた場合は、画面の配置やボタンの名称が異なることがあります。

![Claude Design のホーム画面（スタンドアロン版）。ステータスバッジ、Recent / Your designs / Examples / Design systems タブ、左に新規プロトタイプ作成パネルが表示されている](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/FirstPage.png)

### 最初にやること

組織のデザインシステムが用意されていれば、新しく作るデザインには自動でブランドの色・フォント・コンポーネントが使われるため、すぐに作業を始められます（E 節参照）。デザインシステムがまだない場合は、先に G 節の手順で用意しておくと、以降のアウトプットが安定します。

### プロジェクト作成時の忠実度（Wireframe / High Fidelity）

スタンドアロン版でプロトタイプのプロジェクトを作成するときは、プロジェクト名・デザインシステムのほかに **忠実度（fidelity）** を Wireframe / High Fidelity から選びます。生成されるデザインの作り込み度が変わります。

![新規プロトタイプ作成ダイアログ。Project name 入力欄、Design system の選択、Wireframe と High fidelity の 2 択（Wireframe が選択中）、Create ボタンが並ぶ](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/CreateNewPrototype.png)

| | **Wireframe** | **High Fidelity** |
| --- | --- | --- |
| 目的 | アイデア・構造・レイアウトを素早く探索する | 本番に近い、作り込まれたデザインを得る |
| 仕上がり | ラフで低忠実度。スピード重視 | デザインシステムを適用した、実際のブランド資産を使う完成度の高いモックアップ |
| インタラクション | 構造の確認が中心 | クリック可能なインタラクティブ要素を含む |
| 向くフェーズ | 初期の発散・たたき台づくり | 要件が固まった後の仕上げ・共有・実装前 |

- **二者択一ではなく連続的** です。Wireframe で始めても、会話を重ねてそのまま High Fidelity に育てられます。
- どちらを選んでも、**設定済みのデザインシステムはコンテキストに含まれます**（High Fidelity の方がより忠実に反映されます）。

> [!TIP]
> まだ方向が定まっていないなら **Wireframe** で速く回し、固まってきたら **High Fidelity** に切り替えるのがおすすめです。最初から本番に近い見た目が欲しい場合は High Fidelity から始めます。

## D. 画面構成と基本操作

Claude Design の UI は **左にチャット、右にキャンバス** の 2 ペイン構成です。

![Claude Design の編集画面。左に「Start with context」のコンテキスト追加パネル、右のキャンバスに生成された LP のデザインが表示されている](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/ClaudeDesignUI.png)

模式的に表すと次の通りです。

```text
┌──────────────────────┬──────────────────────────┐
│  Chat (左)            │  Canvas (右)              │
│                       │                           │
│  ・要件を自然言語で記述 │  ・生成されたデザイン     │
│  ・「もっと余白を…」   │  ・要素をクリックで編集   │
│  ・素材のアップロード  │  ・スライダーで微調整     │
│                       │                           │
└──────────────────────┴──────────────────────────┘
                              └─ 右上に [Share] ボタン
```

操作の使い分けは次の通りです。

| やりたいこと | 操作場所 |
| --- | --- |
| 全体方針を変える（トーン・構成・追加機能） | 左のチャット |
| 個別要素をピンポイントで修正 | 右のキャンバス上の要素をクリック |
| 素材を渡す（画像・PPTX・PDF・DOCX・XLSX・コードベース） | 左のチャットに添付 |
| 共有・エクスポート | 右上の [Share] ボタン |

## E. ワークフロー：5 ステップで進める

公式ドキュメントが推奨する基本フローを、5 ステップに整理すると次のとおりです。

```text
1. 作成（会話・Artifacts タブから始め、デザインシステムを付ける）
       ↓
2. コンテキスト追加（素材・参照・既存デザイン）
       ↓
3. 要件を記述（最初は核となるレイアウトだけ）
       ↓
4. レビュー（チャットで全体、キャンバスで個別）
       ↓
5. 反復 → 5 が固まったらエクスポート
```

### ステップ別のコツ

- **1. 作成**：会話や Artifacts タブから始めます。組織の既定のデザインシステムが自動で適用され、別のデザインシステムを付けることもできます。
- **2. コンテキスト追加**：競合プロダクトのスクリーンショット、既存 LP の URL、社内 PPTX / DOCX / XLSX、**Web キャプチャ**（既存サイトから要素を取り込む）などを最初にまとめて渡すと、トーンと文脈が安定します。
- **3. 要件記述**：いきなり全機能を盛り込まず、**まず骨格だけ** を作るのが鉄則です（後述のプロンプトのコツ参照）。
- **4. レビュー**：「コントラスト比」「情報階層」「アクセシビリティ」も Claude にレビューさせられます。
- **5. 反復**：チャットで大枠を変える → キャンバスで細部を直す、の順で回します。

## F. 良いプロンプトの書き方

公式は「**目標・レイアウト・コンテンツ・対象ユーザー**」の 4 点を含めることを推奨しています。

| 要素 | 例 |
| --- | --- |
| 目標 (Goal) | 何のためのデザインか（例：SaaS の料金ページ） |
| レイアウト (Layout) | どう配置するか（例：3 プラン横並び、上部に CTA） |
| コンテンツ (Content) | 表示する情報（例：プラン名・価格・主要機能 5 件） |
| 対象ユーザー (Audience) | 誰が見るか（例：スタートアップの技術責任者） |

### Bad / Good 例

```text
✗ Bad:  「かっこいい料金ページを作って」
✓ Good: 「スタートアップの CTO 向けに、SaaS の料金ページを作ってください。
        3 プラン横並びで、上部に CTA を 1 つ。各プランにはプラン名・
        月額・年額・主要機能 5 件・推奨バッジを表示してください。」
```

### 段階的に複雑さを足す

最初に骨格を作り、あとから次のような順序でレイヤーを重ねます。

```text
コアレイアウト → コンテンツ → インタラクション → エッジケース → 仕上げ
```

> [!TIP]
> 「ボタンの padding を 16px に」「primary 色を 1 段階濃く」のように **定量・具体** な指示は通りやすく、「もっとモダンに」のような抽象指示は当たり外れが大きくなります。抽象指示はスライダーや候補生成と組み合わせると効果的です。

## G. デザインシステムをセットアップする

組織のブランドに揃えたアウトプットを得るための、いちばん重要な準備です。デザインシステムは Pro・Max・Ultra・Team・Enterprise プランで使え（公式は beta 扱い）、Pro・Max・Ultra・Team では既定でオン、Enterprise ではオーナーが **Organization settings > Artifacts** で有効にする必要があります。

### Claude の中で作る

現在の作り方は次の 2 通りです。

| 方法 | 向いているもの |
| --- | --- |
| **チャットで頼む** | 接続済みのアプリ・アップロードしたファイル・Figma ファイル・スライド・ロゴ・フォントから作る。フォントや色、ガイドラインが中心のブランド向け |
| **Claude Code の `/design-sync`** | React コンポーネントなど、コードとして存在するデザインシステムのトークンとコンポーネントを直接読み込む。プロダクトのデザインシステム向け |

作ったデザインシステムは **Settings > Capabilities** の Design systems の「Manage」から管理します。スタンドアロン版で作ったものは、B 節の手順で Claude へ移行できます（移行後、各デザインシステムに表示されるバナーの「Let Claude clean it up」で整理させられます）。

### スタンドアロン版でのセットアップ手順

以下はスタンドアロン版 claude.ai/design での手順です。**スタンドアロン版は 2026 年 12 月 14 日に終了** するため、新しく作る場合は上の「Claude の中で作る」方法を使ってください。

```text
1. Claude Design を開く
       ↓
2. 左下のプロジェクトピッカーで組織を選択 or 新規作成
       ↓
3. オンボーディングフローを完了する
       ↓
4. 素材をアップロード（後述）
       ↓
5. 抽出された色・タイポ・コンポーネントを確認
       ↓
6. テストプロジェクトで検証
       ↓
7. 問題なければ [Published] トグルをオン
       ↓
8. 以降、組織内の全プロジェクトに自動適用
```

### セットアップ画面で入力する項目

「Set up your design system」画面では、会社・プロダクトの説明とブランド素材を渡します。素材はすべて任意で、渡せるものだけ渡せば構いません。

![「Set up your design system」のセットアップフォーム。会社概要のテキスト欄、GitHub リポジトリのリンク、ローカルフォルダのアップロード、.fig ファイルのアップロード、フォント・ロゴ・アセットの追加、補足メモ欄が並ぶ](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/DesignSystemsSettings.png)

| 入力欄 | 内容 |
| --- | --- |
| Company name and blurb | 会社・プロダクトの概要をテキストで（デザインシステムの名前にもなる） |
| Link code on GitHub | GitHub リポジトリの URL を指定 |
| Link code from your computer | ローカルのフォルダをドラッグ（全体ではなく選択ファイルをコピー。大規模なら frontend 中心のサブフォルダ推奨） |
| Upload a .fig file | Figma ファイル（ブラウザ内でローカル解析され、アップロードはされない） |
| Add fonts, logos and assets | フォント・ロゴ・アセットをドラッグ |
| Any other notes | 「角丸を多用」「ブランドボイスは遊び心がありつつプロフェッショナル」などの補足 |

抽出されたシステムには **カラーパレット・タイポグラフィ・コンポーネント・レイアウトパターン** が含まれ、以降のプロジェクトで自動的に使われます。

### デザインシステムの一覧と公開

スタンドアロン版では、作成したデザインシステムを「Design systems」タブで一覧管理します。各システムには **Published トグル** があり、オンにすると組織内の全プロジェクトに適用されます。`Make default` で既定システムも指定できます。

![Design systems タブの一覧画面。複数のデザインシステムが並び、それぞれに Published トグルと Make default ボタンが表示されている](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/DesignSystems.png)

> [!TIP]
> いきなり全社展開する前に、必ず **テストプロジェクトで 1 つ作って検証** してから Published をオンにしましょう。意図しない色やフォントが拾われていることがあります。上の画面のように 1 組織で **複数のデザインシステム**（ブランドやサブチームごと）を持つこともできます。

## H. デザインを反復改善する

### チャット（左ペイン）でやること

大きな方針変更や追加要求はチャットに書きます。

```text
「全体のトーンをもっとプロフェッショナルに」
「ヒーロー部分に動画プレースホルダを追加して」
「アクセシビリティの観点でレビューしてください」
```

### キャンバス（右ペイン）の 4 つの編集モード

キャンバス右上には編集モードを切り替える 4 つのボタンがあります。大きく **「AI に依頼する系」** と **「自分で直接いじる系」** に分かれます。

![キャンバス右上のツールバー。Mark up (M)、Edit (E)、Hide tweaks、Comments (C) のモードボタンと、Present・Share ボタンが並ぶ](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/FourCanvasButtons.png)

| ボタン（ショートカット） | 系統 | できること |
| --- | --- | --- |
| **Mark up**（M） | AI に依頼 | キャンバスに直接スケッチ・手描き注釈を描き込み、視覚的に修正を指示する。複数箇所をキューに溜めてまとめて送れる |
| **Comments**（C） | AI に依頼 | 要素をクリックしてコメントとして指示文（例：「全ページから削除」）を残す。各コメントの「Select for Send to Claude」をチェックして複数まとめてバッチ送信できる |
| **Edit**（E） | 自分でいじる | 要素を直接クリックして、テキスト・位置・サイズ・色・スタイルを手動で調整する（Claude を介さない）。要素のドラッグ・リサイズ・整列といった直接編集（Direct Canvas Editing）にも対応している |
| **Tweaks**（Show / Hide tweaks トグル） | 自分でいじる | Claude が背景プリセット（Plain / Grid / Dark Mode）・アクセントカラー・余白・アニメーション速度などのスライダーやカラーピッカーを埋め込む。ドラッグするとキャンバスがライブ更新される |

> [!NOTE]
> ツールバーには上記 4 つに加えて、プレビュー表示用の **Present** と、共有・エクスポートの **Share**（I 節）も並びます。Tweaks は表示中だと「Hide tweaks」、非表示だと「Show tweaks」と表示が切り替わるトグルです。

### モードの使い分け

- **Mark up と Comments はどちらも「Claude に修正を依頼する」モード** で、入力方法が違います。
  - **Mark up**：図で示す（線・囲み・矢印）→ 言葉で位置を説明しづらいレイアウト変更に向く
  - **Comments**：文章で示す（要素にピン留め）→ 「この見出しを短く」など言語化しやすい変更に向く
- **Edit と Tweaks は自分で直接いじる** モードで、Claude への往復が発生しません。
  - **Edit**：完全手動（任意の値に直接変更）
  - **Tweaks**：Claude が用意した範囲内（スライダー・プリセット）での微調整

> [!TIP]
> ざっくり **Mark up / Comments = AI に頼む系、Edit / Tweaks = 自分で動かす系** と捉えると整理しやすいです。大枠の変更はチャットや Mark up、細部の仕上げは Edit / Tweaks、と組み合わせると効率的です。

> [!WARNING]
> **既知の不具合**：インラインコメントが Claude に読まれる前に消えることがあります。重要な指示はキャンバスで書いたあとに **同じ内容をチャットに貼り直す** と確実です。

## I. 共有・エクスポートと Claude Code へのハンドオフ

キャンバス右上の **[Share] ボタン**（以前は Export という名称でした）から、共有・エクスポート・ハンドオフをまとめて選べます。用途に応じて以下を選びます。

![Share メニューの展開状態。アクセス権（Teammates can comment）と Copy link、Duplicate project、Download project as .zip、Export as PDF / PPTX / standalone HTML、Send to Canva、Handoff to Claude Code の項目が並ぶ](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/ShareMenu.png)

| 形式 | 用途 |
| --- | --- |
| PDF | 顧客提案・印刷物・ステークホルダー向けレビュー |
| PPTX | 社内プレゼン・登壇資料 |
| Google Slides | Google スライドでの共同編集 |
| HTML | LP プレビュー・実機での確認 |
| ZIP | コード化の起点として手元で扱う |
| Canva | デザイナーによる仕上げ・チーム編集 |
| **Handoff to Claude Code** | ハンドオフバンドルで実装に進む（経路は下表） |

> [!NOTE]
> Canva に加えて、**Adobe・Base44・Gamma・HubSpot・Lovable・Miro・Netlify・Replit・v0・Vercel・Wix** などの外部サービスへ直接送れます。連携先は今後変わる可能性があります。

実装への引き継ぎは、[Share] メニューの **「Handoff to Claude Code…」** を選ぶと、続けて次の経路を選べます。

| 経路 | 向いている場面 |
| --- | --- |
| Send to local coding agent | ローカルの Claude Code に渡す |
| Send to Claude Code Web | [claude.ai/code](https://claude.ai/code) 上のセッションに渡す |

### 組織内での共有

デザインは最初は自分だけが見られる状態で作られます。「Share」から共有相手と権限（閲覧 / コメント / 編集）を選ぶと、ステークホルダーにレビューしてもらえます。実装前のすり合わせに使います。

### Claude Code へのハンドオフ

上記のいずれかを選ぶと、デザインを再現するために必要な情報がまとまった **ハンドオフバンドル** が生成されます。

```text
[Claude Design] Share → Claude Code（いずれかの経路）
       │
       ├─ ハンドオフバンドル（構造・コンポーネント・
       │   デザイントークン・実装指示）
       │
       ▼
[Claude Code] 単一プロンプトとして受け取り
       │
       └─ 既存コードベースの規約に沿って実装
```

このフローで、次の摩擦が大きく減ります。

- Figma → コードの手動トレース
- デザイン仕様の読み解きコスト
- デザインシステムからの逸脱

> [!TIP]
> ハンドオフを前提にするなら、Claude Design 側でデザインシステムを先に整備しておきましょう。Claude Code 側の実装でも同じコンポーネントが再利用され、PR の差分が最小化されます。

### デザインとコードの双方向同期

Claude Design と Claude Code は **双方向に同期** できます。ハンドオフは「スクリーンショットを見て一から作り直す」のではなく、**既存の作業を引き継いで続きから実装する** 方式です。

- Claude Code 側で `/design-sync` を実行すると、リポジトリ（既存コードベース）のデザインシステムを Claude Design に取り込めます（プロトタイプを既存コンポーネントから組み立てられる）。
- `/design` コマンドを使うと、ターミナルを離れずにデザインプロジェクトの作成・編集・同期ができます。デザインをコードベースに取り込んだり、逆にコードを生きたプロトタイプに変換したりできます。

デザイン → コード、コード → デザインのどちらに動いても作業が同期され続けるため、「実装が先行してデザインと乖離する」従来の問題が起きにくくなります。

## J. 既知の問題と落とし穴

公式ドキュメントには、次の制限事項が挙げられています。

| 症状・制限 | 回避策 |
| --- | --- |
| インラインコメントがページ上に表示されないことがある | コメントビューを開けば確認できる。Claude に拾われない場合はチャットに同じ内容を貼り直す |
| 大規模コードベースのリンク時にラグやブラウザの不調 | 大きなリポジトリは Claude Code から `/design-sync` で取り込む |
| チャットの上流エラー（chat upstream error） | 同じプロジェクト内で新しいチャットタブを開く |
| 複数人の同時編集がまだ基本的な機能のみ | 同時に編集する人数を絞る |
| バージョン履歴がない | 「今の状態を保存して別案を試して」と Claude に頼み、途中の版を残す |
| モバイルアプリで共有設定を変更できない | Web かデスクトップで変更する |

本番プロダクトの納品物として依存させる前に、エクスポート結果と Claude Code 側の実装品質を **小さなプロジェクトで検証** することをおすすめします。

## まとめ

- Claude Design は「実装前のビジュアル設計」を担当する Anthropic Labs の新製品（**インタラクティブプロトタイプ**含む）
- **Free を含む全プラン** で利用でき、入口は **会話・Artifacts タブ・Claude Code の `/design`・モバイルアプリ** など複数。UI は **左チャット + 右キャンバス**
- スタンドアロン版 **claude.ai/design は 2026-12-14 に終了**。デザインシステムとプロジェクトは終了前に Claude へ移行する
- 利用量は **チャット・Claude Code と共通のプラン上限** に合算（専用枠はなし。usage credits で継続可能）
- 推奨ワークフローは **作成 → コンテキスト → 要件 → レビュー → 反復** の 5 ステップ
- プロンプトは **目標・レイアウト・コンテンツ・対象ユーザー** を含めて段階的に複雑さを足す
- デザインシステムはチャットか Claude Code の `/design-sync` で作り、組織の既定にすると新しいデザインに自動適用（複数システムも可）
- エクスポートから **Claude Code へのハンドオフ**（ローカル / Web 経由含む）で実装まで一気通貫。`/design-sync`・`/design` によるデザイン⇔コードの双方向同期に対応
- 既知の制限事項（コメント表示・同時編集・バージョン履歴など）に留意して小規模検証から始める

## 関連リソース

- [Get started with Claude Design (Claude Help Center)](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)
- [Set up your design system in Claude Design (Claude Help Center)](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)
- [Manage usage credits for paid Claude plans (Claude Help Center)](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans)
- [Claude Design admin guide for Team and Enterprise plans (Claude Help Center)](https://support.claude.com/en/articles/14604406-claude-design-admin-guide-for-team-and-enterprise-plans)
- [Move from standalone Claude Design to Claude (Claude Help Center)](https://support.claude.com/en/articles/17440474-move-from-standalone-claude-design-to-claude)
- [Artifacts admin guide for Team and Enterprise plans (Claude Help Center)](https://support.claude.com/en/articles/16994751-artifacts-admin-guide-for-team-and-enterprise-plans)
- [Introducing Claude Design by Anthropic Labs](https://www.anthropic.com/news/claude-design-anthropic-labs)
