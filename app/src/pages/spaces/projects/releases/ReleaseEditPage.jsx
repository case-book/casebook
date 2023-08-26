import React, { useState, useEffect, useMemo } from 'react';
import { Block, BlockRow, Button, EmptyContent, Form, Input, Label, Liner, Page, PageButtons, PageContent, PageTitle, TestcaseSelectorSummary, Text, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import TestcaseSelectPopup from '@/assets/TestcaseSelectPopup/TestcaseSelectPopup';
import PropTypes from 'prop-types';
import testcaseUtil from '@/utils/testcaseUtil';

const LABEL_MIN_WIDTH = '120px';

function ReleaseEditPage({ type }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceCode, projectId, releaseId } = useParams();
  const [project, setProject] = useState(null);
  const [release, setRelease] = useState({});
  const [currentSelectedTestcaseGroups, setCurrentSelectedTestcaseGroups] = useState([]);
  const [isTestcaseSelectPopupOpened, setTestcaseSelectPopupOpened] = useState(false);

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  const handleSubmit = e => {
    e.preventDefault();
    const testcaseIds = currentSelectedTestcaseGroups.flatMap(group => group.testcases.map(testcase => testcase.testcaseId));
    if (!isEdit) {
      ReleaseService.createRelease(spaceCode, projectId, { ...release, testcaseIds }, () => {
        navigate(-1);
      });
      return;
    }
    ReleaseService.updateRelease(spaceCode, projectId, releaseId, { ...release, testcaseIds }, () => {
      navigate(-1);
    });
  };

  const selectAllTestcase = () => setCurrentSelectedTestcaseGroups(testcaseUtil.getSelectionFromTestcaseGroups(project?.testcaseGroups ?? []));

  const selectedTestcaseGroupSummary = useMemo(
    () => testcaseUtil.getSelectedTestcaseGroupSummary(currentSelectedTestcaseGroups, project?.testcaseGroups),
    [currentSelectedTestcaseGroups, project?.testcaseGroups],
  );

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
    if (isEdit)
      ReleaseService.selectRelease(spaceCode, projectId, releaseId, info => {
        setRelease(info);
      });
  }, [spaceCode, projectId, isEdit]);

  useEffect(() => {
    setCurrentSelectedTestcaseGroups(
      testcaseUtil.getSelectionFromTestcaseGroups(
        (project?.testcaseGroups ?? []).map(group => ({ ...group, testcases: group.testcases.filter(testcase => testcase.projectReleaseId === +releaseId) })),
      ),
    );
  }, [project?.testcaseGroups, releaseId]);

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
            to: isEdit ? `/spaces/${spaceCode}/projects/${projectId}/releases/${releaseId}/edit` : `/spaces/${spaceCode}/projects/${projectId}/releases/new`,
            text: isEdit ? `${t('편집')}` : t('생성'),
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
              <Text>
                <Link
                  to="/"
                  onClick={e => {
                    e.preventDefault();
                    setTestcaseSelectPopupOpened(true);
                  }}
                >
                  {t('테스트케이스 선택')}
                </Link>
                <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem 0 1rem" />
                <Button
                  outline
                  size="sm"
                  onClick={() => {
                    selectAllTestcase();
                  }}
                >
                  {t('모든 테스트케이스 추가')}
                </Button>
              </Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH} />
              {selectedTestcaseGroupSummary?.length < 1 && <EmptyContent border>{t('선택된 테스트케이스가 없습니다.')}</EmptyContent>}
              {selectedTestcaseGroupSummary?.length > 0 && <TestcaseSelectorSummary selectedTestcaseGroupSummary={selectedTestcaseGroupSummary} />}
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
      {isTestcaseSelectPopupOpened && (
        <TestcaseSelectPopup
          testcaseGroups={project?.testcaseGroups}
          selectedTestcaseGroups={currentSelectedTestcaseGroups}
          onApply={setCurrentSelectedTestcaseGroups}
          setOpened={setTestcaseSelectPopupOpened}
        />
      )}
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
