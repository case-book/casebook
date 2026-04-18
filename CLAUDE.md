# CASEBOOK - Claude Code 가이드 (루트)

이 파일은 저장소 전체에 적용되는 개요와 공통 규칙입니다.
백엔드/프론트 세부 규칙은 하위 디렉터리의 `CLAUDE.md`가 자동 로드됩니다.

## 프로젝트 요약
- **목적**: 테스트케이스 작성·실행·리포팅 도구 (Apache 2.0 오픈소스)
- **도메인 계층**: Space → Project → Testcase Group → Testcase → Testrun
- **모노레포**: 백엔드(Spring Boot, `src/`) + 프론트(React, `app/`)
- **기본 언어**: 한국어 (UI 문자열, `@Operation` 설명, 커밋 메시지 모두 한국어)

## 하위 가이드 (자동 로드)
- 백엔드 작업 시: [`src/main/java/CLAUDE.md`](src/main/java/CLAUDE.md)
- 프론트 작업 시: [`app/CLAUDE.md`](app/CLAUDE.md)

## 추가 참조 문서 (@import)
@docs/claude/build.md
@docs/claude/commit.md
@docs/claude/examples.md

## 공통 규칙 (백엔드·프론트 모두)
1. **한국어 유지**: UI 문자열, Swagger 설명, 커밋 메시지, 에러 메시지 키 설명 모두 한국어.
2. **ESLint/Pretti er/Checkstyle 자동 포맷 존중**: 스타일 임의 재정렬·리네이밍 금지.
3. **기존 레이어·네이밍 그대로**: 새 기능 추가 시 기존 도메인(예: `biz/links`, `pages/spaces/SpaceListPage`)을 레퍼런스로 삼을 것.
4. **레퍼런스 도메인**
   - 백엔드 표본: `com.mindplates.bugcase.biz.links` (OpenLink)
   - 프론트 표본: `app/src/pages/spaces/SpaceListPage`, `app/src/services/SpaceService.js`
5. **버전/릴리스**: `build.gradle`의 `version`과 `app/package.json`의 `version`은 함께 맞춤(현재 v2.1.4).
6. **작업 전 체크**: 새 도메인을 만들 때 백엔드 6계층(controller/service/repository/entity/dto/vo) + 프론트 페이지/서비스 쌍을 모두 채울 것.

## 기술 스택 개괄
| 영역 | 스택 |
|---|---|
| 백엔드 | Java 17, Spring Boot 3.2.2, Spring Data JPA, MySQL, Redis, Quartz, WebFlux, WebSocket/STOMP, Spring AI, Lombok, ModelMapper, springdoc-openapi, jjwt, Sentry |
| 프론트 | React 18 (JSX), MobX, react-router v6, axios, SCSS, react-i18next, toast-ui editor, @xyflow/react, craco |
| 빌드 | Gradle (Java), CRACO (프론트), docker-compose (로컬 인프라) |

## 아키텍처 원칙 요약
- **컨트롤러 ↔ 서비스 ↔ 레포지토리** 분리 엄격. 컨트롤러는 DTO↔Response 매핑만.
- **엔티티는 외부 노출 금지**. 컨트롤러 반환은 반드시 `vo.response.*Response`.
- **요청 바디는 VO → `toDTO()` → 서비스에 DTO 전달** 패턴.
- **프론트**: MobX 스토어 + 함수형 컴포넌트(`observer`) + 콜백 기반 서비스 호출.
- **절대 경로 import**: 프론트는 `@/` alias 사용, 상대경로 지양.
