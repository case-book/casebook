import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import { useParams } from 'react-router';
import ConfigService from '@/services/ConfigService';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Page, PageButtons, PageContent, PageTitle, Tag, Title } from '@/components';
import TestcaseService from '@/services/TestcaseService';
import './ProjectConfigEditPage.scss';
import TestcaseTemplateEditorPopup from '@/pages/spaces/projects/ProjectConfigEditPage/TestcaseTemplateEditorPopup';

function ProjectConfig() {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [templateEditorPopupInfo, setTemplateEditorPopupInfo] = useState({
    opened: false,
    inx: null,
    testcaseTemplate: null,
  });

  const [testcaseItemTypes, setTestcaseItemTypes] = useState([]);
  const [testcaseItemCategories, setTestcaseItemCategories] = useState([]);

  useEffect(() => {
    ConfigService.selectTestcaseConfigs(info => {
      setTestcaseItemTypes(info.testcaseItemTypes);
      setTestcaseItemCategories(info.testcaseItemCategories);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

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

  const onChangeTestcaseTemplate = (inx, template) => {
    const nextProject = { ...project };
    nextProject.testcaseTemplates[inx] = template;
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

  const onSubmit = e => {
    e.preventDefault();

    const nextProject = { ...project };
    nextProject.testcaseTemplates.forEach(testcaseTemplate => {
      const nextTestcaseTemplate = testcaseTemplate;
      nextTestcaseTemplate.testcaseTemplateItems = testcaseTemplate.testcaseTemplateItems.filter(d => d.crud !== 'D');
    });

    TestcaseService.updateConfig(spaceCode, projectId, nextProject, () => {
      navigate(`/spaces/${spaceCode}/projects/${project.id}/config`);
    });
  };

  return (
    <>
      <Page className="project-config-edit-page-wrapper" wide>
        <PageTitle>
          {project?.name} {t('CONFIG')}
        </PageTitle>
        <PageContent>
          <Title
            type="h2"
            control={
              <Button
                size="sm"
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
          <Form onSubmit={onSubmit}>
            <table>
              <tbody>
                {project?.testcaseTemplates?.map((testcaseTemplate, inx) => {
                  return (
                    <tr key={inx} className={`${testcaseTemplate.crud === 'D' ? 'hidden' : ''} `}>
                      <td className="name">
                        {testcaseTemplate.name}
                        {!testcaseTemplate.id && (
                          <div className="new-mark">
                            <Tag className="tag">NEW</Tag>
                          </div>
                        )}
                      </td>
                      <td className="count">
                        <span className="count-badge">
                          <span>{testcaseTemplate.testcaseTemplateItems?.length || 0}</span>
                        </span>
                        {t('아이템')}
                      </td>
                      <td className="control-button">
                        <Button
                          rounded
                          size="sm"
                          color="danger"
                          onClick={() => {
                            removeTestcaseTemplateItem(inx);
                          }}
                        >
                          <i className="fa-solid fa-trash" />
                        </Button>
                      </td>
                      <td className="control-button">
                        <Button
                          rounded
                          size="sm"
                          onClick={() => {
                            setTemplateEditorPopupInfo({
                              opened: true,
                              inx,
                              testcaseTemplate,
                            });
                          }}
                        >
                          <i className="fa-solid fa-gear" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <PageButtons
              className="page-button"
              onBack={() => {
                navigate('/');
              }}
              onSubmit={() => {}}
              onSubmitText={t('저장')}
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

ProjectConfig.defaultProps = {};

ProjectConfig.propTypes = {};

export default ProjectConfig;
