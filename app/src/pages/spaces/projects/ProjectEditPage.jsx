import React, { useEffect, useMemo, useState } from 'react';
import './ProjectEditPage.scss';
import { Block, Button, Card, CardContent, CardHeader, CheckBox, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Tag, Text, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SpaceService from '@/services/SpaceService';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import BlockRow from '@/components/BlockRow/BlockRow';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import ProjectService from '@/services/ProjectService';
import TestcaseTemplateEditorPopup from '@/pages/spaces/projects/TestcaseTemplateEditorPopup/TestcaseTemplateEditorPopup';
import ConfigService from '@/services/ConfigService';
import { cloneDeep } from 'lodash';
import MemberCardManager from '@/components/MemberManager/MemberCardManager';
import useStores from '@/hooks/useStores';

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
          systemLabel: null,
        },
        {
          category: 'CASE',
          type: 'USER',
          itemOrder: 1,
          label: '테스터',
          options: [],
          size: 6,
          defaultValue: null,
          defaultType: '',
          description: null,
          example: null,
          editable: false,
          systemLabel: 'TESTER',
        },

        {
          category: 'CASE',
          type: 'EDITOR',
          itemOrder: 3,
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
          itemOrder: 4,
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
          itemOrder: 5,
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
        {
          category: 'RESULT',
          type: 'RADIO',
          itemOrder: 0,
          label: '테스트 결과',
          options: ['성공', '실패', '수행 불가능'],
          size: 6,
          defaultValue: null,
          defaultType: '',
          description: null,
          example: null,
          editable: false,
          systemLabel: 'TEST_RESULT',
        },
        {
          category: 'RESULT',
          type: 'RADIO',
          itemOrder: 1,
          label: '테스트케이스 평가',
          options: ['미흡함', '적절함', '우수함'],
          size: 6,
          defaultValue: '',
          defaultType: null,
          description: '- 테스트케이스에 대한 점수\n- 테스트 케이스의 설명을 통해 테스트를 올바로 수행할 수 있는지를 점수로 표시',
          example: null,
          editable: true,
          systemLabel: null,
        },
        {
          category: 'RESULT',
          type: 'EDITOR',
          itemOrder: 2,
          label: '코멘트',
          options: [],
          size: 12,
          defaultValue: null,
          defaultType: null,
          description: '- 테스트 수행 결과에 대한 추가적인 정보가 필요한 경우 입력합니다.',
          example: null,
          editable: true,
          systemLabel: null,
        },
      ],

      isDefault: true,
    },
  ],
};

function ProjectEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();

  const { userStore } = useStores();

  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [testcaseItemTypes, setTestcaseItemTypes] = useState([]);
  const [testcaseItemCategories, setTestcaseItemCategories] = useState([]);
  const [opened, setOpened] = useState(false);

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
    token: uuidv4(),
    testcaseTemplates: cloneDeep(defaultProjectConfig.testcaseTemplates),
  });

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    ConfigService.selectTestcaseConfigs(info => {
      setTestcaseItemTypes(info.testcaseItemTypes);
      setTestcaseItemCategories(info.testcaseItemCategories);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (projectId && type === 'edit') {
      ProjectService.selectProjectInfo(spaceCode, projectId, info => {
        setProject(info);
      });
    }
  }, [type, projectId]);

  useEffect(() => {
    SpaceService.selectSpaceInfo(spaceCode, info => {
      setSpace(info);
    });
  }, [spaceCode]);

  const updateProject = () => {
    ProjectService.updateProject(spaceCode, project, () => {
      navigate(`/spaces/${spaceCode}/projects/${project.id}/info`);
    });
  };

  const onSubmit = e => {
    e.preventDefault();

    if (type === 'new') {
      ProjectService.createProject(spaceCode, project, info => {
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

      const currentUser = project.users.find(user => user.userId === userStore.user?.id);

      if (currentUser.crud !== 'D' && currentUser.role === 'USER') {
        dialogUtil.setConfirm(
          MESSAGE_CATEGORY.WARNING,
          t('프로젝트 권한 경고'),
          <div>{t('현재 사용자의 권한이 사용자 권한으로 설정되었습니다. 저장 후 더 이상 프로젝트를 정보를 편집할 수 없습니다. 계속 하시겠습니까?')}</div>,
          () => {
            updateProject();
          },
          null,
          t('확인'),
        );
        return;
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
        return;
      }

      updateProject();
    }
  };

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('프로젝트 삭제'),
      <div>{t(`"${project.name}" 프로젝트 및 프로젝트에 포함된 모든 정보가 삭제됩니다. 삭제하시겠습니까?`)}</div>,
      () => {
        ProjectService.deleteProject(spaceCode, project, () => {
          navigate(`/spaces/${spaceCode}/projects`);
        });
      },
      null,
      t('삭제'),
    );
  };

  const onChangeTestcaseTemplate = (inx, template) => {
    const nextProject = { ...project };
    nextProject.testcaseTemplates[inx] = template;

    if (template.isDefault) {
      nextProject.testcaseTemplates.forEach((item, i) => {
        const nextItem = item;
        if (i !== inx && nextItem.isDefault) {
          nextItem.isDefault = false;
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

    nextProject.testcaseTemplates.push({
      name: `테스트케이스 템플릿 ${nextProject.testcaseTemplates.length + 1}`,
      testcaseTemplateItems: cloneDeep(defaultProjectConfig.testcaseTemplates[0].testcaseTemplateItems),
      isDefault: false,
    });

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
    const projectUser = next.users.find(d => d.userId === userId);
    projectUser.crud = 'U';
    projectUser[field] = value;
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

  return (
    <>
      <Page className="project-edit-page-wrapper">
        <PageTitle
          control={
            <div>
              <Button size="sm" color="danger" onClick={onDelete}>
                {t('프로젝트 삭제')}
              </Button>
            </div>
          }
        >
          {type === 'edit' ? t('프로젝트') : t('새 프로젝트')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title>{t('프로젝트 정보')}</Title>
            <Block>
              <BlockRow>
                <Label>{t('스페이스')}</Label>
                <Text>{space?.name}</Text>
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
                <Label>{t('토큰')}</Label>
                <Text>
                  {project.token}
                  <Button
                    outline
                    rounded
                    size="sm"
                    onClick={() => {
                      setProject({
                        ...project,
                        token: uuidv4(),
                      });
                    }}
                  >
                    <i className="fa-solid fa-arrows-rotate" />
                  </Button>
                </Text>
              </BlockRow>
            </Block>
            <Title
              control={
                <Button
                  size="sm"
                  outline
                  onClick={() => {
                    addTestcaseTemplate();
                  }}
                >
                  <i className="fa-solid fa-plus" /> 템플릿 추가
                </Button>
              }
            >
              테스트케이스 템플릿
            </Title>
            <Block>
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
                          {testcaseTemplate.isDefault && (
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
                            <span className="count-label">아이템</span>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </Block>
            {isEdit && (
              <>
                <Title
                  control={
                    <Button
                      size="sm"
                      outline
                      onClick={() => {
                        setOpened(true);
                      }}
                    >
                      사용자 추가
                    </Button>
                  }
                >
                  {t('프로젝트 사용자')}
                </Title>
                <Block>
                  <MemberCardManager
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
              outline
              onCancel={() => {
                navigate(-1);
              }}
              onSubmit={() => {}}
              onSubmitText="저장"
              onCancelIcon=""
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
