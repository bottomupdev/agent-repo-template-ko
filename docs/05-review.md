<!-- Summary: 어떤 PR에 어떤 리뷰어를 돌리는지(라우팅 표, 등급)와 지적을 어떻게 처리하는지. -->

# 리뷰 라우팅

어떤 PR에 어떤 리뷰어를 돌리는지 정합니다. 리뷰어는 [.claude/skills/](../.claude/skills/README.md)의 읽기 전용
스킬이고, 무엇을 지적으로 인정하는지는 [finding-admission.md](../.claude/skills/finding-admission.md)를 따릅니다.
라우팅 표는 여기 한 곳에만 둡니다. [AGENTS.md](../AGENTS.md)와 PR 양식은 이 문서를 가리키기만 합니다.

<!-- 템플릿: 기울임 글씨는 안내문, "예시" 블록은 가상의 할 일 앱입니다. 채운 뒤 둘 다 지웁니다. -->

## 라우팅 표

*리뷰어마다 언제 돌리는지 적습니다. 아래 일반 조건으로 시작해, 조건을 이 저장소의 실제 경로로 바꿉니다
(예: "API 라우트" → `src/server/routes/**`). 돌릴 일이 없는 리뷰어는 줄을 지우고 PR 양식에서도 지웁니다.
리뷰어 이름은 스킬 폴더 이름이니 바꾸지 않습니다.*

| 리뷰어 | 언제 |
|---|---|
| `engineering-reviewer` | 항상 |
| `test-coverage-reviewer` | 제품 코드나 중요 영역이 바뀜, 또는 테스트가 바뀜 |
| `backend-api-reviewer` | API 라우트, 인증·인가, 데이터 접근 정책, 저장소 계층, 스토리지 어댑터, 공개 토큰·링크 접근, 리소스 수명 주기 전환이 바뀜 |
| `security-reviewer` | 개인정보, 보안, 인증, 접근 정책, 토큰, 서명 URL, 스토리지, 로그, 분석, 공개 링크가 바뀜. 사용자 데이터가 지나는 경계(클라이언트·서버, 런타임)가 바뀜. CI·에이전트 작업 흐름(워크플로 권한·트리거, 에이전트 도구 허용 목록, 프롬프트 주입 경로, CI 시크릿)이 바뀜 |
| `docs-consistency-reviewer` | docs, 결정 기록, 범위, 구조 설명이 바뀜. 코드 변경에 docs 갱신이 필요함. AGENTS.md, 리뷰어 스킬, CI 워크플로가 바뀜 |
| `protocol-walkthrough-reviewer` | AGENTS.md, `.claude/skills/**`, `.github/workflows/**`, 런북처럼 에이전트나 러너가 그대로 실행하는 절차·규칙이 바뀜 |

`ai-pr-owner-review`는 관문이 아닙니다. 오너가 AI가 쓴 PR의 설명을 원할 때 돌립니다.

## engineering-reviewer가 따로 확인하는 것

`engineering-reviewer`는 항상 돌고, 코드 품질과 함께 PR 설명의 두 절을 실제 diff로 다시 확인합니다.

- **재사용 점검**: "없음"이라고 적었다면 정말 [04-architecture.md](04-architecture.md)의 고위험 계열을 건드리지
  않았는지. 건드렸다면 더 알맞은 원본이 이미 있지 않은지, 원본이 둘이 되지 않는지, 남긴 중복에 실제 경계가 있는지,
  대체한 옛 경로를 지웠거나 후속 이슈를 링크했는지. 절이 빠졌으면 그 자체로 `Must fix`입니다.
- **구조 도입 심사**: `Trigger: none`이 맞는지, 트리거가 있다면 Route A의 경로가 정말 도달 가능한지, Route B의
  근거가 재현 가능한지, 수명 관리를 적었는지. 기준은 [AGENTS.md](../AGENTS.md)의 3절입니다.
- **등급과 리뷰어**: PR이 고른 등급과 돌린 리뷰어가 실제 diff와 맞는지.

## 등급

*PR마다 등급을 하나 고르고, 라우팅 표에서 조건이 맞는 줄을 모두 더합니다. 등급이 넓다고 상관없는 리뷰어를
더하지 않습니다. "중요 영역"에 이 저장소의 무엇이 들어가는지 적습니다. 등급 이름도 식별자로 그대로 씁니다.*

| 등급 | 분류 | 돌릴 리뷰어 |
|---|---|---|
| `low-risk docs/tests` | 문서나 테스트만 바뀜. 제품 동작, 중요 영역, 절차·워크플로, 권한은 그대로 | `engineering-reviewer`. 테스트가 바뀌면 `test-coverage-reviewer`, docs가 바뀌면 `docs-consistency-reviewer` |
| `ordinary code` | 회귀 위험이 있는 제품 코드. 중요 영역은 아님 | `engineering-reviewer`, `test-coverage-reviewer`, 라우팅 표에서 맞는 리뷰어 전부 |
| `critical surfaces` | 개인정보, 인증, 스토리지, 삭제, 마이그레이션, 권한, 동시성·복구, 플랫폼 간 계약, 에이전트·CI 권한 | `ordinary code`와 같음 |

## PR 설명에 적기

*PR 설명의 `## 리뷰`에 등급과 리뷰어를 적습니다. 표의 리뷰어를 한 번씩 모두 적고, 돌리지 않은 리뷰어에는
`N/A - 이유`를 붙입니다.*

## 지적 처리

- 리뷰어마다 따로(서브에이전트 하나씩) 돌리고, 같은 원인의 지적은 하나로 묶습니다. 묶는 법과 요청 문구는
  [.claude/skills/README.md](../.claude/skills/README.md)에 있습니다.
- 인정한 지적은 하나씩 처리를 적습니다: **고침**(커밋), **추적**(이슈), **위험 수용**(누가, 왜),
  **인정 안 함**(어느 기준에 못 미치는지 한 줄).
- `Must fix`가 처리되지 않은 채로 머지하지 않습니다. `Can track after merge`는 이슈로 남기거나 이유를 적고 넘깁니다.
- 지적의 심각도는 근거일 뿐, 범위를 넓힐 권한이 아닙니다. 고치려면 범위를 넓혀야 하는 지적은 오너 결정으로 올립니다.
- 고친 뒤에는 바뀐 부분만 다시 리뷰합니다. 한 번 깨끗하면 끝이고, 상한은 `Must fix` 없는 라운드 두 번 연속입니다.
- 깨끗한 리뷰가 PR이 옳다는 증명은 아닙니다. 확인하지 못한 것은 PR의 `## 확인하지 못한 것`에 그대로 둡니다.

## 이 표를 고칠 때

- 경로가 바뀌거나 리뷰어를 더하고 빼면 이 문서와 [PR 양식](../.github/pull_request_template.md)을 같은 PR에서 고칩니다.
- `engineering-reviewer`, `test-coverage-reviewer`, `security-reviewer`는 쉽게 빼지 않습니다. 빼려면 이유를 PR에 적습니다.
- 일반 리뷰어가 자꾸 놓치는 경계(모바일·네이티브, 결제, 마이그레이션 등)가 있으면 도메인 리뷰어를 더합니다.
  만드는 법은 [.claude/skills/README.md](../.claude/skills/README.md)에 있습니다. 한 번 놓친 것으로는 더하지 않습니다.

---

**예시 (가상의 할 일 앱)**

> | 리뷰어 | 언제 |
> |---|---|
> | `engineering-reviewer` | 항상 |
> | `test-coverage-reviewer` | `apps/web/src/**`, `**/*.test.ts`가 바뀜 |
> | `security-reviewer` | 브라우저 저장소 읽기·쓰기(`apps/web/src/storage/**`)가 바뀜, 외부 스크립트가 늘어남, `.github/workflows/**`가 바뀜 |
> | `docs-consistency-reviewer` | `docs/**`, `AGENTS.md`가 바뀜, 또는 [docs/README.md](README.md#언제-어떤-문서를-고치나) 표에 걸리는 변경 |
> | `protocol-walkthrough-reviewer` | `AGENTS.md`, `.claude/skills/**`, `.github/workflows/**`가 바뀜 |
>
> 서버가 없으므로([ADR 0001](adr/0001-example.md)) `backend-api-reviewer`는 지웠습니다.
>
> 할 일에 `priority` 필드를 더하고 기기에 저장된 기존 할 일을 새 형식으로 옮기는 PR은 `critical surfaces`
> (저장 데이터 마이그레이션)입니다. 저장 형식이 바뀌므로 구조 도입 심사의 트리거가 있습니다.
>
> ```markdown
> ## 리뷰
>
> 등급: critical surfaces
>
> - [x] engineering-reviewer
> - [x] test-coverage-reviewer
> - [x] security-reviewer
> - [x] docs-consistency-reviewer
> - [ ] protocol-walkthrough-reviewer N/A - 절차·워크플로 변경 없음
>
> Must fix 처리: 옮기기가 중간에 실패하면 옛 데이터가 지워짐 — 고침 `커밋`
> 남긴 것: 마이그레이션 실패 시 문구 다듬기 — 추적 issue #<번호>
> ```
