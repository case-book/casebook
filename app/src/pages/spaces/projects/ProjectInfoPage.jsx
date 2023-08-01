import React, { useEffect, useState } from 'react';
import {
  Block,
  Button,
  Card,
  CardContent,
  CardHeader,
  EmptyContent,
  Label,
  Page,
  PageButtons,
  PageContent,
  PageTitle,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  THead,
  Title,
  TokenList,
  Tr,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import TestcaseTemplateEditorPopup from '@/pages/spaces/projects/TestcaseTemplateEditorPopup/TestcaseTemplateEditorPopup';
import MemberCardManager from '@/components/MemberManager/MemberCardManager';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import './ProjectInfoPage.scss';
import useStores from '@/hooks/useStores';
import TokenDialog from '@/pages/common/Header/TokenDialog';
import SpaceService from '@/services/SpaceService';
import JiraProjectIntegrationEditPopup from '@/pages/spaces/JiraProjectIntegrationEditPopup';

function ProjectInfoPage() {
  const { t } = useTranslation();
  const {
    userStore: { isAdmin },
  } = useStores();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [project, setProject] = useState(null);
  const [projectTokenList, setProjectTokenList] = useState([]);
  const [tagUserMap, setTagUserMap] = useState({});
  const [integration, setIntegration] = useState(null);
  const [templateViewerPopupInfo, setTemplateViewerPopupInfo] = useState({
    opened: false,
    testcaseTemplate: null,
  });

  const [createTokenPopupOpened, setCreateTokenPopupOpened] = useState(false);
  const [updateTokenPopupOpened, setUpdateTokenPopupOpened] = useState(false);
  const [updateTokenPopupInfo, setUpdateTokenPopupInfo] = useState({
    id: '',
    name: '',
    token: '',
    lastAccess: '',
    enabled: true,
  });
  const [jiraProjectPopupOpened, setJiraProjectTokenPopupOpened] = useState(false);

  useEffect(() => {
    SpaceService.selectSpaceInfo(spaceCode, info => {
      setSpace(info);
    });
  }, [spaceCode]);

  const createProjectToken = (name, enabled) => {
    ProjectService.createProjectToken(spaceCode, projectId, { name, enabled }, projectToken => {
      const nextProjectTokenList = projectTokenList.slice(0);
      nextProjectTokenList.push(projectToken);
      setProjectTokenList(nextProjectTokenList);
      setCreateTokenPopupOpened(false);
    });
  };

  const updateProjectToken = (id, name, enabled) => {
    ProjectService.updateProjectToken(spaceCode, projectId, id, { name, enabled }, userToken => {
      const nextProjectTokenList = projectTokenList.slice(0);
      const targetTokenIndex = nextProjectTokenList.findIndex(d => d.id === id);
      if (targetTokenIndex > -1) {
        nextProjectTokenList[targetTokenIndex] = userToken;
        setProjectTokenList(nextProjectTokenList);
      }
      setUpdateTokenPopupOpened(false);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);

      const nextTagUserMap = {};
      info.users.forEach(user => {
        const currentTags = user.tags?.split(';').filter(d => !!d) || [];
        currentTags.forEach(tag => {
          if (!nextTagUserMap[tag]) {
            nextTagUserMap[tag] = [];
          }

          nextTagUserMap[tag].push(user);
        });
      });

      setTagUserMap(nextTagUserMap);
    });

    ProjectService.getProjectTokenList(spaceCode, projectId, tokens => {
      setProjectTokenList(tokens);
    });

    ProjectService.getIntegrationInfo(spaceCode, projectId, res => setIntegration({ ...res }));
  }, [projectId]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('프로젝트 삭제'),
      <div>{t('@ 프로젝트 및 프로젝트에 포함된 모든 정보가 삭제됩니다. 삭제하시겠습니까?', { projectName: project.name })}</div>,
      () => {
        ProjectService.deleteProject(spaceCode, project, () => {
          navigate(`/spaces/${spaceCode}/projects`);
        });
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  const onWithdraw = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('프로젝트 탈퇴'),
      <div>{t('프로젝트를 탈퇴하면, @ 프로젝트에 더 이상 접근할 수 없습니다. 탈퇴하시겠습니까?', { projectName: project.name })}</div>,
      () => {
        ProjectService.withdrawProject(spaceCode, project, () => {
          navigate(`/spaces/${spaceCode}/projects`);
        });
      },
      null,
      t('탈퇴'),
      null,
      'danger',
    );
  };

  const deleteProjectToken = id => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('토큰 삭제'),
      <div>{t('인증 토큰을 삭제하면, 해당 토큰을 사용하여 더 이상 로그인 할 수 없습니다. 삭제하시겠습니까?')}</div>,
      () => {
        ProjectService.deleteProjectToken(spaceCode, projectId, id, () => {
          const nextProjectTokenList = projectTokenList.slice(0);
          const targetTokenIndex = nextProjectTokenList.findIndex(d => d.id === id);
          if (targetTokenIndex > -1) {
            nextProjectTokenList.splice(targetTokenIndex, 1);
          }
          setProjectTokenList(nextProjectTokenList);
        });
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  return (
    <>
      <Page className="project-info-page-wrapper">
        <PageTitle
          name={t('프로젝트 정보')}
          breadcrumbs={[
            {
              to: '/',
              text: t('HOME'),
            },
            {
              to: '/',
              text: t('스페이스 목록'),
            },
            {
              to: `/spaces/${spaceCode}/info`,
              text: space?.name,
            },
            {
              to: `/spaces/${spaceCode}/projects`,
              text: t('프로젝트 목록'),
            },
            {
              to: `/spaces/${spaceCode}/projects/${projectId}/info`,
              text: project?.name,
            },
          ]}
          links={
            isAdmin || project?.admin
              ? [
                  {
                    to: `/spaces/${spaceCode}/projects/${project?.id}/edit`,
                    text: t('편집'),
                    color: 'primary',
                  },
                ]
              : null
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects`);
          }}
        >
          {t('프로젝트')}
        </PageTitle>
        <PageContent>
          <Title border={false} marginBottom={false}>
            {t('프로젝트 정보')}
          </Title>
          <Block>
            <BlockRow>
              <Label>{t('스페이스')}</Label>
              <Text>{project?.spaceName}</Text>
            </BlockRow>
            <BlockRow>
              <Label>{t('이름')}</Label>
              <Text>{project?.name}</Text>
            </BlockRow>
            <BlockRow>
              <Label>{t('설명')}</Label>
              <Text>{project?.description}</Text>
            </BlockRow>
            <BlockRow>
              <Label>{t('활성화')}</Label>
              <Text>{project?.activated ? 'Y' : 'N'}</Text>
            </BlockRow>
          </Block>
          <Title
            border={false}
            marginBottom={false}
            control={
              <Button
                size="xs"
                color="primary"
                onClick={() => {
                  setCreateTokenPopupOpened(true);
                }}
              >
                {t('인증 토큰 추가')}
              </Button>
            }
          >
            {t('인증 토큰')}
          </Title>
          <Block>
            <TokenList
              tokens={projectTokenList}
              onDeleteButtonClick={id => {
                deleteProjectToken(id);
              }}
              onChangeButtonClick={info => {
                setUpdateTokenPopupInfo({
                  ...info,
                });
                setUpdateTokenPopupOpened(true);
              }}
            />
          </Block>
          <Title
            icon={<i className="fa-brands fa-jira" />}
            control={
              <Button
                size="xs"
                color="primary"
                onClick={() => {
                  setJiraProjectTokenPopupOpened(true);
                }}
              >
                {t('Jira Project 설정 변경')}
              </Button>
            }
          >
            {t('Jira Project')}
          </Title>
          <Block>
            <BlockRow>
              <Label>{t('Jira Project 이름')}</Label>
              <Text>{integration?.jiraProject.name ? integration.jiraProject.name : 'N/A'}</Text>
            </BlockRow>
            <BlockRow>
              <Label>{t('Jira Project Key')}</Label>
              <Text>{integration?.jiraProject.key ? integration.jiraProject.key : 'N/A'}</Text>
            </BlockRow>
          </Block>
          <Title marginBottom={false}>{t('알림 설정')}</Title>
          <Block>
            <BlockRow>
              <Label>{t('슬랙 URL')}</Label>
              <Text>{project?.slackUrl}</Text>
            </BlockRow>
            <BlockRow>
              <Label>{t('테스트런 알림')}</Label>
              <Text>{project?.enableTestrunAlarm ? 'Y' : 'N'}</Text>
            </BlockRow>
          </Block>
          <Title marginBottom={false}>{t('테스트케이스 템플릿')}</Title>
          <Block>
            <ul className="template-list">
              {project?.testcaseTemplates?.map(testcaseTemplate => {
                return (
                  <li key={testcaseTemplate.id}>
                    <Card border className="testcase-template" point>
                      <CardHeader className="name">
                        <div>
                          <span
                            onClick={() => {
                              setTemplateViewerPopupInfo({
                                opened: true,
                                testcaseTemplate,
                              });
                            }}
                          >
                            {testcaseTemplate.name}
                          </span>
                        </div>
                        {testcaseTemplate.defaultTemplate && (
                          <div className="default">
                            <span>DEFAULT</span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="testcase-template-content">
                        <div className="item-count">
                          <span className="count">
                            <span>{testcaseTemplate.testcaseTemplateItems?.length}</span>
                          </span>
                          <span className="count-label">{t('아이템')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </Block>
          <Title marginBottom={false}>{t('프로젝트 사용자')}</Title>
          <Block>
            <MemberCardManager className="member-manager" users={project?.users} tags />
          </Block>
          <Title paddingBottom={false} border={false}>
            {t('태그별 사용자')}
          </Title>
          <Block>
            {Object.keys(tagUserMap).length < 1 && (
              <EmptyContent className="empty-content" border>
                <div>{t('태그가 설정된 사용자가 없습니다.')}</div>
              </EmptyContent>
            )}
            {Object.keys(tagUserMap).length > 0 && (
              <Table cols={['1px', '100%']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('태그')}</Th>
                    <Th align="left">{t('사용자')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {Object.keys(tagUserMap).map((tag, inx) => {
                    return (
                      <Tr key={inx}>
                        <Td className="tag-name">
                          <Tag size="sm" color="white" border>
                            {tag}
                          </Tag>
                        </Td>
                        <Td className="tag-users">
                          <ul>
                            {tagUserMap[tag].map(user => {
                              return (
                                <li key={user.id}>
                                  <Tag size="sm" color="white" border>
                                    {user.name}
                                  </Tag>
                                </li>
                              );
                            })}
                          </ul>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </Block>
          <Title paddingBottom={false} border={false} marginBottom={false}>
            {t('관리')}
          </Title>
          <Block>
            <BlockRow>
              <Label>{t('프로젝트 탈퇴')}</Label>
              <Text>
                <Button size="sm" color="warning" onClick={onWithdraw}>
                  {t('프로젝트 탈퇴')}
                </Button>
              </Text>
            </BlockRow>
            {(isAdmin || project?.admin) && (
              <BlockRow>
                <Label>{t('프로젝트 삭제')}</Label>
                <Text>
                  <Button size="sm" color="danger" onClick={onDelete}>
                    {t('프로젝트 삭제')}
                  </Button>
                </Text>
              </BlockRow>
            )}
          </Block>
          <PageButtons
            onBack={() => {
              navigate(-1);
            }}
            onEdit={
              isAdmin || project?.admin
                ? () => {
                    navigate(`/spaces/${spaceCode}/projects/${project.id}/edit`);
                  }
                : null
            }
            onCancelIcon=""
          />
        </PageContent>
      </Page>
      <TestcaseTemplateEditorPopup
        editor={false}
        opened={templateViewerPopupInfo.opened}
        testcaseTemplate={templateViewerPopupInfo.testcaseTemplate}
        onClose={() => {
          setTemplateViewerPopupInfo({
            opened: false,
          });
        }}
      />
      {createTokenPopupOpened && (
        <TokenDialog
          setOpened={() => {
            setCreateTokenPopupOpened(false);
          }}
          setToken={(id, name, enabled) => {
            createProjectToken(name, enabled);
          }}
        />
      )}
      {updateTokenPopupOpened && (
        <TokenDialog
          setOpened={() => {
            setUpdateTokenPopupOpened(false);
          }}
          setToken={(id, name, enabled) => {
            updateProjectToken(id, name, enabled);
          }}
          token={updateTokenPopupInfo}
        />
      )}
      {jiraProjectPopupOpened && (
        <JiraProjectIntegrationEditPopup
          spaceCode={spaceCode}
          data={integration?.jiraProject}
          setOpened={() => {
            setJiraProjectTokenPopupOpened(false);
          }}
          onApply={info => {
            ProjectService.updateJiraProjectIntegration(spaceCode, projectId, info, () => {
              ProjectService.getIntegrationInfo(spaceCode, projectId, res => setIntegration({ ...res }));
            });
          }}
        />
      )}
    </>
  );
}

ProjectInfoPage.defaultProps = {};

ProjectInfoPage.propTypes = {};

export default ProjectInfoPage;
