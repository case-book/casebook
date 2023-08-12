import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DateRange, EmptyContent, Input, Liner, Modal, ModalBody, ModalFooter, ModalHeader, TestcaseSelector } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { TestcaseGroupPropTypes } from '@/proptypes';
import testcaseUtil from '@/utils/testcaseUtil';
import useStores from '@/hooks/useStores';
import moment from 'moment/moment';
import dateUtil from '@/utils/dateUtil';
import './TestcaseSelectPopup.scss';

function TestcaseSelectPopup({ testcaseGroups, selectedTestcaseGroups, setOpened, onApply }) {
  const { t } = useTranslation();
  const {
    userStore: { user },
  } = useStores();
  const [projectTestcaseGroupTree, setProjectTestcaseGroupTree] = useState([]);
  const [currentSelectedTestcaseGroups, setCurrentSelectedTestcaseGroups] = useState([]);
  const [filterCondition, setFilterCondition] = useState({ name: '', minDate: null, maxDate: null });
  const [range, setRange] = useState({});

  useEffect(() => {
    const nextGroups = testcaseUtil.getTestcaseTreeData(cloneDeep(testcaseGroups), 'id');
    setProjectTestcaseGroupTree(nextGroups);
    const allTestCases = testcaseGroups?.reduce((data, current) => {
      return data.concat(current.testcases);
    }, []);
    const testCaseCreationDates = allTestCases.reduce((data, current) => {
      return data.concat(dateUtil.getLocalDate(current.creationDate).valueOf());
    }, []);

    const min = moment(Math.min(...testCaseCreationDates));
    min.set('minute', 0);
    min.set('second', 0);
    min.set('millisecond', 0);
    const max = moment(Math.max(...testCaseCreationDates));
    max.set('hour', max.get('hour') + 1);
    max.set('minute', 0);
    max.set('second', 0);
    max.set('millisecond', 0);

    setFilterCondition({
      name: '',
      minDate: null,
      maxDate: null,
    });

    setRange({
      minDate: min,
      maxDate: max,
    });
  }, [testcaseGroups]);

  useEffect(() => {
    setCurrentSelectedTestcaseGroups(cloneDeep(selectedTestcaseGroups));
  }, [selectedTestcaseGroups]);

  const removeParentId = (list, parentId) => {
    const targetGroupIds = testcaseGroups.filter(d => d.parentId === parentId).map(d => d.id);

    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (targetGroupIds.includes(list[i].testcaseGroupId)) {
        list.splice(i, 1);
      }
    }

    for (let i = 0; i < targetGroupIds.length; i += 1) {
      removeParentId(list, targetGroupIds[i]);
    }
  };

  const addChildGroup = (list, parentId) => {
    const targetGroupIds = testcaseGroups.filter(d => d.parentId === parentId).map(d => d.id);
    for (let i = 0; i < targetGroupIds.length; i += 1) {
      if (!list.find(d => d.testcaseGroupId === targetGroupIds[i])) {
        const testcaseGroupInfo = testcaseGroups.find(d => d.id === targetGroupIds[i]);
        list.push({
          testcaseGroupId: targetGroupIds[i],
          testcases:
            testcaseGroupInfo.testcases?.map(d => {
              return {
                testcaseId: d.id,
              };
            }) || [],
        });
      }
    }

    for (let i = 0; i < targetGroupIds.length; i += 1) {
      addChildGroup(list, targetGroupIds[i]);
    }
  };

  const addParentGroup = (list, groupId) => {
    const groupInfo = testcaseGroups.find(d => d.id === groupId);
    if (groupInfo.parentId) {
      const parentGroupId = testcaseGroups.find(d => d.id === groupInfo.parentId).id;

      if (!list.find(d => d.testcaseGroupId === parentGroupId)) {
        list.push({
          testcaseGroupId: parentGroupId,
          testcases: [],
        });
      }

      addParentGroup(list, parentGroupId);
    }
  };

  const onClick = (testcaseGroupId, testcaseId) => {
    const isGroup = !testcaseId;

    const nextCurrentSelectedTestcaseGroups = (currentSelectedTestcaseGroups || []).slice(0);

    const selectedGroupIndex = nextCurrentSelectedTestcaseGroups.findIndex(d => d.testcaseGroupId === testcaseGroupId);

    if (isGroup) {
      if (selectedGroupIndex > -1) {
        const testcaseGroupInfo = testcaseGroups.find(d => d.id === testcaseGroupId);
        nextCurrentSelectedTestcaseGroups.splice(selectedGroupIndex, 1);
        removeParentId(nextCurrentSelectedTestcaseGroups, testcaseGroupInfo.id);
      } else {
        const testcaseGroupInfo = testcaseGroups.find(d => d.id === testcaseGroupId);

        let parentGroupId = testcaseGroupInfo.parentId;
        while (parentGroupId) {
          if (!nextCurrentSelectedTestcaseGroups.find(d => d.testcaseGroupId === parentGroupId)) {
            nextCurrentSelectedTestcaseGroups.push({
              testcaseGroupId: parentGroupId,
              testcases: [],
            });
          }

          const parentGroup = testcaseGroups.find(d => d.id === parentGroupId);
          parentGroupId = parentGroup?.parentId;
        }

        nextCurrentSelectedTestcaseGroups.push({
          testcaseGroupId,
          testcases:
            testcaseGroupInfo.testcases?.map(d => {
              return {
                testcaseId: d.id,
              };
            }) || [],
        });

        addChildGroup(nextCurrentSelectedTestcaseGroups, testcaseGroupId);
      }
    } else if (selectedGroupIndex > -1) {
      const currentSelectedInfo = nextCurrentSelectedTestcaseGroups[selectedGroupIndex];
      const selectedTestcaseIndex = currentSelectedInfo.testcases?.findIndex(d => d.testcaseId === testcaseId);
      if (selectedTestcaseIndex > -1) {
        currentSelectedInfo.testcases.splice(selectedTestcaseIndex, 1);
      } else {
        currentSelectedInfo.testcases.push({
          testcaseId,
        });
      }
    } else {
      nextCurrentSelectedTestcaseGroups.push({
        testcaseGroupId,
        testcases: [
          {
            testcaseId,
          },
        ],
      });

      addParentGroup(nextCurrentSelectedTestcaseGroups, testcaseGroupId);
    }

    setCurrentSelectedTestcaseGroups(nextCurrentSelectedTestcaseGroups);
  };

  const filteredProjectTestcaseGroupTree = useMemo(() => {
    return projectTestcaseGroupTree
      ?.filter(testcaseGroup => testcaseUtil.isGroupFilteredByName(testcaseGroup, filterCondition.name))
      ?.filter(testcaseGroup => testcaseUtil.isGroupFilteredByRange(testcaseGroup, filterCondition.minDate, filterCondition.maxDate))
      .map(testcaseGroup => {
        return {
          ...testcaseGroup,
          testcases: testcaseGroup.testcases
            .filter(testcase => testcaseUtil.isFilteredTestcaseByName(testcase, filterCondition.name))
            .filter(testcase => testcaseUtil.isFilteredTestcaseByRange(testcase, filterCondition.minDate, filterCondition.maxDate)),
        };
      });
  }, [projectTestcaseGroupTree, filterCondition]);

  const allCheck = useCallback(() => {
    if (currentSelectedTestcaseGroups.length > 0) {
      setCurrentSelectedTestcaseGroups([]);
    } else {
      setCurrentSelectedTestcaseGroups(
        testcaseGroups?.map(d => {
          return {
            testcaseGroupId: d.id,
            testcases: d.testcases?.map(item => {
              return {
                testcaseId: item.id,
              };
            }),
          };
        }),
      );
    }
  }, [currentSelectedTestcaseGroups, testcaseGroups]);

  const filtered = useMemo(() => {
    return Object.values(filterCondition).some(d => d);
  }, [filterCondition]);

  return (
    <Modal
      size="xl"
      className="testcase-select-popup-wrapper"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader className="modal-header">
        <span>{t('테스트케이스 선택')}</span>
      </ModalHeader>
      <ModalBody className="modal-body">
        {projectTestcaseGroupTree && projectTestcaseGroupTree?.length < 1 && (
          <EmptyContent className="empty-content">
            <div>{t('테스트케이스 정보가 없습니다.')}</div>
          </EmptyContent>
        )}
        {projectTestcaseGroupTree?.length > 0 && (
          <div className="content">
            <div className="testrun-filter">
              <div>
                <Button size="sm" outline onClick={allCheck} disabled={filtered}>
                  <i className="fa-solid fa-circle-check" /> ALL
                </Button>
              </div>
              <div>
                <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
              </div>
              <div>
                <Button
                  className="filter-button"
                  rounded
                  size="sm"
                  color={filtered ? 'primary' : 'white'}
                  onClick={() => {
                    setFilterCondition({
                      name: '',
                      minDate: null,
                      maxDate: null,
                    });
                  }}
                >
                  <i className="fa-solid fa-filter" />
                </Button>
              </div>
              <div>
                <DateRange
                  className="date-range"
                  size="sm"
                  country={user.country}
                  language={user.language}
                  startDate={filterCondition.minDate?.valueOf()}
                  endDate={filterCondition.maxDate?.valueOf()}
                  startDateKey="minDate"
                  endDateKey="maxDate"
                  onChange={(key, value) => {
                    setFilterCondition({
                      ...filterCondition,
                      [key]: value ? moment(value) : value,
                    });
                  }}
                  nullable
                  control={
                    <Button
                      className="fill-button"
                      rounded
                      size="xs"
                      shadow={false}
                      onClick={() => {
                        setFilterCondition({
                          ...filterCondition,
                          minDate: range.minDate,
                          maxDate: range.maxDate,
                        });
                      }}
                    >
                      <i className="fa-solid fa-fill-drip" />
                    </Button>
                  }
                />
              </div>
              <div className="icon">
                <i className="fa-solid fa-font" />
              </div>
              <Input
                value={filterCondition.name}
                size="sm"
                placeholder={t('테스트케이스 및 그룹 이름')}
                onChange={value => {
                  setFilterCondition({
                    ...filterCondition,
                    name: value,
                  });
                }}
              />
            </div>
            <TestcaseSelector
              filteredProjectTestcaseGroupTree={filteredProjectTestcaseGroupTree}
              currentSelectedTestcaseGroups={currentSelectedTestcaseGroups}
              filterCondition={filterCondition}
              onClick={onClick}
            />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => setOpened(false)}>
          {t('취소')}
        </Button>
        <Button
          outline
          onClick={() => {
            if (onApply) {
              onApply(currentSelectedTestcaseGroups);
            }

            if (setOpened) {
              setOpened(false);
            }
          }}
        >
          {t('확인')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

TestcaseSelectPopup.defaultProps = {
  testcaseGroups: [],
  selectedTestcaseGroups: [],
};

TestcaseSelectPopup.propTypes = {
  testcaseGroups: PropTypes.arrayOf(TestcaseGroupPropTypes),
  selectedTestcaseGroups: PropTypes.arrayOf(
    PropTypes.shape({
      testcaseGroupId: PropTypes.number,
      testcases: PropTypes.arrayOf(
        PropTypes.shape({
          testcaseId: PropTypes.number,
        }),
      ),
    }),
  ),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default TestcaseSelectPopup;
