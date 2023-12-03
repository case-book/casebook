import React, { useEffect, useMemo, useState } from 'react';
import { Block, BlockRow, Button, CheckBox, EmptyContent, Form, Input, Label, Liner, Page, PageButtons, PageContent, PageTitle, TestcaseSelectorSummary, Text, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import TestcaseSelectPopup from '@/assets/TestcaseSelectPopup/TestcaseSelectPopup';
import PropTypes from 'prop-types';
import testcaseUtil from '@/utils/testcaseUtil';
import './ReleaseEditPage.scss';

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
        navigate(`/spaces/${spaceCode}/projects/${projectId}/releases`);
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
  }, [spaceCode, projectId]);
  useEffect(() => {
    if (!isEdit) return;
    ReleaseService.selectRelease(spaceCode, projectId, releaseId, info => {
      setRelease(info);
    });
  }, [spaceCode, projectId, releaseId, isEdit]);

  useEffect(() => {
    setCurrentSelectedTestcaseGroups(
      testcaseUtil.getSelectionFromTestcaseGroups(
        (project?.testcaseGroups ?? []).map(group => ({ ...group, testcases: group.testcases.filter(testcase => testcase.projectReleaseIds.includes(Number(releaseId))) })),
      ),
    );
  }, [project?.testcaseGroups, releaseId]);

  return (
    <Page className="release-edit-page">
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
            text: t('릴리스 목록'),
          },
          {
            to: isEdit ? `/spaces/${spaceCode}/projects/${projectId}/releases/${releaseId}/edit` : `/spaces/${spaceCode}/projects/${projectId}/releases/new`,
            text: isEdit ? `${t('편집')}` : t('생성'),
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/releases`);
        }}
      >
        {isEdit ? t('릴리스') : t('새 릴리스')}
      </PageTitle>
      <PageContent>
        <Form onSubmit={handleSubmit}>
          <Title border={false} marginBottom={false}>
            {t('릴리스 정보')}
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
              <Label minWidth={LABEL_MIN_WIDTH} verticalAlign="baseline">
                {t('타겟 릴리즈')}
              </Label>
              <div>
                <CheckBox
                  type="checkbox"
                  size="sm"
                  value={release.isTarget}
                  onChange={val =>
                    setRelease({
                      ...release,
                      isTarget: val,
                    })
                  }
                />
                <div className="target-description">
                  {t('테스트케이스 생성이나 변경 시 타겟 릴리즈로 설정된 릴리즈가 해당 테스트케이스에 설정되어 있지 않다면, 자동으로 테스트케이스에 릴리즈로 추가됩니다.')}
                </div>
              </div>
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH} verticalAlign="baseline">
                {t('설명')}
              </Label>
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
              {selectedTestcaseGroupSummary?.length > 0 && (
                <Block className="summary-list" scroll maxHeight="600px" border>
                  <TestcaseSelectorSummary selectedTestcaseGroupSummary={selectedTestcaseGroupSummary} />
                </Block>
              )}
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
