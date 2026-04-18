# 커밋 · PR 컨벤션

## 커밋 메시지
- **한국어로** 간결하게 작성. 영어 혼용 최소화.
- 제목 한 줄로 변경 목적을 드러냄 (what, why를 동시에).
- 실제 커밋 예시 (`git log` 기반):
  - `v2.1.4` — 버전 태그 커밋
  - `- 로그인시 마지막 스페이스로 이동 - 시퀀스 버그 수정`
  - `띄어 쓰기 안되는 오류 수정`
  - `프로젝트 메뉴 가리는 오류 수정`
  - `Merge pull request #211 from case-book/feature/change-gnb`
- 여러 변경을 한 커밋에 묶을 경우, `-` 접두로 리스트 사용 (위 로그인 예시).

## 권장 동사
- 추가/생성: `추가`, `생성`
- 수정/개선: `수정`, `변경`, `개선`
- 버그 수정: `... 오류 수정`, `... 버그 수정`
- 삭제/제거: `제거`, `삭제`
- 리팩터링: `리팩토링`, `구조 변경`

## 브랜치
- 기본 개발 브랜치: `development`
- 릴리스 브랜치: `master`
- 기능 브랜치: `feature/<slug>` (예: `feature/change-gnb`)
- 머지 방향: `feature/*` → `development` → `master`

## PR
- 제목은 한국어로 간결하게.
- `master`로 직접 머지되는 PR은 릴리스 PR 성격.
- PR 머지 커밋은 기본 템플릿 유지: `Merge pull request #NNN from case-book/feature/xxx`.

## 커밋 전 체크리스트
1. 백엔드 변경이 있다면 `./gradlew test` 통과.
2. 프론트 변경이 있다면 `npm test` + 로컬 `npm start` 로 실 화면 확인.
3. 한국어 UI 문자열은 i18n 키로 등록됐는지 확인.
4. 새 엔티티/컬럼은 DB 스크립트(`database/`)에도 반영.
5. `build.gradle`·`app/package.json` 버전 동기화 (릴리스 커밋 시).
