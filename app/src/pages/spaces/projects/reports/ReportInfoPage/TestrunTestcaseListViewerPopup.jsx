import React from 'react';
import { Block, Liner, Modal, ModalBody, ModalHeader, Table, Tag, Tbody, Th, THead, Tr } from '@/components';
import PropTypes from 'prop-types';
import { TestcaseGroupPropTypes } from '@/proptypes';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import './TestrunTestcaseListViewerPopup.scss';
import ReportGroupItem from '@/pages/spaces/projects/reports/ReportInfoPage/ReportGroupItem';

function TestrunTestcaseListViewerPopup({ testcaseGroups, users, onItemClick, setOpened, userId, status }) {
  const { t } = useTranslation();

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
              {testcaseGroups
                .filter(testcaseGroup => {
                  if (!(testcaseGroup.testcases?.length > 0)) {
                    return false;
                  }

                  if (!status && !userId) {
                    return true;
                  }

                  if (status && userId) {
                    return testcaseGroup.testcases?.some(testcase => {
                      return testcase.testerId === userId && testcase.testResult === status;
                    });
                  }

                  return testcaseGroup.testcases?.some(testcase => {
                    return testcase.testerId === userId || testcase.testResult === status;
                  });
                })
                .map(testcaseGroup => {
                  return (
                    <ReportGroupItem
                      key={testcaseGroup.id}
                      users={users}
                      testcaseGroup={testcaseGroup}
                      status={status}
                      userId={userId}
                      onNameClick={(groupId, id) => {
                        onItemClick({ groupId, id });
                        // setQuery({ groupId, id });
                      }}
                    />
                  );
                })}
            </Tbody>
          </Table>
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
};

export default observer(TestrunTestcaseListViewerPopup);
