import React, { useEffect, useMemo, useState } from 'react';
import { Block, BlockRow, Button, EmptyContent, Label, Liner, Page, PageButtons, PageContent, PageTitle, Table, Tbody, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import testcaseUtil from '@/utils/testcaseUtil';
import './ReleaseInfoPage.scss';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import TestcaseService from '@/services/TestcaseService';
import dateUtil from '@/utils/dateUtil';
import ReleaseGroupItem from '@/pages/spaces/projects/releases/ReleaseGroupItem';
import { TestcaseViewerPopup } from '@/assets';
import useQueryString from '@/hooks/useQueryString';

const LABEL_MIN_WIDTH = '120px';

function ReleaseInfoPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId, releaseId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [testcaseGroups, setTestcaseGroups] = useState([]);
  const [releaseNameMap, setReleaseNameMap] = useState({});
  const [release, setRelease] = useState({});
  const [releases, setReleases] = useState([]);
  const { query, setQuery } = useQueryString();

  const { groupId: testcaseGroupId, id: testcaseGroupTestcaseId } = query;

  const [popupInfo, setPopupInfo] = useState({
    opened: false,
  });

  useEffect(() => {
    ReleaseService.selectReleaseList(spaceCode, projectId, list => {
      setReleases(list);
      const nextReleaseNameMap = {};
      list.forEach(projectRelease => {
        nextReleaseNameMap[projectRelease.id] = projectRelease.name;
      });
      setReleaseNameMap(nextReleaseNameMap);
    });

    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });

    TestcaseService.selectTestcaseGroupList(spaceCode, projectId, list => {
      setTestcaseGroups(list);
    });
  }, [spaceCode, projectId]);

  useEffect(() => {
    ReleaseService.selectRelease(spaceCode, projectId, releaseId, info => {
      setRelease(info);
    });
  }, [spaceCode, projectId, releaseId]);

  const testcaseTreeData = useMemo(() => {
    return testcaseUtil.getTestcaseTreeData(testcaseGroups, 'id');
  }, [project, releaseId, testcaseGroups]);

  const hasReleaseTestcase = useMemo(() => {
    return testcaseGroups.some(group => {
      return group.testcases.some(testcase => {
        return testcase.projectReleaseIds.includes(Number(releaseId));
      });
    });
  }, [testcaseGroups]);

  useEffect(() => {
    if (testcaseGroupId && testcaseGroupTestcaseId) {
      const testrunTestcaseGroup = testcaseGroups?.find(d => d.id === Number(testcaseGroupId));

      if (testrunTestcaseGroup) {
        const testcaseGroupTestcase = testrunTestcaseGroup.testcases.find(d => d.id === Number(testcaseGroupTestcaseId));
        if (testcaseGroupTestcase) {
          const testcaseTemplate = project.testcaseTemplates.find(d => d.id === testcaseGroupTestcase.testcaseTemplateId);

          setPopupInfo({
            opened: true,
            testcaseTemplate,
            testcaseGroupId: Number(testcaseGroupId),
            testcaseGroupTestcaseId: Number(testcaseGroupTestcaseId),
          });
        }
      }
    } else {
      setPopupInfo({
        opened: false,
      });
    }
  }, [testcaseGroups, testcaseGroupId, testcaseGroupTestcaseId]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('릴리스 삭제'),
      <div>{t('@ 릴리스 및 해당 릴리스가 할당된 테스트케이스의 릴리스 정보가 모두 초기화됩니다. 삭제하시겠습니까?', { name: release.name })}</div>,
      () => {
        ReleaseService.deleteRelease(spaceCode, projectId, releaseId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/releases`);
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
      <Page className="release-info-page-wrapper">
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
              to: `/spaces/${spaceCode}/projects/${projectId}/releases/${releaseId}`,
              text: release?.name,
            },
          ]}
          control={
            <div>
              <Button size="sm" color="danger" onClick={onDelete}>
                {t('릴리스 삭제')}
              </Button>
              <Liner display="inline-block" width="1px" height="10px" margin="0 10px 0 0" />
              <Button onClick={() => navigate(`/spaces/${spaceCode}/projects/${projectId}/testruns/new?releaseId=${release.id}`)} color="primary">
                {t('새 테스트런')}
              </Button>
              <Button onClick={() => navigate('edit')} color="primary">
                {t('변경')}
              </Button>
            </div>
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/releases`);
          }}
        >
          {t('릴리스')}
        </PageTitle>
        <PageContent>
          <Block>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH}>{t('프로젝트')}</Label>
              <Text>{project?.name}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH}>{t('이름')}</Label>
              <Text>{release.name}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH} verticalAlign="baseline">
                {t('타겟 릴리스')}
              </Label>
              <Text>
                <div>{release.isTarget ? 'Y' : 'N'}</div>
                <div className="target-description">
                  {t('테스트케이스 생성이나 변경 시 타겟 릴리스로 설정된 릴리스가 해당 테스트케이스에 설정되어 있지 않다면, 저장 시 해당 테스트케이스에 릴리스를 추가할지 사용자에게 확인합니다.')}
                </div>
              </Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH}>{t('설명')}</Label>
              <Text whiteSpace="pre-wrap">{release.description}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH}>{t('생성')}</Label>
              <Text whiteSpace="pre-wrap">{dateUtil.getDateString(release.creationDate)}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={LABEL_MIN_WIDTH}>{t('마지막 변경')}</Label>
              <Text whiteSpace="pre-wrap">{dateUtil.getDateString(release.lastUpdateDate)}</Text>
            </BlockRow>
          </Block>
          <Title>{t('테스트케이스')}</Title>
          {!hasReleaseTestcase && <EmptyContent border>{t('릴리스에 등록된 테스트케이스가 없습니다.')}</EmptyContent>}
          {hasReleaseTestcase && (
            <Block className="testcase-list" border padding={false} scroll>
              <Table className="table" cols={['1px', '100%', '1px']} sticky>
                <THead>
                  <Tr>
                    <Th align="left">{t('테스트케이스 그룹')}</Th>
                    <Th align="left">{t('테스트케이스')}</Th>
                    <Th align="left">{t('릴리스')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {testcaseTreeData.map(testcaseGroup => {
                    return (
                      <ReleaseGroupItem
                        key={testcaseGroup.id}
                        releaseId={releaseId}
                        testcaseGroup={testcaseGroup}
                        releaseNameMap={releaseNameMap}
                        onNameClick={(groupId, id) => {
                          setQuery({ groupId, id });
                        }}
                      />
                    );
                  })}
                </Tbody>
              </Table>
            </Block>
          )}
          <PageButtons
            onBack={() => {
              navigate(-1);
            }}
            onEdit={() => {
              navigate(`/spaces/${spaceCode}/projects/${projectId}/releases/${releaseId}/edit`);
            }}
            onCancelIcon=""
          />
        </PageContent>
      </Page>
      {popupInfo.opened && (
        <TestcaseViewerPopup
          spaceCode={spaceCode}
          projectId={projectId}
          project={project}
          releases={releases}
          testcaseTemplate={popupInfo.testcaseTemplate}
          testcaseGroupId={popupInfo.testcaseGroupId}
          testcaseGroupTestcaseId={popupInfo.testcaseGroupTestcaseId}
          users={project?.users.map(u => {
            return {
              ...u,
              id: u.userId,
            };
          })}
          setOpened={val => {
            setPopupInfo({
              ...popupInfo,
              opened: val,
            });
            setQuery({ groupId: null, id: null });
          }}
        />
      )}
    </>
  );
}

export default ReleaseInfoPage;
