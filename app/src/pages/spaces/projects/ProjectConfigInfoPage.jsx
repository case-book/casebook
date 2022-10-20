import React, { useEffect, useState } from 'react';
import { Page, PageButtons, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import './ProjectConfigInfoPage.scss';
import TestcaseTemplateEditorPopup from '@/pages/spaces/projects/ProjectConfigEditPage/TestcaseTemplateEditorPopup';

function ProjectConfigInfoPage() {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [templateViewerPopupInfo, setTemplateViewerPopupInfo] = useState({
    opened: false,
    testcaseTemplate: null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  return (
    <>
      <Page className="project-config-info-page-wrapper">
        <PageTitle>{t('설정')}</PageTitle>
        <PageContent>
          <Title type="h2" border={false}>
            테스트케이스 템플릿
          </Title>
          <table>
            <tbody>
              {project?.testcaseTemplates?.map(testcaseTemplate => {
                return (
                  <tr key={testcaseTemplate.id}>
                    <td
                      className="name"
                      onClick={() => {
                        setTemplateViewerPopupInfo({
                          opened: true,
                          testcaseTemplate,
                        });
                      }}
                    >
                      {testcaseTemplate.name}
                    </td>
                    <td className="count">
                      <span className="count-badge">
                        <span>{testcaseTemplate.testcaseTemplateItems?.length || 0}</span>
                      </span>{' '}
                      {t('아이템')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PageButtons
            onBack={() => {
              navigate(-1);
            }}
            onEdit={() => {
              navigate(`/spaces/${spaceCode}/projects/${project.id}/config/edit`);
            }}
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
    </>
  );
}

ProjectConfigInfoPage.defaultProps = {};

ProjectConfigInfoPage.propTypes = {};

export default ProjectConfigInfoPage;
