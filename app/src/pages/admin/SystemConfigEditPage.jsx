import React, { useEffect, useState } from 'react';
import { Button, EmptyContent, Form, Liner, Page, PageButtons, PageContent, PageTitle, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminService from '@/services/AdminService';
import LlmPromptEditPopup from '@/pages/admin/LlmPromptEditPopup/LlmPromptEditPopup';

function SystemInfoPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [info, setInfo] = useState({});
  const [defaultPromptInfo, setDefaultPromptInfo] = useState({});

  const getSystemInfo = () => {
    AdminService.selectSystemInfo(d => {
      setInfo(d);
    });
  };

  const getDefaultPromptInfo = () => {
    AdminService.selectDefaultPromptInfo(d => {
      setDefaultPromptInfo(d);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getDefaultPromptInfo();
    getSystemInfo();
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    AdminService.updateSystemInfo(info, () => {
      navigate('/admin/systems/config');
    });
  };

  const [llmPromptPopupInfo, setLlmPromptPopupInfo] = useState({
    isOpened: false,
    index: null,
    id: null,
    name: '',
    systemRole: '',
    prompt: '',
    activated: false,
  });

  return (
    <>
      <Page>
        <PageTitle
          name="시스템 설정 변경"
          breadcrumbs={[
            {
              to: '/',
              text: t('HOME'),
            },
            {
              to: '/admin',
              text: t('시스템 관리'),
            },
            {
              to: '/admin/systems/config',
              text: t('시스템 설정'),
            },
            {
              to: '/admin/systems/config/edit',
              text: t('시스템 설정 변경'),
            },
          ]}
          onListClick={() => {
            navigate('/');
          }}
        >
          {t('시스템 설정 변경')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title
              control={
                <Button
                  size="xs"
                  color="primary"
                  onClick={() => {
                    setLlmPromptPopupInfo({
                      isOpened: true,
                      index: null,
                    });
                  }}
                >
                  {t('프롬프트 추가')}
                </Button>
              }
            >
              {t('LLM 프롬프트 설정')}
            </Title>
            {!(info.llmPrompts?.length > 0) && (
              <EmptyContent className="empty-content">
                <div>{t('등록된 프롬프트가 없습니다.')}</div>
              </EmptyContent>
            )}
            {info.llmPrompts?.length > 0 && (
              <Table cols={['1px', '100%', '1px']} border>
                <THead>
                  <Tr>
                    <Th align="center">{t('이름')}</Th>
                    <Th align="left">{t('활성화')}</Th>
                    <Th />
                  </Tr>
                </THead>
                <Tbody>
                  {info.llmPrompts.map((llmPrompt, inx) => {
                    return (
                      <Tr key={inx}>
                        <Td>{llmPrompt.name}</Td>
                        <Td>{llmPrompt.activated ? <Tag border>ACTIVE</Tag> : null}</Td>
                        <Td>
                          <Button
                            size="xs"
                            color="danger"
                            onClick={() => {
                              const nextLlmPrompts = info.llmPrompts.slice(0);
                              nextLlmPrompts.splice(inx, 1);
                              setInfo({
                                ...info,
                                llmPrompts: nextLlmPrompts,
                              });
                            }}
                          >
                            {t('삭제')}
                          </Button>
                          <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 0.5rem " />
                          <Button
                            size="xs"
                            color="primary"
                            onClick={() => {
                              setLlmPromptPopupInfo({
                                ...llmPrompt,
                                isOpened: true,
                                index: inx,
                              });
                            }}
                          >
                            {t('변경')}
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}

            <PageButtons
              onCancel={() => {
                navigate('/admin/systems/config');
              }}
              onSubmit={() => {}}
              onCancelIcon=""
            />
          </Form>
        </PageContent>
      </Page>
      {llmPromptPopupInfo.isOpened && (
        <LlmPromptEditPopup
          data={llmPromptPopupInfo}
          defaultPromptInfo={defaultPromptInfo}
          setOpened={() => {
            setLlmPromptPopupInfo({
              isOpened: false,
            });
          }}
          onApply={llmPrompt => {
            const nextLlmPrompts = info.llmPrompts.slice(0);

            if (llmPrompt.activated && nextLlmPrompts?.length > 0) {
              nextLlmPrompts.forEach((prompt, index) => {
                const nextPrompt = prompt;
                if (nextPrompt.activated && index !== llmPrompt.index) {
                  nextPrompt.activated = false;
                }
              });
            }

            if (llmPrompt.index === null) {
              nextLlmPrompts.push(llmPrompt);
            } else {
              const nextLlmPrompt = nextLlmPrompts[llmPrompt.index];
              nextLlmPrompt.id = llmPrompt.id;
              nextLlmPrompt.name = llmPrompt.name;
              nextLlmPrompt.systemRole = llmPrompt.systemRole;
              nextLlmPrompt.prompt = llmPrompt.prompt;
              nextLlmPrompt.activated = llmPrompt.activated;
            }

            setInfo({
              ...info,
              llmPrompts: nextLlmPrompts,
            });
          }}
        />
      )}
    </>
  );
}

SystemInfoPage.defaultProps = {};

SystemInfoPage.propTypes = {};

export default SystemInfoPage;
