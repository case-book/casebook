import React, { useEffect, useMemo } from 'react';
import { Block, EmptyContent, Liner, Modal, ModalBody, ModalHeader, Table, Tag, Tbody, Th, THead, Tr } from '@/components';
import PropTypes from 'prop-types';
import { TestcaseGroupPropTypes } from '@/proptypes';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import ReportGroupItem from '@/pages/spaces/projects/reports/ReportInfoPage/ReportGroupItem';
import testcaseUtil from '@/utils/testcaseUtil';
import './TestrunTestcaseListViewerPopup.scss';

function TestrunTestcaseListViewerPopup({ testcaseGroups, users, onItemClick, setOpened, userId, status, resultViewOpened, hasComment }) {
  const { t } = useTranslation();

  const list = useMemo(() => {
    return testcaseUtil.getFilteredTestcaseGroupList(testcaseGroups, status, userId, hasComment);
  }, [testcaseGroups, status, userId, hasComment]);

  const onKeyDown = e => {
    if (e.keyCode === 27 && !resultViewOpened) {
      setOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [resultViewOpened]);

  console.log(status);

  return (
    <Modal
      className="testrun-testcase-list-viewer-popup-wrapper"
      size="xl"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader>
        <div className="modal-title">
          <div>{t('테스트 결과')}</div>
          {(status || userId) && (
            <>
              <Liner width="1px" height="10px" margin="0 0.5rem" />
              {status && (
                <div className="status">
                  <Tag border size="xs" className={`status ${status}`}>
                    {status}
                  </Tag>
                </div>
              )}
              {status && userId && <Liner width="1px" height="10px" margin="0 0.5rem" />}
              {userId && (
                <div className="user">
                  <Tag border size="xs">
                    {users.find(d => d.userId === userId)?.name || userId}
                  </Tag>
                </div>
              )}
            </>
          )}
        </div>
      </ModalHeader>
      <ModalBody className="modal-body">
        <Block border className="block" scroll>
          {!list || (list?.length < 1 && <EmptyContent minHeight="398px">{t('데이터가 없습니다.')}</EmptyContent>)}
          {list?.length > 0 && (
            <Table className="table" cols={['1px', '100%']} sticky>
              <THead>
                <Tr>
                  <Th align="left">{t('테스트케이스 그룹')}</Th>
                  <Th align="left">{t('테스트케이스')}</Th>
                  <Th align="left">{t('테스터')}</Th>
                  <Th align="center">{t('테스트 결과')}</Th>
                </Tr>
              </THead>
              <Tbody>
                {list.map(testcaseGroup => {
                  return (
                    <ReportGroupItem
                      key={testcaseGroup.id}
                      users={users}
                      testcaseGroup={testcaseGroup}
                      status={status}
                      userId={userId}
                      hasComment={hasComment}
                      onNameClick={(groupId, id) => {
                        onItemClick({ groupId, id });
                      }}
                    />
                  );
                })}
              </Tbody>
            </Table>
          )}
        </Block>
      </ModalBody>
    </Modal>
  );
}

TestrunTestcaseListViewerPopup.defaultProps = {
  testcaseGroups: [],
  users: [],
  userId: null,
  status: null,
  resultViewOpened: false,
  hasComment: false,
};

TestrunTestcaseListViewerPopup.propTypes = {
  testcaseGroups: PropTypes.arrayOf(TestcaseGroupPropTypes),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
  onItemClick: PropTypes.func.isRequired,
  setOpened: PropTypes.func.isRequired,
  userId: PropTypes.number,
  status: PropTypes.string,
  resultViewOpened: PropTypes.bool,
  hasComment: PropTypes.bool,
};

export default observer(TestrunTestcaseListViewerPopup);
