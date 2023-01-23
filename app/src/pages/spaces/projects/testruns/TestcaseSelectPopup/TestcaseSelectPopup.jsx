import React, { useCallback, useEffect, useState } from 'react';
import { Button, EmptyContent, Liner, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { TestcaseGroupPropTypes } from '@/proptypes';
import testcaseUtil from '@/utils/testcaseUtil';
import TestcaseSelectorGroup from './TestcaseSelectorGroup';
import './TestcaseSelectPopup.scss';

function TestcaseSelectPopup({ testcaseGroups, selectedTestcaseGroups, setOpened, onApply }) {
  const { t } = useTranslation();

  const [projectTestcaseGroupTree, setProjectTestcaseGroupTree] = useState([]);

  const [currentSelectedTestcaseGroups, setCurrentSelectedTestcaseGroups] = useState([]);

  useEffect(() => {
    const nextGroups = testcaseUtil.getTestcaseTreeData(cloneDeep(testcaseGroups));
    setProjectTestcaseGroupTree(nextGroups);
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

    const nextCurrentSelectedTestcaseGroups = currentSelectedTestcaseGroups.slice(0);

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
          // eslint-disable-next-line no-loop-func
          if (!nextCurrentSelectedTestcaseGroups.find(d => d.testcaseGroupId === parentGroupId)) {
            nextCurrentSelectedTestcaseGroups.push({
              testcaseGroupId: parentGroupId,
              testcases: [],
            });
          }

          // eslint-disable-next-line no-loop-func
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
        <span>테스트케이스</span>
        <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 1rem" />
        <Button size="sm" outline onClick={allCheck}>
          <i className="fa-solid fa-circle-check" /> {t('모두 선택')}
        </Button>
      </ModalHeader>
      <ModalBody className="modal-body">
        {projectTestcaseGroupTree && projectTestcaseGroupTree?.length < 1 && (
          <EmptyContent className="empty-content">
            <div>{t('테스트케이스 정보가 없습니다.')}</div>
          </EmptyContent>
        )}
        {projectTestcaseGroupTree?.length > 0 && (
          <div className="testcase-select-list g-no-select">
            <div className="condition">
              <Button size="sm" outline onClick={allCheck}>
                <i className="fa-solid fa-circle-check" /> {t('전체')}
              </Button>
            </div>
            <ul>
              {projectTestcaseGroupTree?.map(testcaseGroup => {
                const selected = currentSelectedTestcaseGroups.findIndex(d => d.testcaseGroupId === testcaseGroup.id) > -1;
                return <TestcaseSelectorGroup key={testcaseGroup.id} testcaseGroup={testcaseGroup} selected={selected} selectedTestcaseGroups={currentSelectedTestcaseGroups} onClick={onClick} />;
              })}
            </ul>
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
