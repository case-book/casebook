# 레퍼런스 구현 예시

새 도메인/페이지를 만들 때 복붙해서 시작할 수 있는 **실제 코드 레퍼런스**.

## 백엔드 표본: `biz/links` (OpenLink)
모든 6계층이 모범적으로 구현된 최소 도메인. 신규 도메인을 만들 때 이 패키지를 복제해 이름만 바꾸면 된다.

### 파일 매핑
| 계층 | 파일 |
|---|---|
| Entity | `biz/links/entity/OpenLink.java` |
| Repository | `biz/links/repository/OpenLinkRepository.java` |
| DTO | `biz/links/dto/OpenLinkDTO.java` |
| Service | `biz/links/service/OpenLinkService.java` |
| Controller | `biz/links/controller/OpenLinkController.java` |
| Request VO | `biz/links/vo/request/OpenLinkRequest.java` |
| Response VO | `biz/links/vo/response/OpenLinkResponse.java`, `OpenLinkListResponse.java` |

### Request → DTO 변환 (경로변수 병합)
```java
@Data
public class OpenLinkRequest {
    private Long id;
    private String name;
    private List<Long> testrunIds;

    public OpenLinkDTO toDTO(long projectId) {
        OpenLinkDTO dto = OpenLinkDTO.builder()
            .id(id).name(name)
            .project(ProjectDTO.builder().id(projectId).build())
            .build();
        dto.setTestruns(testrunIds.stream().map(id -> {
            OpenLinkTestrunDTO t = new OpenLinkTestrunDTO();
            t.setTestrun(TestrunDTO.builder().id(id).build());
            t.setOpenLink(dto);
            return t;
        }).collect(Collectors.toList()));
        return dto;
    }
}
```

### DTO ↔ Entity (IDTO 인터페이스)
```java
public class OpenLinkDTO extends CommonDTO implements IDTO<OpenLink> {
    public OpenLinkDTO(OpenLink e) { this(e, false); }
    public OpenLinkDTO(OpenLink e, boolean detail) { /* 필드 매핑 */ }

    @Override
    public OpenLink toEntity() {
        return OpenLink.builder().id(id).name(name)./*...*/.build();
    }
}
```

### 서비스의 트랜잭션 경계 & 예외
```java
public OpenLinkDTO selectOpenLinkInfo(long projectId, long openLinkId) {
    OpenLink ol = openLinkRepository.findByIdAndProjectId(openLinkId, projectId)
        .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    return new OpenLinkDTO(ol, true);
}

@Transactional
public OpenLinkDTO createOpenLink(long projectId, OpenLinkDTO info) {
    OpenLink ol = info.toEntity();
    ol.setToken((UUID.randomUUID().toString() + UUID.randomUUID().toString()).replace("-", ""));
    return new OpenLinkDTO(openLinkRepository.save(ol));
}
```

### 상태 검증 (도메인 예외)
```java
if (!openLink.isOpened()) {
    throw new ServiceException(HttpStatus.GONE, "error.openlink.closed");
}
if (openLink.getOpenEndDateTime() != null
        && openLink.getOpenEndDateTime().isBefore(LocalDateTime.now())) {
    throw new ServiceException(HttpStatus.GONE, "error.openlink.expired");
}
```

## 프론트 표본: `SpaceListPage`
파일: `app/src/pages/spaces/SpaceListPage/SpaceListPage.jsx` (+ `.scss`)

### 필수 요소 체크
- [x] `observer` + `useStores` 로 MobX 구독
- [x] `useTranslation` + `t('...')` 한국어
- [x] `useQueryString` 으로 URL 상태 관리
- [x] `SpaceService.selectSpaceList(text, success, fail)` 콜백 호출
- [x] `<Page><PageTitle/><PageContent/></Page>` 페이지 골격
- [x] breadcrumbs 첫 항목 `HOME`
- [x] `@/` alias import

```jsx
const onSearch = useCallback(() => {
  if (isMine) {
    SpaceService.selectMySpaceList(text, list => setSpaces(list), null);
  } else {
    SpaceService.selectSpaceList(text, list => setSpaces(list));
  }
}, [text, isMine]);

useEffect(() => { onSearch(); }, [text, isMine]);
```

## 프론트 표본: `AdminService`
파일: `app/src/services/AdminService.js` — 모든 서비스의 콜백 시그니처 레퍼런스.

```js
AdminService.selectSpaceList = (successHandler, failHandler) => {
  return request.get('/api/admin/spaces', null,
    res => { successHandler(res); },
    failHandler);
};
```

## 새 도메인 추가 체크리스트
백엔드:
- [ ] `biz/<domain>/entity/<Xxx>.java` - `extends CommonEntity`, snake_case 테이블/컬럼, LAZY fetch
- [ ] `biz/<domain>/repository/<Xxx>Repository.java` - `JpaRepository<Xxx, Long>`
- [ ] `biz/<domain>/dto/<Xxx>DTO.java` - `IDTO<Xxx>`, `toEntity()`, `(entity, detail)` 생성자
- [ ] `biz/<domain>/service/<Xxx>Service.java` - select/create/update/delete, `@Transactional` 쓰기만
- [ ] `biz/<domain>/vo/request/<Xxx>Request.java` - `toDTO(projectId)`
- [ ] `biz/<domain>/vo/response/<Xxx>Response.java` + `<Xxx>ListResponse.java`
- [ ] `biz/<domain>/controller/<Xxx>Controller.java` - `@Operation` 한국어, 경로 `/api/{spaceCode}/projects/{projectId}/...`
- [ ] DB 스키마 반영 (`database/`)
- [ ] i18n 에러 메시지 키 등록

프론트:
- [ ] `services/<Xxx>Service.js` - 콜백 시그니처
- [ ] `pages/<domain>/<XxxPage>/<XxxPage>.jsx + .scss`
- [ ] `App.jsx` 라우트 등록
- [ ] i18n 번역 키 등록
- [ ] 기존 `@/components` 재사용, 없을 때만 신규 컴포넌트
