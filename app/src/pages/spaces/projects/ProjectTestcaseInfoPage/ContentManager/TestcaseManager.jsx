import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import './TestcaseManager.scss';
import { Input, Radio } from '@/components';

function TestcaseManager({ content, testcaseTemplates, isEdit, setIsEdit, setContent }) {
  const { testcaseItems } = content;

  const testcaseTemplate = useMemo(() => {
    return testcaseTemplates.find(d => d.id === content?.testcaseTemplateId);
  }, [content?.testcaseTemplateId]);

  console.log(testcaseTemplate);

  console.log(content);

  const onChangeContent = (field, value) => {
    setContent({
      ...content,
      [field]: value,
    });
  };

  return (
    <div className={`testcase-manager-wrapper ${isEdit ? 'is-edit' : ''}`}>
      <div className="testcase-title">
        <div className="text">
          {isEdit && (
            <Input
              value={content.name}
              underline
              size="md"
              onChange={val => {
                onChangeContent('name', val);
              }}
              required
              minLength={1}
            />
          )}
          {!isEdit && content.name}
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
                              readOnly
                              value={testcaseItem.value}
                              checked={d === testcaseItem.value || d === '중'}
                              onChange={val => {
                                console.log(val);
                              }}
                              label={d}
                            />
                          );
                        })}
                      </div>
                    )}
                    {testcaseTemplateItem.type === 'CHECKBOX' && <div className="checkbox">{testcaseItem.value === 'Y' ? 'Y' : 'N'}</div>}
                    {testcaseTemplateItem.type === 'EDITOR' && <div className="editor">{testcaseItem.text || testcaseItem.value || <span className="none-text">NONE</span>}</div>}
                    {!(testcaseTemplateItem.type === 'RADIO' || testcaseTemplateItem.type === 'CHECKBOX' || testcaseTemplateItem.type === 'EDITOR') && (
                      <div>{testcaseItem.text || testcaseItem.value || <span className="none-text">NONE</span>}</div>
                    )}
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
};

export default TestcaseManager;
