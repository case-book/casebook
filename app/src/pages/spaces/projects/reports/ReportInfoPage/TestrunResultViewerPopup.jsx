import React, { useEffect, useRef, useState } from 'react';
import { CloseIcon, EmptyContent, Liner, SeqId, TestcaseItem } from '@/components';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import { useTranslation } from 'react-i18next';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import { DEFAULT_TESTRUN_RESULT_ITEM, DEFAULT_TESTRUN_TESTER_ITEM, ITEM_TYPE } from '@/constants/constants';
import { Viewer } from '@toast-ui/react-editor';
import dateUtil from '@/utils/dateUtil';
import './TestrunResultViewerPopup.scss';

function TestrunResultViewerPopup({ users, testcaseTemplate, testrunTestcaseGroupTestcase, setOpened }) {
  const { t } = useTranslation();

  const {
    themeStore: { theme },
  } = useStores();

  const caseContentElement = useRef(null);

  const [openTooltipInfo, setOpenTooltipInfo] = useState({
    inx: null,
    type: '',
  });

  useEffect(() => {
    const body = document.querySelector('body');
    body.classList.add('stop-scroll');

    return () => {
      body.classList.remove('stop-scroll');
    };
  }, []);

  return (
    <div
      className="testrun-result-viewer-popup-wrapper"
      onClick={() => {
        setOpened(false);
      }}
    >
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <div className="popup-content-layout">
          <div className="testcase-title">
            <div>
              <SeqId type={ITEM_TYPE.TESTCASE} copy={false}>
                {testrunTestcaseGroupTestcase.seqId}
              </SeqId>
            </div>
            <div className="name">{testrunTestcaseGroupTestcase.name}</div>
            <div className="close-button">
              <CloseIcon
                size="sm"
                onClick={() => {
                  setOpened(false);
                }}
              />
            </div>
          </div>
          <div className="case-content" ref={caseContentElement}>
            <div className="testcase-item-list">
              {testcaseTemplate?.testcaseTemplateItems
                .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'CASE')
                .map((testcaseTemplateItem, inx) => {
                  let testcaseItem;
                  if (testcaseTemplateItem.systemLabel) {
                    testcaseItem = testrunTestcaseGroupTestcase?.testrunTestcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};
                  } else {
                    testcaseItem = testrunTestcaseGroupTestcase.testcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};
                  }

                  return (
                    <TestcaseItem
                      key={inx}
                      type={false}
                      isEdit={false}
                      testcaseTemplateItem={testcaseTemplateItem}
                      testcaseItem={testcaseItem}
                      content={testrunTestcaseGroupTestcase}
                      theme={theme}
                      users={users}
                      setOpenTooltipInfo={setOpenTooltipInfo}
                      caseContentElement={caseContentElement}
                      openTooltipInfo={openTooltipInfo}
                      inx={inx}
                    />
                  );
                })}
            </div>
            <div className="testrun-result-info">
              <div className="title">
                <span>{t('테스트 결과')}</span>
              </div>
              <div className="testrun-result-content">
                <div className="testrun-result-list">
                  <TestcaseItem
                    isEdit={false}
                    type={false}
                    testcaseTemplateItem={{
                      ...DEFAULT_TESTRUN_RESULT_ITEM,
                    }}
                    testcaseItem={{ value: testrunTestcaseGroupTestcase.testResult }}
                    content={testrunTestcaseGroupTestcase}
                    theme={theme}
                    users={users}
                    setOpenTooltipInfo={setOpenTooltipInfo}
                    caseContentElement={caseContentElement}
                    openTooltipInfo={openTooltipInfo}
                  />
                  <TestcaseItem
                    isEdit={false}
                    type={false}
                    testcaseTemplateItem={{
                      ...DEFAULT_TESTRUN_TESTER_ITEM,
                    }}
                    testcaseItem={{ value: testrunTestcaseGroupTestcase.testerId }}
                    content={testrunTestcaseGroupTestcase}
                    theme={theme}
                    users={users}
                    setOpenTooltipInfo={setOpenTooltipInfo}
                    caseContentElement={caseContentElement}
                    openTooltipInfo={openTooltipInfo}
                  />
                </div>
                <div className="testrun-result-list">
                  {testcaseTemplate?.testcaseTemplateItems
                    .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'RESULT')
                    .map((testcaseTemplateItem, inx) => {
                      const testcaseItem = testrunTestcaseGroupTestcase?.testrunTestcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};

                      return (
                        <TestcaseItem
                          key={inx}
                          isEdit={false}
                          type={false}
                          testcaseTemplateItem={{
                            ...testcaseTemplateItem,
                          }}
                          testcaseItem={testcaseItem}
                          content={testrunTestcaseGroupTestcase}
                          theme={theme}
                          users={users}
                          setOpenTooltipInfo={setOpenTooltipInfo}
                          caseContentElement={caseContentElement}
                          openTooltipInfo={openTooltipInfo}
                          inx={inx}
                          isTestResultItem
                        />
                      );
                    })}
                </div>
                <div className="testrun-testcase-comments">
                  <div className="text">코멘트</div>
                  <div className="comment-list">
                    {(!testrunTestcaseGroupTestcase.comments || testrunTestcaseGroupTestcase.comments.length < 1) && (
                      <EmptyContent minHeight="auto" className="empty-comments">
                        <div>{t('코멘트가 없습니다.')}</div>
                      </EmptyContent>
                    )}
                    {testrunTestcaseGroupTestcase.comments?.length > 0 && (
                      <ul>
                        {testrunTestcaseGroupTestcase.comments?.map(info => {
                          return (
                            <li key={info.id} className="comment">
                              <div className="comment-content">
                                <Viewer className="viewer" theme={theme === 'DARK' ? 'dark' : 'white'} initialValue={info.comment || '<span className="none-text">&nbsp;</span>'} />
                              </div>
                              <div className="comment-user-info">
                                <div>{dateUtil.getDateString(info.lastUpdateDate)}</div>
                                <div>
                                  <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                                </div>
                                <div>{users.find(u => u.userId === info.userId)?.name || ''}</div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TestrunResultViewerPopup.defaultProps = {
  testcaseTemplate: {},

  testrunTestcaseGroupTestcase: {},
  users: [],
};

TestrunResultViewerPopup.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
  testcaseTemplate: TestcaseTemplatePropTypes,

  testrunTestcaseGroupTestcase: PropTypes.shape({
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
  setOpened: PropTypes.func.isRequired,
};

export default observer(TestrunResultViewerPopup);
