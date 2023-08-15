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
              testcaseGroups={testcaseGroups}
              currentSelectedTestcaseGroups={currentSelectedTestcaseGroups}
              filterCondition={filterCondition}
              onChange={setCurrentSelectedTestcaseGroups}
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
