import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './TestcaseItem.scss';
import { Button, CheckBox, Radio, ResizableEditor, Selector, Tag, TestcaseViewerLabel, UserSelector, VariableInput } from '@/components';
import { getUserText } from '@/utils/userUtil';
import { Viewer } from '@toast-ui/react-editor';
import { getBaseURL } from '@/utils/configUtil';
import { TESTRUN_RESULT_CODE } from '@/constants/constants';
import { useTranslation } from 'react-i18next';
import UserRandomChangeDialog from '@/components/TestcaseItem/UserRandomChangeDialog';
import { getVariableList } from '@/pages/spaces/projects/testruns/TestrunExecutePage/variableUtil';
import { ParaphraseInfoPropTypes } from '@/proptypes';

// const reWidgetRule = /\{{(\S+)}}/;

function TestcaseItem({
  isEdit,
  testcaseTemplateItem,
  testcaseItem,
  users,
  createImage,
  content,
  theme,
  onChangeTestcaseItem,
  onRandomTester,
  setOpenTooltipInfo,
  caseContentElement,
  openTooltipInfo,
  inx,
  size,
  selectUserOnly,
  isTestResult,
  isTestResultItem,
  tags,
  variables,
  paraphraseInfo,
  onAcceptParaphraseContent,
  onRemoveParaphraseContent,
}) {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const lastEditorKey = useRef(null);

  const onUserRandomChange = () => {
    setOpened(true);
  };

  let paraphraseContent = '';
  try {
    paraphraseContent = paraphraseInfo?.items?.find(d => d.id === testcaseItem.id);
  } catch (e) {
    paraphraseContent = '';
    console.error(e);
  }

  return (
    <div key={testcaseTemplateItem.id} className={`testcase-item-wrapper size-${testcaseTemplateItem?.size}`}>
      <div>
        <TestcaseViewerLabel
          testcaseTemplateItem={testcaseTemplateItem}
          setOpenTooltipInfo={setOpenTooltipInfo}
          caseContentElement={caseContentElement}
          openTooltipInfo={openTooltipInfo}
          inx={inx}
          showType={isEdit}
        />
        <div className={`value ${testcaseTemplateItem.type}`}>
          <div>
            {testcaseTemplateItem.type === 'RADIO' && (
              <div>
                {!isEdit && <div className="value-text">{testcaseItem.value}</div>}
                {isEdit &&
                  testcaseTemplateItem?.options?.map(d => {
                    return (
                      <Radio
                        key={d}
                        type="inline"
                        size={size}
                        readOnly={!isEdit}
                        value={d}
                        checked={d === testcaseItem.value}
                        onChange={val => {
                          onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val, testcaseTemplateItem.type);
                        }}
                        label={isTestResult ? TESTRUN_RESULT_CODE[d] : d}
                      />
                    );
                  })}
              </div>
            )}
            {testcaseTemplateItem.type === 'CHECKBOX' && (
              <div>
                {!isEdit && <div className="value-text">{testcaseItem.value === 'Y' ? 'Y' : 'N'}</div>}
                {isEdit && (
                  <CheckBox
                    size={size}
                    value={testcaseItem.value === 'Y'}
                    onChange={() => {
                      if (testcaseItem.value === 'Y') {
                        onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', 'N', testcaseTemplateItem.type);
                      } else {
                        onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', 'Y', testcaseTemplateItem.type);
                      }
                    }}
                  />
                )}
              </div>
            )}
            {(testcaseTemplateItem.type === 'URL' || testcaseTemplateItem.type === 'TEXT' || testcaseTemplateItem.type === 'NUMBER') && (
              <div>
                {!isEdit && (
                  <div className="value-text">
                    <span
                      onClick={() => {
                        if (testcaseItem.value) {
                          window.open(testcaseItem.value, '_blank', 'noopener, noreferrer');
                        }
                      }}
                    >
                      {testcaseItem.value}
                    </span>
                  </div>
                )}
                {!isEdit && paraphraseContent?.text && (
                  <div className="value-text">
                    <span
                      onClick={() => {
                        if (testcaseItem.value) {
                          window.open(testcaseItem.value, '_blank', 'noopener, noreferrer');
                        }
                      }}
                    >
                      {paraphraseContent?.text}
                    </span>
                  </div>
                )}

                {isEdit && (
                  <VariableInput
                    type={testcaseTemplateItem.type.toLowerCase()}
                    value={testcaseItem.value}
                    size={size}
                    outline
                    onChange={val => {
                      onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val, testcaseTemplateItem.type);
                    }}
                    required
                    minLength={1}
                    variables={variables}
                  />
                )}
              </div>
            )}
            {testcaseTemplateItem.type === 'SELECT' && (
              <div className="select">
                {!isEdit && <div className="value-text">{testcaseItem.value}</div>}
                {isEdit && (
                  <Selector
                    className="selector"
                    size={size}
                    items={testcaseTemplateItem?.options?.map(d => {
                      return {
                        key: d,
                        value: d,
                      };
                    })}
                    value={testcaseItem.value}
                    onChange={val => {
                      onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val, testcaseTemplateItem.type);
                    }}
                  />
                )}
              </div>
            )}
            {testcaseTemplateItem.type === 'USER' && (
              <div>
                {!isEdit && (
                  <div className="value-text user-text">
                    {testcaseItem.type === 'tag' && (
                      <span className="tag-info">
                        <Tag className="tag">TAG</Tag>
                      </span>
                    )}
                    <span>{getUserText(users, testcaseItem.type, testcaseItem.value) || ''}</span>
                  </div>
                )}
                {isEdit && (
                  <div className="user-selector">
                    <UserSelector
                      size={size}
                      users={users}
                      tags={tags}
                      type={testcaseItem.type}
                      value={testcaseItem.value}
                      selectUserOnly={selectUserOnly}
                      onChange={(typeValue, val) => {
                        onChangeTestcaseItem(testcaseTemplateItem.id, typeValue, 'value', val, testcaseTemplateItem.type);
                      }}
                    />
                    {onRandomTester && (
                      <Button type="submit" tip={t('테스터 랜덤 변경')} size={size} onClick={onUserRandomChange} rounded>
                        <i className="fa-solid fa-dice" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
            {testcaseTemplateItem.type === 'EDITOR' && (
              <div className="editor" key={`${content.id}-${theme}`}>
                {!isEdit && (
                  <Viewer key={testcaseItem?.text} className="viewer" theme={theme === 'DARK' ? 'dark' : 'white'} initialValue={testcaseItem?.text || '<span className="none-text">&nbsp;</span>'} />
                )}
                {!isEdit && paraphraseContent?.text && (
                  <div className="paraphrase-content">
                    <Tag className="ai-tag" border color="white">
                      AI GEN
                    </Tag>
                    <div className="buttons">
                      {onRemoveParaphraseContent && (
                        <Button
                          size="sm"
                          color="danger"
                          outline={false}
                          rounded
                          onClick={() => {
                            onRemoveParaphraseContent(testcaseItem.id);
                          }}
                        >
                          <i className="fa-solid fa-xmark" />
                        </Button>
                      )}
                      {onAcceptParaphraseContent && (
                        <Button
                          size="sm"
                          color="yellow"
                          rounded
                          onClick={() => {
                            onAcceptParaphraseContent(content.id, testcaseItem.id);
                          }}
                        >
                          <i className="fa-solid fa-arrow-up" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Viewer className="viewer" theme={theme === 'DARK' ? 'dark' : 'white'} initialValue={paraphraseContent?.text || '<span className="none-text">&nbsp;</span>'} />
                    </div>
                  </div>
                )}
                {isEdit && (
                  <ResizableEditor
                    initialValue={testcaseItem?.text || ''}
                    defaultHeight={400}
                    onBlur={html => {
                      if (isTestResultItem) {
                        onChangeTestcaseItem(testcaseTemplateItem.id, 'text', 'text', html, testcaseTemplateItem.type);
                      }
                    }}
                    onAddImageHook={async (blob, callback) => {
                      const result = await createImage(content.id, blob.name, blob.size, blob.type, blob);
                      callback(`${getBaseURL()}/api/${result.data.spaceCode}/projects/${result.data.projectId}/images/${result.data.id}?uuid=${result.data.uuid}`);
                    }}
                    onKeyup={(editorControl, editorType, ev) => {
                      if (editorControl && ev.shiftKey && ev.key === '{' && lastEditorKey.current === '{') {
                        const widgetPopup = getVariableList(variables, e => {
                          const [start, end] = editorControl.getInstance().getSelection();
                          editorControl.getInstance().replaceSelection(`${e.target.textContent}}}`, [start[0], start[1] - 1], end);
                        });

                        editorControl.getInstance().addWidget(widgetPopup, 'bottom');
                      } else if (ev.key !== 'Shift') {
                        lastEditorKey.current = ev.key;
                      }
                    }}
                    onChange={html => {
                      if (!isTestResultItem) {
                        onChangeTestcaseItem(testcaseTemplateItem.id, 'text', 'text', html, testcaseTemplateItem.type);
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {opened && <UserRandomChangeDialog setOpened={setOpened} currentUser={users.find(d => d.userId === testcaseItem.value)} onChange={onRandomTester} targetId={content.id} />}
    </div>
  );
}

TestcaseItem.defaultProps = {
  isEdit: false,
  testcaseTemplateItem: {},
  testcaseItem: {},
  setOpenTooltipInfo: null,
  caseContentElement: null,
  openTooltipInfo: {},
  inx: null,
  users: [],
  content: {},
  theme: null,
  createImage: null,
  onChangeTestcaseItem: null,
  type: true,
  size: 'md',
  selectUserOnly: false,
  isTestResult: false,
  isTestResultItem: false,
  tags: [],
  onRandomTester: null,
  variables: [],
  paraphraseInfo: {},
  onAcceptParaphraseContent: null,
  onRemoveParaphraseContent: null,
};

TestcaseItem.propTypes = {
  isEdit: PropTypes.bool,
  testcaseTemplateItem: PropTypes.shape({
    id: PropTypes.number,
    size: PropTypes.number,
    label: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    example: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
  }),
  testcaseItem: PropTypes.shape({
    id: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    type: PropTypes.string,
    text: PropTypes.string,
  }),
  content: PropTypes.shape({
    id: PropTypes.number,
    projectReleaseId: PropTypes.number,
  }),
  theme: PropTypes.string,
  createImage: PropTypes.func,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
  setOpenTooltipInfo: PropTypes.func,
  caseContentElement: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  openTooltipInfo: PropTypes.shape({
    inx: PropTypes.number,
    type: PropTypes.string,
    category: PropTypes.string,
  }),
  inx: PropTypes.number,
  onChangeTestcaseItem: PropTypes.func,
  type: PropTypes.bool,
  size: PropTypes.string,
  selectUserOnly: PropTypes.bool,
  isTestResult: PropTypes.bool,
  isTestResultItem: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
  onRandomTester: PropTypes.func,
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  paraphraseInfo: ParaphraseInfoPropTypes,
  onAcceptParaphraseContent: PropTypes.func,
  onRemoveParaphraseContent: PropTypes.func,
};

export default TestcaseItem;
