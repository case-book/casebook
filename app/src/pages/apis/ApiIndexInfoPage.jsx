import React, { useEffect, useState } from 'react';
import { Button, Page, PageContent, PageTitle, Selector, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import './ApiIndexInfoPage.scss';
import useStores from '@/hooks/useStores';
import RequestBuilderPopup from '@/pages/admin/AdminIndexInfoPage/RequestBuilderPopup';

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
                    <div className="method">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>/testruns
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestrunApiBuilder(true);
                          }}
                        >
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestrunApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        {
                          type: 'text',
                          value: '/api/automation/projects/',
                        },
                        {
                          type: 'variable',
                          value: 'PROJECT TOKEN',
                        },
                        {
                          type: 'text',
                          value: '/testcases/',
                        },
                        {
                          type: 'variable',
                          value: 'TESTCASE SEQ NUMBER',
                        },
                        {
                          type: 'text',
                          value: '/testruns',
                        },
                      ]}
                      setOpened={setIsOpenTestrunApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE</Tag>
                  </div>
                  <div className="explain">{t('JSON 숫자 배열로 테스트런 SEQ 번호 목록이 반환됩니다.')}</div>
                </div>
                <div className="result">[10, 20, 30]</div>
              </div>
            </div>
          </li>
          <li>
            <div className="name">{t('테스트케이스 결과 저장 API')}</div>
            <div className="description">{t('테스트런에 포함된 테스트케이스 테스트 결과를 저장합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method">POST</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testruns/<span className="var">TESTRUN SEQ NUMBER</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseResultApiBuilder(true);
                          }}
                        >
                          {t('빌더')}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isOpenTestcaseResultApiBuilder && (
                    <RequestBuilderPopup
                      path={[
                        {
                          type: 'text',
                          value: '/api/automation/projects/',
                        },
                        {
                          type: 'variable',
                          value: 'PROJECT TOKEN',
                        },
                        {
                          type: 'text',
                          value: '/testruns/',
                        },
                        {
                          type: 'variable',
                          value: 'TESTRUN SEQ NUMBER',
                        },
                        {
                          type: 'text',
                          value: '/testcases/',
                        },
                        {
                          type: 'variable',
                          value: 'TESTCASE SEQ NUMBER',
                        },
                      ]}
                      setOpened={setIsOpenTestcaseResultApiBuilder}
                    />
                  )}
                </div>
              </div>
              <div className="request-body">
                <div className="label">
                  <div>
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('테스트 결과 및 코멘트를 저장할 수 있습니다.')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['100px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>result</Td>
                        <Td>String</Td>
                        <Td>UNTESTED / UNTESTABLE / FAILED / PASSED {t('중 1개의 값')}</Td>
                      </Tr>
                      <Tr>
                        <Td>comment</Td>
                        <Td>String</Td>
                        <Td>{t('코멘트')}</Td>
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
                  <div className="explain">{t('HTTP STATUS 코드 값으로 성공 여부를 반환합니다.')}</div>
                </div>
                <div className="result">{t('성공 시 200')}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="name">{t('테스트케이스 목록 조회 API')}</div>
            <div className="description">{t('프로젝트에 속한 모든 테스트케이스 목록을 조회합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseListApiBuilder(true);
                          }}
                        >
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
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE</Tag>
                  </div>
                  <div className="explain">{t('테스트케이스 목록을 JSON 배열로 반환합니다. (id, seqId, testcaseGroupId, name, description, itemOrder, closed, creationDate 등)')}</div>
                </div>
                <div className="result">{'[{ "id": 1, "seqId": "TC1", "name": "..." }, ...]'}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="name">{t('테스트케이스 상세 조회 API')}</div>
            <div className="description">{t('테스트케이스의 SEQ 번호를 통해 해당 테스트케이스의 상세 정보를 조회합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method">GET</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseInfoApiBuilder(true);
                          }}
                        >
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
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE</Tag>
                  </div>
                  <div className="explain">{t('테스트케이스 상세 정보를 JSON 객체로 반환합니다. (id, seqId, name, description, testcaseGroupId, testcaseTemplateId, testcaseItems, testerType, testerValue 등)')}</div>
                </div>
                <div className="result">{'{ "id": 1, "seqId": "TC1", "name": "...", "testcaseItems": [...] }'}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="name">{t('테스트케이스 생성 API')}</div>
            <div className="description">
              {t('지정한 테스트케이스 그룹에 새로운 테스트케이스를 생성합니다. 테스트케이스 아이템 정보(testcaseItems)를 함께 전달하여 템플릿 아이템의 값을 지정할 수 있습니다. 아이템은 상세 조회 API 응답의 testcaseTemplateItemId를 기준으로 매칭됩니다.')}
            </div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method">POST</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseCreateApiBuilder(true);
                          }}
                        >
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
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('생성할 테스트케이스의 정보를 전달합니다.')}</div>
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
                        <Td>testcaseGroupSeqNumber</Td>
                        <Td>Number</Td>
                        <Td>{t('테스트케이스를 생성할 대상 테스트케이스 그룹의 SEQ 번호 (필수)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('테스트케이스 이름 (필수)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('테스트케이스 설명 (선택)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testerType</Td>
                        <Td>String</Td>
                        <Td>{t('테스터 지정 타입 (선택). 예: operation, tag, addUser')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testerValue</Td>
                        <Td>String</Td>
                        <Td>{t('테스터 지정 값 (선택). testerType에 따라 RND/SEQ, 태그명, 사용자 ID 등')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testcaseItems</Td>
                        <Td>Array</Td>
                        <Td>
                          {t('테스트케이스 아이템 목록 (선택). 각 아이템은 testcaseTemplateItemId(필수), type(text/value), value, text 필드로 구성됩니다.')}
                        </Td>
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
                  <div className="explain">{t('생성된 테스트케이스의 상세 정보를 JSON 객체로 반환합니다. (testcaseItems 포함)')}</div>
                </div>
                <div className="result">{'{ "id": 10, "seqId": "TC10", "name": "...", "testcaseItems": [{ "testcaseTemplateItemId": 3, "type": "text", "text": "..." }] }'}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="name">{t('테스트케이스 변경 API')}</div>
            <div className="description">
              {t('테스트케이스의 이름, 설명, 테스터, 아이템 정보를 변경합니다. 상세 조회 API 응답을 활용하여 testcaseTemplateItemId를 기준으로 아이템 값을 수정해서 전달할 수 있습니다. testcaseItems를 생략하면 기존 아이템은 유지됩니다.')}
            </div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method">PUT</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseUpdateApiBuilder(true);
                          }}
                        >
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
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('변경할 테스트케이스의 정보를 전달합니다.')}</div>
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
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('테스트케이스 이름 (필수)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('테스트케이스 설명 (선택)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testerType</Td>
                        <Td>String</Td>
                        <Td>{t('테스터 지정 타입 (선택)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testerValue</Td>
                        <Td>String</Td>
                        <Td>{t('테스터 지정 값 (선택)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>closed</Td>
                        <Td>Boolean</Td>
                        <Td>{t('테스트케이스 종료 여부 (선택)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>testcaseItems</Td>
                        <Td>Array</Td>
                        <Td>
                          {t('테스트케이스 아이템 목록 (선택). 상세 조회 응답의 testcaseTemplateItemId를 사용하여 매칭된 아이템의 value/text를 변경합니다.')}
                        </Td>
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
                  <div className="explain">{t('변경된 테스트케이스의 상세 정보를 JSON 객체로 반환합니다. (testcaseItems 포함)')}</div>
                </div>
                <div className="result">{'{ "id": 10, "seqId": "TC10", "name": "...", "testcaseItems": [...] }'}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="name">{t('테스트케이스 삭제 API')}</div>
            <div className="description">{t('테스트케이스의 SEQ 번호를 통해 해당 테스트케이스를 삭제합니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method">DELETE</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcases/
                      <span className="var">TESTCASE SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseDeleteApiBuilder(true);
                          }}
                        >
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
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE</Tag>
                  </div>
                  <div className="explain">{t('HTTP STATUS 코드 값으로 성공 여부를 반환합니다.')}</div>
                </div>
                <div className="result">{t('성공 시 200')}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="name">{t('테스트케이스 그룹 생성 API')}</div>
            <div className="description">{t('프로젝트에 새로운 테스트케이스 그룹을 생성합니다. parentSeqNumber를 지정하면 하위 그룹으로 생성됩니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method">POST</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseGroupCreateApiBuilder(true);
                          }}
                        >
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
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('생성할 테스트케이스 그룹의 정보를 전달합니다.')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['180px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>parentSeqNumber</Td>
                        <Td>Number</Td>
                        <Td>{t('상위 그룹의 SEQ 번호 (선택). 생략 시 최상위 그룹으로 생성')}</Td>
                      </Tr>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('그룹 이름 (필수)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('그룹 설명 (선택)')}</Td>
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
                  <div className="explain">{t('생성된 테스트케이스 그룹의 정보를 JSON 객체로 반환합니다.')}</div>
                </div>
                <div className="result">{'{ "id": 5, "seqId": "G5", "name": "...", "parentId": null, "depth": 0 }'}</div>
              </div>
            </div>
          </li>
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
                    <div className="method">PUT</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups/
                      <span className="var">GROUP SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseGroupUpdateApiBuilder(true);
                          }}
                        >
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
                    <Tag border>REQUEST BODY</Tag>
                  </div>
                  <div className="explain">{t('변경할 테스트케이스 그룹의 정보를 전달합니다.')}</div>
                </div>
                <div className="result">
                  <Table size="sm" cols={['180px', '100px', '']} border>
                    <THead>
                      <Tr>
                        <Th align="left">{t('이름')}</Th>
                        <Th align="left">{t('타입')}</Th>
                        <Th align="left">{t('설명')}</Th>
                      </Tr>
                    </THead>
                    <Tbody>
                      <Tr>
                        <Td>name</Td>
                        <Td>String</Td>
                        <Td>{t('그룹 이름 (필수)')}</Td>
                      </Tr>
                      <Tr>
                        <Td>description</Td>
                        <Td>String</Td>
                        <Td>{t('그룹 설명 (선택)')}</Td>
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
                  <div className="explain">{t('변경된 테스트케이스 그룹의 정보를 JSON 객체로 반환합니다.')}</div>
                </div>
                <div className="result">{'{ "id": 5, "seqId": "G5", "name": "..." }'}</div>
              </div>
            </div>
          </li>
          <li>
            <div className="name">{t('테스트케이스 그룹 삭제 API')}</div>
            <div className="description">{t('테스트케이스 그룹의 SEQ 번호를 통해 해당 그룹을 삭제합니다. 하위 그룹과 그 안의 테스트케이스도 함께 삭제됩니다.')}</div>
            <div className="req-res">
              <div className="request">
                <div className="label">
                  <Tag border>REQUEST</Tag>
                </div>
                <div className="request-info">
                  <div className="spec">
                    <div className="method">DELETE</div>
                    <div className="path">
                      /api/automation/projects/<span className="var">PROJECT TOKEN</span>/testcase-groups/
                      <span className="var">GROUP SEQ NUMBER</span>
                    </div>
                    {isLogin && (
                      <div className="builder">
                        <Button
                          size="xs"
                          color="primary"
                          onClick={() => {
                            setIsOpenTestcaseGroupDeleteApiBuilder(true);
                          }}
                        >
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
              <div className="response">
                <div className="label">
                  <div>
                    <Tag border>RESPONSE</Tag>
                  </div>
                  <div className="explain">{t('HTTP STATUS 코드 값으로 성공 여부를 반환합니다.')}</div>
                </div>
                <div className="result">{t('성공 시 200')}</div>
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
