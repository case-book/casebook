# 백엔드 (Spring Boot) 작업 가이드

Java 17 / Spring Boot 3.2.2. 이 파일은 `src/main/java` 트리 아래에서 작업할 때 자동 로드됩니다.

## 패키지 루트
`com.mindplates.bugcase`
- `bugcase/` (애플리케이션 엔트리)
- `bugcase/biz/<domain>/` - 도메인별 비즈니스 모듈 (추가 작업은 대부분 여기)
- `bugcase/common/` - 공통: `exception`, `entity`, `dto`, `vo`, `constraints`, `code`, `util`, `message`, `service`, `bean`
- `bugcase/framework/` - 인프라: `config`, `security`, `aware`, `converter`, `handler`, `redis`, `scheduler`, `websocket`

## 도메인 6계층 (필수)
신규 도메인을 만들 때 **반드시** 아래 구조로 생성합니다. 하나라도 빠뜨리지 말 것.

```
biz/<domain>/
├── controller/          # @RestController
├── service/             # @Service + 트랜잭션 경계
├── repository/          # Spring Data JPA 인터페이스
├── entity/              # @Entity, extends CommonEntity
├── dto/                 # 도메인 DTO, implements IDTO<Entity>
└── vo/
    ├── request/         # 컨트롤러 입력
    └── response/        # 컨트롤러 출력
```

레퍼런스 도메인: `biz/links/` (OpenLink). 새 도메인은 이 구조를 그대로 복제.

## 컨트롤러 규칙
```java
@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/<resource>")
@AllArgsConstructor
public class XxxController {
    private final XxxService xxxService;

    @Operation(description = "한국어 설명")
    @GetMapping
    public List<XxxListResponse> selectXxxList(@PathVariable String spaceCode,
                                               @PathVariable long projectId) {
        return xxxService.selectXxxList(projectId).stream()
                .map(XxxListResponse::new).collect(Collectors.toList());
    }

    @PostMapping
    public XxxResponse createXxx(@PathVariable String spaceCode,
                                 @PathVariable long projectId,
                                 @Valid @RequestBody XxxRequest request) {
        return new XxxResponse(xxxService.createXxx(projectId, request.toDTO(projectId)));
    }
}
```

규칙:
- 클래스 어노테이션: `@Slf4j @RestController @RequestMapping(...) @AllArgsConstructor`
- 의존성: `private final` 필드 (Lombok 생성자 주입)
- 모든 엔드포인트에 `@Operation(description = "한국어 …")` 부착 (Swagger UI 문서)
- 경로 변수: `spaceCode` / `projectId`를 컨텍스트 계층 그대로 포함
- 바디 검증: `@Valid @RequestBody XxxRequest`
- 반환: 단건 `XxxResponse`, 목록 `List<XxxListResponse>`, 단순 상태는 `ResponseEntity<HttpStatus>`
- **컨트롤러에는 로직 없음**: DTO↔Response 매핑, 서비스 위임만

## 서비스 규칙
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class XxxService {
    private final XxxRepository xxxRepository;

    public XxxDTO selectXxxInfo(long projectId, long xxxId) {
        Xxx xxx = xxxRepository.findByIdAndProjectId(xxxId, projectId)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new XxxDTO(xxx, true);
    }

    @Transactional
    public XxxDTO createXxx(long projectId, XxxDTO info) { ... }
}
```

- 어노테이션: `@Service @RequiredArgsConstructor @Slf4j`
- 트랜잭션: **쓰기 메서드에만** `@Transactional` (jakarta.transaction) — 읽기에는 붙이지 않는 것이 관행
- 메서드 네이밍: `selectXxxList`, `selectXxxInfo`, `createXxx`, `updateXxx`, `deleteXxx`, 상태변경은 `closeXxx`/`openXxx` 등 도메인 동사
- 예외: `ServiceException`만 사용
  - `throw new ServiceException(HttpStatus.NOT_FOUND)`
  - `throw new ServiceException(HttpStatus.GONE, "error.openlink.closed")` (i18n 메시지 키)
- 엔티티→DTO 변환은 `new XxxDTO(entity)` 또는 `new XxxDTO(entity, detail)`에서 담당 (서비스에서 필드 매핑 금지)

## 엔티티 규칙
```java
@Entity
@Builder
@Table(name = "open_link")
@NoArgsConstructor @AllArgsConstructor @Getter @Setter
public class OpenLink extends CommonEntity {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id",
                foreignKey = @ForeignKey(name = "FK_OPEN_LINK__PROJECT"))
    private Project project;
}
```

- 반드시 `extends CommonEntity` (생성자·수정자·일시 공통 컬럼)
- 컬럼명은 `snake_case`, 길이는 `ColumnsDef.*` 상수 재사용
- 연관관계는 기본 `FetchType.LAZY`, 필요 시 `@Fetch(FetchMode.SUBSELECT)` 추가
- FK 이름은 `FK_<TABLE>__<REF>` 규칙으로 명시

## DTO 규칙
- `extends CommonDTO implements IDTO<Entity>` — `toEntity()` 오버라이드 필수
- `@Builder @NoArgsConstructor @AllArgsConstructor @Data @EqualsAndHashCode(callSuper = false)`
- 엔티티 생성자 `new XxxDTO(Entity entity)`와 `new XxxDTO(Entity, boolean detail)` 2개 제공 (상세 여부로 하위 컬렉션 로딩 제어)

## Request / Response VO 규칙
- **Request** (`vo.request.XxxRequest`)
  - `@Data` (Lombok) 사용
  - `toDTO(long projectId)` 제공 → 경로 변수와 바디를 합쳐 DTO 생성
- **Response** (`vo.response.XxxResponse`, `XxxListResponse`)
  - `@Builder @Getter @NoArgsConstructor @AllArgsConstructor`
  - 생성자 `new XxxResponse(XxxDTO dto)`에서 필드 매핑
  - 목록 응답은 경량 버전(`XxxListResponse`), 상세는 전체(`XxxResponse`)로 분리

## 예외 처리
- 비즈니스 예외: `com.mindplates.bugcase.common.exception.ServiceException(HttpStatus, messageKey?)`
- 메시지 키는 `src/main/resources/messages*.properties` 와 연결 (i18n)
- 글로벌 핸들러: `framework/handler/` 에 위치 (수정 시 주의)

## 검증 (Bean Validation)
- `@Valid`는 컨트롤러에서, 제약 어노테이션(`@NotNull`, `@Size` 등)은 Request VO 필드에 붙임
- `spring-boot-starter-validation` 사용

## 기타
- 로깅: `@Slf4j` + `log.info(...)` (System.out 금지)
- ModelMapper 사용 가능하지만, 위 도메인 표본은 **수동 매핑**을 채택 — 일관성을 위해 수동 매핑 권장
- 스케줄러: Quartz 사용, `framework/scheduler/` 참조
- 보안: `framework/security/` + JWT(jjwt) + Spring Session(Redis)
- WebSocket: `framework/websocket/` (STOMP)
