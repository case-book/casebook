import React, { useState, useEffect, useMemo } from 'react';
import { Block, BlockRow, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, TestcaseSelector, Text, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import PropTypes from 'prop-types';

const LABEL_MIN_WIDTH = '120px';

function ReleaseEditPage({ type }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceCode, projectId, releaseId } = useParams();
  const [project, setProject] = useState(null);
  const [release, setRelease] = useState({});
  const [currentSelectedTestcaseGroups, setCurrentSelectedTestcaseGroups] = useState([]);

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
    if (isEdit)
      ReleaseService.selectRelease(spaceCode, projectId, releaseId, info => {
        setRelease(info);
      });
  }, [spaceCode, projectId, isEdit]);

  const handleSubmit = e => {
    e.preventDefault();

    const testcaseIds = currentSelectedTestcaseGroups.flatMap(group => group.testcases.map(testcase => testcase.id));
    ReleaseService.createRelease(spaceCode, projectId, { ...release, testcaseIds }, () => {
      navigate(-1);
    });
  };

  return (
    <Page>
      <PageTitle
        breadcrumbs={[
          { to: '/', text: t('HOME') },
          {
            to: '/',
            text: t('스페이스 목록'),
          },
          {
            to: `/spaces/${spaceCode}/info`,
            text: spaceCode,
          },
          {
            to: `/spaces/${spaceCode}/projects`,
            text: t('프로젝트 목록'),
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}`,
            text: project?.name,
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/releases`,
            text: t('릴리즈 목록'),
          },
          {
            to: isEdit ? `/spaces/${spaceCode}/projects/${projectId}/releases/${releaseId}/edit` : `/spaces/${spaceCode}/projects/${projectId}/testruns/new`,
            text: isEdit ? t('편집') : t('생성'),
          },
        ]}
      >
        {t('새 릴리즈')}
      </PageTitle>
      <PageContent>
        <Form onSubmit={handleSubmit}>
          <Title border={false} marginBottom={false}>
            {t('릴리즈 정보')}
          </Title>
          <Block>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH}>{t('프로젝트')}</Label>
              <Text>{project?.name}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH} required>
                {t('이름')}
              </Label>
              <Input
                value={release.name}
                onChange={val =>
                  setRelease({
                    ...release,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH}>{t('설명')}</Label>
              <TextArea
                value={release.description || ''}
                rows={4}
                onChange={val => {
                  setRelease({
                    ...release,
                    description: val,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH}>{t('테스트케이스')}</Label>
              <TestcaseSelector testcaseGroups={project?.testcaseGroups ?? []} currentSelectedTestcaseGroups={currentSelectedTestcaseGroups} onChange={setCurrentSelectedTestcaseGroups} />
            </BlockRow>
          </Block>
          <PageButtons
            onCancel={() => {
              navigate(-1);
            }}
            onSubmit={() => {}}
            onSubmitText={t('저장')}
            onCancelIcon=""
          />
        </Form>
      </PageContent>
    </Page>
  );
}

ReleaseEditPage.defaultProps = {
  type: 'new',
};

ReleaseEditPage.propTypes = {
  type: PropTypes.string,
};

export default ReleaseEditPage;
