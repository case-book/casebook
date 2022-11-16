import React, { useEffect, useState } from 'react';
import { Block, Card, CardContent, CardHeader, Label, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import './ProjectInfoPage.scss';
import ProjectService from '@/services/ProjectService';
import MemberManager from '@/components/MemberManager/MemberManager';
import TestcaseTemplateEditorPopup from '@/pages/spaces/projects/TestcaseTemplateEditorPopup';

function ProjectInfoPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [templateViewerPopupInfo, setTemplateViewerPopupInfo] = useState({
    opened: false,
    testcaseTemplate: null,
  });

  console.log(templateViewerPopupInfo);

  useEffect(() => {
    window.scrollTo(0, 0);
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      console.log(info);
      setProject(info);
    });
  }, [projectId]);

  return (
    <>
      <Page className="project-info-page-wrapper">
        <PageTitle links={project?.admin ? [<Link to={`/spaces/${spaceCode}/projects/${project.id}/edit`}>{t('프로젝트 변경')}</Link>] : null}>{t('프로젝트')}</PageTitle>
        <PageContent>
          <Title>{t('프로젝트 정보')}</Title>
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
            <BlockRow>
              <Label>{t('토큰')}</Label>
              <Text>{project?.token}</Text>
            </BlockRow>
          </Block>
          <Title>테스트케이스 템플릿</Title>
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
          <Title>프로젝트 사용자</Title>
          <Block>
            <MemberManager className="member-manager" users={project?.users} />
          </Block>
          <PageButtons
            outline
            onBack={() => {
              navigate(-1);
            }}
            onEdit={() => {
              navigate(`/spaces/${spaceCode}/projects/${project.id}/edit`);
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

ProjectInfoPage.defaultProps = {};

ProjectInfoPage.propTypes = {};

export default ProjectInfoPage;
