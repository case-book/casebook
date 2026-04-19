import React, { useEffect, useState } from 'react';
import { Button, Page, PageContent, PageTitle, Selector, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import './ApiIndexInfoPage.scss';
import useStores from '@/hooks/useStores';
import RequestBuilderPopup from '@/pages/admin/AdminIndexInfoPage/RequestBuilderPopup';

const TESTCASE_LIST_EXAMPLE = `[
  {
    "id": 1,
    "seqId": "TC1",
    "testcaseGroupId": 5,
    "testcaseTemplateId": 2,
    "projectReleaseIds": [10],
    "name": "로그인 정상 케이스-1",
    "itemOrder": 0,
    "closed": false,
    "description": "이메일과 비밀번호가 일치하는 경우",
    "creationDate": "2026-04-19T10:30:00"
  },
  {
    "id": 2,
    "seqId": "TC2",
    "testcaseGroupId": 5,
    "testcaseTemplateId": 2,
    "projectReleaseIds": [],
    "name": "로그인 실패 케이스-2",
    "itemOrder": 1,
    "closed": false,
    "description": "비밀번호가 일치하지 않는 경우",
    "creationDate": "2026-04-19T10:31:00"
  }
]`;

const TESTCASE_DETAIL_EXAMPLE = `{
  "id": 1,
  "seqId": "TC1",
  "projectId": 3,
  "testcaseGroupId": 5,
  "testcaseTemplateId": 2,
  "projectReleaseIds": [10],
  "name": "로그인 정상 케이스-1",
  "itemOrder": 0,
  "closed": false,
  "description": "이메일과 비밀번호가 일치하는 경우",
  "testerType": "operation",
  "testerValue": "RND",
  "createdUserName": "홍길동",
  "lastUpdatedUserName": "홍길동",
  "creationDate": "2026-04-19T10:30:00",
  "lastUpdateDate": "2026-04-19T11:00:00",
  "testcaseItems": [
    {
      "id": 101,
      "testcaseId": 1,
      "testcaseTemplateItemId": 20,
      "type": "text",
      "value": null,
      "text": "이메일/비밀번호를 입력한다."
    },
    {
      "id": 102,
      "testcaseId": 1,
      "testcaseTemplateItemId": 21,
      "type": "value",
      "value": "Y",
      "text": null
    }
  ]
}`;

const TESTCASE_GROUP_EXAMPLE = `{
  "id": 5,
  "seqId": "G5",
  "parentId": null,
  "depth": 0,
  "name": "로그인-5",
  "description": "로그인 관련 테스트케이스 그룹",
  "itemOrder": 0,
  "testcases": [
    {
      "id": 1,
      "seqId": "TC1",
      "testcaseGroupId": 5,
      "testcaseTemplateId": 2,
      "projectReleaseIds": [10],
      "name": "로그인 정상 케이스-1",
      "itemOrder": 0,
      "closed": false,
      "description": "이메일과 비밀번호가 일치하는 경우",
      "creationDate": "2026-04-19T10:30:00"
    }
  ]
}`;

const TESTCASE_RESULT_REQUEST_EXAMPLE = `{
  "result": "PASSED",
  "comment": "정상 동작 확인"
}`;

const TESTCASE_CREATE_REQUEST_EXAMPLE = `{
  "testcaseGroupSeqNumber": 5,
  "name": "로그인 정상 케이스",
  "description": "이메일과 비밀번호가 일치하는 경우",
  "testerType": "operation",
  "testerValue": "RND",
  "testcaseItems": [
    {
      "testcaseTemplateItemId": 20,
      "type": "text",
      "text": "이메일/비밀번호를 입력한다."
    },
    {
      "testcaseTemplateItemId": 21,
      "type": "value",
      "value": "Y"
    }
  ]
}`;

const TESTCASE_UPDATE_REQUEST_EXAMPLE = `{
  "name": "로그인 정상 케이스",
  "description": "이메일과 비밀번호가 모두 유효한 경우",
  "testerType": "operation",
  "testerValue": "RND",
  "closed": false,
  "testcaseItems": [
    {
      "testcaseTemplateItemId": 20,
      "type": "text",
      "text": "유효한 이메일과 비밀번호를 입력한다."
    },
    {
      "testcaseTemplateItemId": 21,
      "type": "value",
      "value": "N"
    }
  ]
}`;

const TESTCASE_GROUP_CREATE_REQUEST_EXAMPLE = `{
  "parentSeqNumber": null,
  "name": "로그인",
  "description": "로그인 관련 테스트케이스 그룹"
}`;

const TESTCASE_GROUP_UPDATE_REQUEST_EXAMPLE = `{
  "name": "로그인",
  "description": "로그인 기능 전반에 대한 테스트케이스"
}`;

const TESTCASE_TEMPLATE_LIST_EXAMPLE = `[
  {
    "id": 2,
    "name": "기본 템플릿",
    "defaultTemplate": true,
    "defaultTesterType": "operation",
    "defaultTesterValue": "RND",
    "testcaseTemplateItems": [
      {
        "id": 20,
        "category": "CASE",
        "type": "EDITOR",
        "itemOrder": 0,
        "label": "테스트 절차",
        "options": null,
        "size": 12,
        "defaultValue": null,
        "defaultType": "text",
        "description": "단계별 수행 절차",
        "example": "1. 로그인 버튼 클릭\\n2. 이메일 입력",
        "editable": true,
        "systemLabel": null
      },
      {
        "id": 21,
        "category": "CASE",
        "type": "CHECKBOX",
        "itemOrder": 1,
        "label": "자동화 여부",
        "options": ["Y", "N"],
        "size": 4,
        "defaultValue": "N",
        "defaultType": "value",
        "description": "자동화 테스트 대상인지 여부",
        "example": null,
        "editable": true,
        "systemLabel": "AUTOMATION"
      }
    ]
  }
]`;

const TESTCASE_TEMPLATE_DETAIL_EXAMPLE = `{
  "id": 2,
  "name": "기본 템플릿",
  "defaultTemplate": true,
  "defaultTesterType": "operation",
  "defaultTesterValue": "RND",
  "testcaseTemplateItems": [
    {
      "id": 20,
      "category": "CASE",
      "type": "EDITOR",
      "itemOrder": 0,
      "label": "테스트 절차",
      "options": null,
      "size": 12,
      "defaultValue": null,
      "defaultType": "text",
      "description": "단계별 수행 절차",
      "example": "1. 로그인 버튼 클릭\\n2. 이메일 입력",
      "editable": true,
      "systemLabel": null
    },
    {
      "id": 21,
      "category": "CASE",
      "type": "CHECKBOX",
      "itemOrder": 1,
      "label": "자동화 여부",
      "options": ["Y", "N"],
      "size": 4,
      "defaultValue": "N",
      "defaultType": "value",
      "description": "자동화 테스트 대상인지 여부",
      "example": null,
      "editable": true,
      "systemLabel": "AUTOMATION"
    }
  ]
}`;

const PROJECT_INFO_EXAMPLE = `{
  "id": 3,
  "name": "CASEBOOK",
  "description": "메인 프로덕트",
  "token": "d6ae0639-13a5-4f7d-b413-0f63369c94f2",
  "activated": true,
  "spaceName": "MINDPLATES",
  "spaceCode": "MP",
  "defaultTestcaseTemplateId": 2,
  "aiEnabled": true,
  "creationDate": "2026-01-15T09:00:00"
}`;

const RELEASE_LIST_EXAMPLE = `[
  {
    "id": 10,
    "name": "v2.2.0",
    "isTarget": true,
    "description": "다음 릴리스 대상"
  },
  {
    "id": 9,
    "name": "v2.1.4",
    "isTarget": false,
    "description": "이전 릴리스"
  }
]`;

const USER_LIST_EXAMPLE = `[
  {
    "userId": 1,
    "name": "홍길동",
    "email": "gildong@example.com",
    "role": "ADMIN",
    "tags": "frontend,qa"
  },
  {
    "userId": 2,
    "name": "김철수",
    "email": "chulsoo@example.com",
    "role": "USER",
    "tags": "backend"
  }
]`;

const USER_TAG_LIST_EXAMPLE = '["backend", "frontend", "qa"]';

const TESTCASE_GROUP_LIST_EXAMPLE = `[
  {
    "id": 5,
    "seqId": "G5",
    "parentId": null,
    "depth": 0,
    "name": "로그인-5",
    "description": "로그인 관련 테스트케이스 그룹",
    "itemOrder": 0,
    "testcases": [
      {
        "id": 1,
        "seqId": "TC1",
        "testcaseGroupId": 5,
        "testcaseTemplateId": 2,
        "projectReleaseIds": [10],
        "name": "로그인 정상 케이스-1",
        "itemOrder": 0,
        "closed": false,
        "description": "이메일과 비밀번호가 일치하는 경우",
        "creationDate": "2026-04-19T10:30:00"
      }
    ]
  },
  {
    "id": 6,
    "seqId": "G6",
    "parentId": 5,
    "depth": 1,
    "name": "로그인실패-6",
    "description": "로그인 실패 시나리오",
    "itemOrder": 0,
    "testcases": []
  }
]`;

const FILE_UPLOAD_EXAMPLE = `{
  "id": 42,
  "name": "login-screen.png",
  "type": "image/png",
  "path": "/files/d6ae0639/TESTCASE/42/login-screen.png",
  "size": 18234,
  "spaceCode": "MP",
  "projectId": 3,
  "uuid": "8f2e3a1c-..."
}`;

const TESTRUN_CREATE_REQUEST_EXAMPLE = `{
  "name": "자동 생성 테스트런",
  "description": "소스 분석 기반 회귀 테스트",
  "startDateTime": "2026-04-20T10:00:00",
  "endDateTime": "2026-04-20T18:00:00",
  "opened": true,
  "autoTestcaseNotAssignedTester": true,
  "assignSequenceTestcaseSameTester": false,
  "addConnectedSequenceTestcase": false,
  "testrunUserIds": [1, 2],
  "testcaseSeqNumbers": [1, 2, 3, 10],
  "testcaseGroupSeqNumbers": [5]
}`;

const TESTRUN_CREATE_RESPONSE_EXAMPLE = `{
  "id": 15,
  "seqId": "R15",
  "name": "자동 생성 테스트런",
  "description": "소스 분석 기반 회귀 테스트",
  "startDateTime": "2026-04-20T10:00:00",
  "endDateTime": "2026-04-20T18:00:00",
  "opened": true,
  "totalTestcaseCount": 8,
  "passedTestcaseCount": 0,
  "failedTestcaseCount": 0,
  "untestableTestcaseCount": 0
}`;

function ApiIndexInfoPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [userTokenList, setUserTokenList] = useState([]);
  const [selectedUserTokenId, setSelectedUserTokenId] = useState(null);

  const [isOpenTestrunApiBuilder, setIsOpenTestrunApiBuilder] = useState(false);
  const [isOpenTestcaseResultApiBuilder, setIsOpenTestcaseResultApiBuilder] = useState(false);
  const [isOpenTestcaseListApiBuilder, setIsOpenTestcaseListApiBuilder] = useState(false);
  const [isOpenTestcaseInfoApiBuilder, setIsOpenTestcaseInfoApiBuilder] = useState(false);
  const [isOpenTestcaseCreateApiBuilder, setIsOpenTestcaseCreateApiBuilder] = useState(false);
  const [isOpenTestcaseUpdateApiBuilder, setIsOpenTestcaseUpdateApiBuilder] = useState(false);
  const [isOpenTestcaseDeleteApiBuilder, setIsOpenTestcaseDeleteApiBuilder] = useState(false);
  const [isOpenTestcaseGroupCreateApiBuilder, setIsOpenTestcaseGroupCreateApiBuilder] = useState(false);
  const [isOpenTestcaseGroupUpdateApiBuilder, setIsOpenTestcaseGroupUpdateApiBuilder] = useState(false);
  const [isOpenTestcaseGroupDeleteApiBuilder, setIsOpenTestcaseGroupDeleteApiBuilder] = useState(false);
  const [isOpenTestcaseTemplateListApiBuilder, setIsOpenTestcaseTemplateListApiBuilder] = useState(false);
  const [isOpenTestcaseTemplateInfoApiBuilder, setIsOpenTestcaseTemplateInfoApiBuilder] = useState(false);
  const [isOpenProjectInfoApiBuilder, setIsOpenProjectInfoApiBuilder] = useState(false);
  const [isOpenReleaseListApiBuilder, setIsOpenReleaseListApiBuilder] = useState(false);
  const [isOpenUserListApiBuilder, setIsOpenUserListApiBuilder] = useState(false);
  const [isOpenUserTagListApiBuilder, setIsOpenUserTagListApiBuilder] = useState(false);
  const [isOpenTestcaseGroupListApiBuilder, setIsOpenTestcaseGroupListApiBuilder] = useState(false);
  const [isOpenTestcaseGroupInfoApiBuilder, setIsOpenTestcaseGroupInfoApiBuilder] = useState(false);
  const [isOpenTestcaseGroupTestcasesApiBuilder, setIsOpenTestcaseGroupTestcasesApiBuilder] = useState(false);
  const [isOpenTestcaseSearchApiBuilder, setIsOpenTestcaseSearchApiBuilder] = useState(false);
  const [isOpenTestcaseFileApiBuilder, setIsOpenTestcaseFileApiBuilder] = useState(false);
  const [isOpenTestrunCreateApiBuilder, setIsOpenTestrunCreateApiBuilder] = useState(false);

  const {
    userStore: { user, isLogin },
  } = useStores();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLogin) {
      UserService.getUserTokenList(tokens => {
        setUserTokenList(tokens);
        if (tokens?.length > 0) {
          setSelectedUserTokenId(tokens[0].id);
        }
      });
    }
  }, [isLogin]);

  const testcaseItemFieldTable = (
    <Table size="sm" cols={['220px', '100px', '100px', '']} border>
      <THead>
        <Tr>
          <Th align="left">{t('이름')}</Th>
          <Th align="left">{t('타입')}</Th>
          <Th align="left">{t('필수')}</Th>
          <Th align="left">{t('설명')}</Th>
        </Tr>
      </THead>
      <Tbody>
        <Tr>
          <Td>testcaseTemplateItemId</Td>
          <Td>Number</Td>
          <Td>{t('필수')}</Td>
          <Td>{t('연결할 테스트케이스 템플릿 아이템의 ID. 상세 조회 API 응답의 testcaseItems[].testcaseTemplateItemId 값을 그대로 사용합니다.')}</Td>
        </Tr>
        <Tr>
          <Td>type</Td>
          <Td>String</Td>
          <Td>{t('선택')}</Td>
          <Td>{t('아이템 값 종류. "text"(리치텍스트/에디터) 또는 "value"(일반 값). 템플릿 아이템의 타입에 맞춰 지정합니다.')}</Td>
        </Tr>
        <Tr>
          <Td>value</Td>
          <Td>String</Td>
          <Td>{t('선택')}</Td>
          <Td>{t('type이 "value"일 때의 값. 예: "Y", "SEQ", 사용자 ID 등.')}</Td>
        </Tr>
        <Tr>
          <Td>text</Td>
          <Td>String</Td>
          <Td>{t('선택')}</Td>
          <Td>{t('type이 "text"일 때의 본문 텍스트 (HTML/Markdown).')}</Td>
        </Tr>
      </Tbody>
    </Table>
  );

  const testcaseItemResponseTable = (
    <Table size="sm" cols={['200px', '100px', '']} border>
      <THead>
        <Tr>
          <Th align="left">{t('이름')}</Th>
          <Th align="left">{t('타입')}</Th>
          <Th align="left">{t('설명')}</Th>
        </Tr>
      </THead>
      <Tbody>
        <Tr>
          <Td>id</Td>
          <Td>Number</Td>
          <Td>{t('테스트케이스 아이템의 고유 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>testcaseId</Td>
          <Td>Number</Td>
          <Td>{t('소속 테스트케이스의 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>testcaseTemplateItemId</Td>
          <Td>Number</Td>
          <Td>{t('연결된 테스트케이스 템플릿 아이템의 ID. 생성/변경 시 매칭 키로 사용.')}</Td>
        </Tr>
        <Tr>
          <Td>type</Td>
          <Td>String</Td>
          <Td>{t('아이템 값의 종류. "text" 또는 "value".')}</Td>
        </Tr>
        <Tr>
          <Td>value</Td>
          <Td>String</Td>
          <Td>{t('type이 "value"일 때의 값 (type이 "text"면 null).')}</Td>
        </Tr>
        <Tr>
          <Td>text</Td>
          <Td>String</Td>
          <Td>{t('type이 "text"일 때의 본문 (type이 "value"면 null).')}</Td>
        </Tr>
      </Tbody>
    </Table>
  );

  const testcaseDetailResponseTable = (
    <Table size="sm" cols={['200px', '120px', '']} border>
      <THead>
        <Tr>
          <Th align="left">{t('이름')}</Th>
          <Th align="left">{t('타입')}</Th>
          <Th align="left">{t('설명')}</Th>
        </Tr>
      </THead>
      <Tbody>
        <Tr>
          <Td>id</Td>
          <Td>Number</Td>
          <Td>{t('테스트케이스의 고유 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>seqId</Td>
          <Td>String</Td>
          <Td>{t('프로젝트 내 테스트케이스 식별자. "TC" 접두사 + SEQ 번호. (예: "TC10")')}</Td>
        </Tr>
        <Tr>
          <Td>projectId</Td>
          <Td>Number</Td>
          <Td>{t('소속 프로젝트의 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>testcaseGroupId</Td>
          <Td>Number</Td>
          <Td>{t('소속 테스트케이스 그룹의 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>testcaseTemplateId</Td>
          <Td>Number</Td>
          <Td>{t('적용된 테스트케이스 템플릿의 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>projectReleaseIds</Td>
          <Td>Array&lt;Number&gt;</Td>
          <Td>{t('연관된 프로젝트 릴리스 ID 목록.')}</Td>
        </Tr>
        <Tr>
          <Td>name</Td>
          <Td>String</Td>
          <Td>{t('테스트케이스 이름. 생성 시 "-<SEQ>" 접미가 자동 추가됩니다.')}</Td>
        </Tr>
        <Tr>
          <Td>itemOrder</Td>
          <Td>Number</Td>
          <Td>{t('그룹 내에서의 정렬 순서 (0부터).')}</Td>
        </Tr>
        <Tr>
          <Td>closed</Td>
          <Td>Boolean</Td>
          <Td>{t('종료(보관) 여부. true이면 테스트런에 선택되지 않습니다.')}</Td>
        </Tr>
        <Tr>
          <Td>description</Td>
          <Td>String</Td>
          <Td>{t('테스트케이스 설명.')}</Td>
        </Tr>
        <Tr>
          <Td>testerType</Td>
          <Td>String</Td>
          <Td>{t('테스터 지정 타입. "operation" | "tag" | "addUser".')}</Td>
        </Tr>
        <Tr>
          <Td>testerValue</Td>
          <Td>String</Td>
          <Td>{t('테스터 지정 값. testerType에 따라 "RND"/"SEQ", 태그명, 사용자 ID 문자열 중 하나.')}</Td>
        </Tr>
        <Tr>
          <Td>createdUserName</Td>
          <Td>String</Td>
          <Td>{t('최초 생성한 사용자 이름.')}</Td>
        </Tr>
        <Tr>
          <Td>lastUpdatedUserName</Td>
          <Td>String</Td>
          <Td>{t('마지막으로 수정한 사용자 이름.')}</Td>
        </Tr>
        <Tr>
          <Td>creationDate</Td>
          <Td>String (ISO-8601)</Td>
          <Td>{t('생성 일시.')}</Td>
        </Tr>
        <Tr>
          <Td>lastUpdateDate</Td>
          <Td>String (ISO-8601)</Td>
          <Td>{t('마지막 수정 일시.')}</Td>
        </Tr>
        <Tr>
          <Td>testcaseItems</Td>
          <Td>Array&lt;TestcaseItem&gt;</Td>
          <Td>{t('테스트케이스 아이템 배열. 각 아이템의 필드는 아래 테이블 참조.')}</Td>
        </Tr>
      </Tbody>
    </Table>
  );

  const testcaseListResponseTable = (
    <Table size="sm" cols={['200px', '120px', '']} border>
      <THead>
        <Tr>
          <Th align="left">{t('이름')}</Th>
          <Th align="left">{t('타입')}</Th>
          <Th align="left">{t('설명')}</Th>
        </Tr>
      </THead>
      <Tbody>
        <Tr>
          <Td>id</Td>
          <Td>Number</Td>
          <Td>{t('테스트케이스의 고유 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>seqId</Td>
          <Td>String</Td>
          <Td>{t('프로젝트 내 테스트케이스 식별자. (예: "TC10")')}</Td>
        </Tr>
        <Tr>
          <Td>testcaseGroupId</Td>
          <Td>Number</Td>
          <Td>{t('소속 테스트케이스 그룹의 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>testcaseTemplateId</Td>
          <Td>Number</Td>
          <Td>{t('적용된 테스트케이스 템플릿의 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>projectReleaseIds</Td>
          <Td>Array&lt;Number&gt;</Td>
          <Td>{t('연관된 프로젝트 릴리스 ID 목록.')}</Td>
        </Tr>
        <Tr>
          <Td>name</Td>
          <Td>String</Td>
          <Td>{t('테스트케이스 이름.')}</Td>
        </Tr>
        <Tr>
          <Td>itemOrder</Td>
          <Td>Number</Td>
          <Td>{t('그룹 내에서의 정렬 순서 (0부터).')}</Td>
        </Tr>
        <Tr>
          <Td>closed</Td>
          <Td>Boolean</Td>
          <Td>{t('종료(보관) 여부.')}</Td>
        </Tr>
        <Tr>
          <Td>description</Td>
          <Td>String</Td>
          <Td>{t('테스트케이스 설명.')}</Td>
        </Tr>
        <Tr>
          <Td>creationDate</Td>
          <Td>String (ISO-8601)</Td>
          <Td>{t('생성 일시.')}</Td>
        </Tr>
      </Tbody>
    </Table>
  );

  const testcaseGroupResponseTable = (
    <Table size="sm" cols={['200px', '180px', '']} border>
      <THead>
        <Tr>
          <Th align="left">{t('이름')}</Th>
          <Th align="left">{t('타입')}</Th>
          <Th align="left">{t('설명')}</Th>
        </Tr>
      </THead>
      <Tbody>
        <Tr>
          <Td>id</Td>
          <Td>Number</Td>
          <Td>{t('테스트케이스 그룹의 고유 ID.')}</Td>
        </Tr>
        <Tr>
          <Td>seqId</Td>
          <Td>String</Td>
          <Td>{t('프로젝트 내 그룹 식별자. "G" 접두사 + SEQ 번호. (예: "G5")')}</Td>
        </Tr>
        <Tr>
          <Td>parentId</Td>
          <Td>Number</Td>
          <Td>{t('상위 그룹의 ID. 최상위면 null.')}</Td>
        </Tr>
        <Tr>
          <Td>depth</Td>
          <Td>Number</Td>
          <Td>{t('트리 깊이. 최상위는 0.')}</Td>
        </Tr>
        <Tr>
          <Td>name</Td>
          <Td>String</Td>
          <Td>{t('그룹 이름. 생성 시 "-<SEQ>" 접미가 자동 추가됩니다.')}</Td>
        </Tr>
        <Tr>
          <Td>description</Td>
          <Td>String</Td>
          <Td>{t('그룹 설명.')}</Td>
        </Tr>
        <Tr>
          <Td>itemOrder</Td>
          <Td>Number</Td>
          <Td>{t('같은 상위 그룹 내에서의 정렬 순서 (0부터).')}</Td>
        </Tr>
        <Tr>
          <Td>testcases</Td>
          <Td>Array&lt;TestcaseList&gt;</Td>
          <Td>{t('그룹에 소속된 테스트케이스 목록 (목록 조회 스키마와 동일).')}</Td>
        </Tr>
      </Tbody>
    </Table>
  );

  const testcaseTemplateResponseTable = (
    <Table size="sm" cols={['200px', '180px', '']} border>
      <THead>
        <Tr>
          <Th align="left">{t('이름')}</Th>
          <Th align="left">{t('타입')}</Th>
          <Th align="left">{t('설명')}</Th>
        </Tr>
      </THead>
      <Tbody>
        <Tr>
          <Td>id</Td>
          <Td>Number</Td>
          <Td>{t('테스트케이스 템플릿의 고유 ID. 테스트케이스 생성 시 참고.')}</Td>
        </Tr>
        <Tr>
          <Td>name</Td>
          <Td>String</Td>
          <Td>{t('템플릿 이름.')}</Td>
        </Tr>
        <Tr>
          <Td>defaultTemplate</Td>
          <Td>Boolean</Td>
          <Td>{t('기본 템플릿 여부. 테스트케이스 생성 시 별도 지정이 없으면 이 템플릿이 적용됩니다.')}</Td>
        </Tr>
        <Tr>
          <Td>defaultTesterType</Td>
          <Td>String</Td>
          <Td>{t('템플릿의 기본 테스터 지정 타입. "operation" | "tag" | "addUser".')}</Td>
        </Tr>
        <Tr>
          <Td>defaultTesterValue</Td>
          <Td>String</Td>
          <Td>{t('템플릿의 기본 테스터 지정 값 (예: "RND", "SEQ", 태그명, 사용자 ID 문자열).')}</Td>
        </Tr>
        <Tr>
          <Td>testcaseTemplateItems</Td>
          <Td>Array&lt;TestcaseTemplateItem&gt;</Td>
          <Td>{t('템플릿에 포함된 아이템 목록. 각 아이템의 필드는 아래 테이블 참조.')}</Td>
        </Tr>
      </Tbody>
    </Table>
  );

  const testcaseTemplateItemResponseTable = (
    <Table size="sm" cols={['180px', '180px', '']} border>
      <THead>
        <Tr>
          <Th align="left">{t('이름')}</Th>
          <Th align="left">{t('타입')}</Th>
          <Th align="left">{t('설명')}</Th>
        </Tr>
      </THead>
      <Tbody>
        <Tr>
          <Td>id</Td>
          <Td>Number</Td>
          <Td>{t('테스트케이스 템플릿 아이템의 고유 ID. 테스트케이스 생성/변경 시 testcaseItems[].testcaseTemplateItemId에 그대로 사용합니다.')}</Td>
        </Tr>
        <Tr>
          <Td>category</Td>
          <Td>String</Td>
          <Td>{t('아이템 카테고리. "CASE"(케이스 작성용) | "RESULT"(결과 기록용).')}</Td>
        </Tr>
        <Tr>
          <Td>type</Td>
          <Td>String</Td>
          <Td>{t('UI 렌더링 타입. "CHECKBOX" | "RADIO" | "TEXT" | "NUMBER" | "USER" | "SELECT" | "URL" | "EDITOR".')}</Td>
        </Tr>
        <Tr>
          <Td>itemOrder</Td>
          <Td>Number</Td>
          <Td>{t('템플릿 내 정렬 순서 (0부터).')}</Td>
        </Tr>
        <Tr>
          <Td>label</Td>
          <Td>String</Td>
          <Td>{t('아이템 레이블 (UI 표시 이름).')}</Td>
        </Tr>
        <Tr>
          <Td>options</Td>
          <Td>Array&lt;String&gt;</Td>
          <Td>{t('CHECKBOX/RADIO/SELECT 타입일 때 선택 가능한 값 목록. 그 외엔 null.')}</Td>
        </Tr>
        <Tr>
          <Td>size</Td>
          <Td>Number</Td>
          <Td>{t('UI 컬럼 너비(1~12 그리드 기준).')}</Td>
        </Tr>
        <Tr>
          <Td>defaultValue</Td>
          <Td>String</Td>
          <Td>{t('기본값. 테스트케이스 생성 시 testcaseItems에 별도 지정이 없으면 이 값으로 초기화됩니다.')}</Td>
        </Tr>
        <Tr>
          <Td>defaultType</Td>
          <Td>String</Td>
          <Td>{t('기본값이 적용될 때 사용하는 type. "text" 또는 "value".')}</Td>
        </Tr>
        <Tr>
          <Td>description</Td>
          <Td>String</Td>
          <Td>{t('아이템 설명 (UI 가이드 문구).')}</Td>
        </Tr>
        <Tr>
          <Td>example</Td>
          <Td>String</Td>
          <Td>{t('입력 예시.')}</Td>
        </Tr>
        <Tr>
          <Td>editable</Td>
          <Td>Boolean</Td>
          <Td>{t('사용자가 값을 수정할 수 있는지 여부.')}</Td>
        </Tr>
        <Tr>
          <Td>systemLabel</Td>
          <Td>String</Td>
          <Td>{t('시스템이 특별한 의미로 사용하는 태그. 예: "AUTOMATION"(자동화 여부 아이템).')}</Td>
        </Tr>
      </Tbody>
    </Table>
  );

  return (
    <Page className="apis-index-info-page-wrapper">
      <PageTitle
        borderTop
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: '/apis',
            text: 'APIS',
          },
        ]}
        onListClick={() => {
          navigate('/');
        }}
      >
        APIS
      </PageTitle>
      <PageContent className="page-content">
        <Title border={false} marginBottom={false}>
          {t('API 요청 헤더')}
        </Title>
        <p>{t('API 인증을 위해서는 요청 헤더에 사용자 인증 정보가 포함되어 있어야 합니다. 헤더에 Basic 인증을 통해 사용자 이메일과 사용자 토큰을 Base64로 인코딩하여 전달합니다.')}</p>
        <div className="code">
          {!isLogin && (
            <div className="text">
              Authorization:
              <span className="function">
                Basic BASE64(<span className="var">USER EMAIL</span>:<span className="var">USER TOKEN</span>)
              </span>
            </div>
          )}
          {isLogin && (
            <>
              {selectedUserTokenId && <div className="text">{`Authorization: Basic ${btoa(`${user.email}:${userTokenList?.find(d => d.id === selectedUserTokenId)?.token}`)}`}</div>}
              {!selectedUserTokenId && (
                <div className="text">
                  Authorization:
                  <span className="function">
                    Basic BASE64(<span className="var">USER EMAIL</span>:<span className="var">USER TOKEN</span>)
                  </span>
                </div>
              )}
              <div className="token-selector">
                <div className="user-token">{t('사용자 인증 토큰')}</div>
                <Selector
                  size="sm"
                  value={selectedUserTokenId}
                  items={[{ key: null, value: t('선택 안함') }].concat(
                    userTokenList.map(d => {
                      return { key: d.id, value: d.name };
                    }),
                  )}
                  onChange={val => {
                    setSelectedUserTokenId(val);
                  }}
                />
              </div>
            </>
          )}
        </div>
        <Title border={false} marginBottom={false}>
          {t('API 목록')}
        </Title>
        <ul className="apis">
          {/* 1. 프로젝트 정보 조회 */}
          <li>
            <div className="name">{t('프로젝트 정보 조회')}</div>
            <div className="description">{t('프로젝트의 기본 정보(id, name, spaceCode, 기본 템플릿 ID 등)를 조회합니다. 자동화 파이프라인의 시작점에서 컨텍스트를 확보할 때 사용합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenProjectInfoApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenProjectInfoApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }]}
                      setOpened={setIsOpenProjectInfoApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('프로젝트 기본 정보')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['200px', '180px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>id</Td>
                        <Td>Number</Td>
                        <Td>{t('프로젝트 고유 ID.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 설명.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>token</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰 (요청 시 사용).')}</Td>
                      </Tr>
                      <Tr>
                        <Td>activated</Td>
                        <Td>Boolean</Td>
                        <Td>{t('활성화 여부.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>spaceName</Td>
                        <Td>String</Td>
                        <Td>{t('소속 스페이스 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>spaceCode</Td>
                        <Td>String</Td>
                        <Td>{t('스페이스 코드.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>defaultTestcaseTemplateId</Td>
                        <Td>Number</Td>
                        <Td>{t('프로젝트의 기본 테스트케이스 템플릿 ID. 테스트케이스 생성 시 기본값으로 사용됨.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>aiEnabled</Td>
                        <Td>Boolean</Td>
                        <Td>{t('AI 기능 활성화 여부.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>creationDate</Td>
                        <Td>String (ISO-8601)</Td>
                        <Td>{t('프로젝트 생성 일시.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{PROJECT_INFO_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 2. 프로젝트 릴리스 목록 조회 */}
          <li>
            <div className="name">{t('프로젝트 릴리스 목록 조회')}</div>
            <div className="description">{t('프로젝트의 모든 릴리스 목록을 조회합니다. 테스트케이스에 연결할 projectReleaseIds 값을 확인할 때 사용합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/releases
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenReleaseListApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenReleaseListApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/releases' }]}
                      setOpened={setIsOpenReleaseListApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('릴리스 배열 요소 필드')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['200px', '180px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>id</Td>
                        <Td>Number</Td>
                        <Td>{t('릴리스 고유 ID. 테스트케이스의 projectReleaseIds에 이 값을 지정합니다.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('릴리스 이름 (예: v2.2.0).')}</Td>
                      </Tr>
                      <Tr>
                        <Td>isTarget</Td>
                        <Td>Boolean</Td>
                        <Td>{t('현재 타겟 릴리스(테스트케이스 생성 시 자동 연결 대상) 여부.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('릴리스 설명.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{RELEASE_LIST_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 3. 프로젝트 사용자 목록 조회 */}
          <li>
            <div className="name">{t('프로젝트 사용자 목록 조회')}</div>
            <div className="description">{t('프로젝트에 속한 사용자 목록을 조회합니다. 테스터 지정(testerType=addUser) 시 사용할 userId를 확인하거나, 테스트런 생성의 testrunUserIds에 넣을 값을 확보할 때 사용합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/users
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenUserListApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenUserListApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/users' }]}
                      setOpened={setIsOpenUserListApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('사용자 배열 요소 필드')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['200px', '180px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>userId</Td>
                        <Td>Number</Td>
                        <Td>{t('사용자 ID. testerType=addUser일 때 testerValue에 이 값을 문자열로 넣거나, 테스트런의 testrunUserIds에 사용.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('사용자 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>email</Td>
                        <Td>String</Td>
                        <Td>{t('사용자 이메일.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>role</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 내 역할. ADMIN | USER.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>tags</Td>
                        <Td>String</Td>
                        <Td>{t('해당 사용자에게 부여된 태그. 쉼표 구분 문자열 (예: frontend,qa).')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{USER_LIST_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 4. 프로젝트 사용자 태그 목록 조회 */}
          <li>
            <div className="name">{t('프로젝트 사용자 태그 목록 조회')}</div>
            <div className="description">{t('프로젝트에 등록된 사용자 태그 목록을 조회합니다. testerType=tag로 테스터를 지정할 때 사용 가능한 태그명 확인용입니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/user-tags
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenUserTagListApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenUserTagListApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/user-tags' }]}
                      setOpened={setIsOpenUserTagListApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('태그 문자열 배열 (정렬/중복 제거됨).')}</div>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{USER_TAG_LIST_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 5. 테스트케이스 템플릿 목록 조회 */}
          <li>
            <div className="name">{t('테스트케이스 템플릿 목록 조회 API')}</div>
            <div className="description">
              {t(
                '프로젝트에 정의된 테스트케이스 템플릿 목록과 각 템플릿의 아이템 정의를 조회합니다. 테스트케이스 생성/변경 API에서 사용할 testcaseTemplateItemId(아이템별 id)를 여기서 확인할 수 있습니다.',
              )}
            </div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-templates
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseTemplateListApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseTemplateListApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcase-templates' },
                      ]}
                      setOpened={setIsOpenTestcaseTemplateListApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('템플릿 배열의 각 요소 필드')}</div>
                </div>
                <div className="result">{testcaseTemplateResponseTable}</div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS - testcaseTemplateItems[]</Tag>
                  </div>
                  <div className="explain">{t('템플릿 아이템 요소 필드')}</div>
                </div>
                <div className="result">{testcaseTemplateItemResponseTable}</div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_TEMPLATE_LIST_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>

          {/* 6. 테스트케이스 템플릿 상세 조회 */}
          <li>
            <div className="name">{t('테스트케이스 템플릿 상세 조회 API')}</div>
            <div className="description">{t('특정 테스트케이스 템플릿의 상세 정보(아이템 포함)를 조회합니다. 목록 조회로 얻은 id를 사용합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-templates/
                      <span className="var">TESTCASE TEMPLATE ID</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseTemplateInfoApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseTemplateInfoApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcase-templates/' },
                        { type: 'variable', value: 'TESTCASE TEMPLATE ID' },
                      ]}
                      setOpened={setIsOpenTestcaseTemplateInfoApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>TESTCASE TEMPLATE ID</Td>
                        <Td>Number</Td>
                        <Td>{t('조회할 테스트케이스 템플릿의 ID. 목록 조회 응답의 id 값을 그대로 사용합니다. (SEQ 번호가 아닌 내부 ID)')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('테스트케이스 템플릿 상세 정보')}</div>
                </div>
                <div className="result">{testcaseTemplateResponseTable}</div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS - testcaseTemplateItems[]</Tag>
                  </div>
                </div>
                <div className="result">{testcaseTemplateItemResponseTable}</div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_TEMPLATE_DETAIL_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 7. 테스트케이스 그룹 목록 조회 */}
          <li>
            <div className="name">{t('테스트케이스 그룹 목록 조회')}</div>
            <div className="description">{t('프로젝트의 모든 테스트케이스 그룹을 트리 구조로 조회합니다. 각 그룹은 parentId/depth/itemOrder 정보와 소속 테스트케이스 목록을 함께 반환합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseGroupListApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseGroupListApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/testcase-groups' }]}
                      setOpened={setIsOpenTestcaseGroupListApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('배열 각 요소는 테스트케이스 그룹. 필드 구조는 테스트케이스 그룹 생성 API 응답 참조.')}</div>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_GROUP_LIST_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 8. 테스트케이스 그룹 상세 조회 */}
          <li>
            <div className="name">{t('테스트케이스 그룹 상세 조회')}</div>
            <div className="description">{t('특정 테스트케이스 그룹의 상세 정보를 조회합니다. 소속된 테스트케이스 목록도 testcases 필드로 함께 반환됩니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups/<span className="var">GROUP SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseGroupInfoApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseGroupInfoApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/testcase-groups/' }, { type: 'variable', value: 'GROUP SEQ NUMBER' }]}
                      setOpened={setIsOpenTestcaseGroupInfoApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>GROUP SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('조회할 그룹의 SEQ 번호. (G5면 5)')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('테스트케이스 그룹 상세 (testcases 포함). 필드 구조는 테스트케이스 그룹 생성 API 응답 참조.')}</div>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_GROUP_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 9. 테스트케이스 그룹 하위 테스트케이스 조회 */}
          <li>
            <div className="name">{t('테스트케이스 그룹 하위 테스트케이스 조회')}</div>
            <div className="description">{t('특정 테스트케이스 그룹에 속한 테스트케이스만 필터링하여 목록을 반환합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups/<span className="var">GROUP SEQ NUMBER</span>/testcases
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseGroupTestcasesApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseGroupTestcasesApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/testcase-groups/' }, { type: 'variable', value: 'GROUP SEQ NUMBER' }, { type: 'text', value: '/testcases' }]}
                      setOpened={setIsOpenTestcaseGroupTestcasesApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>GROUP SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('그룹 SEQ 번호.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('테스트케이스 목록. 각 요소의 필드는 테스트케이스 목록 조회 API 참조.')}</div>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_LIST_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 10. 테스트케이스 그룹 생성 */}
          <li>
            <div className="name">{t('테스트케이스 그룹 생성 API')}</div>
            <div className="description">{t('프로젝트에 새로운 테스트케이스 그룹을 생성합니다. parentSeqNumber를 지정하면 해당 그룹의 하위로 생성됩니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method post">POST</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseGroupCreateApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseGroupCreateApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcase-groups' },
                      ]}
                      setOpened={setIsOpenTestcaseGroupCreateApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('생성할 테스트케이스 그룹의 정보를 전달합니다.')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('필수')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>parentSeqNumber</Td>
                        <Td>Number</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('상위 그룹의 SEQ 번호. 생략/null이면 최상위 그룹으로 생성됩니다.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('그룹 이름. 저장 시 "-<SEQ>" 접미가 자동 추가됩니다.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('그룹 설명.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_GROUP_CREATE_REQUEST_EXAMPLE}</pre>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('생성된 테스트케이스 그룹 정보')}</div>
                </div>
                <div className="result">{testcaseGroupResponseTable}</div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_GROUP_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>

          {/* 11. 테스트케이스 그룹 변경 */}
          <li>
            <div className="name">{t('테스트케이스 그룹 변경 API')}</div>
            <div className="description">{t('테스트케이스 그룹의 이름과 설명을 변경합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method put">PUT</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups/
                      <span className="var">GROUP SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseGroupUpdateApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseGroupUpdateApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcase-groups/' },
                        { type: 'variable', value: 'GROUP SEQ NUMBER' },
                      ]}
                      setOpened={setIsOpenTestcaseGroupUpdateApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>GROUP SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('변경할 테스트케이스 그룹의 SEQ 번호. ("G5"면 5)')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('변경할 그룹 정보를 전달합니다.')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('필수')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('그룹 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('그룹 설명. 생략 시 기존 값 유지.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>parentSeqNumber</Td>
                        <Td>Number</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('참고: 본 API에서는 사용되지 않으며 상위 그룹 이동은 지원하지 않습니다.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_GROUP_UPDATE_REQUEST_EXAMPLE}</pre>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('변경된 테스트케이스 그룹 정보')}</div>
                </div>
                <div className="result">{testcaseGroupResponseTable}</div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_GROUP_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>

          {/* 12. 테스트케이스 그룹 삭제 */}
          <li>
            <div className="name">{t('테스트케이스 그룹 삭제 API')}</div>
            <div className="description">{t('테스트케이스 그룹의 SEQ 번호를 통해 해당 그룹을 삭제합니다. 하위 그룹, 그 안의 테스트케이스, 관련 테스트런 실행 이력이 모두 함께 삭제됩니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method delete">DELETE</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups/
                      <span className="var">GROUP SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseGroupDeleteApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseGroupDeleteApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcase-groups/' },
                        { type: 'variable', value: 'GROUP SEQ NUMBER' },
                      ]}
                      setOpened={setIsOpenTestcaseGroupDeleteApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>GROUP SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('삭제할 테스트케이스 그룹의 SEQ 번호.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE</Tag>
                  </div>
                  <div className="explain">{t('응답 본문 없음. HTTP STATUS로 성공 여부를 반환합니다.')}</div>
                </div>
                <div className="result">{t('성공 시 200 OK')}</div>
              </div>
            </div>
          </li>

          {/* 13. 테스트케이스 목록 조회 */}
          <li>
            <div className="name">{t('테스트케이스 목록 조회 API')}</div>
            <div className="description">{t('프로젝트에 속한 모든 테스트케이스를 목록 스키마로 조회합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseListApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseListApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcases' },
                      ]}
                      setOpened={setIsOpenTestcaseListApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('테스트케이스 목록 객체 배열. 배열 각 요소의 필드는 아래와 같습니다.')}</div>
                </div>
                <div className="result">{testcaseListResponseTable}</div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_LIST_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>

          {/* 14. 테스트케이스 검색 */}
          <li>
            <div className="name">{t('테스트케이스 검색')}</div>
            <div className="description">{t('이름으로 테스트케이스를 검색합니다. 대소문자 구분 없는 부분 일치 검색입니다. 자동화 스크립트가 동일/유사한 테스트케이스 중복 생성을 방지할 때 유용합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/search
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseSearchApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseSearchApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/testcases/search' }]}
                      setOpened={setIsOpenTestcaseSearchApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>QUERY PARAMETERS</Tag>
                  </div>
                  <div className="explain">{t('쿼리 파라미터')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['180px','100px','100px','']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('필수')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('검색 키워드. 테스트케이스 name 필드에 대한 contains(ignore-case) 매칭. 생략/빈 값이면 전체 목록 반환.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('테스트케이스 목록. 각 요소의 필드는 테스트케이스 목록 조회 API 참조.')}</div>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_LIST_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 15. 테스트케이스 상세 조회 */}
          <li>
            <div className="name">{t('테스트케이스 상세 조회 API')}</div>
            <div className="description">{t('테스트케이스의 SEQ 번호를 통해 해당 테스트케이스의 상세 정보(아이템 포함)를 조회합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseInfoApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseInfoApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcases/' },
                        { type: 'variable', value: 'TESTCASE SEQ NUMBER' },
                      ]}
                      setOpened={setIsOpenTestcaseInfoApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>TESTCASE SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('테스트케이스의 SEQ 번호.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('테스트케이스 상세 정보')}</div>
                </div>
                <div className="result">{testcaseDetailResponseTable}</div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS - testcaseItems[]</Tag>
                  </div>
                  <div className="explain">{t('testcaseItems 배열 요소의 필드')}</div>
                </div>
                <div className="result">{testcaseItemResponseTable}</div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_DETAIL_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>

          {/* 16. 테스트케이스 생성 */}
          <li>
            <div className="name">{t('테스트케이스 생성 API')}</div>
            <div className="description">
              {t(
                '지정한 테스트케이스 그룹에 새로운 테스트케이스를 생성합니다. 테스트케이스 아이템 정보(testcaseItems)를 함께 전달하여 템플릿 아이템의 값을 지정할 수 있습니다. 아이템은 상세 조회 API 응답의 testcaseTemplateItemId를 기준으로 매칭됩니다.',
              )}
            </div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method post">POST</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseCreateApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseCreateApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcases' },
                      ]}
                      setOpened={setIsOpenTestcaseCreateApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('생성할 테스트케이스의 정보를 전달합니다.')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('필수')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>testcaseGroupSeqNumber</Td>
                        <Td>Number</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('테스트케이스를 생성할 대상 테스트케이스 그룹의 SEQ 번호. (예: "G5"이면 5)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('테스트케이스 이름. 저장 시 "-<SEQ>" 접미가 자동 추가됩니다.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('테스트케이스 설명.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testerType</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('테스터 지정 타입. "operation" | "tag" | "addUser". 생략 시 템플릿 기본값 사용.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testerValue</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('testerType에 따른 값. operation이면 "RND"/"SEQ", tag이면 태그명, addUser이면 사용자 ID 문자열.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testcaseItems</Td>
                        <Td>Array&lt;TestcaseItem&gt;</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('템플릿 아이템별 값 목록. 각 요소 필드는 아래 테이블 참조. 생략 시 템플릿의 기본값으로 초기화됩니다.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY - testcaseItems[]</Tag>
                  </div>
                  <div className="explain">{t('testcaseItems 배열 요소 구조')}</div>
                </div>
                <div className="result">{testcaseItemFieldTable}</div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_CREATE_REQUEST_EXAMPLE}</pre>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('생성된 테스트케이스의 상세 정보')}</div>
                </div>
                <div className="result">{testcaseDetailResponseTable}</div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS - testcaseItems[]</Tag>
                  </div>
                </div>
                <div className="result">{testcaseItemResponseTable}</div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_DETAIL_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>

          {/* 17. 테스트케이스 변경 */}
          <li>
            <div className="name">{t('테스트케이스 변경 API')}</div>
            <div className="description">
              {t(
                '테스트케이스의 이름, 설명, 테스터, 종료 여부, 아이템 정보를 변경합니다. 상세 조회 API 응답의 testcaseTemplateItemId를 기준으로 매칭하여 아이템 값을 수정합니다. testcaseItems를 생략하면 기존 아이템은 유지됩니다.',
              )}
            </div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method put">PUT</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseUpdateApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseUpdateApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcases/' },
                        { type: 'variable', value: 'TESTCASE SEQ NUMBER' },
                      ]}
                      setOpened={setIsOpenTestcaseUpdateApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>TESTCASE SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('변경할 테스트케이스의 SEQ 번호.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('변경할 테스트케이스의 정보를 전달합니다.')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('필수')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('테스트케이스 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('테스트케이스 설명. null을 보내면 그대로 반영되어 빈 값으로 저장됩니다.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testerType</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('테스터 지정 타입. 생략 시 기존 값 유지.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testerValue</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('테스터 지정 값. 생략 시 기존 값 유지.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>closed</Td>
                        <Td>Boolean</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('종료(보관) 여부. 생략 시 기존 값 유지.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testcaseItems</Td>
                        <Td>Array&lt;TestcaseItem&gt;</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('변경할 아이템 목록. testcaseTemplateItemId로 매칭하여 value/text를 갱신합니다. 생략 시 기존 아이템이 그대로 유지됩니다.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY - testcaseItems[]</Tag>
                  </div>
                </div>
                <div className="result">{testcaseItemFieldTable}</div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_UPDATE_REQUEST_EXAMPLE}</pre>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('변경된 테스트케이스의 상세 정보')}</div>
                </div>
                <div className="result">{testcaseDetailResponseTable}</div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS - testcaseItems[]</Tag>
                  </div>
                </div>
                <div className="result">{testcaseItemResponseTable}</div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_DETAIL_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>

          {/* 18. 테스트케이스 파일 첨부 */}
          <li>
            <div className="name">{t('테스트케이스 파일 첨부')}</div>
            <div className="description">{t('테스트케이스에 첨부 파일(이미지/스펙 문서 등)을 업로드합니다. multipart/form-data 형식으로 전송해야 합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method post">POST</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/<span className="var">TESTCASE SEQ NUMBER</span>/files
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseFileApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseFileApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/testcases/' }, { type: 'variable', value: 'TESTCASE SEQ NUMBER' }, { type: 'text', value: '/files' }]}
                      setOpened={setIsOpenTestcaseFileApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>TESTCASE SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('파일을 첨부할 테스트케이스의 SEQ 번호.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>FORM PARAMETERS (multipart/form-data)</Tag>
                  </div>
                  <div className="explain">{t('multipart/form-data 필드')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['180px','140px','100px','']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('필수')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>file</Td>
                        <Td>File</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('업로드할 파일 (multipart 바이너리).')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('파일 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>size</Td>
                        <Td>Number</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('파일 크기(byte).')}</Td>
                      </Tr>
                      <Tr>
                        <Td>type</Td>
                        <Td>String</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('MIME 타입 (예: image/png).')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('업로드된 파일 정보')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['200px', '180px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>id</Td>
                        <Td>Number</Td>
                        <Td>{t('파일 ID.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('파일 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>type</Td>
                        <Td>String</Td>
                        <Td>{t('MIME 타입.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>path</Td>
                        <Td>String</Td>
                        <Td>{t('서버에 저장된 파일 경로 (이미지 태그 src 등으로 활용).')}</Td>
                      </Tr>
                      <Tr>
                        <Td>size</Td>
                        <Td>Number</Td>
                        <Td>{t('파일 크기 (byte).')}</Td>
                      </Tr>
                      <Tr>
                        <Td>spaceCode</Td>
                        <Td>String</Td>
                        <Td>{t('스페이스 코드.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>projectId</Td>
                        <Td>Number</Td>
                        <Td>{t('프로젝트 ID.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>uuid</Td>
                        <Td>String</Td>
                        <Td>{t('파일 UUID.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{FILE_UPLOAD_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 19. 테스트케이스 삭제 */}
          <li>
            <div className="name">{t('테스트케이스 삭제 API')}</div>
            <div className="description">{t('테스트케이스의 SEQ 번호를 통해 해당 테스트케이스를 삭제합니다. 연관된 아이템과 테스트런 실행 이력도 함께 제거됩니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method delete">DELETE</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseDeleteApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseDeleteApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcases/' },
                        { type: 'variable', value: 'TESTCASE SEQ NUMBER' },
                      ]}
                      setOpened={setIsOpenTestcaseDeleteApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>TESTCASE SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('삭제할 테스트케이스의 SEQ 번호.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE</Tag>
                  </div>
                  <div className="explain">{t('응답 본문 없음. HTTP STATUS로 성공 여부를 반환합니다.')}</div>
                </div>
                <div className="result">{t('성공 시 200 OK')}</div>
              </div>
            </div>
          </li>

          {/* 20. 테스트런 생성 */}
          <li>
            <div className="name">{t('테스트런 생성')}</div>
            <div className="description">{t('지정한 테스트케이스들로 새 테스트런을 생성합니다. testcaseSeqNumbers(개별 지정) 또는 testcaseGroupSeqNumbers(그룹 전체) 중 하나 이상을 반드시 지정해야 합니다. 둘 다 주면 합집합이 대상이 됩니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method post">POST</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testruns
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestrunCreateApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestrunCreateApiBuilder && (
                    <RequestBuilderPopup
                      path={[{ type: 'text', value: '/api/automation/projects/' }, { type: 'variable', value: 'PROJECT TOKEN' }, { type: 'text', value: '/testruns' }]}
                      setOpened={setIsOpenTestrunCreateApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('요청 본문 필드')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px','160px','100px','']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('필수')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('테스트런 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('테스트런 설명.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>startDateTime</Td>
                        <Td>String (ISO-8601)</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('시작 일시.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>endDateTime</Td>
                        <Td>String (ISO-8601)</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('종료 일시.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>opened</Td>
                        <Td>Boolean</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('생성 직후 오픈 상태로 둘지 여부. 생략 시 true.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>autoTestcaseNotAssignedTester</Td>
                        <Td>Boolean</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('자동화 플래그가 있는 테스트케이스의 테스터 자동 배정을 건너뛸지 여부.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>addConnectedSequenceTestcase</Td>
                        <Td>Boolean</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('시퀀스 그래프로 연결된 테스트케이스를 자동 포함할지 여부.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>assignSequenceTestcaseSameTester</Td>
                        <Td>Boolean</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('시퀀스로 연결된 케이스에 동일 테스터를 할당할지 여부.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testrunUserIds</Td>
                        <Td>Array&lt;Number&gt;</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('테스트런 참여자의 userId 목록. 비어있으면 자동 테스터 배정이 이뤄지지 않음.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testcaseSeqNumbers</Td>
                        <Td>Array&lt;Number&gt;</Td>
                        <Td>{t('선택*')}</Td>
                        <Td>{t('포함할 개별 테스트케이스 SEQ 번호 목록.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testcaseGroupSeqNumbers</Td>
                        <Td>Array&lt;Number&gt;</Td>
                        <Td>{t('선택*')}</Td>
                        <Td>{t('포함할 테스트케이스 그룹의 SEQ 번호 목록(해당 그룹의 모든 케이스 포함). 둘 중 하나는 필수.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTRUN_CREATE_REQUEST_EXAMPLE}</pre>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('생성된 테스트런 정보')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['200px', '180px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>id</Td>
                        <Td>Number</Td>
                        <Td>{t('테스트런 고유 ID.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>seqId</Td>
                        <Td>String</Td>
                        <Td>{t('테스트런 식별자. R + SEQ 번호. 결과 저장 API의 TESTRUN SEQ NUMBER에 이 SEQ 번호를 사용합니다.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('테스트런 이름.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('테스트런 설명.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>startDateTime</Td>
                        <Td>String (ISO-8601)</Td>
                        <Td>{t('시작 일시.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>endDateTime</Td>
                        <Td>String (ISO-8601)</Td>
                        <Td>{t('종료 일시.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>opened</Td>
                        <Td>Boolean</Td>
                        <Td>{t('오픈 상태.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>totalTestcaseCount</Td>
                        <Td>Number</Td>
                        <Td>{t('포함된 테스트케이스 수.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>passedTestcaseCount</Td>
                        <Td>Number</Td>
                        <Td>{t('성공으로 기록된 건수.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>failedTestcaseCount</Td>
                        <Td>Number</Td>
                        <Td>{t('실패로 기록된 건수.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>untestableTestcaseCount</Td>
                        <Td>Number</Td>
                        <Td>{t('테스트 불가로 기록된 건수.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTRUN_CREATE_RESPONSE_EXAMPLE}</pre>
                </div>
              </div>
            </div>
          </li>
          {/* 21. 테스트케이스가 포함된 테스트런 SEQ 번호 조회 */}
          <li>
            <div className="name">{t('테스트케이스가 포함된 테스트런 SEQ 번호 조회 API')}</div>
            <div className="description">{t('테스트케이스의 SEQ 번호를 통해, 해당 테스트케이스가 포함되어 실행 중인 테스트런 SEQ 번호 목록을 조회할 수 있습니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method get">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>/testruns
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestrunApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestrunApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testcases/' },
                        { type: 'variable', value: 'TESTCASE SEQ NUMBER' },
                        { type: 'text', value: '/testruns' },
                      ]}
                      setOpened={setIsOpenTestrunApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                  <div className="explain">{t('경로에 포함되는 변수 설명')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트의 토큰 값. 프로젝트 설정 화면에서 확인할 수 있습니다.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>TESTCASE SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('테스트케이스 SEQ 번호. seqId가 "TC10"이면 10.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE FIELDS</Tag>
                  </div>
                  <div className="explain">{t('Number 배열 (각 요소는 테스트런 SEQ 번호)')}</div>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>[10, 20, 30]</pre>
                </div>
              </div>
            </div>
          </li>

          {/* 22. 테스트케이스 결과 저장 */}
          <li>
            <div className="name">{t('테스트케이스 결과 저장 API')}</div>
            <div className="description">{t('테스트런에 포함된 테스트케이스의 테스트 결과를 저장합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method post">POST</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testruns/<span className="var">TESTRUN SEQ NUMBER</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button size="xs" color="primary" onClick={() => setIsOpenTestcaseResultApiBuilder(true)}>
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseResultApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        { type: 'text', value: '/api/automation/projects/' },
                        { type: 'variable', value: 'PROJECT TOKEN' },
                        { type: 'text', value: '/testruns/' },
                        { type: 'variable', value: 'TESTRUN SEQ NUMBER' },
                        { type: 'text', value: '/testcases/' },
                        { type: 'variable', value: 'TESTCASE SEQ NUMBER' },
                      ]}
                      setOpened={setIsOpenTestcaseResultApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>PATH PARAMETERS</Tag>
                  </div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['220px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>PROJECT TOKEN</Td>
                        <Td>String</Td>
                        <Td>{t('프로젝트 토큰.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>TESTRUN SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('테스트런의 SEQ 번호. (예: "R15"이면 15)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>TESTCASE SEQ NUMBER</Td>
                        <Td>Number</Td>
                        <Td>{t('테스트케이스의 SEQ 번호.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('테스트 결과 및 코멘트를 저장합니다.')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['180px', '100px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('필수')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>result</Td>
                        <Td>String</Td>
                        <Td>{t('필수')}</Td>
                        <Td>{t('테스트 결과 코드. "UNTESTED" | "UNTESTABLE" | "FAILED" | "PASSED" 중 하나.')}</Td>
                      </Tr>
                      <Tr>
                        <Td>comment</Td>
                        <Td>String</Td>
                        <Td>{t('선택')}</Td>
                        <Td>{t('결과와 함께 저장할 코멘트.')}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY EXAMPLE</Tag>
                  </div>
                </div>
                <div className="result">
                  <pre>{TESTCASE_RESULT_REQUEST_EXAMPLE}</pre>
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE</Tag>
                  </div>
                  <div className="explain">{t('응답 본문 없음. HTTP STATUS로 성공 여부를 반환합니다.')}</div>
                </div>
                <div className="result">{t('성공 시 200 OK')}</div>
              </div>
            </div>
          </li>

        </ul>
      </PageContent>
    </Page>
  );
}

ApiIndexInfoPage.defaultProps = {};

ApiIndexInfoPage.propTypes = {};

export default ApiIndexInfoPage;
