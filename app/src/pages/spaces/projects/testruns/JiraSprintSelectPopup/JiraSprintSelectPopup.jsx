import React, { useEffect, useState } from 'react';
import { Block, BlockRow, EmptyContent, Label, Modal, ModalBody, ModalHeader, ReactSelect, Table, Tbody, Td, Text, Tfoot, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import TestrunService from '@/services/TestrunService';
import PropTypes from 'prop-types';
import './JiraSprintSelectPopup.scss';
import moment from 'moment';
import PrevNext from '@/components/PrevNext/PrevNext';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const labelMinWidth = '120px';

function JiraSprintSelectPopup({ spaceCode, projectId, setOpened, onApply }) {
  const { t } = useTranslation();

  const [selectedBoardInfo, setSelectedBoardInfo] = useState();
  const [boards, setBoards] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [sprintPageInfo, setSprintPageInfo] = useState({
    startAt: 0,
    maxResults: 0,
    isLast: false,
  });

  useEffect(() => {
    TestrunService.selectJiraProjectBoards(spaceCode, projectId, res => {
      setBoards(res.values);
      if (res?.values.length > 0) {
        setSelectedBoardInfo(res.values[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedBoardInfo) {
      TestrunService.selectJiraProjectSprints(spaceCode, projectId, selectedBoardInfo.id, sprintPageInfo.startAt, res => {
        setSprints(res.values);
        if (res?.values.length > 0) {
          setSprintPageInfo({
            ...sprintPageInfo,
            startAt: res.startAt,
            maxResults: res.maxResults,
            isLast: res.isLast,
          });
        }
      });
    }
  }, [selectedBoardInfo]);

  const handleSprintPrevNextClick = cursor => {
    TestrunService.selectJiraProjectSprints(spaceCode, projectId, selectedBoardInfo.id, cursor, res => {
      setSprints(res.values);
      if (res?.values.length > 0) {
        setSprintPageInfo({
          ...sprintPageInfo,
          startAt: res.startAt,
          maxResults: res.maxResults,
          isLast: res.isLast,
        });
      }
    });
  };

  const handleSprintClick = sprint => {
    dialogUtil.setConfirm(MESSAGE_CATEGORY.INFO, t('Jira Sprint 선택'), t('선택한 Sprint 를 테스트런 정보에 입력하시겠습니까?'), () => {
      onApply(sprint);
      if (setOpened) {
        setOpened(false);
      }
    });
  };

  return (
    <Modal
      size="xl"
      className="jira-sprint-select-popup-wrapper"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader className="modal-header">
        <span>{t('Jira Sprint 선택')}</span>
      </ModalHeader>
      <ModalBody className="modal-body">
        <Block className="block">
          <BlockRow>
            <Label minWidth={labelMinWidth} required>
              {t('Jira 보드')}
            </Label>
            {boards && selectedBoardInfo ? (
              <ReactSelect
                maxMenuHeight={200}
                className="react-select"
                value={{
                  key: selectedBoardInfo?.id.toString(),
                  label: selectedBoardInfo?.name,
                }}
                defaultValue={{
                  key: selectedBoardInfo?.id.toString(),
                  label: selectedBoardInfo?.name,
                }}
                onChange={e => setSelectedBoardInfo({ ...selectedBoardInfo, id: e.value, name: e.label })}
                options={boards.map(board => ({
                  value: board.id.toString(),
                  label: board.name,
                }))}
                searchable
              />
            ) : (
              <EmptyContent className="empty-content">{t('Jira 프로젝트에 Board 가 존재하지 않습니다.')}</EmptyContent>
            )}
          </BlockRow>
          <BlockRow>
            <Label minWidth={labelMinWidth} required>
              {t('Jira 스프린트 목록')}
            </Label>
          </BlockRow>
          <BlockRow>
            {boards && sprints ? (
              <Table className="jira-project-board-sprint-table">
                <THead>
                  <Tr>
                    <Th align="center">{t('이름')}</Th>
                    <Th align="center">{t('스프린트 골')}</Th>
                    <Th align="center">{t('시작 시각')}</Th>
                    <Th align="center">{t('종료 시각')}</Th>
                    <Th align="center">{t('상태')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {sprints ? (
                    sprints.map(sprint => (
                      <Tr key={sprint.id} onClick={() => handleSprintClick(sprint)}>
                        <Td align="left">{sprint.name}</Td>
                        <Td align="left">
                          <Text>{sprint.goal}</Text>
                        </Td>
                        <Td align="center">{moment(sprint.startDate).format('YYYY-MM-DD')}</Td>
                        <Td align="center">{moment(sprint.endDate).format('YYYY-MM-DD')}</Td>
                        <Td align="center">{sprint.state}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5} align="center">
                        {t('데이터가 존재하지 않습니다.')}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Td colSpan={5} align="center">
                      <PrevNext
                        onPrevClick={() => handleSprintPrevNextClick(sprintPageInfo.startAt - sprintPageInfo.maxResults)}
                        isPrev={!(sprintPageInfo.startAt === 0)}
                        isNext={!sprintPageInfo.isLast}
                        onNextClick={() => handleSprintPrevNextClick(sprintPageInfo.startAt + sprintPageInfo.maxResults)}
                      />
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            ) : (
              <EmptyContent className="empty-content">{t('선택된 Boards 에 Sprint 가 존재하지 않습니다.')}</EmptyContent>
            )}
          </BlockRow>
        </Block>
      </ModalBody>
    </Modal>
  );
}

JiraSprintSelectPopup.propTypes = {
  spaceCode: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default JiraSprintSelectPopup;
