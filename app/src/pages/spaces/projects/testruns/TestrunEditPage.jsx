import React, { useEffect, useMemo, useState } from 'react';
import { Block, Button, CloseIcon, DateRange, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Radio, Text, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import ProjectService from '@/services/ProjectService';
import useStores from '@/hooks/useStores';
import './TestrunEditPage.scss';
import ProjectUserSelectPopup from '@/pages/spaces/projects/testruns/ProjectUserSelectPopup';

const start = new Date();
start.setHours(start.getHours() + 1);
start.setMinutes(0);
start.setSeconds(0);
start.setMilliseconds(0);

const end = new Date();
end.setHours(end.getHours() + 2);
end.setMinutes(0);
end.setSeconds(0);
end.setMilliseconds(0);

const TESTCASE_SELECTION_TYPES = [
  {
    key: 'ALL',
    value: '모든 테스트케이스',
  },
  {
    key: 'CHOICE',
    value: '테스트케이스 선택',
  },
];

const labelMinWidth = '120px';

function TestrunEditPage({ type }) {
  const { t } = useTranslation();
  const { projectId, spaceCode } = useParams();

  const {
    userStore: { user },
  } = useStores();

  const navigate = useNavigate();

  const [testcaseSelectionType, setTestcaseSelectionType] = useState(TESTCASE_SELECTION_TYPES[0].key);

  const [allUserSelection, setAllUserSelection] = useState(true);

  const [projectUserSelectPopupOpened, setProjectUserSelectPopupOpened] = useState(false);

  const [project, setProject] = useState(null);

  const [testrun, setTestrun] = useState({
    seqId: '',
    name: '',
    description: '',
    testrunUsers: [],
    testcaseGroups: [],
    startDateTime: start.getTime(),
    endDateTime: end.getTime(),
    opened: false,
    totalTestcaseCount: true,
    passedTestcaseCount: true,
    failedTestcaseCount: true,
  });

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    if (project && allUserSelection) {
      setTestrun({
        ...testrun,
        testrunUsers: project.users?.map(d => {
          return { ...d };
        }),
      });
    }
  }, [project, allUserSelection]);

  useEffect(() => {
    let nextTestrun = { ...testrun };

    if (project && allUserSelection) {
      nextTestrun = {
        ...nextTestrun,
        testrunUsers: project.users?.map(d => {
          return { ...d };
        }),
      };
    }

    if (project && testcaseSelectionType === 'ALL') {
      nextTestrun = {
        ...nextTestrun,
        testcaseGroups: project.testcaseGroups?.map(d => {
          return {
            testcaseGroupId: d.id,
            testcases: d.testcases?.map(item => {
              return {
                testcaseId: item.id,
              };
            }),
          };
        }),
      };

      setTestrun(nextTestrun);
    }
  }, [project, allUserSelection, testcaseSelectionType]);

  useEffect(() => {
    ProjectService.selectProjectInfo(spaceCode, projectId, info => {
      console.log(info);
      setProject(info);
    });
  }, [type, projectId]);

  const onSubmit = e => {
    e.preventDefault();
  };

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('프로젝트 삭제'),
      <div>{t(`"${testrun.name}" 프로젝트 및 프로젝트에 포함된 모든 정보가 삭제됩니다. 삭제하시겠습니까?`)}</div>,
      () => {
        ProjectService.deleteProject(spaceCode, testrun, () => {
          navigate(`/spaces/${spaceCode}/projects`);
        });
      },
      null,
      t('삭제'),
    );
  };

  const onChangeTestrun = (key, value) => {
    setTestrun({
      ...testrun,
      [key]: value,
    });
  };

  const removeTestrunUser = userId => {
    const nextTestrunUsers = testrun.testrunUsers.slice(0);
    const nextIndex = nextTestrunUsers.findIndex(d => d.userId === userId);
    if (nextIndex > -1) {
      nextTestrunUsers.splice(nextIndex, 1);
      if (nextTestrunUsers.length !== project.users.length) {
        setAllUserSelection(false);
      }
      onChangeTestrun('testrunUsers', nextTestrunUsers);
    }
  };

  console.log(project);
  console.log(testrun);

  return (
    <>
      <Page className="testrun-edit-page-wrapper">
        <PageTitle
          control={
            isEdit ? (
              <div>
                <Button size="sm" color="danger" onClick={onDelete}>
                  {t('테스트런 삭제')}
                </Button>
              </div>
            ) : null
          }
        >
          {type === 'edit' ? t('테스트런') : t('새 테스트런')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title>{t('테스트런 정보')}</Title>
            <Block>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('프로젝트')}</Label>
                <Text>{project?.name}</Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} required>
                  {t('이름')}
                </Label>
                <Input
                  value={testrun.name}
                  onChange={val =>
                    setTestrun({
                      ...testrun,
                      name: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('설명')}</Label>
                <TextArea
                  value={testrun.description || ''}
                  rows={4}
                  onChange={val => {
                    setTestrun({
                      ...testrun,
                      description: val,
                    });
                  }}
                />
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth} required>
                  {t('테스트 기간')}
                </Label>
                <DateRange
                  country={user.country}
                  language={user.language}
                  startDate={testrun.startDateTime}
                  endDate={testrun.endDateTime}
                  startDateKey="startDateTime"
                  endDateKey="endDateTime"
                  onChange={(key, value) => {
                    setTestrun({
                      ...testrun,
                      [key]: value,
                    });
                  }}
                />
              </BlockRow>
              <BlockRow className="testrun-users-type-row">
                <Label minWidth={labelMinWidth}>{t('테스터')}</Label>
                <div className="testrun-users-type">
                  <Radio
                    value
                    checked={allUserSelection}
                    onChange={() => {
                      setAllUserSelection(true);
                    }}
                    label="모든 사용자"
                  />
                  <Radio
                    value={false}
                    checked={!allUserSelection}
                    onChange={() => {
                      setAllUserSelection(false);
                    }}
                    label="사용자 선택"
                  />
                  <Button
                    outline
                    onClick={() => {
                      setProjectUserSelectPopupOpened(true);
                    }}
                  >
                    사용자 선택
                  </Button>
                </div>
              </BlockRow>
              <BlockRow className="testrun-users-row">
                <Label minWidth={labelMinWidth} />
                {testrun.testrunUsers?.length < 1 && <Text className="no-user">{t('선택된 사용자가 없습니다.')}</Text>}
                {testrun.testrunUsers?.length > 0 && (
                  <ul className="testrun-users">
                    {testrun.testrunUsers?.map(d => {
                      return (
                        <li key={d.userId}>
                          <div>{d.name}</div>
                          <div>
                            <CloseIcon
                              onClick={() => {
                                removeTestrunUser(d.userId);
                              }}
                              size="xs"
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </BlockRow>
              <BlockRow className="testrun-selection-type-row">
                <Label minWidth={labelMinWidth}>{t('테스트케이스')}</Label>
                <div className="testrun-selection-type">
                  {TESTCASE_SELECTION_TYPES.map(d => {
                    return (
                      <Radio
                        key={d.key}
                        value={d.key}
                        checked={testcaseSelectionType === d.key}
                        onChange={() => {
                          setTestcaseSelectionType(d.key);
                        }}
                        label={d.value}
                      />
                    );
                  })}
                </div>
              </BlockRow>
              <BlockRow className="testrun-groups-row">
                <Label minWidth={labelMinWidth} />
                <Text className="testcase-summary">
                  <span>{testrun.testcaseGroups?.length}</span>
                  <span>그룹</span>
                  <span>
                    {testrun.testcaseGroups?.reduce((b, n) => {
                      return b + (n.testcases?.length || 0);
                    }, 0)}
                  </span>
                  <span>케이스</span>
                </Text>
              </BlockRow>
            </Block>
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
      {projectUserSelectPopupOpened && (
        <ProjectUserSelectPopup
          users={project.users}
          selectedUsers={testrun.testrunUsers}
          setOpened={setProjectUserSelectPopupOpened}
          onApply={selectedUsers => {
            onChangeTestrun('testrunUsers', selectedUsers);
          }}
        />
      )}
    </>
  );
}

TestrunEditPage.defaultProps = {
  type: 'new',
};

TestrunEditPage.propTypes = {
  type: PropTypes.string,
};

export default TestrunEditPage;
