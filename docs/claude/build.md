# 빌드 · 실행 · 배포

## 로컬 개발
### 프론트엔드
```bash
cd app
npm install --legacy-peer-deps   # toast-ui/react-editor 호환성 때문에 필수
npm start                        # craco start (개발 서버)
```

### 백엔드
- IntelliJ에서 `BugcaseApplication` 실행, 또는
- `./gradlew bootRun`
- 의존: MySQL + Redis. 로컬은 `docker-compose.yml`로 기동.
- 설정: `src/main/resources/application.yml` (현재 로컬 수정 중 — 커밋 시 주의)

### 인프라 (로컬)
```bash
docker-compose up -d   # MySQL, Redis 등
```

## 통합 빌드
프론트 산출물을 백엔드 `static/`에 포함시켜 단일 jar 배포.

```bash
./gradlew buildApp     # npmInstallApp → buildReact → cleanStatic → deployStatic
./gradlew bootJar      # build/libs/casebook-<version>.jar
```

`buildApp` 태스크 흐름 (`build.gradle` 정의):
1. `npmInstallApp` - `npm install --legacy-peer-deps`
2. `buildReact` - `npm run build` (CRACO 빌드)
3. `cleanStatic` - `src/main/resources/static` 삭제
4. `deployStatic` - `app/build` → `src/main/resources/static` 복사

## 릴리스 패키지
```bash
gradle release
```
- ⚠ **Gradle 7.x 필수**. 8.x에서는 실패합니다.
- 산출물: `build/dist/casebook-<version>.zip`
- zip 내부: `bin/*.jar`, `conf/application.properties`, `start.sh`/`stop.sh`/`status.sh` (+ bat)
- `files/` 폴더의 스크립트 템플릿이 `__fileName__` 치환되어 복사됨

## 버전 관리
- 백엔드: `build.gradle`의 `version = 'v2.1.X'`
- 프론트: `app/package.json`의 `"version": "v2.1.X"`
- **두 값은 항상 동일하게 맞춰 커밋** (릴리스 커밋 예: `v2.1.4`)

## DB
- 마이그레이션/스키마 파일: `database/`
- ORM: JPA (Hibernate) — 운영에서는 자동 DDL 비권장, 스키마 스크립트 사용
- 커넥터: `mysql-connector-j`

## 테스트
- 백엔드: `./gradlew test` (JUnit 5 + spring-boot-starter-test + spring-batch-test)
- 프론트: `npm test` (craco test, React Testing Library)

## 환경 변수 / 설정
- 백엔드: `src/main/resources/application.yml` + 릴리스 시 `files/application.properties`
- 프론트: `baseURL`은 `@/utils/configUtil`의 `getBaseURL()`에서 결정
- 토큰: `localStorage.token` → axios 기본 헤더 `X-AUTH-TOKEN`
