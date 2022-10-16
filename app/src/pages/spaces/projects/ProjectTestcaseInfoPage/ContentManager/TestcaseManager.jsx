import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import copy from 'copy-to-clipboard';
import { Button, CheckBox, Input, Radio, TextArea } from '@/components';
import './TestcaseManager.scss';

function TestcaseManager({ content, testcaseTemplates, isEdit, setIsEdit, setContent, onSave }) {
  const { testcaseItems } = content;

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

  const onChangeTestcaseItem = (testcaseTemplateItemId, field, value) => {
    const nextTestcaseItems = testcaseItems.slice(0);

    const index = nextTestcaseItems.findIndex(d => d.testcaseTemplateItemId === testcaseTemplateItemId);
    let target = null;
    if (index > -1) {
      target = testcaseItems[index];
    } else {
      target = {
        testcaseId: content.id,
        testcaseTemplateItemId,
      };
      nextTestcaseItems.push(target);
    }

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
              <div className={`copied-message ${copied ? 'copied' : ''}`}>
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
            <div className="control">
              <Input
                value={content.name}
                size="md"
                color="white"
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
        <div className="button">
          <div
            className="g-no-select"
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            <span className="label">편집</span>
            <span className={`switch ${isEdit ? 'on' : ''}`}>
              {isEdit && <i className="fa-solid fa-toggle-on" />}
              {!isEdit && <i className="fa-solid fa-toggle-off" />}
            </span>
          </div>
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
                <div className="label">
                  <div className="text">{testcaseTemplateItem.label}</div>
                  <div className="type">{testcaseTemplateItem.type}</div>
                </div>
                <div className={`value ${testcaseTemplateItem.type}`}>
                  <div>
                    {testcaseTemplateItem.type === 'RADIO' && (
                      <div className="radio">
                        {testcaseTemplateItem?.options?.map(d => {
                          return (
                            <Radio
                              key={d}
                              type="inline"
                              size="md"
                              readOnly={!isEdit}
                              value={d}
                              checked={d === testcaseItem.value}
                              onChange={val => {
                                onChangeTestcaseItem(testcaseTemplateItem.id, 'value', val);
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
                                onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'N');
                              } else {
                                onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'Y');
                              }
                            }}
                          />
                        )}
                      </div>
                    )}
                    {testcaseTemplateItem.type === 'URL' && (
                      <div className="url">
                        {!isEdit && <div>{testcaseItem.value}</div>}
                        {isEdit && (
                          <Input
                            type="url"
                            value={testcaseItem.value}
                            size="md"
                            color="white"
                            onChange={val => {
                              onChangeTestcaseItem(testcaseTemplateItem.id, 'value', val);
                            }}
                            required
                            minLength={1}
                          />
                        )}
                      </div>
                    )}
                    {testcaseTemplateItem.type === 'USER' && (
                      <div className="url">
                        {!isEdit && <div>{testcaseItem.value}</div>}
                        {isEdit && (
                          <Input
                            type="url"
                            value={testcaseItem.value}
                            size="md"
                            color="white"
                            onChange={val => {
                              onChangeTestcaseItem(testcaseTemplateItem.id, 'value', val);
                            }}
                            required
                            minLength={1}
                          />
                        )}
                      </div>
                    )}
                    {testcaseTemplateItem.type === 'EDITOR' && (
                      <div className="editor">
                        {!isEdit && <div>{testcaseItem.text || <span className="none-text">NONE</span>}</div>}
                        {isEdit && (
                          <TextArea
                            className="text-area"
                            value={testcaseItem.text || ''}
                            rows={4}
                            color="white"
                            onChange={val => {
                              onChangeTestcaseItem(testcaseTemplateItem.id, 'text', val);
                            }}
                          />
                        )}
                      </div>
                    )}

                    {!(
                      testcaseTemplateItem.type === 'EDITOR' ||
                      testcaseTemplateItem.type === 'USER' ||
                      testcaseTemplateItem.type === 'URL' ||
                      testcaseTemplateItem.type === 'RADIO' ||
                      testcaseTemplateItem.type === 'CHECKBOX' ||
                      testcaseTemplateItem.type === 'EDITOR'
                    ) && <div>{testcaseItem.text || testcaseItem.value || <span className="none-text">NONE</span>}</div>}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {isEdit && (
        <div className="save-button">
          <Button size="lg" onClick={onSave}>
            저장
          </Button>
        </div>
      )}
    </div>
  );
}

TestcaseManager.defaultProps = {
  content: null,
  testcaseTemplates: [],
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
        value: PropTypes.string,
        text: PropTypes.string,
      }),
    ),
  }),
  testcaseTemplates: PropTypes.arrayOf(TestcaseTemplatePropTypes),
  isEdit: PropTypes.bool.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TestcaseManager;
