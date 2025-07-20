import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import { Button, CloseIcon, CommentEditor, Liner, Tag, TestcaseItem } from '@/components';
import { observer } from 'mobx-react';

import useStores from '@/hooks/useStores';
import { DEFAULT_TESTRUN_RESULT_ITEM, DEFAULT_TESTRUN_TESTER_ITEM } from '@/constants/constants';
import { getBaseURL } from '@/utils/configUtil';
import { useTranslation } from 'react-i18next';
import { CommentList } from '@/assets';
import TestcaseService from '@/services/TestcaseService';
import TestrunService from '@/services/TestrunService';
import TestrunResultViewerPopup from '@/pages/spaces/projects/reports/ReportInfoPage/TestrunResultViewerPopup';
import './TestRunResultInfo.scss';

function TestRunResultInfo({
  content,
  testcaseTemplates,
  users,
  createTestrunImage,
  onSaveComment,
  onDeleteComment,
  resultLayoutPosition,
  onChangeTestResult,
  onChangeTester,
  onRandomTester,
  onChangeTestcaseItem,
  resultPopupOpened,
  setResultPopupOpened,
  spaceCode,
  projectId,
  project,
  testrunId,
}) {
  const {
    themeStore: { theme },
  } = useStores();

  const { t } = useTranslation();
  const caseContentElement = useRef(null);
  const resultInfoElement = useRef(null);
  const [testcaseResultHistory, setTestcaseResultHistory] = useState([]);
  const [testcaseResultHistoryOpened, setTestcaseResultHistoryOpened] = useState(false);
  const [popupInfo, setPopupInfo] = useState({
    opened: false,
  });

  const testcaseTemplate = useMemo(() => {
    return testcaseTemplates.find(d => d.id === content?.testcaseTemplateId);
  }, [content?.testcaseTemplateId]);

  const [openTooltipInfo, setOpenTooltipInfo] = useState({
    inx: null,
    type: '',
  });

  useEffect(() => {
    if (resultInfoElement.current && resultInfoElement.current.parentNode && resultInfoElement.current.parentNode.parentNode) {
      resultInfoElement.current.parentNode.parentNode.scrollTop = 0;
    }
  }, [content?.id]);

  useEffect(() => {
    if (spaceCode && projectId && content.testcaseId) {
      TestcaseService.selectTestcaseTestrunHistory(spaceCode, projectId, content.testcaseId, testrunId, result => {
        setTestcaseResultHistory(result);
      });
    }
  }, [spaceCode, projectId, content.testcaseId]);

  const lastTestcaseResultHistory = useMemo(() => {
    return testcaseResultHistory?.length > 0 ? testcaseResultHistory[0] : null;
  }, [testcaseResultHistory]);

  const getResultHistory = resultHistory => {
    TestrunService.selectTestrunTestcaseGroupTestcase(spaceCode, projectId, resultHistory.testrunId, resultHistory.testrunTestcaseGroupId, resultHistory.id, result => {
      setTestcaseResultHistoryOpened(false);
      setPopupInfo({
        opened: true,
        testcaseTemplate,
        testrunTestcaseGroupTestcase: result,
      });
    });
  };

  return (
    <div className={`testrun-result-info-wrapper ${resultPopupOpened ? 'opened' : ''} ${resultLayoutPosition}`} ref={resultInfoElement}>
      <div>
        <div className="result-liner title-liner" />
        <div className="layout-title">
          <span>{t('테스트 결과 입력')}</span>
          {testcaseResultHistory?.length > 0 && (
            <>
              <span>
                <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === 'LIGHT' ? 'black' : 'white'} margin="0 10px" />
              </span>
              <span className={`last-testcase-result ${testcaseResultHistoryOpened ? 'opened' : ''}`}>
                <span
                  className="button"
                  onClick={() => {
                    getResultHistory(lastTestcaseResultHistory);
                  }}
                >
                  {t('마지막 결과')}
                  <Tag size="xs" className={`test-result ${lastTestcaseResultHistory.testResult}`}>
                    {lastTestcaseResultHistory.testResult}
                  </Tag>
                </span>
                <span>
                  <Liner className="liner" display="inline-block" width="1px" height="8px" color={theme === 'LIGHT' ? 'gray' : 'white'} margin="0 4px 0 0" />
                </span>
                <span
                  className="button"
                  onClick={() => {
                    setTestcaseResultHistoryOpened(!testcaseResultHistoryOpened);
                  }}
                >
                  <i className="fas fa-chevron-down" />
                </span>
                {testcaseResultHistoryOpened && (
                  <ul className="testrun-history-list-popup">
                    {testcaseResultHistory.map(history => {
                      return (
                        <li
                          key={history.id}
                          onClick={() => {
                            getResultHistory(history);
                          }}
                        >
                          <div>{history.testrunSeqId}</div>
                          <div>
                            <Tag size="xs" className={`test-result ${history.testResult}`}>
                              {history.testResult}
                            </Tag>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </span>
            </>
          )}
          <Button
            className="exit-button"
            outline={false}
            color="transparent"
            onClick={() => {
              setResultPopupOpened(false);
            }}
          >
            <span>
              <CloseIcon size="sm" />
            </span>
          </Button>
        </div>
        <div className="testrun-result-content">
          <div className="testrun-result-list is-edit">
            <TestcaseItem
              selectUserOnly
              type={false}
              size="sm"
              isEdit
              testcaseTemplateItem={{
                ...DEFAULT_TESTRUN_RESULT_ITEM,
                size: resultLayoutPosition === 'RIGHT' ? 12 : DEFAULT_TESTRUN_RESULT_ITEM.size,
              }}
              testcaseItem={{ value: content.testResult }}
              content={content}
              theme={theme}
              createImage={createTestrunImage}
              users={users}
              setOpenTooltipInfo={setOpenTooltipInfo}
              caseContentElement={caseContentElement}
              openTooltipInfo={openTooltipInfo}
              onChangeTestcaseItem={onChangeTestResult}
              isTestResult
            />
            <TestcaseItem
              selectUserOnly
              type={false}
              size="sm"
              isEdit
              testcaseTemplateItem={{
                ...DEFAULT_TESTRUN_TESTER_ITEM,
                size: resultLayoutPosition === 'RIGHT' ? 12 : DEFAULT_TESTRUN_RESULT_ITEM.size,
              }}
              testcaseItem={{ value: content.testerId }}
              content={content}
              theme={theme}
              createImage={createTestrunImage}
              users={users}
              setOpenTooltipInfo={setOpenTooltipInfo}
              caseContentElement={caseContentElement}
              openTooltipInfo={openTooltipInfo}
              onChangeTestcaseItem={onChangeTester}
              onRandomTester={onRandomTester}
            />
          </div>
          <div className="testrun-result-list is-edit">
            {testcaseTemplate?.testcaseTemplateItems
              .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'RESULT')
              .map((testcaseTemplateItem, inx) => {
                const testcaseItem = content?.testrunTestcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};

                return (
                  <TestcaseItem
                    selectUserOnly
                    size="sm"
                    key={inx}
                    isEdit
                    testcaseTemplateItem={{
                      ...testcaseTemplateItem,
                      size: resultLayoutPosition === 'RIGHT' ? 12 : DEFAULT_TESTRUN_RESULT_ITEM.size,
                    }}
                    testcaseItem={testcaseItem}
                    content={content}
                    theme={theme}
                    createImage={createTestrunImage}
                    users={users}
                    setOpenTooltipInfo={setOpenTooltipInfo}
                    caseContentElement={caseContentElement}
                    openTooltipInfo={openTooltipInfo}
                    inx={inx}
                    onChangeTestcaseItem={onChangeTestcaseItem}
                    isTestResultItem
                  />
                );
              })}
          </div>
          <div className="testrun-testcase-comments">
            <div className="text">{t('코멘트')}</div>
            <CommentList comments={content.comments} onDeleteComment={onDeleteComment} />
            <CommentEditor
              onSaveComment={onSaveComment}
              onAddImageHook={async (blob, callback) => {
                const result = await createTestrunImage(content.id, blob.name, blob.size, blob.type, blob);
                callback(`${getBaseURL()}/api/${result.data.spaceCode}/projects/${result.data.projectId}/images/${result.data.id}?uuid=${result.data.uuid}`);
              }}
            />
          </div>
        </div>
      </div>
      {popupInfo.opened && (
        <TestrunResultViewerPopup
          project={project}
          testcaseTemplate={popupInfo.testcaseTemplate}
          testrunTestcaseGroupTestcase={popupInfo.testrunTestcaseGroupTestcase}
          users={users.map(u => {
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
          }}
        />
      )}
    </div>
  );
}

TestRunResultInfo.defaultProps = {
  content: null,
  testcaseTemplates: [],
  users: [],
  onSaveComment: null,
  user: null,
  onDeleteComment: null,
  onRandomTester: null,
  spaceCode: null,
  projectId: null,
  project: null,
  testrunId: null,
};

TestRunResultInfo.propTypes = {
  spaceCode: PropTypes.string,
  projectId: PropTypes.string,
  testrunId: PropTypes.string,
  project: PropTypes.shape({
    id: PropTypes.number,
  }),
  content: PropTypes.shape({
    id: PropTypes.number,
    testrunTestcaseGroupId: PropTypes.number,
    testcaseId: PropTypes.number,
    seqId: PropTypes.string,
    testcaseGroupId: PropTypes.number,
    testcaseTemplateId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    itemOrder: PropTypes.number,
    closed: PropTypes.bool,
    testcaseItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        testcaseId: PropTypes.number,
        testcaseTemplateItemId: PropTypes.number,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.string,
      }),
    ),
    testrunTestcaseItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        testcaseId: PropTypes.number,
        testcaseTemplateItemId: PropTypes.number,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.string,
      }),
    ),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        testrunTestcaseGroupTestcaseId: PropTypes.number,
        comment: PropTypes.string,
      }),
    ),
    testResult: PropTypes.string,
    testerId: PropTypes.number,
  }),
  testcaseTemplates: PropTypes.arrayOf(TestcaseTemplatePropTypes),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  createTestrunImage: PropTypes.func.isRequired,
  onSaveComment: PropTypes.func,

  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  onDeleteComment: PropTypes.func,
  onRandomTester: PropTypes.func,
  resultLayoutPosition: PropTypes.string.isRequired,
  onChangeTestResult: PropTypes.func.isRequired,
  onChangeTester: PropTypes.func.isRequired,
  onChangeTestcaseItem: PropTypes.func.isRequired,
  resultPopupOpened: PropTypes.bool.isRequired,
  setResultPopupOpened: PropTypes.func.isRequired,
};

export default observer(TestRunResultInfo);
