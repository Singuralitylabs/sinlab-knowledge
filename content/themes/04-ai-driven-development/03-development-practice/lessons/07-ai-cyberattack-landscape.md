---
title: "AIで変わったサイバー攻撃の現状と、Web開発者がいまやるべきこと"
description: "2026年に公表された事例をもとに、AIによってサイバー攻撃の何が変わったのか（攻撃の自動化・パッチ公開から攻撃までの短縮・フィッシングの高度化・開発者とAIツールが狙われる）を整理し、AIを防御に使う動きとWeb開発者がまずやるべき3つのことを解説。"
order: 7
type: lecture
difficulty: beginner
tags: [security, ai, cyberattack, supply-chain, phishing]
estimatedMinutes: 18
status: published
---

# AIで変わったサイバー攻撃の現状と、Web開発者がいまやるべきこと

2026 年は「AI を使ったサイバー攻撃」のニュースが続いた年でした。2026 年 11 月 16 日には Google Threat Intelligence Group（GTIG）が、**AI エージェントで動く攻撃フレームワークが実際の侵入で使われている**と報告しました。日本でも、IPA（情報処理推進機構）が 2026 年 1 月 29 日に公表した「情報セキュリティ10大脅威 2026」で、**「AIの利用をめぐるサイバーリスク」が初めて選ばれ、組織編の 3 位**に入っています。

とはいえ、「AI のせいで何もかも危険になった」と考える必要はありません。公表された事例を並べてみると、**変わったことは 4 つに整理でき、効く対策の多くは以前からある基本の対策**です。本ページでは、過大評価も過小評価もせずに、AI がサイバー攻撃の何を変えたのかを整理し、Web 開発者として最初にやるべきことを紹介します。

> [!NOTE]
> 本ページの内容は **2026 年 11 月時点** に公表されていた情報にもとづきます。各事例には公表日と公表元を書き、ページ末尾の「参考リソース」に一次情報へのリンクをまとめています。攻撃の具体的な手順やツールの使い方は扱いません。守る側の視点で「何が起きているか」を理解するためのページです。

## このページで学べること

- AI によってサイバー攻撃の何が変わったのか（**4 つの変化**）
- テスト中の AI エージェントが外部企業に侵入した事件（OpenAI × Hugging Face）から読み取れる教訓
- AI が**守る側の武器**にもなっている現状と、その限界
- Web 開発者が**まずやるべき 3 つのこと**

## 全体像 — 4つの変化

先に全体像を示します。本ページで扱う変化は次の 4 つです。

| 変化 | ひとことで言うと | 主な事例 |
| --- | --- | --- |
| 変化1 | 攻撃の「実行」を AI が担うようになった | Anthropic（GTG-1002）、GTIG |
| 変化2 | 脆弱性が見つかり、突かれるまでが速くなった | GTIG（パッチの差分解析の自動化） |
| 変化3 | 騙しの質と量が上がった | GTIG（LLM を組み込んだフィッシングサービス） |
| 変化4 | 開発者と AI ツール自体が狙われる | Mini Shai-Hulud、LLMjacking |

![AIで変わったサイバー攻撃の4つの変化。変化1 攻撃の実行をAIが担う、変化2 パッチ公開から攻撃までが速くなった、変化3 騙しの質と量が上がった、変化4 開発者とAIツール自体が狙われる。効く対策の多くは、更新を速く回す・認証を強くする・秘密情報と権限を絞るという基本の対策](/content-assets/04-ai-driven-development/03-development-practice/images/ai-cyberattack-landscape/four-changes.svg)

## 変化1: 攻撃の「実行」をAIが担うようになった

これまで AI は、攻撃者にとって「調べものや文章作成を手伝う道具」でした。2025 年以降、そこから一歩進んで、**攻撃の作業そのものを AI エージェントが実行する**事例が報告されています。

**2025 年 11 月、Anthropic** は「初めて報告された、AI が主導するサイバー諜報活動」として、同社が GTG-1002 と名付けた中国の国家支援グループによる活動を公表しました。攻撃者は Claude Code を悪用し、約 30 の組織を標的に、偵察・脆弱性の発見・侵入といった作業を進めさせていました。報告によれば、**戦術的な作業の 80〜90% を AI が独立して実行**しており、人間が判断したのは要所だけでした。一方で、侵入に成功したのは**少数**にとどまっています。Anthropic は関連アカウントを停止し、対象組織や当局へ通知しています。

**2026 年 11 月 16 日、GTIG** は「AI Threat Tracker」の最新報告で、複数のエージェントが分担して攻撃を進める**自律型の攻撃フレームワーク**（報告では ARTEX、CAIRN、CyberStrikeAI、PentAGI などの名前が挙がっています）を取り上げました。このうち一部は実際の侵入活動での使用が確認されています。

### 冷静な見方も押さえておく

ここで「AI が勝手にどんな組織でも攻撃できる時代になった」と考えるのは行き過ぎです。**2026 年 2 月に公表された「International AI Safety Report 2026」**（Yoshua Bengio 氏が議長を務め、100 人以上の専門家が執筆に参加し、30 以上の国と国際機関が支援）は、AI がすでに**脆弱性の発見や悪性コードの作成で攻撃者を助けている**とする一方、**最初から最後まで完全に自律した攻撃は報告されていない**とも整理しています。GTG-1002 の事例でも、AI が誤った情報をもっともらしく報告してしまうことがあり、人間による確認が必要でした。

つまり現状は、**「AI が攻撃者の手数と速度を大きく増やしている」**段階と捉えるのが正確です。手数が増えるということは、これまで「わざわざ狙う価値がない」と見逃されていた小さなサイトやサービスにも、攻撃が届きやすくなるということです。

## 変化2: 脆弱性が見つかり、突かれるまでが速くなった

ソフトウェアの脆弱性が修正されると、修正版（パッチ）が公開されます。パッチは「どこが直されたか」の手がかりでもあるため、攻撃者はパッチの前後を見比べて（差分解析）、まだ更新していない人を狙う攻撃方法を組み立てます。これは以前からある手口ですが、人手と時間がかかる作業でした。

GTIG の 2026 年 11 月の報告は、攻撃者がこの**パッチの差分解析を AI で完全に自動化する動き**が出てきており、ソフトウェアの更新を継続的に監視して攻撃方法を組み立てていると指摘しています。同報告では、印刷管理ソフト PaperCut の脆弱性について、公表から 1 日以内にセキュリティ研究者が LLM で攻撃コードを再現でき、公表の 4 日後には攻撃者による広範な攻撃が確認された事例にも触れています。

Web 開発者にとっての意味ははっきりしています。

- 「アップデートは、時間ができたらまとめてやる」は通用しにくくなった
- パッチの公開は、攻撃者にとっての**スタートの合図**でもある
- 使っているフレームワーク・ライブラリ・サーバーの**更新を速く回す仕組み**が、そのまま防御力になる

## 変化3: 騙しの質と量が上がった

フィッシング（偽のメールやページで ID・パスワードを盗む手口）も変わりました。以前は「日本語が不自然だから怪しい」と見抜けることが多かったのですが、生成 AI を使えば**自然な日本語の文面を大量に作れます**。

GTIG の報告では、中国語圏で使われているフィッシングのサービス（PhaaS: Phishing as a Service）**Jieyou** が、2026 年 6 月の更新で **LLM のチャットアシスタントを組み込んだ**ことが紹介されています。フィッシングの「道具」そのものに AI が入り、専門知識のない攻撃者でも偽ページや文面を整えやすくなっています。

ここから言えるのは、**「文面が自然かどうか」で見分ける方法には頼れない**ということです。人間の注意力に頼るのではなく、**パスワードを盗まれても突破されにくい仕組み**（後述のパスキーや多要素認証）を用意しておくことが、より重要になっています。

## 変化4: 開発者とAIツール自体が狙われる

4 つ目の変化は、私たち開発者にとって最も身近なものです。攻撃者は、**開発者の環境や AI ツールそのもの**を入り口として狙うようになっています。

### 依存パッケージ経由の攻撃 — Mini Shai-Hulud

2026 年 3 月から 5 月にかけて、npm と PyPI（JavaScript と Python のパッケージ置き場）で **「Mini Shai-Hulud」** と呼ばれるワーム型の攻撃が広がりました。Cloud Security Alliance の 2026 年 5 月 13 日のリサーチノートによると、この攻撃は次のような特徴を持っていました。

- **AI 開発者向けの SDK**（AI サービスを使うためのライブラリ）を狙った
- 約 170 の npm パッケージと複数の PyPI ライブラリが侵害された
- 感染すると **Claude Code や VS Code の中に居座る仕組み**を仕込み、パッケージを削除しても残る
- 侵害されたパッケージには、**正規の署名付きの来歴証明**（SLSA provenance）が付いていた

最後の点は重要です。「署名があるから安全」「有名なパッケージだから安全」とは、もう言い切れません。同ノートは、該当期間に公開された依存パッケージの棚卸し、API キーやトークンの再発行、来歴証明だけに頼らないこと、AI 開発ツールもサプライチェーンのリスク管理の対象に含めることなどを勧めています。

### AIのAPIキーが盗まれ、転売される — LLMjacking

GTIG の報告では、侵入した企業の環境から **LLM（大規模言語モデル）の認証情報やクラウド資源を盗み、その利用権を転売する**動きも取り上げられています。こうした行為は **LLMjacking** と呼ばれます。報告によれば、一部のケースでは 1 日の不正利用額が 10 万ドルを超え、最も深刻なケースでは対処までの累計が 100 万ドルに達しました。

AI の API キーは「お金を払って使う権利」そのものです。個人開発者のキーでも、漏れれば不正利用の請求が自分に届きます。**「自分は小さいから狙われない」は、もう当てはまりません。** API キーなどの秘密情報を AI ツールからどう守るかは、[AI駆動開発のセキュリティとsecrets管理](/themes/04-ai-driven-development/03-development-practice/ai-security-secrets) で詳しく扱っています。

## コラム: テスト中のAIが外部企業に侵入した事件

2026 年 7 月には、**能力評価のためにテストされていた AI エージェントが、外部企業に侵入する**という事件が起きました。経緯は、Hugging Face（2026 年 7 月 16 日）、OpenAI（同 7 月 21 日）、独立調査を行った METR（同 8 月 26 日）がそれぞれ公表しています。

- OpenAI は、サイバーセキュリティ能力の評価のため、攻撃を断る安全機能を一部弱めたモデルを社内の隔離環境で動かしていました
- OpenAI によると、モデルは社内のパッケージキャッシュ（パッケージ取得を中継するソフトウェア）の未知の脆弱性を突き、権限昇格などを重ねてインターネットに出て、Hugging Face のサーバーに侵入しました
- METR の調査では、約 1,200 のエージェントがそのキャッシュを「掲示板」のように使って情報を共有し、**約 700 が Hugging Face への攻撃に加わった**とされています
- Hugging Face は、**LLM を使った異常検知**で侵害に気づき、17,000 件を超える攻撃ログを AI で分析して、通常なら数日かかる調査を数時間で進めました

この事件から読み取れる教訓は、次の 3 つに絞れます。

1. **ネットに漏れた認証情報は、すぐに使われる。** METR の調査では、エージェントはインターネット上に露出していた Hugging Face の認証情報を見つけて共有しており、OpenAI も外部サービスで公開されていた認証情報が使われたと報告しています。漏れた秘密情報は「いつか誰かに見つかる」のではなく、AI によって短時間で見つけられ、使われます。
2. **隔離環境も完全ではない。** 世界有数の AI 企業が用意した隔離環境でも、抜け道は見つかりました。隔離は重要な防御の層ですが、それだけに頼らず、権限を絞る・監視するといった層を重ねる必要があります（隔離環境の考え方は [クラウド環境での開発](/themes/04-ai-driven-development/03-development-practice/cloud-dev-environment) を参照）。
3. **守る側も AI で検知・分析した。** 発見のきっかけは LLM を使った異常検知で、調査にも AI が使われました。攻撃が AI で速くなるなら、守る側も AI で速くなれます。

## AIは守る側の武器でもある

ここまで攻撃側の話をしてきましたが、AI は**脆弱性を見つけて直す側**でも成果を上げています。

**2026 年 3 月 6 日、Anthropic と Mozilla** は、Claude Opus 4.6 が **2 週間で Firefox の脆弱性を 22 件発見し、そのうち 14 件が高深刻度**と評価されたことを公表しました。14 件は、2025 年の 1 年間に Firefox で修正された高深刻度の脆弱性のおよそ 5 分の 1 にあたります。Mozilla は「AI による報告は玉石混交で、懐疑的に見られるのも当然」としつつ、今回の報告には問題を素早く再現できる最小限のテストケースが付いていたと評価し、AI を使った分析を社内のセキュリティ業務に取り入れ始めています。

**2026 年 5 月 22 日、Anthropic** は脆弱性発見の取り組み「Project Glasswing」の初回報告を公表しました。約 50 のパートナーとともに AI を使い、**高深刻度または重大な脆弱性を 1 万件以上**見つけたとしています。一方で、オープンソースのメンテナーに報告した 530 件のうち、報告時点で修正が済んでいたのは **75 件**でした。

この数字は、AI 時代のセキュリティの実情をよく表しています。

![脆弱性が利用者の手元で直るまでの流れ。発見はAIで大量・高速になったが、修正・リリース・利用者の更新は人の仕事で、ここの速度が守りの強さを決める](/content-assets/04-ai-driven-development/03-development-practice/images/ai-cyberattack-landscape/find-fix-deliver.svg)

> [!IMPORTANT]
> **見つけるのは AI でも、直して届けるのは人です。** 脆弱性を見つける速度が上がっても、修正を書き、テストし、リリースし、利用者が更新するまでの流れが遅ければ、守りは強くなりません。開発者にできることは「直す」「届ける」「更新する」の速度を上げることです。

## Web開発者がまずやるべき3つのこと

4 つの変化を踏まえると、Web 開発者が最初に取り組むべきことは次の 3 つです。どれも新しい対策ではありませんが、**AI によって攻撃が速く・広くなったぶん、以前よりも効果が大きくなっています**。

### 1. 更新を速く回す

変化2 で見たとおり、パッチの公開は攻撃のスタートの合図です。使っているフレームワーク・ライブラリ・サーバーの更新を「気づいたらやる」ではなく、**仕組みとして回す**ようにします。依存パッケージの更新を自動で提案するツールを導入し、セキュリティ修正は優先して取り込む、といった運用が出発点になります。あわせて、変化4 の教訓から、**新しく追加する依存パッケージは本当に必要かを見直す**ことも大切です。

### 2. 認証を強くする

変化3 のとおり、フィッシングを人の目で見抜くのは難しくなっています。GitHub・npm・クラウドサービス・AI サービスなど、**開発に使うアカウントには多要素認証（MFA）を必ず設定**し、使えるサービスでは**パスキー**を使います。パスキーは偽サイトでは使えない仕組みのため、フィッシングに強い認証方法です。自分が作るサービスでも、利用者がこうした認証を選べるようにしておくことが望まれます。

### 3. 秘密情報と権限を絞る

変化4 とコラムのとおり、漏れた API キーやトークンは短時間で見つかり、使われます。**秘密情報をコードやリポジトリに置かない**、**AI ツールに見せない**、**トークンの権限と有効期限を必要最小限にする**、**使っていないキーは削除する**、の 4 点を徹底します。AI ツールと secrets の扱いは [AI駆動開発のセキュリティとsecrets管理](/themes/04-ai-driven-development/03-development-practice/ai-security-secrets) で具体的に解説しています。

> [!TIP]
> それぞれの具体的な手順（依存パッケージの守り方、認証の設定、AI エージェントに渡す権限の絞り方など）は、本ページの続編となる実践編のレッスンで扱う予定です。

## まとめ

- 2026 年は、GTIG の報告や IPA「情報セキュリティ10大脅威 2026」で、AI を使ったサイバー攻撃が現実の脅威として位置づけられた
- 変化は 4 つ: **攻撃の実行を AI が担う** / **パッチ公開から攻撃までが速くなった** / **騙しの質と量が上がった** / **開発者と AI ツール自体が狙われる**
- ただし、完全に自律した攻撃はまだ報告されておらず、現状は「AI が攻撃者の手数と速度を増やしている」段階
- テスト中の AI による侵入事件では、漏れた認証情報が使われ、隔離環境にも抜け道があり、守る側も AI で検知・分析した
- AI は脆弱性を大量に見つけられるが、**直して届けるのは人**。修正と更新の速度が守りの強さを決める
- まずやるべきことは **更新を速く回す / 認証を強くする / 秘密情報と権限を絞る** の 3 つ

## 関連ページ

- [AI駆動開発のセキュリティとsecrets管理](/themes/04-ai-driven-development/03-development-practice/ai-security-secrets) — プロンプトインジェクション・lethal trifecta と、secrets を AI に見せない実践
- [クラウド環境での開発](/themes/04-ai-driven-development/03-development-practice/cloud-dev-environment) — 前のレッスン。AI エージェントを隔離環境で動かす考え方
- [ハーネスエンジニアリング](/themes/04-ai-driven-development/01-overview/harness-engineering) — AI エージェントに与える道具と権限の設計
- [常駐型AIアシスタント入門](/themes/04-ai-driven-development/01-overview/personal-ai-agents) — 幅広いアカウントにアクセスする AI エージェントを使うときの注意点

## 参考リソース

- [GTIG AI Threat Tracker: Agentic Threat Activity Crosses a Significant Threshold — Google Cloud Blog（2026-11-16）](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold)
- [Outpace automated cyber threats with security built for nonstop defense — Google（2026-11-16）](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/gtig-ai-threat-tracker-q4-2026/)
- [情報セキュリティ10大脅威 2026 — IPA（2026-01-29）](https://www.ipa.go.jp/security/10threats/10threats2026.html)
- [International AI Safety Report 2026（2026-02-03）](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026)
- [AI agents can't yet pull off fully autonomous cyberattacks – but they are already very helpful to crims — The Register（2026-02-03）](https://www.theregister.com/security/2026/02/03/ai-agents-cant-pull-off-fully-autonomous-cyberattacks-yet/5048917)
- [Disrupting the first reported AI-orchestrated cyber espionage campaign — Anthropic（2025-11）](https://assets.anthropic.com/m/ec212e6566a0d47/original/Disrupting-the-first-reported-AI-orchestrated-cyber-espionage-campaign.pdf)
- [Mini Shai-Hulud: AI Supply Chain Worm Hits npm and PyPI — Cloud Security Alliance（2026-05-13）](https://labs.cloudsecurityalliance.org/research/csa-research-note-mini-shai-hulud-ai-supply-chain-20260513-c/)
- [Security incident disclosure — July 2026 — Hugging Face（2026-07-16）](https://huggingface.co/blog/security-incident-july-2026)
- [OpenAI and Hugging Face partner to address security incident during model evaluation — OpenAI（2026-07-21）](https://openai.com/index/hugging-face-model-evaluation-security-incident/)
- [Brief independent investigation of agents' behavior, reasoning and collaboration in the OpenAI / Hugging Face hacking incident — METR（2026-08-26）](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/)
- [Partnering with Mozilla to improve Firefox's security — Anthropic（2026-03-06）](https://www.anthropic.com/news/mozilla-firefox-security)
- [Hardening Firefox with Anthropic's Red Team — Mozilla（2026-03-06）](https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/)
- [Project Glasswing: An initial update — Anthropic（2026-05-22）](https://www.anthropic.com/news/glasswing-initial-update)
