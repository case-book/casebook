import React, { useEffect, useMemo, useState } from 'react';
import { Block, BlockRow, Button, EmptyContent, Label, Liner, Page, PageButtons, PageContent, PageTitle, SeqId, Table, Tag, Tbody, Td, Text, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import testcaseUtil from '@/utils/testcaseUtil';
import './ReleaseInfoPage.scss';
import dialogUtil from '@/utils/dialogUtil';
import { ITEM_TYPE, MESSAGE_CATEGORY } from '@/constants/constants';

const LABEL_MIN_WIDTH = '120px';

function ReleaseInfoPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId, releaseId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [releaseNameMap, setReleaseNameMap] = useState({});
  const [release, setRelease] = useState({});

  useEffect(() => {
    ReleaseService.selectReleaseList(spaceCode, projectId, list => {
      const nextReleaseNameMap = {};
      list.forEach(projectRelease => {
        nextReleaseNameMap[projectRelease.id] = projectRelease.name;
      });
      setReleaseNameMap(nextReleaseNameMap);
    });

    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  useEffect(() => {
    ReleaseService.selectRelease(spaceCode, projectId, releaseId, info => {
      setRelease(info);
    });
  }, [spaceCode, projectId, releaseId]);

  const selectedTestcaseGroup = useMemo(
    () =>
      testcaseUtil.getSelectionFromTestcaseGroups(
        (project?.testcaseGroups ?? []).map(group => ({
          ...group,
          testcases: group.testcases.filter(testcase => testcase.projectReleaseIds.includes(Number(releaseId))),
        })),
      ),
    [project, releaseId],
  );

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
              {t('편집')}
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
              {t('타겟 릴리즈')}
            </Label>
            <Text>
              <div>{release.isTarget ? 'Y' : 'N'}</div>
              <div className="target-description">
                {t('테스트케이스 생성이나 변경 시 타겟 릴리즈로 설정된 릴리즈가 해당 테스트케이스에 설정되어 있지 않다면, 자동으로 테스트케이스에 릴리즈로 추가하는지 됩니다.')}
              </div>
            </Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={LABEL_MIN_WIDTH}>{t('설명')}</Label>
            <Text whiteSpace="pre-wrap">{release.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label minWidth={LABEL_MIN_WIDTH}>{t('테스트케이스')}</Label>
          </BlockRow>
          <BlockRow className="release-testcases-content">
            {selectedTestcaseGroup.length < 1 && <EmptyContent border>{t('릴리스에 해당하는 테스트케이스가 없습니다.')}</EmptyContent>}
            {selectedTestcaseGroup?.length > 0 && (
              <Table cols={['1px', '100%', '1px']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('테스트케이스 그룹')}</Th>
                    <Th align="left">{t('테스트케이스')}</Th>
                    <Th align="left">{t('릴리스')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {selectedTestcaseGroup?.map(d => {
                    if (d.testcases?.length > 0) {
                      return (
                        <React.Fragment key={d.testcaseGroupId}>
                          {d.testcases?.map((testcase, inx) => {
                            return (
                              <Tr key={testcase.id}>
                                {inx === 0 && (
                                  <Td rowSpan={d.testcases.length} className="group-info">
                                    <div className="seq-name">
                                      <div>
                                        <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                                          {d.seqId}
                                        </SeqId>
                                      </div>
                                      <div>{d.name}</div>
                                    </div>
                                  </Td>
                                )}
                                <Td>
                                  <div className="seq-name">
                                    <div>
                                      <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE} copy={false}>
                                        {testcase.seqId}
                                      </SeqId>
                                    </div>
                                    <div>{testcase.name}</div>
                                  </div>
                                </Td>
                                <Td className="releases">
                                  {testcase.projectReleaseIds
                                    .sort((a, b) => b - a)
                                    .map(projectReleaseId => {
                                      return (
                                        <Tag key={projectReleaseId} border bold>
                                          {releaseNameMap[projectReleaseId]}
                                        </Tag>
                                      );
                                    })}
                                </Td>
                              </Tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    }

                    return (
                      <Tr key={d.seqId}>
                        <Td className="group-info">
                          <div className="seq-name">
                            <div>
                              <SeqId size="sm" type={ITEM_TYPE.TESTCASE_GROUP} copy={false}>
                                {d.seqId}
                              </SeqId>
                            </div>
                            <div>{d.name}</div>
                          </div>
                        </Td>
                        <Td />
                        <Td />
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </BlockRow>
        </Block>
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
  );
}

export default ReleaseInfoPage;
