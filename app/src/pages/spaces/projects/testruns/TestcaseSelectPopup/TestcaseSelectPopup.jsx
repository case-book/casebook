import React, { useCallback, useEffect, useState } from 'react';
import { Button, EmptyContent, Liner, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { TestcaseGroupPropTypes } from '@/proptypes';
import testcaseUtil from '@/utils/testcaseUtil';
import './TestcaseSelectPopup.scss';
import TestcaseSelectorGroup from '@/pages/spaces/projects/testruns/TestcaseSelectPopup/TestcaseSelectorGroup';

function TestcaseSelectPopup({ testcaseGroups, selectedTestcaseGroups, setOpened, onApply }) {
  const { t } = useTranslation();

  const [projectTestcaseGroupTree, setProjectTestcaseGroupTree] = useState([]);

  const [currentSelectedTestcaseGroups, setCurrentSelectedTestcaseGroups] = useState([]);

  useEffect(() => {
    const nextGroups = testcaseUtil.getTestcaseTreeData(cloneDeep(testcaseGroups));
    setProjectTestcaseGroupTree(nextGroups);
  }, [testcaseGroups]);

  console.log(projectTestcaseGroupTree);

  useEffect(() => {
    setCurrentSelectedTestcaseGroups(cloneDeep(selectedTestcaseGroups));
  }, [selectedTestcaseGroups]);

  const onClick = user => {
    const nextCurrentSelectedUsers = currentSelectedTestcaseGroups.slice(0);
    const index = nextCurrentSelectedUsers.findIndex(d => d.userId === user.userId);

    if (index > -1) {
      nextCurrentSelectedUsers.splice(index, 1);
    } else {
      nextCurrentSelectedUsers.push({ ...user });
    }

    setCurrentSelectedTestcaseGroups(nextCurrentSelectedUsers);
  };

  const allCheck = useCallback(() => {
    if (currentSelectedTestcaseGroups.length === projectTestcaseGroupTree.length) {
      setCurrentSelectedTestcaseGroups([]);
    } else {
      setCurrentSelectedTestcaseGroups(
        projectTestcaseGroupTree.map(d => {
          return {
            ...d,
          };
        }),
      );
    }
  }, [currentSelectedTestcaseGroups, projectTestcaseGroupTree]);

  return (
    <Modal size="xl" className="testcase-select-popup-wrapper" isOpen>
      <ModalHeader
        className="modal-header"
        onClose={() => {
          if (setOpened) {
            setOpened(false);
          }
        }}
      >
        <span>테스트케이스</span>
        <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 1rem" />
        <Button size="sm" outline onClick={allCheck}>
          <i className="fa-solid fa-circle-check" /> {t('모두 선택')}
        </Button>
      </ModalHeader>
      <ModalBody className="modal-body">
        <div className="testcase-select-list g-no-select">
          {projectTestcaseGroupTree && projectTestcaseGroupTree?.length < 1 && (
            <EmptyContent className="empty-content">
              <div>{t('프로젝트 사용자가 없습니다.')}</div>
            </EmptyContent>
          )}
          {projectTestcaseGroupTree?.length > 0 && (
            <>
              <div className="condition">
                <Button size="sm" outline onClick={allCheck}>
                  <i className="fa-solid fa-circle-check" /> {t('전체')}
                </Button>
              </div>
              <ul>
                {projectTestcaseGroupTree?.map(testcaseGroup => {
                  const selected = currentSelectedTestcaseGroups.findIndex(d => d.userId === testcaseGroup.userId) > -1;
                  return <TestcaseSelectorGroup key={testcaseGroup.id} testcaseGroup={testcaseGroup} selected={selected} onClick={onClick} />;
                })}
              </ul>
            </>
          )}
        </div>
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
