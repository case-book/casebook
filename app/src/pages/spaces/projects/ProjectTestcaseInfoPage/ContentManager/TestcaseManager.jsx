import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import copy from 'copy-to-clipboard';
import { Button, CheckBox, Input, Radio, Selector, UserSelector } from '@/components';
import { Editor, Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import { getUserText } from '@/utils/userUtil';
import { getBaseURL } from '@/utils/configUtil';
import './TestcaseManager.scss';

function TestcaseManager({ content, testcaseTemplates, isEdit, setIsEdit, setContent, onSave, onCancel, users, createImage }) {
  const { testcaseItems } = content;
  const editors = useRef({});

  const testcaseTemplate = useMemo(() => {
    return testcaseTemplates.find(d => d.id === content?.testcaseTemplateId);
  }, [content?.testcaseTemplateId]);

  const onChangeContent = (field, value) => {
    setContent({
      ...content,
      [field]: value,
    });
  };

  const [copied, setCopied] = useState(false);

  const onChangeTestcaseItem = (testcaseTemplateItemId, type, field, value) => {
    const nextTestcaseItems = testcaseItems.slice(0);

    const index = nextTestcaseItems.findIndex(d => d.testcaseTemplateItemId === testcaseTemplateItemId);
    let target = null;
    if (index > -1) {
      target = testcaseItems[index];
    } else {
      target = {
        type,
        testcaseId: content.id,
        testcaseTemplateItemId,
      };
      nextTestcaseItems.push(target);
    }

    target.type = type;
    target[field] = value;

    setContent({
      ...content,
      testcaseItems: nextTestcaseItems,
    });
  };

  return (
    <div className={`testcase-manager-wrapper ${isEdit ? 'is-edit' : ''}`}>
      <div className="testcase-title">
        <div className="text">
          <div className="seq-id">
            <div
              onClick={() => {
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
                copy(content.seqId);
              }}
            >
              <div className={`copied-message ${copied ? 'copied' : ''}`} onClick={e => e.stopPropagation()}>
                <span className="bg">
                  <i className="fa-solid fa-certificate" />
                </span>
                <div className="icon">
                  <span>
                    <i className="fa-solid fa-copy" />
                  </span>
                </div>
                <div className="text">COPIED</div>
              </div>
              <span className="seq-id-text">{content.seqId}</span>
            </div>
          </div>
          {isEdit && (
            <div className="title-input">
              <Input
                value={content.name}
                size="md"
                color="black"
                onChange={val => {
                  onChangeContent('name', val);
                }}
                required
                minLength={1}
              />
            </div>
          )}
          {!isEdit && <div className="name">{content.name}</div>}
        </div>
        <div className="title-button">
          {!isEdit && (
            <Button
              size="md"
              color="white"
              onClick={() => {
                setIsEdit(true);
              }}
            >
              변경
            </Button>
          )}
          {isEdit && (
            <>
              <Button size="md" color="white" onClick={onCancel}>
                취소
              </Button>
              <Button size="md" color="primary" onClick={onSave}>
                저장
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="title-liner" />
      <div className="case-content">
        {testcaseTemplate?.testcaseTemplateItems
          .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'CASE')
          .map(testcaseTemplateItem => {
            const testcaseItem = testcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};

            return (
              <div key={testcaseTemplateItem.id} className={`case-item size-${testcaseTemplateItem?.size}`}>
                <div>
                  <div className="label">
                    <div className="text">{testcaseTemplateItem.label}</div>
                    <div className="type">{testcaseTemplateItem.type}</div>
                  </div>
                  <div className="case-liner" />
                  <div className={`value ${testcaseTemplateItem.type}`}>
                    <div>
                      {testcaseTemplateItem.type === 'RADIO' && (
                        <div className="radio">
                          {!isEdit && <div>{testcaseItem.value}</div>}
                          {isEdit &&
                            testcaseTemplateItem?.options?.map(d => {
                              return (
                                <Radio
                                  key={d}
                                  type="inline"
                                  size="md"
                                  readOnly={!isEdit}
                                  value={d}
                                  checked={d === testcaseItem.value}
                                  onChange={val => {
                                    onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val);
                                  }}
                                  label={d}
                                />
                              );
                            })}
                        </div>
                      )}
                      {testcaseTemplateItem.type === 'CHECKBOX' && (
                        <div className="checkbox">
                          {!isEdit && <div>{testcaseItem.value === 'Y' ? 'Y' : 'N'}</div>}
                          {isEdit && (
                            <CheckBox
                              size="md"
                              value={testcaseItem.value === 'Y'}
                              onChange={() => {
                                if (testcaseItem.value === 'Y') {
                                  onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', 'N');
                                } else {
                                  onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', 'Y');
                                }
                              }}
                            />
                          )}
                        </div>
                      )}
                      {(testcaseTemplateItem.type === 'URL' || testcaseTemplateItem.type === 'TEXT') && (
                        <div className="url">
                          {!isEdit && <div>{testcaseItem.value}</div>}
                          {isEdit && (
                            <Input
                              type={testcaseTemplateItem.type.toLowerCase()}
                              value={testcaseItem.value}
                              size="md"
                              color="black"
                              onChange={val => {
                                onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val);
                              }}
                              required
                              minLength={1}
                            />
                          )}
                        </div>
                      )}
                      {testcaseTemplateItem.type === 'SELECT' && (
                        <div className="select">
                          {!isEdit && <div>{testcaseItem.value}</div>}
                          {isEdit && (
                            <Selector
                              color="black"
                              className="selector"
                              size="md"
                              items={testcaseTemplateItem?.options?.map(d => {
                                return {
                                  key: d,
                                  value: d,
                                };
                              })}
                              value={testcaseItem.value}
                              onChange={val => {
                                onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val);
                              }}
                            />
                          )}
                        </div>
                      )}
                      {testcaseTemplateItem.type === 'USER' && (
                        <div className="url">
                          {!isEdit && <div>{getUserText(users, testcaseItem.type, testcaseItem.value) || ''}</div>}
                          {isEdit && (
                            <UserSelector
                              users={users}
                              type={testcaseItem.type}
                              value={testcaseItem.value}
                              color="black"
                              onChange={(type, val) => {
                                onChangeTestcaseItem(testcaseTemplateItem.id, type, 'value', val);
                              }}
                            />
                          )}
                        </div>
                      )}
                      {testcaseTemplateItem.type === 'EDITOR' && (
                        <div className="editor">
                          {!isEdit && <Viewer theme="dark" initialValue={testcaseItem?.text || '<span className="none-text">&nbsp;</span>'} />}
                          {isEdit && (
                            <Editor
                              ref={e => {
                                editors.current[testcaseTemplateItem.id] = e;
                              }}
                              theme="dark"
                              placeholder="내용을 입력해주세요."
                              previewStyle="vertical"
                              height="400px"
                              initialEditType="wysiwyg"
                              hideModeSwitch
                              plugins={[colorSyntax]}
                              autofocus={false}
                              toolbarItems={[
                                ['heading', 'bold', 'italic', 'strike'],
                                ['hr', 'quote'],
                                ['ul', 'ol', 'task', 'indent', 'outdent'],
                                ['table', 'image', 'link'],
                                ['code', 'codeblock'],
                              ]}
                              hooks={{
                                addImageBlobHook: async (blob, callback) => {
                                  const result = await createImage(content.id, blob.name, blob.size, blob.type, blob);
                                  callback(`${getBaseURL()}/api/${result.data.spaceCode}/projects/${result.data.projectId}/testcases/${result.data.testcaseId}/images/${result.data.id}`);
                                },
                              }}
                              initialValue={testcaseItem?.text || ''}
                              onChange={() => {
                                onChangeTestcaseItem(testcaseTemplateItem.id, 'text', 'text', editors.current[testcaseTemplateItem.id]?.getInstance()?.getHTML());
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

TestcaseManager.defaultProps = {
  content: null,
  testcaseTemplates: [],
  users: [],
};

TestcaseManager.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.number,
    seqId: PropTypes.string,
    testcaseGroupId: PropTypes.number,
    testcaseTemplateId: PropTypes.number,
    name: PropTypes.string,
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
  }),
  testcaseTemplates: PropTypes.arrayOf(TestcaseTemplatePropTypes),
  isEdit: PropTypes.bool.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  createImage: PropTypes.func.isRequired,
};

export default TestcaseManager;
