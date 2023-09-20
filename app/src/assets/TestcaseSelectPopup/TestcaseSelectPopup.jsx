import React, { useCallback, useEffect, useState } from 'react';
import { Button, EmptyContent, Modal, ModalBody, ModalFooter, ModalHeader, TestcaseSelector, TestcaseSelectorFilter } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { TestcaseGroupPropTypes, SelectedTestcaseGroupPropTypes } from '@/proptypes';
import testcaseUtil from '@/utils/testcaseUtil';
import useStores from '@/hooks/useStores';
import moment from 'moment/moment';
import dateUtil from '@/utils/dateUtil';
import './TestcaseSelectPopup.scss';
import ReleaseService from '@/services/ReleaseService';

function TestcaseSelectPopup({ testcaseGroups, selectedTestcaseGroups, setOpened, onApply }) {
  const { t } = useTranslation();
  const {
    userStore: { user },
    contextStore: { spaceCode, projectId },
  } = useStores();
  const [projectTestcaseGroupTree, setProjectTestcaseGroupTree] = useState([]);
  const [currentSelectedTestcaseGroups, setCurrentSelectedTestcaseGroups] = useState([]);
  const [filterCondition, setFilterCondition] = useState({ name: '', minDate: null, maxDate: null, releases: [] });
  const [releases, setReleases] = useState([]);
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

    setFilterCondition({ name: '', minDate: null, maxDate: null, releases: [] });

    ReleaseService.selectReleaseList(spaceCode, projectId).then(res => setReleases(res.data));

    setRange({
      minDate: min,
      maxDate: max,
    });
  }, [testcaseGroups, spaceCode, projectId]);

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
            <TestcaseSelectorFilter
              filter={filterCondition}
              releases={releases}
              onChange={setFilterCondition}
              onAllCheck={allCheck}
              dateRange={range}
              country={user.country}
              language={user.language}
            />
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
  selectedTestcaseGroups: SelectedTestcaseGroupPropTypes,
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default TestcaseSelectPopup;
