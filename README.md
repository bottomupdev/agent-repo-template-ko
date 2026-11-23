# AI 에이전트와 일하는 저장소 템플릿

Claude Code, Codex 같은 AI 에이전트가 코드 대부분을 쓰는 저장소를 위한 GitHub 템플릿입니다. 세 가지로 되어 있습니다.

1. **에이전트가 읽고 일할 문서** — 공통 규칙(`AGENTS.md`), 현재 상태·결정·질문·용어·구조·리뷰를 나눠 적는
   `docs/`, PR 양식.
2. **그 문서에 비춰 PR을 검토하는 읽기 전용 리뷰어** — `.claude/skills/`의 리뷰어 스킬. 파일을 고치지 않고
   정해진 기준을 넘는 지적만 올립니다.
3. **둘을 묶는 원칙** — 끝까지 생각하고 최소로 구현하기, 쓰기 전에 찾기, 구조는 근거가 있을 때만 들이기.

[English edition](https://github.com/bottomupdev/agent-repo-template)

> 이 README는 템플릿 설명입니다. 템플릿으로 저장소를 만들었다면 프로젝트의 README(설치, 실행, 배포)로 바꿉니다.

## 왜

에이전트는 대화가 끝나면 맥락을 잊고, 한 번에 읽을 수 있는 양도 정해져 있습니다. 매번 처음부터 설명하지 않으려면
저장소 안에 세 가지가 분명하게 있어야 합니다.

- **무엇을 만드는가** — 누구를 위해, 무엇은 하지 않는가 (`docs/00-current-state.md`)
- **어떤 결정이 지금 유효한가** — 무엇을 골랐고, 왜, 무엇은 하지 말아야 하는가 (`docs/01-decision-log.md`)
- **어떻게 일하는가** — 작업 크기, 테스트, 문서 갱신, 리뷰, 올리기 전 확인 (`AGENTS.md`)

에이전트는 또 지나치게 만드는 경향이 있습니다. 이미 있는 함수를 다시 쓰고, 쓰일 곳 없는 추상화와 "나중을 위한"
버전 분기를 들이고, 드문 실패마다 새 검사를 붙입니다. `AGENTS.md`의 원칙들은 여기에 맞서도록 쓰였습니다.
작성자가 Claude Code·Codex와 매일 일하며 다듬은 규칙과 도구를 정리했습니다.

## 구성

```
AGENTS.md                         에이전트 공통 규칙. 가장 높은 권위
CLAUDE.md                         AGENTS.md를 불러오는 포인터
docs/
  README.md                       질문별 길잡이, 권위와 근거, 언제 어떤 문서를 고치나, 쓰는 규칙
  00-current-state.md             지금: 무엇을 누구를 위해, 범위, 되는 것, 빈틈, 다음
  01-decision-log.md              결정 (D1, D2, …). 지우지 않고 "대체됨"으로 쌓음
  02-open-questions.md            정하지 않은 것. 풀린 질문은 묘비로 남김
  03-glossary.md                  용어, 쓰지 않는 동의어, 번호 체계
  04-architecture.md              구성 요소와 경계, 데이터 흐름, 고위험 기본 요소의 원본 위치
  05-review.md                    리뷰 라우팅: 어떤 PR에 어떤 리뷰어를
  adr/README.md                   ADR을 언제 어떻게 쓰나
  adr/0001-example.md             ADR 예시
  growing.md                      커지면 더할 것과 더해도 되는 신호
.claude/skills/
  README.md                       리뷰어 설명, 설치, 여러 리뷰어 결과 합치기
  finding-admission.md            무엇을 지적으로 인정하나
  <리뷰어>/SKILL.md                리뷰어 스킬
.github/pull_request_template.md  PR 양식
.github/workflows/scrub.yml       금지어 검사 CI
scripts/scrub.mjs                 금지어 검사
.gitattributes                    줄바꿈 규칙(* text=auto eol=lf)
```

`docs/`의 문서마다 첫 줄에 한 줄 요약(`<!-- Summary: … -->`)이 있고, 기울임 글씨 안내문과 가상의 할 일 앱으로 든
예시가 있습니다. 채운 뒤 안내문과 예시를 지웁니다.

`.gitattributes`는 원칙 하나를 보여 주는 예이기도 합니다. 동작에 영향을 주는 설정은 각자의 기기 설정이 아니라
저장소에 버전으로 둡니다. 줄바꿈이 기기마다 다르면 로컬에서는 통과하고 CI에서는 실패하는(또는 반대인) 테스트가 생깁니다.

| 리뷰어 | 보는 것 |
|---|---|
| `engineering-reviewer` | 구조, 신뢰성, 효율, 유지보수성, 머지 준비. PR의 재사용 점검과 구조 도입 심사를 diff로 다시 확인 |
| `test-coverage-reviewer` | 테스트가 바뀐 동작의 회귀를 실제로 잡는지 |
| `security-reviewer` | 보안·개인정보 위험. CI 워크플로와 에이전트 도구 권한 포함 |
| `backend-api-reviewer` | 인증·인가, 소유권, 데이터 접근 정책, 수명 주기, 스토리지, 공개 토큰, 오류 의미 |
| `docs-consistency-reviewer` | docs·결정 기록·범위·구조 설명이 코드와 맞는지 |
| `protocol-walkthrough-reviewer` | 에이전트 규칙·런북·CI 워크플로를 글자 그대로 따라가 보고 어디서 막히는지 |
| `ai-pr-owner-review` | 관문이 아닙니다. AI가 쓴 PR을 오너에게 설명하고, 머지를 막는 것과 나중 일을 나눕니다 |

## 빠른 시작

1. GitHub에서 **Use this template**으로 새 저장소를 만듭니다.
2. `AGENTS.md`와 `.github/pull_request_template.md`의 `<꺾쇠>` 자리(프로젝트 이름, 빌드·테스트 명령)를 채웁니다.
3. **`docs/00-current-state.md`와 `docs/01-decision-log.md`를 먼저 채웁니다.** 무엇을 만들고 무엇은 하지 않는지,
   이미 정한 것이 무엇인지가 에이전트에게 가장 큰 차이를 만듭니다. 나머지는 비워 두고 시작해도 됩니다.
4. 에이전트에게 "`AGENTS.md`를 읽고 시작해"라고 말합니다. Claude Code는 `CLAUDE.md`를 통해 자동으로 읽습니다.
5. PR을 올리기 전에 에이전트가 `docs/05-review.md`대로 리뷰어를 돌리고 결과를 PR 설명에 적게 합니다.
   `AGENTS.md`에 이미 규칙으로 있습니다. 직접 돌리려면 Claude Code에서 `/engineering-reviewer 이 브랜치 리뷰해`처럼 부릅니다.

그 뒤로는 PR마다 에이전트가 `docs/README.md`의 표대로 문서를 고치게 둡니다. 비어 있던 문서도 그렇게 채워집니다.

## 리뷰어만 쓰기

리뷰어 스킬은 나머지 템플릿 없이도 돕니다. 기존 저장소에 `.claude/skills/`를 복사합니다.

```bash
mkdir -p .claude/skills
cp -r path/to/this-template/.claude/skills/. .claude/skills/
```

- **Claude Code**: 프로젝트의 `.claude/skills/`를 자동으로 찾습니다. 모든 프로젝트에서 쓰려면 `~/.claude/skills/`에 복사합니다.
- **Codex**: 스킬 폴더를 `~/.codex/skills/`에 복사하고 다시 시작합니다. 설치하지 않고
  "`.claude/skills/security-reviewer/SKILL.md`를 읽고 따라 해"라고 해도 됩니다.
- 언제 어떤 리뷰어를 돌릴지는 [.claude/skills/README.md](.claude/skills/README.md)의 기본 라우팅에서 시작해 고칩니다.

## 금지어 검사와 SCRUB_TERMS

출시 전 프로젝트 이름, 고객사 이름, 내부 코드명이 공개 저장소에 섞이지 않게 막습니다.

**금지어 목록은 저장소에 두지 않습니다.** 공개 저장소에 목록을 적으면 그 목록이 곧 유출입니다. 목록은 GitHub Actions
시크릿 `SCRUB_TERMS`(쉼표로 구분한 한 줄)에만 둡니다.

- `scripts/scrub.mjs`는 `git ls-files`로 추적된 텍스트 파일을 줄마다 봅니다(대소문자 무시, 부분 일치).
- 걸리면 `파일:줄: banned term #N`처럼 단어 대신 번호를 찍고 실패합니다. CI 로그에도 단어가 남지 않습니다.
- `SCRUB_TERMS`가 없으면(포크, 시크릿 미설정) 건너뛰고 통과합니다.

설정: **Settings → Secrets and variables → Actions → New repository secret**에서 이름 `SCRUB_TERMS`로 만들거나
`gh secret set SCRUB_TERMS`를 실행합니다. 머지를 막게 하려면 브랜치 보호 규칙에서 `scrub`을 필수 검사로 지정합니다.

```bash
# 로컬 실행. 목록은 저장소 밖 파일에 두고 읽어 옵니다(셸 기록에 남지 않게).
SCRUB_TERMS="$(cat ~/.config/scrub-terms)" node scripts/scrub.mjs
```

한계: 추적된 파일만 봅니다(새 파일은 `git add` 뒤에). 커밋 메시지와 PR 설명은 보지 않아서 `AGENTS.md`에 규칙으로
따로 적었습니다. 이미 커밋된 단어는 지워도 git 기록에 남습니다. 부분 일치라 짧거나 흔한 단어는 오탐이 납니다.

## 커지면

처음에는 작게 시작합니다. 충돌·정리 기록, 프로젝트 저널, 아카이브, 문맥 선택, 중복 점검, 래칫 게이트 같은 것은
그것이 필요하다는 신호가 나타났을 때 더합니다. 신호와 가장 작은 형태는 [docs/growing.md](docs/growing.md)에 있습니다.

## 자주 묻는 것

**Claude Code와 Codex를 같이 써도 되나요?**
됩니다. 둘 다 `AGENTS.md`의 규칙을 따릅니다. Codex는 `AGENTS.md`를 직접 읽고, Claude Code는 `CLAUDE.md`를 읽는데
이 파일이 `@AGENTS.md`로 같은 규칙을 불러옵니다. 규칙은 `AGENTS.md` 한 곳에만 씁니다.

**문서가 너무 많지 않나요?**
필요 없는 문서는 지우고 `docs/README.md`의 표를 고칩니다. 다만 한 문서에 모두 몰아 쓰지는 않습니다. 에이전트가
필요한 것만 골라 읽을 수 있어야 합니다.

**결정을 바꾸고 싶으면요?**
옛 항목을 지우지 않고 `대체됨: D<m>`을 붙인 뒤 새 번호로 적습니다. 왜 바뀌었는지가 남아야 옛 방식으로 되돌아가지
않습니다. 에이전트는 결정을 바꿔야 할 것 같으면 구현하지 않고 먼저 묻습니다.

**리뷰를 CI가 강제하나요?**
아니요. 리뷰어는 프롬프트이고, 돌리는 것은 에이전트와 사람입니다. PR 설명의 `## 리뷰`가 무엇을 돌렸는지 남깁니다.
리뷰어는 틀릴 수 있고, 깨끗한 결과가 PR이 옳다는 증명은 아닙니다.

**"확인 필요"는 왜 따로 적나요?**
에이전트는 해 보지 않은 일을 끝났다고 적기 쉽습니다. 확인하지 않은 것을 완료와 구분해 두면, 다음 사람이 무엇을
믿어도 되는지 압니다.

## 상태

있는 그대로(as-is) 공개합니다. 지원은 약속하지 않습니다. 이슈와 PR은 읽을 수 있지만 답이나 반영을 약속하지 않습니다.
포크는 환영합니다.

## License

MIT. [LICENSE](LICENSE)를 봅니다.
