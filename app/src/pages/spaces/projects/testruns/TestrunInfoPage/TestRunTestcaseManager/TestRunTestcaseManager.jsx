import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import { Button, SeqId, TestcaseItem } from '@/components';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import './TestRunTestcaseManager.scss';
import useStores from '@/hooks/useStores';
import { ITEM_TYPE } from '@/constants/constants';

function TestRunTestcaseManager({ content, testcaseTemplates, setContent, users, createTestrunImage, onSave }) {
  const {
    themeStore: { theme },
  } = useStores();

  const { testcaseItems } = content;

  const caseContentElement = useRef(null);

  const testcaseTemplate = useMemo(() => {
    return testcaseTemplates.find(d => d.id === content?.testcaseTemplateId);
  }, [content?.testcaseTemplateId]);

  const [openTooltipInfo, setOpenTooltipInfo] = useState({
    inx: null,
    type: '',
  });

  const onChangeTestcaseItem = (testcaseTemplateItemId, type, field, value) => {
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

    setContent({
      ...content,
      testrunTestcaseItems: nextTestrunTestcaseItems,
    });
  };

  return (
    <div className="testrun-testcase-manager-wrapper">
      <div>
        <div className="testcase-title">
          <SeqId type={ITEM_TYPE.TESTCASE}>{content.seqId}</SeqId>
          <div className="name">{content.name}</div>
        </div>
        <div className="title-liner" />
        <div className="case-content" ref={caseContentElement}>
          <div className="case-description">
            <div className="description-title">설명</div>
            <div className="description-content">
              <div>{content.description}</div>
            </div>
          </div>
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
                  />
                );
              })}
          </div>
          <div className="testrun-result-list">
            {testcaseTemplate?.testcaseTemplateItems
              .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'RESULT')
              .map((testcaseTemplateItem, inx) => {
                const testcaseItem = content?.testrunTestcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};

                return (
                  <TestcaseItem
                    key={inx}
                    isEdit
                    testcaseTemplateItem={testcaseTemplateItem}
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
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div>
        <Button outline onClick={onSave}>
          저장
        </Button>
      </div>
    </div>
  );
}

TestRunTestcaseManager.defaultProps = {
  content: null,
  testcaseTemplates: [],
  users: [],
  onSave: null,
};

TestRunTestcaseManager.propTypes = {
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
  onSave: PropTypes.func,
};

export default TestRunTestcaseManager;
