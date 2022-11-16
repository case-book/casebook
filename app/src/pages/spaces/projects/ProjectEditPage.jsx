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
import TestcaseService from '@/services/TestcaseService';
import MemberManager from '@/components/MemberManager/MemberManager';
import TestcaseTemplateEditorPopup from '@/pages/spaces/projects/TestcaseTemplateEditorPopup';
import ConfigService from '@/services/ConfigService';
import { cloneDeep } from 'lodash';

const defaultProjectConfig = {
  testcaseTemplates: [
    {
      name: '기본 템플릿',
      testcaseTemplateItems: [
        { category: 'CASE', type: 'RADIO', itemOrder: 0, label: '중요도', options: ['상', '중', '하'], size: 4, defaultValue: '중' },
        { category: 'CASE', type: 'URL', itemOrder: 1, label: 'URL', options: [], size: 4 },
        { category: 'CASE', type: 'CHECKBOX', itemOrder: 2, label: 'E2E', options: [], size: 4 },
        { category: 'CASE', type: 'USER', itemOrder: 3, label: '테스터', options: [], size: 4 },
        { category: 'CASE', type: 'USER', itemOrder: 4, label: '담당자', options: [], size: 4 },
        { category: 'CASE', type: 'CHECKBOX', itemOrder: 5, label: '회귀 테스트', options: [], size: 4 },
        { category: 'CASE', type: 'EDITOR', itemOrder: 6, label: '테스트 준비 절차', options: [], size: 12 },
        { category: 'CASE', type: 'EDITOR', itemOrder: 7, label: '테스트 절차', options: [], size: 12 },
        { category: 'CASE', type: 'EDITOR', itemOrder: 8, label: '예상 절차', options: [], size: 12 },
        { category: 'RESULT', type: 'RADIO', itemOrder: 0, label: '테스트 결과', options: ['성공', '실패', '수행 불가능'], size: 6 },
        { category: 'RESULT', type: 'RADIO', itemOrder: 1, label: '테스트케이스 평가', options: ['1', '2', '3', '4', '5'], size: 6 },
        { category: 'RESULT', type: 'EDITOR', itemOrder: 2, label: '비고', options: [], size: 12 },
      ],
      isDefault: true,
    },
  ],
};

function ProjectEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();

  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [testcaseItemTypes, setTestcaseItemTypes] = useState([]);
  const [testcaseItemCategories, setTestcaseItemCategories] = useState([]);

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

  const onSubmit = e => {
    e.preventDefault();

    if (type === 'new') {
      ProjectService.createProject(spaceCode, project, info => {
        const nextProject = { ...project };
        nextProject.testcaseTemplates.forEach(testcaseTemplate => {
          const nextTestcaseTemplate = testcaseTemplate;
          nextTestcaseTemplate.testcaseTemplateItems = testcaseTemplate.testcaseTemplateItems.filter(d => d.crud !== 'D');
        });

        TestcaseService.updateConfig(spaceCode, info.id, nextProject, () => {
          navigate(`/spaces/${spaceCode}/projects/${info.id}/info`);
        });
      });
    } else if (type === 'edit') {
      ProjectService.updateProject(spaceCode, project, () => {
        const nextProject = { ...project };
        nextProject.testcaseTemplates.forEach(testcaseTemplate => {
          const nextTestcaseTemplate = testcaseTemplate;
          nextTestcaseTemplate.testcaseTemplateItems = testcaseTemplate.testcaseTemplateItems.filter(d => d.crud !== 'D');
        });

        TestcaseService.updateConfig(spaceCode, projectId, nextProject, () => {
          navigate(`/spaces/${spaceCode}/projects/${project.id}/info`);
        });
      });
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
    setProject(nextProject);
  };

  const addTestcaseTemplate = () => {
    const nextProject = { ...project };
    if (!nextProject.testcaseTemplates) {
      nextProject.testcaseTemplates = [];
    }

    nextProject.testcaseTemplates.push({
      name: `테스트케이스 템플릿 ${nextProject.testcaseTemplates.length + 1}`,
      testcaseTemplateItems: [],
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
                    <li key={testcaseTemplate.id} className={`${testcaseTemplate.crud === 'D' ? 'hidden' : ''} `}>
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
                                  size="sm"
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
                <Title>프로젝트 사용자</Title>
                <Block>
                  <MemberManager className="member-manager" edit users={project?.users} onChangeUserRole={() => {}} onUndoRemovalUSer={() => {}} onRemoveUSer={() => {}} />
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
        onClose={() => {
          setTemplateEditorPopupInfo({
            opened: false,
          });
        }}
        onChange={template => {
          onChangeTestcaseTemplate(templateEditorPopupInfo.inx, template);
        }}
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
