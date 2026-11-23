## 무엇을 왜

<!-- 바꾼 것과 이유를 짧게. 관련 결정(D<n>), 질문, 이슈가 있으면 적습니다. 이슈를 닫으면 "Closes #<이슈 번호>". -->

## docs

<!-- 둘 중 하나를 남깁니다. 표는 docs/README.md의 "언제 어떤 문서를 고치나". -->

docs: 고친 문서 (예: 00-current-state, 04-architecture)
docs: 해당 없음(이유)

## 재사용 점검

<!-- AGENTS.md 4절. 고위험 계열 목록은 docs/04-architecture.md. 건드린 계열이 없으면 첫 줄만 "없음 — 이유"로 남깁니다. -->

계열: <건드린 계열 | 없음 — 이유>
검색어: <검색한 말>
살펴본 경로: <이미 있던 구현의 경로·심볼>
결정: <재사용 | 확장 | 대체(옛 경로 삭제 또는 후속 issue #<번호>와 종료 조건) | 새로 만듦 — 재사용이 틀린 구체적 경계>

## 구조 도입 심사

<!-- AGENTS.md 3절. 트리거: 오래 남는 상태, 형식·프로토콜 버전, 런타임 호환 분기, 플랫폼·공급자 추상화. 제거·단순화만이면 Trigger: none. -->

Trigger: <해당하는 트리거 전부 | none>
Route: <Route A | Route B | N/A>
근거: <Route A: 인용한 결정·ADR과 도달 가능한 생산자→소비자 경로 / Route B: 단순한 구현, 목표, 재현 가능한 근거>
수명 관리: <마이그레이션·삭제·재생성·다운그레이드·호환 분기 제거 | N/A — 이유>

## 리뷰

<!-- docs/05-review.md 라우팅대로. 표의 리뷰어를 한 번씩 적고, 돌리지 않은 리뷰어에는 "N/A - 이유"를 붙입니다. -->

등급: <low-risk docs/tests | ordinary code | critical surfaces>

- [ ] engineering-reviewer
- [ ] test-coverage-reviewer
- [ ] backend-api-reviewer
- [ ] security-reviewer
- [ ] docs-consistency-reviewer
- [ ] protocol-walkthrough-reviewer

Must fix 처리: <지적 제목 — 고침 `커밋` / 추적 issue #<번호> / 위험 수용(누가, 왜) / 인정 안 함(이유)>. 없으면 "없음".
남긴 것: <Can track after merge 지적과 관찰 중 이 PR에서 고치지 않은 것과 이유>. 없으면 "없음".

## 확인한 것

<!-- 무엇을 어떻게 확인했는지. 명령, 화면, 링크. -->

- [ ] `node scripts/scrub.mjs`
- [ ] `<빌드 명령>`
- [ ] `<테스트 명령>`

## 확인하지 못한 것

<!-- 확인하지 못한 것과 이유. 없으면 "없음". -->
