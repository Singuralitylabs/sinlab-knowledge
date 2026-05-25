---
title: "Claude Design との連携"
description: "Anthropic Labs の Claude Design でデザイン・プロトタイプ・スライドを作成し、Claude Code に引き継いで実装するまでのワークフローを解説。"
order: 11
type: lecture
category: extension
difficulty: intermediate
tags: [claude-code, claude-design, anthropic-labs, design, prototype]
estimatedMinutes: 20
status: draft
---

# Claude Design との連携

Claude Design は 2026 年 4 月に Anthropic Labs から発表されたビジュアル制作向けの AI プロダクトです。**クリック可能なインタラクティブプロトタイプ**、スライド、ワンページャー、モックアップなどを会話ベースで生成でき、完成したデザインを **Claude Code にハンドオフして実装まで一気通貫で進められる** のが特徴です。

> [!NOTE]
> 本記事の内容は **2026 年 5 月時点** のものです。Claude Design は research preview（段階的ロールアウト）であり、UI・機能名・料金・利用枠は今後変更される可能性があります。実際に利用する際は最新の公式ドキュメントを併せて確認してください。

## このページで学べること

- Claude Design がカバーする領域と Claude Code との役割分担
- 利用できるプラン・モデル・利用枠と有効化の方法
- アクセスからオンボーディング・プロジェクト作成（Wireframe / High Fidelity）までの手順
- 左右 2 ペイン UI（チャット ＋ キャンバス）の基本操作
- 5 ステップで進めるデザイン制作ワークフロー
- 効果的なプロンプトの書き方
- デザインシステムをセットアップしてチームで共有する手順
- キャンバスの 4 つの編集モード（Mark up / Comments / Edit / Tweaks）とチャットの使い分け
- エクスポート形式・組織内共有と Claude Code への引き継ぎ方
- Research preview としての制限・既知の不具合

## A. Claude Design とは何か

Claude Design は、デザイン経験のないファウンダー・PM・エンジニアでもアイデアを素早くビジュアルに落とし込めるようにすることを目的とした製品です。Claude Code が「実装」を担当するのに対し、Claude Design は「実装前のビジュアル設計」を担当します。

| 比較項目 | Claude Code | Claude Design |
| --- | --- | --- |
| 主な役割 | コードの実装・編集・運用 | デザイン・プロトタイプ・資料の作成 |
| 主な成果物 | ソースコード・コミット・PR | インタラクティブプロトタイプ・画面モック・スライド・ワンページャー |
| 利用シーン | 実装・リファクタ・デバッグ | アイデア共有・要件すり合わせ・社内資料 |
| ハンドオフ | Claude Design からバンドルを受け取る | Claude Code へのエクスポートが可能 |

## B. 利用できるプランとモデル

Claude Design は **Claude Pro / Max / Team / Enterprise** で利用できます。現在は [claude.ai/design](https://claude.ai/design) からブラウザで利用します（デスクトップの Claude Code アプリとは別の画面です）。

Enterprise はデフォルトで無効化されています。Team / Enterprise ともに、管理者は **Organization settings > Capabilities** から有効化できます。

| プラン | 利用可否 | 備考 |
| --- | --- | --- |
| Free | 不可 | — |
| Pro / Max | 可 | 個人で利用可能 |
| Team | 可 | チームで共有可能。管理者が Capabilities でオン/オフ可能 |
| Enterprise | 可（要管理者有効化） | デフォルト OFF。Capabilities からオン |

利用量は **チャットや Claude Code とは別メーター** です。プランごとに週次の枠があり、枯渇時は [Extra usage](https://support.claude.com/en/articles/12429409-manage-extra-usage-for-paid-claude-plans) で追加できます（詳細は公式の利用量・料金ページを参照）。

バックエンドは **Claude Opus 4.7** です。ハンドオフ時は **ハンドオフバンドル** に構造・コンポーネント・デザイントークン・実装指示がまとまるため、Claude Code がデザイン意図を解釈しやすくなります（Claude Code 側のモデルは Sonnet / Opus など切り替え可能）。

> [!WARNING]
> 本記事執筆時点で Claude Design は **research preview**（段階的ロールアウト）です。機能・UI・料金は変更される可能性があります。実運用に組み込む前に最新の公式ドキュメントを確認してください。

## C. 使い始める：アクセスとオンボーディング

### アクセスの入り口

ブラウザから次のいずれかでアクセスします。

- 直接 URL：[claude.ai/design](https://claude.ai/design)
- Claude.ai にログインし、アプリメニューから「Claude Design」を選択

![Claude Design のホーム画面。Research Preview バッジ、Recent / Your designs / Examples / Design systems タブ、左に新規プロトタイプ作成パネルが表示されている](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/FirstPage.png)

### オンボーディングの流れ

初回起動時に、用途に応じた質問（役割の選択など）が表示されることがあります。UI は変更されうるため、ここでは公式ドキュメントで確実な流れだけ整理します。

**組織のデザインシステムを初めて整える場合**（G 節）は、次の順序がオンボーディングの中心です。

1. 左下のプロジェクトピッカーで組織を選択 or 新規作成
2. オンボーディングフローでブランド素材をアップロード
3. 抽出された色・タイポ・コンポーネントを確認
4. テストプロジェクトで検証し、問題なければ [Published] をオン

デザインシステムが既に Published 済みなら、プロジェクト作成からすぐ作業を始められます（E 節参照）。

### プロジェクト作成時の忠実度（Wireframe / High Fidelity）

プロトタイプのプロジェクトを作成するとき、プロジェクト名・デザインシステムのほかに **忠実度（fidelity）** を Wireframe / High Fidelity から選びます。生成されるデザインの作り込み度が変わります。

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

公式ドキュメントが推奨する基本フローは次の 5 ステップです。

```text
1. プロジェクト作成
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

- **1. プロジェクト作成**：左下のプロジェクトピッカーで組織を選んでから新規作成。組織のデザインシステム（公開済み）が自動で適用されます。
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

組織のブランドに揃えたアウトプットを得るための、いちばん重要な準備です。

### セットアップ手順

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

作成したデザインシステムは「Design systems」タブで一覧管理します。各システムには **Published トグル** があり、オンにすると組織内の全プロジェクトに適用されます。`Make default` で既定システムも指定できます。

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
| **Edit**（E） | 自分でいじる | 要素を直接クリックして、テキスト・位置・サイズ・色・スタイルを手動で調整する（Claude を介さない） |
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

キャンバス右上の **[Share] ボタン**（2026 年 5 月時点。以前は Export という名称でした）から、共有・エクスポート・ハンドオフをまとめて選べます。用途に応じて以下を選びます。

![Share メニューの展開状態。アクセス権（Teammates can comment）と Copy link、Duplicate project、Download project as .zip、Export as PDF / PPTX / standalone HTML、Send to Canva、Handoff to Claude Code の項目が並ぶ](/content-assets/04-ai-driven-development/02-claude-code/images/claude-design/ShareMenu.png)

| 形式 | 用途 |
| --- | --- |
| PDF | 顧客提案・印刷物・ステークホルダー向けレビュー |
| PPTX | 社内プレゼン・登壇資料 |
| HTML | LP プレビュー・実機での確認 |
| ZIP | コード化の起点として手元で扱う |
| Canva | デザイナーによる仕上げ・チーム編集 |
| **Handoff to Claude Code** | ハンドオフバンドルで実装に進む（経路は下表） |

実装への引き継ぎは、[Share] メニューの **「Handoff to Claude Code…」** を選ぶと、続けて次の経路を選べます。

| 経路 | 向いている場面 |
| --- | --- |
| Send to local coding agent | ローカルの Claude Code に渡す |
| Send to Claude Code Web | [claude.ai/code](https://claude.ai/code) 上のセッションに渡す |

### 組織内での共有

エクスポート以外に、組織内の **共有リンク**（閲覧のみ / コメント / 編集）でステークホルダーにレビューしてもらえます。実装前のすり合わせに使います。

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

## J. 既知の問題と落とし穴

Research preview のため、執筆時点で次の問題が報告されています。

| 症状 | 回避策 |
| --- | --- |
| インラインコメントが消える | チャットに同じ内容を貼り直す |
| コンパクトビューで保存エラー | ビューを標準に戻してから保存 |
| 大規模コードベースのリンク時にラグ | 必要な範囲だけスコープを絞る |
| チャットの上流エラー | 新しいタブでプロジェクトを開き直す |

本番プロダクトの納品物として依存させる前に、エクスポート結果と Claude Code 側の実装品質を **小さなプロジェクトで検証** することをおすすめします。

## まとめ

- Claude Design は「実装前のビジュアル設計」を担当する Anthropic Labs の新製品（**インタラクティブプロトタイプ**含む）
- 入口は **[claude.ai/design](https://claude.ai/design)（ブラウザ）**、UI は **左チャット + 右キャンバス**
- 利用量は **チャット・Claude Code とは別メーター**（週次枠 + Extra usage）
- 推奨ワークフローは **作成 → コンテキスト → 要件 → レビュー → 反復** の 5 ステップ
- プロンプトは **目標・レイアウト・コンテンツ・対象ユーザー** を含めて段階的に複雑さを足す
- デザインシステムを組織にセットアップし、[Published] にすると全プロジェクトに自動適用（複数システムも可）
- エクスポートから **Claude Code へのハンドオフ**（ローカル / Web 経由含む）で実装まで一気通貫
- Research preview のため、既知の不具合に留意して小規模検証から始める

## 関連リソース

- [Get started with Claude Design (Claude Help Center)](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)
- [Set up your design system in Claude Design (Claude Help Center)](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)
- [Claude Design subscription usage and pricing (Claude Help Center)](https://support.claude.com/en/articles/14667344-claude-design-subscription-usage-and-pricing)
- [Claude Design admin guide for Team and Enterprise plans (Claude Help Center)](https://support.claude.com/en/articles/14604406-claude-design-admin-guide-for-team-and-enterprise-plans)
- [Introducing Claude Design by Anthropic Labs](https://www.anthropic.com/news/claude-design-anthropic-labs)
