import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import { Button, Loader, SeqId, TestcaseItem } from '@/components';
import SplitPane, { Pane } from 'split-pane-react';
import { observer } from 'mobx-react';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import { debounce } from 'lodash';
import useStores from '@/hooks/useStores';
import { ITEM_TYPE, TESTRUN_RESULT_LAYOUTS } from '@/constants/constants';
import { useTranslation } from 'react-i18next';
import { getOption, setOption } from '@/utils/storageUtil';
import './TestRunTestcaseManager.scss';
import TestRunResultInfo from '@/pages/spaces/projects/testruns/TestrunExecutePage/TestRunTestcaseManager/TestRunResultInfo';
import dateUtil from '@/utils/dateUtil';

function TestRunTestcaseManager({
  spaceCode,
  projectId,
  project,
  content,
  testcaseTemplates,
  setContent,
  users,
  createTestrunImage,
  onSaveTestResultItem,
  contentLoading,
  onSaveComment,
  user,
  onDeleteComment,
  onSaveResult,
  onRandomTester,
  onSaveTester,
  testrunId,
}) {
  const {
    themeStore: { theme },
  } = useStores();

  const { t } = useTranslation();
  const { testcaseItems } = content;
  const caseContentElement = useRef(null);
  const testcaseManagerContentElement = useRef(null);
  const managerLayoutElement = useRef(null);
  const managerContentElement = useRef(null);

  const [sizes, setSizes] = useState(
    (() => {
      const info = JSON.parse(localStorage.getItem('testrun-testcase-manager-sizes'));
      if (info) {
        return info;
      }

      return ['auto', 300];
    })(),
  );

  const onChangeSize = info => {
    localStorage.setItem('testrun-testcase-manager-sizes', JSON.stringify(info));
    setSizes(info);
  };

  const testcaseTemplate = useMemo(() => {
    return testcaseTemplates.find(d => d.id === content?.testcaseTemplateId);
  }, [content?.testcaseTemplateId]);

  const [openTooltipInfo, setOpenTooltipInfo] = useState({
    inx: null,
    type: '',
  });

  const [resultPopupOpened, setResultPopupOpened] = useState(false);

  const [resultLayoutPosition, setResultLayoutPosition] = useState(
    (() => {
      return getOption('testrun', 'manager', 'layout') || 'RIGHT';
    })(),
  );

  useEffect(() => {
    if (testcaseManagerContentElement.current) {
      testcaseManagerContentElement.current.scrollTop = 0;
    }

    if (managerLayoutElement.current) {
      managerLayoutElement.current.scrollTop = 0;
    }

    if (managerContentElement.current) {
      managerContentElement.current.scrollTop = 0;
    }
  }, [content?.id]);

  const onChangeDebounce = React.useMemo(
    () =>
      debounce(target => {
        onSaveTestResultItem(target);
      }, 500),
    [],
  );

  const onChangeTestcaseItem = (testcaseTemplateItemId, type, field, value, templateItemType) => {
    const nextTestrunTestcaseItems = (content?.testrunTestcaseItems || []).slice(0);

    const index = nextTestrunTestcaseItems.findIndex(d => d.testcaseTemplateItemId === testcaseTemplateItemId);
    let target = null;
    if (index > -1) {
      target = nextTestrunTestcaseItems[index];
    } else {
      target = {
        type,
        testcaseId: content.testcaseId,
        testrunTestcaseGroupId: content.testrunTestcaseGroupId,
        testrunTestcaseGroupTestcaseId: content.id,
        testcaseTemplateItemId,
      };
      nextTestrunTestcaseItems.push(target);
    }

    target.type = type;
    target[field] = value;

    const nextContent = {
      ...content,
      testrunTestcaseItems: nextTestrunTestcaseItems,
    };

    setContent(nextContent);

    if (templateItemType === 'RADIO' || templateItemType === 'CHECKBOX' || templateItemType === 'SELECT' || templateItemType === 'USER') {
      onSaveTestResultItem(target);
    } else {
      onChangeDebounce(target);
    }
  };

  const onChangeTestResult = (_testcaseTemplateItemId, _type, _field, value) => {
    const nextContent = {
      ...content,
      testResult: value,
    };
    setContent(nextContent);
    onSaveResult(value);
  };

  const onChangeTester = (_testcaseTemplateItemId, _type, _field, value) => {
    const nextContent = {
      ...content,
      testerId: value,
    };
    setContent(nextContent);
    onSaveTester(value);
  };

  const onChangeLayoutPosition = layoutPosition => {
    setOption('testrun', 'manager', 'layout', layoutPosition);
    setResultLayoutPosition(layoutPosition);
  };

  const getManagerContent = () => {
    return (
      <div className="manager-content" ref={managerContentElement}>
        <div className="testcase-title">
          <SeqId className="seq-id" type={ITEM_TYPE.TESTCASE}>
            {content.seqId}
          </SeqId>
          <div className="name">{content.name}</div>
          {resultLayoutPosition === 'POPUP' && (
            <Button
              size="xs"
              className="result-popup-open-button"
              onClick={() => {
                setResultPopupOpened(true);
              }}
            >
              {t('결과 입력')}
            </Button>
          )}
          <div className="result-layout-selector">
            <div className="circle" />
            <div className="current-layout">{TESTRUN_RESULT_LAYOUTS[resultLayoutPosition]}</div>
            <div className="layout-label">{t('결과 입력 레이아웃')}</div>
            <div
              className={`selector-item popup ${resultLayoutPosition === 'POPUP' ? 'selected' : ''}`}
              onClick={() => {
                onChangeLayoutPosition('POPUP');
              }}
            >
              <div>{t('팝업')}</div>
            </div>
            <div
              className={`selector-item right ${resultLayoutPosition === 'RIGHT' ? 'selected' : ''}`}
              onClick={() => {
                onChangeLayoutPosition('RIGHT');
              }}
            >
              <div>{t('우측')}</div>
            </div>
            <div
              className={`selector-item bottom ${resultLayoutPosition === 'BOTTOM' ? 'selected' : ''}`}
              onClick={() => {
                onChangeLayoutPosition('BOTTOM');
              }}
            >
              <div>{t('하단')}</div>
            </div>
          </div>
        </div>
        <div className="title-liner" />
        <div className="case-content" ref={caseContentElement}>
          <div className="case-description">{content.description || t('설명이 없습니다.')}</div>
          <div className="testcase-item-list">
            {testcaseTemplate?.testcaseTemplateItems
              .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'CASE')
              .map((testcaseTemplateItem, inx) => {
                const testcaseItem = testcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};

                return (
                  <TestcaseItem
                    key={inx}
                    isEdit={false}
                    testcaseTemplateItem={testcaseTemplateItem}
                    testcaseItem={testcaseItem}
                    content={content}
                    theme={theme}
                    createImage={createTestrunImage}
                    users={users.map(d => {
                      return {
                        ...d,
                        id: d.userId,
                      };
                    })}
                    setOpenTooltipInfo={setOpenTooltipInfo}
                    caseContentElement={caseContentElement}
                    openTooltipInfo={openTooltipInfo}
                    inx={inx}
                    onChangeTestcaseItem={onChangeTestcaseItem}
                    size="sm"
                  />
                );
              })}
          </div>
          <div className="creator-info">
            <table>
              <tbody>
                <tr>
                  <td>{t('생성')}</td>
                  <td>{content.createdUserName}</td>
                  <td>{dateUtil.getDateString(content.creationDate)}</td>
                </tr>
                <tr>
                  <td>{t('마지막 변경')}</td>
                  <td>{content.lastUpdatedUserName}</td>
                  <td>{content.lastUpdatedUserName ? dateUtil.getDateString(content.lastUpdateDate) : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`testrun-testcase-manager-wrapper ${resultLayoutPosition}`} ref={testcaseManagerContentElement}>
      {contentLoading && <Loader />}
      {resultLayoutPosition === 'RIGHT' && (
        <SplitPane sizes={sizes} onChange={onChangeSize}>
          <Pane className="manager-content-layout" minSize={200}>
            {getManagerContent()}
          </Pane>
          <Pane className="testcase-navigator-content" minSize={300}>
            <TestRunResultInfo
              spaceCode={spaceCode}
              projectId={projectId}
              testrunId={testrunId}
              project={project}
              content={content}
              testcaseTemplates={testcaseTemplates}
              users={users}
              createTestrunImage={createTestrunImage}
              onSaveComment={onSaveComment}
              user={user}
              onDeleteComment={onDeleteComment}
              resultLayoutPosition={resultLayoutPosition}
              onChangeTestResult={onChangeTestResult}
              onChangeTester={onChangeTester}
              onRandomTester={onRandomTester}
              onChangeTestcaseItem={onChangeTestcaseItem}
              resultPopupOpened={resultPopupOpened}
              setResultPopupOpened={setResultPopupOpened}
            />
          </Pane>
        </SplitPane>
      )}
      {resultLayoutPosition !== 'RIGHT' && (
        <div className="manager-layout" ref={managerLayoutElement}>
          {getManagerContent()}
          {resultLayoutPosition === 'BOTTOM' && (
            <TestRunResultInfo
              spaceCode={spaceCode}
              projectId={projectId}
              testrunId={testrunId}
              project={project}
              content={content}
              testcaseTemplates={testcaseTemplates}
              users={users}
              createTestrunImage={createTestrunImage}
              onSaveComment={onSaveComment}
              user={user}
              onDeleteComment={onDeleteComment}
              resultLayoutPosition={resultLayoutPosition}
              onChangeTestResult={onChangeTestResult}
              onChangeTester={onChangeTester}
              onChangeTestcaseItem={onChangeTestcaseItem}
              resultPopupOpened={resultPopupOpened}
              setResultPopupOpened={setResultPopupOpened}
            />
          )}
        </div>
      )}
      {resultLayoutPosition === 'POPUP' && (
        <TestRunResultInfo
          spaceCode={spaceCode}
          projectId={projectId}
          testrunId={testrunId}
          project={project}
          content={content}
          testcaseTemplates={testcaseTemplates}
          users={users}
          createTestrunImage={createTestrunImage}
          onSaveComment={onSaveComment}
          user={user}
          onDeleteComment={onDeleteComment}
          resultLayoutPosition={resultLayoutPosition}
          onChangeTestResult={onChangeTestResult}
          onChangeTester={onChangeTester}
          onChangeTestcaseItem={onChangeTestcaseItem}
          resultPopupOpened={resultPopupOpened}
          setResultPopupOpened={setResultPopupOpened}
        />
      )}
    </div>
  );
}

TestRunTestcaseManager.defaultProps = {
  content: null,
  testcaseTemplates: [],
  users: [],
  testrunId: null,
  onSaveComment: null,
  contentLoading: false,
  user: null,
  onDeleteComment: null,
  onSaveResult: null,
  onSaveTester: null,
  onRandomTester: null,
  onSaveTestResultItem: null,
  spaceCode: null,
  projectId: null,
  project: null,
};

TestRunTestcaseManager.propTypes = {
  spaceCode: PropTypes.string,
  projectId: PropTypes.string,
  project: PropTypes.shape({
    id: PropTypes.number,
  }),
  testrunId: PropTypes.string,
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
    createdUserName: PropTypes.string,
    lastUpdatedUserName: PropTypes.string,
    creationDate: PropTypes.string,
    lastUpdateDate: PropTypes.string,
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
  setContent: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  createTestrunImage: PropTypes.func.isRequired,
  onSaveComment: PropTypes.func,
  contentLoading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  onDeleteComment: PropTypes.func,
  onSaveResult: PropTypes.func,
  onSaveTester: PropTypes.func,
  onRandomTester: PropTypes.func,
  onSaveTestResultItem: PropTypes.func,
};

export default observer(TestRunTestcaseManager);
