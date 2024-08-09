import React, { useEffect, useMemo, useState } from 'react';
import {
  Block,
  BlockRow,
  Button,
  CheckBox,
  EmptyContent,
  Form,
  Input,
  Label,
  Liner,
  Page,
  PageButtons,
  PageContent,
  PageTitle,
  Table,
  Tbody,
  Text,
  TextArea,
  Th,
  THead,
  Title,
  Tr,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import ProjectService from '@/services/ProjectService';
import ReleaseService from '@/services/ReleaseService';
import TestcaseSelectPopup from '@/assets/TestcaseSelectPopup/TestcaseSelectPopup';
import PropTypes from 'prop-types';
import testcaseUtil from '@/utils/testcaseUtil';
import TestcaseService from '@/services/TestcaseService';
import './ReleaseEditPage.scss';
import SelectReleaseGroupItem from '@/pages/spaces/projects/releases/SelectReleaseGroupItem';
import { TestcaseViewerPopup } from '@/assets';
import useQueryString from '@/hooks/useQueryString';

const LABEL_MIN_WIDTH = '120px';

function ReleaseEditPage({ type }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceCode, projectId, releaseId } = useParams();
  const [project, setProject] = useState(null);
  const [releases, setReleases] = useState([]);
  const [testcaseGroups, setTestcaseGroups] = useState([]);
  const [release, setRelease] = useState({});
  const [currentSelectedTestcaseGroups, setCurrentSelectedTestcaseGroups] = useState([]);
  const [isTestcaseSelectPopupOpened, setTestcaseSelectPopupOpened] = useState(false);
  const [searchParams] = useSearchParams();
  const { query, setQuery } = useQueryString();
  const { groupId: testcaseGroupId, id: testcaseGroupTestcaseId } = query;
  const [popupInfo, setPopupInfo] = useState({
    opened: false,
  });
  const name = searchParams.get('name') ?? null;

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    if (!isEdit && name) {
      setRelease({
        ...release,
        isTarget: true,
        name,
      });
    }
  }, [name]);

  const testcaseTreeData = useMemo(() => {
    return testcaseUtil.getTestcaseTreeData(testcaseGroups, 'id');
  }, [project, releaseId, testcaseGroups]);

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

  const selectAllTestcase = () => setCurrentSelectedTestcaseGroups(testcaseUtil.getSelectionFromTestcaseGroups(testcaseGroups ?? []));

  const selectedTestcaseIdMap = useMemo(() => {
    const map = {};
    currentSelectedTestcaseGroups.forEach(group => {
      group.testcases.forEach(testcase => {
        map[testcase.testcaseId] = true;
      });
    });

    return map;
  }, [currentSelectedTestcaseGroups]);

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      setProject(info);
    });

    TestcaseService.selectTestcaseGroupList(spaceCode, projectId, list => {
      setTestcaseGroups(list);
    });

    ReleaseService.selectReleaseList(spaceCode, projectId, list => {
      setReleases(list);
    });
  }, [spaceCode, projectId]);

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    ReleaseService.selectRelease(spaceCode, projectId, releaseId, info => {
      setRelease(info);
    });
  }, [spaceCode, projectId, releaseId, isEdit]);

  useEffect(() => {
    setCurrentSelectedTestcaseGroups(
      testcaseUtil.getSelectionFromTestcaseGroups(
        (testcaseGroups ?? []).map(group => ({
          ...group,
          testcases: group.testcases.filter(testcase => testcase.projectReleaseIds.includes(Number(releaseId))),
        })),
      ),
    );
  }, [testcaseGroups, releaseId]);

  return (
    <>
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
              text: isEdit ? `${t('변경')}` : t('생성'),
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
                  {t('타겟 릴리스')}
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
                    {t('테스트케이스 생성이나 변경 시 타겟 릴리스로 설정된 릴리스가 해당 테스트케이스에 설정되어 있지 않다면, 저장 시 해당 테스트케이스에 릴리스를 추가할지 사용자에게 확인합니다.')}
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
            </Block>
            <Title
              control={
                <div>
                  <Button
                    outline
                    size="sm"
                    onClick={() => {
                      setTestcaseSelectPopupOpened(true);
                    }}
                  >
                    {t('테스트케이스 선택')}
                  </Button>
                  <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                  <Button
                    outline
                    size="sm"
                    onClick={() => {
                      selectAllTestcase();
                    }}
                  >
                    {t('모든 테스트케이스 추가')}
                  </Button>
                </div>
              }
            >
              {t('테스트케이스')}
            </Title>
            {currentSelectedTestcaseGroups.length < 1 && <EmptyContent border>{t('선택된 테스트케이스가 없습니다.')}</EmptyContent>}
            {currentSelectedTestcaseGroups.length > 0 && (
              <Block className="testcase-list" border padding={false} scroll>
                <Table className="table" cols={['1px', '100%', '1px']} sticky>
                  <THead>
                    <Tr>
                      <Th align="left">{t('테스트케이스 그룹')}</Th>
                      <Th align="left">{t('테스트케이스')}</Th>
                    </Tr>
                  </THead>
                  <Tbody>
                    {testcaseTreeData.map(testcaseGroup => {
                      return (
                        <SelectReleaseGroupItem
                          key={testcaseGroup.id}
                          testcaseGroup={testcaseGroup}
                          selectedTestcaseIdMap={selectedTestcaseIdMap}
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
            testcaseGroups={testcaseGroups}
            selectedTestcaseGroups={currentSelectedTestcaseGroups}
            onApply={setCurrentSelectedTestcaseGroups}
            setOpened={setTestcaseSelectPopupOpened}
          />
        )}
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

ReleaseEditPage.defaultProps = {
  type: 'new',
};

ReleaseEditPage.propTypes = {
  type: PropTypes.string,
};

export default ReleaseEditPage;
