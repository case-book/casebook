import React, { useEffect, useMemo, useState } from 'react';
import './ProjectEditPage.scss';
import {
  Block,
  Button,
  Card,
  CardContent,
  CardHeader,
  CheckBox,
  EmptyContent,
  Form,
  Input,
  Label,
  Page,
  PageButtons,
  PageContent,
  PageTitle,
  Selector,
  Tag,
  Text,
  TextArea,
  Title,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SpaceService from '@/services/SpaceService';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import dialogUtil from '@/utils/dialogUtil';
import { CHANNEL_TYPE_CODE, MESSAGE_CATEGORY } from '@/constants/constants';
import ProjectService from '@/services/ProjectService';
import TestcaseTemplateEditorPopup from '@/pages/spaces/projects/TestcaseTemplateEditorPopup/TestcaseTemplateEditorPopup';
import ConfigService from '@/services/ConfigService';
import { cloneDeep } from 'lodash';
import MemberCardManager from '@/components/MemberManager/MemberCardManager';
import useStores from '@/hooks/useStores';
import ReleaseService from '@/services/ReleaseService';

const defaultProjectConfig = {
  testcaseTemplates: [
    {
      name: '기본 템플릿',
      testcaseTemplateItems: [
        {
          category: 'CASE',
          type: 'CHECKBOX',
          itemOrder: 0,
          label: '자동화',
          options: [],
          size: 6,
          defaultValue: null,
          defaultType: null,
          description: '- 스크립트나 자동화 도구 등을 이용하여 API를 이용하여, 테스트 결과가 입력되는지의 표시 여부를 선택합니다.',
          example: null,
          editable: false,
          systemLabel: 'AUTOMATION',
        },
        {
          category: 'CASE',
          type: 'RADIO',
          itemOrder: 2,
          label: '중요도',
          options: ['상', '중', '하'],
          size: 6,
          defaultValue: '중',
          defaultType: null,
          description: '- 테스트를 수행하기전에 필요한 전체 조건 혹은 사전 수행 절차',
          example: null,
          editable: true,
          systemLabel: null,
        },
        {
          category: 'CASE',
          type: 'EDITOR',
          itemOrder: 2,
          label: '전제 조건',
          options: [],
          size: 12,
          defaultValue: null,
          defaultType: null,
          description: '- 테스트를 수행하기전에 필요한 전체 조건 혹은 사전 수행 절차',
          example: null,
          editable: true,
          systemLabel: null,
        },
        {
          category: 'CASE',
          type: 'EDITOR',
          itemOrder: 3,
          label: '테스트 절차',
          options: [],
          size: 12,
          defaultValue: null,
          defaultType: null,
          description: '- 예상 결과를 얻기 위해 수행해야할 테스트 수행 절차',
          example: null,
          editable: true,
          systemLabel: null,
        },
        {
          category: 'CASE',
          type: 'EDITOR',
          itemOrder: 4,
          label: '예상 결과',
          options: [],
          size: 12,
          defaultValue: null,
          defaultType: null,
          description: '- 테스트 절차를 수행했을때 예상되는 결과',
          example: null,
          editable: true,
          systemLabel: null,
        },
        /*
                {
                  category: 'RESULT',
                  type: 'RADIO',
                  itemOrder: 0,
                  label: '테스트 결과',
                  options: ['성공', '실패', '수행 불가능'],
                  size: 6,
                  defaultValue: null,
                  defaultType: null,
                  description: null,
                  example: null,
                  editable: false,
                  systemLabel: 'TEST_RESULT',
                },
                {
                  category: 'RESULT',
                  type: 'USER',
                  itemOrder: 1,
                  label: '테스터',
                  options: [],
                  size: 6,
                  defaultValue: 'RND',
                  defaultType: 'operation',
                  description: null,
                  example: null,
                  editable: false,
                  systemLabel: 'TESTER',
                },
                   */
      ],
      defaultTesterType: 'operation',
      defaultTesterValue: 'RND',
      defaultTemplate: true,
    },
  ],
};

function ProjectEditPage({ type }) {
  const { t } = useTranslation();

  const {
    userStore: { isAdmin },
  } = useStores();

  const { projectId, spaceCode } = useParams();

  const {
    userStore,
    contextStore: { setRefreshProjectList },
  } = useStores();

  const navigate = useNavigate();

  const [spaceName, setSpaceName] = useState('');
  const [testcaseItemTypes, setTestcaseItemTypes] = useState([]);
  const [testcaseItemCategories, setTestcaseItemCategories] = useState([]);
  const [opened, setOpened] = useState(false);
  const [spaceMessageChannelList, setSpaceMessageChannelList] = useState([]);
  const [releases, setReleases] = useState([]);
  const [llms, setLlms] = useState([]);

  const [templateEditorPopupInfo, setTemplateEditorPopupInfo] = useState({
    opened: false,
    inx: null,
    testcaseTemplate: null,
  });

  const [project, setProject] = useState({
    name: '',
    code: '',
    description: '',
    activated: true,
    aiEnabled: false,
    token: uuidv4(),
    testcaseTemplates: cloneDeep(defaultProjectConfig.testcaseTemplates),
    targetReleaseId: null,
    messageChannels: [],
  });

  const getLlms = () => {
    SpaceService.selectSpaceLlmList(spaceCode, list => {
      setLlms(list);
    });
  };

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    SpaceService.selectSpaceChannelList(spaceCode, list => {
      setSpaceMessageChannelList(list);
    });

    ConfigService.selectTestcaseConfigs(info => {
      setTestcaseItemTypes(info.testcaseItemTypes);
      setTestcaseItemCategories(info.testcaseItemCategories);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (projectId && type === 'edit') {
      ProjectService.selectProjectInfo(spaceCode, projectId, info => {
        ReleaseService.selectReleaseList(spaceCode, projectId, list => {
          const targetRelease = list.find(release => release.isTarget);
          setProject({
            ...info,
            targetReleaseId: targetRelease?.id || null,
          });
          setReleases(list);
        });
      });
    }
  }, [type, projectId]);

  useEffect(() => {
    getLlms();
    SpaceService.selectSpaceName(spaceCode, name => {
      setSpaceName(name);
    });
  }, [spaceCode]);

  const updateProject = () => {
    ProjectService.updateProject(spaceCode, project, () => {
      setRefreshProjectList();
      navigate(`/spaces/${spaceCode}/projects/${project.id}/info`);
    });
  };

  const checkUserRole = () => {
    if (isAdmin) {
      updateProject();
    } else {
      const currentUser = project.users.find(user => user.userId === userStore.user?.id);

      if (currentUser.crud !== 'D' && currentUser.role === 'USER') {
        dialogUtil.setConfirm(
          MESSAGE_CATEGORY.WARNING,
          t('프로젝트 권한 경고'),
          <div>{t('현재 사용자의 권한이 사용자 권한으로 설정되었습니다. 저장 후 더 이상 프로젝트를 정보를 변경할 수 없습니다. 계속 하시겠습니까?')}</div>,
          () => {
            updateProject();
          },
          null,
          t('확인'),
        );
        return true;
      }

      if (currentUser.crud === 'D') {
        dialogUtil.setConfirm(
          MESSAGE_CATEGORY.WARNING,
          t('프로젝트 권한 경고'),
          <div>{t('프로젝트 사용자에서 현재 사용자가 제외되었습니다. 저장 후 더 이상 프로젝트에 접근할 수 없습니다. 계속 하시겠습니까?')}</div>,
          () => {
            updateProject();
          },
          null,
          t('확인'),
        );
        return true;
      }

      updateProject();
    }

    return false;
  };

  const onSubmit = e => {
    e.preventDefault();

    if (type === 'new') {
      ProjectService.createProject(spaceCode, project, info => {
        setRefreshProjectList();
        navigate(`/spaces/${spaceCode}/projects/${info.id}/info`);
      });
    } else if (type === 'edit') {
      if (project.users.filter(user => user.crud !== 'D').length < 1) {
        dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '프로젝트 설정 오류', '최소한 1명의 프로젝트 사용자는 존재해야 합니다.');
        return;
      }

      if (project.users.filter(user => user.crud !== 'D' && user.role === 'ADMIN').length < 1) {
        dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '프로젝트 설정 오류', '최소한 1명의 관리자는 지정되어야 합니다.');
        return;
      }

      if (project.testcaseTemplates?.filter(d => d.crud === 'D').length > 0) {
        dialogUtil.setConfirm(
          MESSAGE_CATEGORY.WARNING,
          t('테스트케이스 템플릿 삭제 경고'),
          <div>
            {t('테스트케이스 템플릿이 삭제됩니다. 삭제하려는 테스트케이스 템플릿을 사용하는 모든 테스트케이스 및 예약, 반복 테스트런의 테스트케이스 정보가 함께 삭제됩니다. 계속 하시겠습니까?')}
          </div>,
          () => {
            return checkUserRole();
          },
          null,
          t('확인'),
        );
        return;
      }

      checkUserRole();
    }
  };

  const onChangeTestcaseTemplate = (inx, template) => {
    const nextProject = { ...project };
    nextProject.testcaseTemplates[inx] = template;

    if (template.defaultTemplate) {
      nextProject.testcaseTemplates.forEach((item, i) => {
        const nextItem = item;
        if (i !== inx && nextItem.defaultTemplate) {
          nextItem.defaultTemplate = false;
        }
      });
    }
    setProject(nextProject);
  };

  const addTestcaseTemplate = () => {
    const nextProject = { ...project };
    if (!nextProject.testcaseTemplates) {
      nextProject.testcaseTemplates = [];
    }

    nextProject.testcaseTemplates.push({ ...cloneDeep(defaultProjectConfig.testcaseTemplates[0]), name: `테스트케이스 템플릿 ${nextProject.testcaseTemplates.length + 1}`, defaultTemplate: false });
    setProject(nextProject);
  };

  const removeTestcaseTemplateItem = inx => {
    const nextProject = { ...project };
    if (nextProject.testcaseTemplates[inx].id) {
      nextProject.testcaseTemplates[inx].crud = 'D';
    } else {
      nextProject.testcaseTemplates.splice(inx, 1);
    }

    setProject(nextProject);
  };

  const changeProjectUserRole = (userId, field, value) => {
    const next = { ...project };
    const inx = next.users.findIndex(d => d.userId === userId);
    const nextProjectUser = { ...next.users[inx] };
    nextProjectUser.crud = 'U';
    nextProjectUser[field] = value;
    next.users[inx] = nextProjectUser;
    setProject(next);
  };

  const removeProjectUser = userId => {
    const next = { ...project };
    const userIndex = next.users.findIndex(d => d.userId === userId);
    if (next.users[userIndex].id) {
      next.users[userIndex].crud = 'D';
    } else {
      next.users.splice(userIndex, 1);
    }

    setProject(next);
  };

  const undoRemovalProjectUser = spaceUserId => {
    const next = { ...project };
    const projectUser = next.users.find(d => d.userId === spaceUserId);
    projectUser.crud = 'U';
    setProject(next);
  };

  const createProjectImage = (name, size, typeText, file) => {
    return ProjectService.createImage(spaceCode, projectId, name, size, typeText, file);
  };

  const addMessageChannel = () => {
    const nextProject = { ...project };
    if (!nextProject.messageChannels) {
      nextProject.messageChannels = [];
    }

    if (spaceMessageChannelList.length > 0) {
      nextProject.messageChannels.push({
        spaceMessageChannelId: spaceMessageChannelList[0].id,
      });
      setProject(nextProject);
    }
  };

  const removeMessageChannel = inx => {
    const nextProject = { ...project };
    nextProject.messageChannels.splice(inx, 1);
    setProject(nextProject);
  };

  const hasLlm = useMemo(() => {
    return llms && llms.filter(d => d.activated)?.length > 0;
  });

  return (
    <>
      <Page className="project-edit-page-wrapper">
        <PageTitle
          name={isEdit ? t('프로젝트 변경') : t('프로젝트 생성')}
          breadcrumbs={
            isEdit
              ? [
                  {
                    to: '/',
                    text: t('HOME'),
                  },
                  {
                    to: `/spaces/${spaceCode}/info`,
                    text: spaceName,
                  },
                  {
                    to: `/spaces/${spaceCode}/projects`,
                    text: t('프로젝트 목록'),
                  },
                  {
                    to: `/spaces/${spaceCode}/projects/${projectId}/info`,
                    text: project?.name,
                  },
                  {
                    to: `/spaces/${spaceCode}/edit`,
                    text: t('변경'),
                  },
                ]
              : [
                  {
                    to: '/',
                    text: t('HOME'),
                  },
                  {
                    to: `/spaces/${spaceCode}/info`,
                    text: spaceName,
                  },
                  {
                    to: `/spaces/${spaceCode}/projects`,
                    text: t('프로젝트 목록'),
                  },
                  {
                    to: `/spaces/${spaceCode}/projects/new`,
                    text: t('생성'),
                  },
                ]
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects`);
          }}
        >
          {type === 'edit' ? t('프로젝트') : t('새 프로젝트')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title border={false} marginBottom={false}>
              {t('프로젝트 정보')}
            </Title>
            <Block>
              <BlockRow>
                <Label>{t('스페이스')}</Label>
                <Text>{spaceName}</Text>
              </BlockRow>
              <BlockRow>
                <Label required>{t('이름')}</Label>
                <Input
                  value={project.name}
                  onChange={val =>
                    setProject({
                      ...project,
                      name: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label>{t('설명')}</Label>
                <TextArea
                  value={project.description || ''}
                  rows={4}
                  onChange={val => {
                    setProject({
                      ...project,
                      description: val,
                    });
                  }}
                />
              </BlockRow>
              <BlockRow>
                <Label>{t('활성화')}</Label>
                <CheckBox
                  type="checkbox"
                  value={project.activated}
                  onChange={val =>
                    setProject({
                      ...project,
                      activated: val,
                    })
                  }
                />
              </BlockRow>
              <BlockRow>
                <Label>{t('AI 활성화')}</Label>
                <CheckBox
                  type="checkbox"
                  value={project.aiEnabled}
                  disabled={!hasLlm}
                  onChange={val =>
                    setProject({
                      ...project,
                      aiEnabled: val,
                    })
                  }
                />
                {!hasLlm && (
                  <div className="msg">
                    {t('OPENAI API 미설정')} (
                    <Link to={`/spaces/${spaceCode}/info`}>
                      <span>{t('스페이스')}</span>
                    </Link>
                    )
                  </div>
                )}
              </BlockRow>
              {isEdit && (
                <BlockRow>
                  <Label>{t('타겟 릴리스')}</Label>
                  <Selector
                    items={[{ key: null, value: t('없음') }].concat(
                      releases.map(release => {
                        return {
                          key: release.id,
                          value: release.name,
                        };
                      }),
                    )}
                    value={project.targetReleaseId}
                    onChange={value => {
                      setProject({
                        ...project,
                        targetReleaseId: value,
                      });
                    }}
                  />
                </BlockRow>
              )}
            </Block>
            <Title
              control={
                <Button size="sm" outline onClick={addMessageChannel} disabled={!spaceMessageChannelList || spaceMessageChannelList?.length < 1}>
                  <i className="fa-solid fa-plus" /> {t('알림 채널 추가')}
                </Button>
              }
            >
              {t('알림 채널')}
            </Title>
            <Block>
              {(!project.messageChannels || project.messageChannels?.length < 1) && <EmptyContent border>{t('알림 채널이 없습니다.')}</EmptyContent>}
              {project?.messageChannels?.length > 0 && (
                <ul className="message-channels">
                  {project.messageChannels?.map((channel, inx) => {
                    return (
                      <li key={inx}>
                        <div>
                          <Selector
                            minWidth="100%"
                            size="md"
                            items={spaceMessageChannelList.map(d => {
                              return {
                                key: d.id,
                                value: (
                                  <div className="message-channel-item">
                                    <Tag size="xs" color="white" border>
                                      {CHANNEL_TYPE_CODE[d.messageChannelType]}
                                    </Tag>
                                    <div>{d.name}</div>
                                  </div>
                                ),
                              };
                            })}
                            value={channel.spaceMessageChannelId}
                            onChange={value => {
                              const nextProject = { ...project };
                              nextProject.messageChannels[inx].spaceMessageChannelId = value;
                              setProject(nextProject);
                            }}
                          />
                        </div>
                        <div>
                          <Button size="sm" color="primary" rounded onClick={() => removeMessageChannel(inx)}>
                            <i className="fa-solid fa-xmark" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Block>
            {isEdit && (
              <>
                <Title
                  control={
                    <Button
                      size="sm"
                      outline
                      onClick={() => {
                        addTestcaseTemplate();
                      }}
                    >
                      <i className="fa-solid fa-plus" /> {t('템플릿 추가')}
                    </Button>
                  }
                >
                  {t('테스트케이스 템플릿')}
                </Title>
                <Block>
                  {!(project?.testcaseTemplates?.filter(d => d.crud !== 'D').length > 0) && <EmptyContent border>{t('테스트케이스 템플릿이 없습니다.')}</EmptyContent>}
                  {project?.testcaseTemplates?.length > 0 && (
                    <ul className="template-list">
                      {project?.testcaseTemplates?.map((testcaseTemplate, inx) => {
                        return (
                          <li key={inx} className={`${testcaseTemplate.crud === 'D' ? 'hidden' : ''} `}>
                            <Card border className="testcase-template" point>
                              <CardHeader className="name">
                                {!testcaseTemplate.id && (
                                  <div className="new-mark">
                                    <Tag className="tag">NEW</Tag>
                                  </div>
                                )}

                                <div>
                                  <span
                                    className="name-info"
                                    onClick={() => {
                                      setTemplateEditorPopupInfo({
                                        opened: true,
                                        inx,
                                        testcaseTemplate,
                                      });
                                    }}
                                  >
                                    <span className="name-text">{testcaseTemplate.name}</span>
                                    <span className="control-button">
                                      <Button
                                        rounded
                                        size="xs"
                                        color="danger"
                                        onClick={e => {
                                          e.stopPropagation();
                                          removeTestcaseTemplateItem(inx);
                                        }}
                                      >
                                        <i className="fa-solid fa-trash" />
                                      </Button>
                                    </span>
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
                  )}
                </Block>
                <Title
                  control={
                    <Button
                      size="sm"
                      outline
                      onClick={() => {
                        setOpened(true);
                      }}
                    >
                      {t('사용자 추가')}
                    </Button>
                  }
                >
                  {t('프로젝트 사용자')}
                </Title>
                <Block>
                  <MemberCardManager
                    tags
                    className="member-manager"
                    edit
                    users={project?.users}
                    onChangeUserRole={changeProjectUserRole}
                    onUndoRemovalUser={undoRemovalProjectUser}
                    onRemoveUser={removeProjectUser}
                    opened={opened}
                    setOpened={setOpened}
                    spaceCode={spaceCode}
                    onApply={users => {
                      const next = { ...project };
                      next.users = users;
                      setProject(next);
                    }}
                  />
                </Block>
              </>
            )}
            <PageButtons
              onCancel={() => {
                navigate(-1);
              }}
              onSubmit={() => {}}
              onSubmitText={t('저장')}
            />
          </Form>
        </PageContent>
      </Page>
      <TestcaseTemplateEditorPopup
        opened={templateEditorPopupInfo.opened}
        testcaseTemplate={templateEditorPopupInfo.testcaseTemplate}
        testcaseItemTypes={testcaseItemTypes}
        testcaseItemCategories={testcaseItemCategories}
        users={project.users}
        onClose={() => {
          setTemplateEditorPopupInfo({
            opened: false,
          });
        }}
        onChange={template => {
          onChangeTestcaseTemplate(templateEditorPopupInfo.inx, template);
        }}
        createProjectImage={createProjectImage}
      />
    </>
  );
}

ProjectEditPage.defaultProps = {
  type: 'new',
};

ProjectEditPage.propTypes = {
  type: PropTypes.string,
};

export default ProjectEditPage;
