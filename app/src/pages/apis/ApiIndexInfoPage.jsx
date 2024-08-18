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
                BASE64(<span className="var">USER EMAIL</span>:<span className="var">USER TOKEN</span>)
              </span>
            </div>
          )}
          {isLogin && (
            <>
              {selectedUserTokenId && <div className="text">{`Authorization: ${btoa(`${user.email}:${userTokenList?.find(d => d.id === selectedUserTokenId)?.token}`)}`}</div>}
              {!selectedUserTokenId && (
                <div className="text">
                  Authorization:
                  <span className="function">
                    BASE64(<span className="var">USER EMAIL</span>:<span className="var">USER TOKEN</span>)
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
        </ul>
      </PageContent>
    </Page>
  );
}

ApiIndexInfoPage.defaultProps = {};

ApiIndexInfoPage.propTypes = {};

export default ApiIndexInfoPage;
