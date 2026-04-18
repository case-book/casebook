# 프론트엔드 (React) 작업 가이드

React 18 + JSX + MobX + SCSS. 이 파일은 `app/` 하위에서 자동 로드됩니다.
TypeScript 의존성이 있으나 **실제 소스는 JSX/JS**로 작성됩니다. 임의로 `.tsx`로 변경하지 마세요.

## 디렉터리 구조 (`app/src/`)
```
App.jsx / App.scss / index.jsx / index.scss
assets/           # 정적 자산
components/       # 재사용 UI (폴더당 index.js + Foo.jsx + Foo.scss)
configurations/   # 설정 상수/초기화
constants/        # constants.js (THEMES 등)
fonts/ images/ styles/
hooks/            # useStores, useQueryString, useClickOutside, useKeyboard, useMenu
pages/            # 라우트 페이지. 도메인 하위폴더: admin, spaces, users, links, main, apis, common
proptypes/        # PropTypes 정의
services/         # <Domain>Service.js - HTTP API 호출
stores/           # MobX 스토어 (UserStore, ControlStore, ConfigStore, ThemeStore, ContextStore, SocketStore)
utils/            # request.js(axios 래퍼), dateUtil, dialogUtil, storageUtil, configUtil 등
```

## Path Alias
- `@/` → `app/src/` (craco-alias 설정)
- 내부 import는 **항상 `@/...` 사용**. 상대경로(`../../components`) 금지.
  ```js
  import { Button, Page, PageTitle } from '@/components';
  import SpaceService from '@/services/SpaceService';
  import useStores from '@/hooks/useStores';
  ```

## 페이지 템플릿
`pages/<domain>/<PageName>/<PageName>.jsx + .scss` 쌍. 레퍼런스: `pages/spaces/SpaceListPage/`.

```jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import useStores from '@/hooks/useStores';
import './SpaceListPage.scss';

function SpaceListPage() {
  const { t } = useTranslation();
  const { themeStore: { theme } } = useStores();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  return (
    <Page className="space-list-page-wrapper">
      <PageTitle
        name={t('스페이스 검색')}
        breadcrumbs={[
          { to: '/', text: t('HOME') },
          { to: '/spaces/search', text: t('스페이스 검색') },
        ]}
      >
        {t('스페이스 검색')}
      </PageTitle>
      <PageContent className="page-content">
        ...
      </PageContent>
    </Page>
  );
}

export default observer(SpaceListPage);
```

규칙:
- 함수형 컴포넌트만 (클래스 금지)
- MobX 스토어 접근 시 **export default observer(Component)**
- 모든 UI 문자열은 `t('한국어')` — 하드코딩 금지
- 최상단 래퍼: `<Page>` + `<PageTitle>` + `<PageContent>` 구성
- breadcrumb 필수 (루트는 `{ to: '/', text: t('HOME') }`)

## 서비스 (HTTP API) 패턴
**중요: Promise 체이닝이 아닌 콜백 기반.** 새 API도 반드시 동일 시그니처.

```js
// services/XxxService.js
import * as request from '@/utils/request';

const XxxService = {};

XxxService.selectXxxList = (projectId, successHandler, failHandler) => {
  return request.get(
    `/api/projects/${projectId}/xxx`,
    null,
    res => { successHandler(res); },
    failHandler,
  );
};

XxxService.createXxx = (projectId, payload, successHandler, failHandler) => {
  return request.post(
    `/api/projects/${projectId}/xxx`,
    payload,
    res => { successHandler(res); },
    failHandler,
  );
};

export default XxxService;
```

- 메서드명: `selectXxxList`, `selectXxxInfo`, `createXxx`, `updateXxx`, `deleteXxx` — 백엔드 서비스와 동일 규칙
- `@/utils/request` 의 `get / post / put / del` 래퍼 사용 (axios 직접 import 금지)
- 인증 토큰은 `request.js`의 axios interceptor에서 자동 주입 (`X-AUTH-TOKEN`, refresh 처리)
- 호출 측에서 사용:
  ```js
  XxxService.selectXxxList(projectId, list => setItems(list), null);
  ```

## MobX 스토어
- 루트 스토어: `stores/index.js`의 `RootStore` (userStore, controlStore, configStore, themeStore, contextStore, socketStore)
- 접근: `const { themeStore } = useStores();`
- 새 스토어 추가 시 `stores/XxxStore.js` + `RootStore` 생성자 등록
- 컴포넌트는 `observer(...)`로 감싸야 리렌더됨

## 스타일 (SCSS)
- 컴포넌트/페이지마다 `.scss` 파일 1:1 매칭, JSX 최상단에 `import './Foo.scss';`
- 최상위 래퍼 클래스는 `xxx-wrapper` / `xxx-page-wrapper` 패턴 (스코프 격리)
- `classnames` 라이브러리로 조건부 클래스 조합
- 테마: `themeStore.theme` + `THEMES` 상수 (`@/constants/constants`)

## i18n
- `react-i18next`의 `useTranslation()` 에서 `t`를 꺼내 사용
- 번역 리소스 파일에 새 키 등록 (기존 파일 구조 따라가기)
- 파라미터: `t('키', { name })` 형태

## 라우팅
- `react-router-dom` v6: `useNavigate`, `<Link to="...">`, `<Routes>`, `<Route>`
- 쿼리스트링: `useQueryString` 훅 (`query`, `setQuery`)
- 라우트 등록: `App.jsx`에서 관리

## 공통 컴포넌트 (재사용 우선)
가능하면 `@/components`에서 기존 컴포넌트 재사용:
Button, Input, TextArea, CheckBox, Radio, Switch, Selector, MultiSelector, ReactSelect, Modal, Table, Form, Label, Dl, Tag, Pill, Tabs, Card, Block, BlockRow, Page, PageTitle, PageContent, PageButtons, Search, EmptyContent, Loader, UserAvatar, UserSelector, MemberManager, DateRange, TestcaseItem, TestcaseSelector 등

신규 UI 추가 시 먼저 기존 것이 있는지 확인. 없을 때만 `components/<Name>/Name.jsx + .scss + index.js`로 생성.

## 기타
- PropTypes는 `proptypes/`에 공용 정의, 컴포넌트에서 참조
- 날짜: `moment` / `moment-timezone` + `@/utils/dateUtil`
- 다이얼로그/얼럿: `@/utils/dialogUtil` (직접 alert 금지)
- 로컬스토리지 접근: `@/utils/storageUtil`
- WebSocket: `react-stomp` + `SocketStore`
- 에디터: `@toast-ui/react-editor`

## Lint / Format
- ESLint: airbnb + prettier 기반 (`eslintConfig` in `package.json`)
- Prettier 자동 포맷을 IDE에서 켜둘 것. 수동 스타일 변경 금지.
