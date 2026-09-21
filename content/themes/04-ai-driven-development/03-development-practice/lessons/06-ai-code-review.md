---
title: "AIコードレビューの導入と運用"
description: "要件充足・正しさ・より良い実現方法・セキュリティ・リファクタリングなど9つのレビュー観点ごとに、Claude Codeの/code-review・Code Review・REVIEW.mdでどう実現するかを具体的に示し、導入から指摘のトリアージ・コスト管理までの運用の型を解説。"
order: 6
type: lecture
difficulty: intermediate
tags: [ai-coding, code-review, claude-code, github, best-practices]
estimatedMinutes: 25
---

# AIコードレビューの導入と運用

AI が実装を速くするほど、詰まるのは**レビュー**です。書く速度が上がっても、読んで確かめる速度が上がらなければ、開発ループ全体は速くなりません。[基本ループ](/themes/04-ai-driven-development/03-development-practice/ai-development-loop)で見た通り、レビューはループの出口であり、[デバッグとリファクタリング](/themes/04-ai-driven-development/03-development-practice/ai-debugging-refactoring)で触れた AI レビューはその一次チェックです。本ページはその続きとして、**観点を決め、観点ごとに方式を割り当てる**という形で、AI コードレビューの導入と運用を解説します。AI レビューは既定では「正しさ」しか見ません。何を見るかを決めるのは人間の仕事です。

> [!NOTE]
> 本ページのツール情報（機能・設定ファイル名・コマンド・モード名・料金の目安・プラン条件）は **2026 年 9 月時点** のものです。特に研究プレビュー中の機能や料金は変わりやすいため、導入の際はページ末尾の「参考リソース」の公式ドキュメントで最新情報を確認してください。
>
> また、本ページでは Claude Code を例に解説しますが、「観点を決めて方式を割り当てる」という構造は Copilot でも CodeRabbit でも Cursor Bugbot でも同じです。各ツールの設定ファイルの対応は「[他ツールでの対応物](#他ツールでの対応物)」にまとめています。コマンド例は macOS / Linux のシェルを前提とします。

## このページで学べること

- AI コードレビューの **3 つの形態**（ローカル・PR 自動レビュー・自前 CI）と使い分け
- レビュー基準の置き場所（**CLAUDE.md と REVIEW.md** の役割分担）
- **9 つのレビュー観点**と、それぞれを実現する具体的な方式・プロンプト・設定
- 観点を束ねた **REVIEW.md の書き方**
- 指摘の**トリアージと運用**（severity の読み方・マージゲート・コスト管理）
- よくある**アンチパターン**の避け方

## AIコードレビューの3つの形態

Claude Code のレビューは、動く場所で 3 つに分かれます。push 前・PR 作成後・自前 CI という**層**として捉えると、導入順も決めやすくなります。

![AIコードレビューの3つの層：①ローカルの/code-review（push前・手元で即確認）②PR自動レビューCode Review（PR作成・push時にクラウドで多エージェントが並列検証）③自前CI（claude-code-action＋code-reviewプラグインで自前のワークフローとして制御）。層が下がるほど制御できる範囲が広がり、コストと設定の手間も増える](/content-assets/04-ai-driven-development/03-development-practice/images/ai-code-review-layers.svg)

| 形態 | 動く場所 | トリガー | 費用 | 設定ファイル | 向く場面 |
| --- | --- | --- | --- | --- | --- |
| ① ローカル `/code-review` | 自分のマシン（`ultra` のみクラウド実行） | 手動（push 前に実行） | 通常の利用枠 | 不要（CLAUDE.md のみ読む） | push 前の即時確認・他人の PR の下読み |
| ② PR 自動レビュー（Code Review） | Anthropic のクラウド | PR 作成・push・`@claude review` | 1 レビュー $15–25 目安（従量） | CLAUDE.md・REVIEW.md | チームの PR に毎回同じ目を通したいとき |
| ③ 自前 CI（`claude-code-action`） | 自分の GitHub Actions | ワークフローで自由に定義 | Actions 実行時間＋モデル利用 | ワークフロー YAML | ゲート化・条件分岐など制御したいとき |

> [!NOTE]
> ② の Code Review は研究プレビューで、**Team / Enterprise プラン**が対象です。それ以外のプランでは ① と ③ が選択肢になります。まずは ① から始め、チームで回し始めたら ② か ③ を足すのが無理のない順序です。

### ① ローカルの/code-review（push前）

作業中のブランチの差分を、その場でレビューします。対象の指定が柔軟で、push 前の確認に使います。

```bash
/code-review              # 上流に対する差分＋未コミットの変更をレビュー
/code-review 1234         # PR番号を指定（他人のPRの下読みにも使える）
/code-review main...feature  # ref範囲を指定
```

`--fix` を付けると指摘を作業ツリーに適用し、`--comment` を付けると PR にインラインコメントとして投稿します。深さの調整は effort レベルで行います。`low`・`medium` は確度の高い指摘に絞り、`high` 以上は網羅を広げる代わりに確信度の低い指摘も混ざります。さらに深掘りしたい変更は `ultra`（クラウドで多エージェントが独立検証する `ultrareview`）に上げます。`ultra` は通常 5〜10 分かかり、無料枠の後は 1 回 $5–25 程度の目安です。`/review` は `/code-review` のエイリアスです。`/simplify` はバグ探しをしない cleanup 専用レビューで、観点 5 で使います。

### ② PR自動レビュー（Code Review）

GitHub App を入れて有効化すると、PR に対してクラウドの多エージェントがレビューし、行単位のインラインコメントとサマリーを投稿します。有効化の手順は、Claude Code の管理画面で対象リポジトリを選び、GitHub App をインストールして Review Behavior を選ぶだけです。

Review Behavior は 3 モードです。**Once after PR creation**（PR 作成時に 1 回だけ）、**After every push**（push のたびに実行し、直した指摘のスレッドを自動解決する）、**Manual**（自動では動かず、`@claude review` で都度要求する）です。`@claude review always` と書くと、その PR を push 時の自動レビューに登録します。`@claude review once` は bare の `@claude review` と同じく 1 回だけの実行です。fork からの PR は、どのモードでも自動では動かず、コメントでの要求が必要です。

指摘には 3 段階の severity が付きます。🔴 **Important**（マージ前に直すべきバグ）、🟡 **Nit**（直す価値はあるが軽微）、🟣 **Pre-existing**（この PR が入れたものではない既存のバグ）です。読み方は後述の「[指摘をどう扱うか](#指摘をどう扱うか-トリアージと運用)」で解説します。check run は常に **neutral** で終わるため、マージをブロックしません。ゲート化したい場合は自前 CI で severity を読む必要があります。コストは 1 レビュー $15–25 が目安で、push のたびに動かす設定は push 回数分だけ増えます。月次の spend cap を管理画面で設定できます。

### ③ 自前CI（claude-code-action＋code-reviewプラグイン）

レビューを自分のワークフローとして制御したい場合は、`claude-code-action@v1` と `code-review` プラグインを組み合わせます。`/install-github-app` でクイックセットアップできます。要点は `--comment` と `claude_args` の 2 行です。

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-code.git"
          plugins: "code-review@claude-code-plugins"
          prompt: "/code-review:code-review --comment ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'
```

`--comment` が PR への投稿を指示し、`claude_args` の行がインラインコメント投稿用の MCP ツールを許可します。この行を外すと、所見はワークフローのログに残るだけで PR には投稿されません。自前のワークフローでは、draft の PR のスキップや軽微な PR の除外など、条件を自分で書けます。認証情報は必ず Secrets に置き、リポジトリに直書きしないでください。

## レビュー基準の置き場所: CLAUDE.mdとREVIEW.md

Code Review が読む基準ファイルは 2 つあり、役割が違います。**CLAUDE.md は全タスク共通のプロジェクト指示**で、新たに違反した箇所は nit として検出されます。逆に、PR の変更で CLAUDE.md の記述が古くなった場合も検出されます。**REVIEW.md はレビュー専用の指示**で、リポジトリルートに置く自由形式の Markdown です。何をどの severity で報告するか、報告の形まで指示できます。以降の観点別の章では、REVIEW.md に書く内容を少しずつ積み上げていきます。最後の「[REVIEW.md にまとめる](#reviewmdにまとめる)」で 1 本に統合する、という読み方で進めてください。

> [!TIP]
> `/code-review`（ローカル）は **REVIEW.md を読みません**（CLAUDE.md のみ）。ローカル確認と PR 自動レビューで基準を揃えたい場合は、重要なルールを CLAUDE.md 側にも書いておきます。逆に、レビュー時にだけ効かせたい指示（nit 上限・skip ルールなど）は REVIEW.md に書きます。

## レビュー観点と方式のマップ

AI レビューの既定は「正しさ」に偏ります。次の 9 観点を立て、観点ごとに方式を割り当てます。

| # | 観点 | 主な方式 |
| --- | --- | --- |
| 1 | 要件充足 | Issue・受け入れ条件を渡して照合（`/code-review` に PR＋Issue、REVIEW.md で照合指示） |
| 2 | 正しさ・エッジケース | `/code-review`（effort）、Code Review の severity、`ultra` |
| 3 | より良い実現方法 | 別セッションでの設計レビュー（代替案の比較・既存実装の再利用確認） |
| 4 | セキュリティ | `/security-review`、Code Review 既定、REVIEW.md の repo 固有ルール |
| 5 | リファクタリングの余地 | `/simplify`（cleanup 専用）、CLAUDE.md 規約違反の nit 検出 |
| 6 | テストの妥当性 | REVIEW.md の弱体化検出ルール、テスト差分の重点レビュー |
| 7 | スコープと影響範囲 | REVIEW.md の Important 定義、PR サイズ上限 |
| 8 | 可読性・保守性・一貫性 | CLAUDE.md をレビュー基準として機能させる書き方 |
| 9 | 性能・運用 | `/code-review` の efficiency 観点、REVIEW.md の repo 固有チェック |

3 つの群に分けると運用しやすくなります。**AI の既定が強い観点（2・4・9）** は、そのまま回しても一定の成果が出ます。**設定で引き出す観点（5・6・7・8）** は、REVIEW.md や CLAUDE.md に書かないと機能しません。**人間が文脈を渡さないと機能しない観点（1・3）** は、Issue や設計意図をプロンプトで渡す運用が必須です。

## 観点1: 要件を満たしているか

AI レビューは仕様を知りません。差分だけ見ても「動くが頼んだものと違う」は検出できません。**Issue・受け入れ条件・PR 説明を渡して照合させる**のが方式です。

```text
PR #123 をレビューして。Issue #120 の受け入れ条件と1つずつ照合し、
未達の条件と、頼んでいない過剰な機能を挙げて。
```

REVIEW.md には、照合の指示を書きます。

```markdown
- PR説明の受け入れ条件に対する未達・過剰をImportantとして報告する
```

抜け（未実装の条件）と過剰（頼んでいない機能）の両方を問うのがポイントです。過剰な実装はレビューでは見逃されがちですが、保守コストとして残ります。

## 観点2: 正しさとエッジケース

既定で最も強い観点です。effort の使い分けが運用の要点です。日常の push 前確認は `low`・`medium` で確度の高い指摘に絞り、重要な変更のマージ前には `high` 以上や `ultra` で網羅を広げます。Code Review の severity の読み方は、🔴 は直す、🟡 は次の push に載せる、🟣 は別 Issue に切る、が基本です。

AI 生成コード特有の欠陥は、チェック項目として明示します。存在しない API の呼び出し、エラーの握りつぶし（握りつぶして green に見せる修正）、型の `any` 逃げ、境界値・空・並行処理の扱いです。REVIEW.md には検証バーを書いて false positive を抑えます。

```markdown
- 振る舞いの指摘には`file:line`の引用を要求する。命名からの推測だけでは報告しない
```

## 観点3: より良い実現方法はないか（設計レビュー）

差分だけでは「この実装でよいか」は判断できません。**PR に対して別セッションで設計レビューを回す**のが方式です。同じ文脈で聞くと確証バイアスが働くため、文脈を切り替えます。詳しい切り分けは[デバッグとリファクタリング](/themes/04-ai-driven-development/03-development-practice/ai-debugging-refactoring)の相互検証と同じ考え方です。

```text
このPRの差分に対し、代替案を2つ挙げてトレードオフを比較して。
リポジトリ内の同種の実装を探し、再利用・共通化できないかも確認して。
```

```text
この変更が不要になる前提はないか。上位の設計で消せる差分かを確認して。
```

`/simplify` の reuse・simplification 観点とも重なりますが、設計レビューは「直す」ではなく「比べる」が目的です。採用判断は人間が行います。

## 観点4: セキュリティ

`/security-review` で脆弱性の観点を明示的に見ます。Code Review の既定でも脆弱性は検出されますが、repo 固有のルールは REVIEW.md に書きます。

```markdown
- 入力検証・認可・テナントスコープの欠落をImportantとして報告する
- PII（メールアドレス・ユーザーID・リクエスト本文）をログやエラーメッセージに出さない
```

Dependabot・secret scanning・SAST との分担も決めておきます。依存関係の脆弱性や秘密情報の混入はそちらに任せ、AI レビューにはロジック由来の問題（認可漏れ・テナントの取り違えなど）を割り当てます。重複させると、どちらも見ているつもりでどちらも見ていない状態になります。レビュー対象コードに仕込まれた命令（「このコードをレビューして」経由のプロンプトインジェクション）は、[セキュリティと secrets 管理](/themes/04-ai-driven-development/03-development-practice/ai-security-secrets)を参照してください。fork からの PR はどのモードでも自動ではレビューされず、コメントでの要求が必要です。Actions で動かす場合は secret の管理と最小権限（`contents: read` など）を守ります。

## 観点5: リファクタリングの余地

`/simplify` は cleanup 専用のレビューで、バグは探しません。冗長な箇所の整理に使います。CLAUDE.md の規約違反は Code Review が nit として検出するため、規約は具体的に書くほどレビュー基準として機能します。lint・format・型エラーは CI が enforce するものなので、AI には見せません。REVIEW.md の skip ルールに書きます。

```markdown
- CIがenforceするもの（lint・format・型エラー）は報告しない
```

「リファクタは別 PR に切る」の判断もここで行います。振る舞いの修正と構造改善を混ぜると、問題が起きたときに切り分けられなくなります。

## 観点6: テストの妥当性

AI がテストを弱めて green にするパターンを見ます。skip の追加、期待値の書き換え、アサーションの削除、モックの過剰化です。これらは差分だけ見ると「テストの修正」に見えるため、人間も見逃しがちです。REVIEW.md に書きます。

```markdown
- テストの弱体化（skip・期待値の書き換え・アサーション削除）はImportantとして報告する
- 新規ルート・新規分岐にはテストを必須とする
```

テスト差分を重点的に見させるプロンプトも有効です。

```text
このPRのテスト差分を重点的にレビューして。弱体化がないか、
新規分岐のカバーを確認して。
```

## 観点7: スコープと影響範囲

頼んでいない変更、差分の肥大化、後方互換性の破壊、マイグレーションの非可逆性、公開 API の変更を見ます。REVIEW.md で Important の定義に入れます。

```markdown
- 後方互換を壊す変更・非可逆なマイグレーションはImportantとして報告する
- 要件外の変更は別PRへの切り出しを提案する
```

PR サイズの目安も決めておきます。大きすぎる PR は AI も人間も見切れません。小さく切ることが、レビュー精度への投資になります。

## 観点8: 可読性・保守性・一貫性

CLAUDE.md をレビュー基準として機能させるのが方式です。規約は「具体的に、判断基準を添えて」書きます。「命名は分かりやすく」ではなく「関数は動詞始まり・真偽値は `is`/`has` 接頭辞」のように書くと、違反の検出精度が上がります。Code Review は CLAUDE.md の記述を古くする変更も検出するため、ドキュメント更新の確認にも使えます。命名・コメント・ドキュメント更新の確認は、この観点で行います。

## 観点9: 性能・運用

`/code-review` の efficiency 観点と、REVIEW.md の repo 固有チェックを組み合わせます。

```markdown
- N+1クエリ・不要な再計算をImportantとして報告する
- ログとエラーハンドリング・監視の欠落を確認する
```

性能の指摘は測定が前提です。AI の推測を鵜呑みにせず、計測して確認します。この姿勢はトークン効率化の「測ってから減らす」と同じです。

## REVIEW.mdにまとめる

観点 1〜9 で積み上げた指示を、1 本の REVIEW.md に統合します。次のサンプルを起点に、自分のリポジトリに合わせて削ります。

```markdown
# Review instructions

## What Important means here

Reserve Important for findings that would break behavior, leak data,
or block a rollback: unmet acceptance criteria, incorrect logic,
unscoped queries, PII in logs, and backward-incompatible changes.
Style, naming, and refactoring suggestions are Nit at most.

## Cap the nits

Report at most five Nits per review. If you found more, say "plus N
similar items" in the summary instead of posting them inline.

## Do not report

- Anything CI already enforces: lint, formatting, type errors
- Generated files under `src/gen/` and any `*.lock` file

## Always check

- Acceptance criteria in the PR description are met (no missing, no excess)
- New API routes have an integration test
- Log lines don't include email addresses, user IDs, or request bodies
- Database queries are scoped to the caller's tenant

## Verification bar

- Behavior claims need a `file:line` citation in the source,
  not an inference from naming
```

> [!TIP]
> 長くすると効かなくなります。挙動を変える指示だけを書きます。一般的なプロジェクト知識は CLAUDE.md に置き、REVIEW.md はレビューの振る舞いを変える指示に絞ります。

## 他ツールでの対応物

Claude Code 以外のツールを使う場合の対応物です。詳細は各公式ドキュメントを参照してください。

| ツール | 設定ファイル | 備考 |
| --- | --- | --- |
| Claude Code（Code Review） | CLAUDE.md・REVIEW.md | REVIEW.md はレビュー専用。`/code-review` は REVIEW.md を読まない |
| GitHub Copilot code review | `.github/copilot-instructions.md`・`.github/instructions/*.instructions.md`・`AGENTS.md` | リポジトリ全体とパス別の指示。effort は Lite / Balanced。`REVIEW.md`・`CLAUDE.md` の参照も 2026 年夏の更新で拡張されているため、公式ドキュメントで確認する |
| CodeRabbit | `.coderabbit.yaml`（`reviews.path_instructions`） | path filters で対象を絞り、`path_instructions` でパス別の観点を指示する |
| Cursor Bugbot | `.cursor/BUGBOT.md`・Rules | `.cursor/rules` は Bugbot には適用されない。`cursor review` で手動実行、Autofix で修正案を生成できる |
| OpenAI Codex | `AGENTS.md`（`## Code Review Rules`） | `@codex review` で要求、全 PR 自動レビューも設定可能 |

## 指摘をどう扱うか: トリアージと運用

指摘は severity で仕分けます。🔴 Important は直す、🟡 Nit は次の push に載せる、🟣 Pre-existing は別 Issue に切る、が基本です。false positive は 👍👎 のリアクションで伝え、スレッドは resolve して閉じます。繰り返す誤検出は REVIEW.md にフィードバックし、skip ルールや検証バーを足します。

**マージゲートにするか**は慎重に決めます。Code Review の check run は neutral のため、そのままではブロックしません。ゲートにするなら自前 CI で severity の件数を読んで判定します。まずは非ブロッキングで始め、誤検出が落ち着いてからゲート化するのが推奨です。

人間レビューとの分担も決めます。AI は観点 2・4・9 の網羅に強く、人間は観点 1・3 の最終判断と優先度付けに残ります。AI が通ったから人間レビューを省く、はしません。

コスト管理はトリガー選択が要点です。After every push は push 回数分だけ課金されるため、高トラフィックのリポジトリでは Manual モードでレビューする PR を選んで opt-in します。spend cap を設定し、平均コストをダッシュボードで監視します。

## よくあるアンチパターン

- 全指摘を機械的に採用する（採用判断は人間が行う）
- nit の無限ループ（再レビュー収束ルールなしに何度も回す）
- AI が通ったから人間レビューを省く
- 観点を決めずに「レビューして」とだけ頼む
- CI が enforce する lint・型を AI にも見せる
- レビュー基準を長文 CLAUDE.md に埋めて効かなくする
- After every push を全リポジトリに適用してコストを膨らませる

## まとめ

- 実装が速くなるほどレビューが詰まる。**観点を決め、観点ごとに方式を割り当てる**のが本ページの要点
- 3 つの形態（ローカル・PR 自動・自前 CI）は層として使い分ける。まずローカルから始める
- CLAUDE.md は全タスク共通、REVIEW.md はレビュー専用。`/code-review` は REVIEW.md を読まない
- 9 観点のうち、AI の既定が強いのは 2・4・9、設定で引き出すのは 5・6・7・8、人間の文脈が必須なのは 1・3
- 指摘は severity で仕分け、まずは非ブロッキングで始め、コストはトリガー選択で管理する

## 関連ページ

- [AIによるデバッグとリファクタリング](/themes/04-ai-driven-development/03-development-practice/ai-debugging-refactoring) — 前のレッスン（ツール機能・相互検証）
- [AI開発の基本ループ](/themes/04-ai-driven-development/03-development-practice/ai-development-loop) — ループ全体の地図
- [AI駆動開発のセキュリティとsecrets管理](/themes/04-ai-driven-development/03-development-practice/ai-security-secrets) — プロンプトインジェクション対策・secrets 管理
- [ループエンジニアリング](/themes/04-ai-driven-development/01-overview/loop-engineering) — 外側ループとしての人間レビュー・CI
- [開発ワークフローはどう変わるか](/themes/04-ai-driven-development/01-overview/workflow-changes) — レビューフェーズの変化
- [Routines とスケジュール実行](/themes/04-ai-driven-development/02-claude-code/routines) — GitHub トリガーの PR レビュー
- [コードレビューのベストプラクティス](/themes/01-web-basics/02-git/intro-practice/code-review) — 人間向けレビュー作法

## 参考リソース

- [Code Review — Claude Code Docs](https://code.claude.com/docs/en/code-review)
- [GitHub Actions — Claude Code Docs](https://code.claude.com/docs/en/github-actions)
- [Ultrareview — Claude Code Docs](https://code.claude.com/docs/en/ultrareview)
- [About GitHub Copilot code review — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/code-review)
- [Using custom instructions to unlock the power of Copilot code review — GitHub Docs](https://docs.github.com/en/copilot/tutorials/customize-code-review)
- [Copilot code review customization improvements (2026-07-17) — GitHub Changelog](https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/)
- [Path instructions — CodeRabbit Docs](https://docs.coderabbit.ai/configuration/path-instructions)
- [Bugbot — Cursor Docs](https://cursor.com/docs/bugbot)
- [Custom Code Review rules for Codex — OpenAI Developers](https://developers.openai.com/blog/custom-code-review-rules-for-codex)
- [Review GitHub pull requests with Codex — Codex Docs](https://www.codex-docs.com/en/docs/third-party/github)
