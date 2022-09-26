import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import './TestcaseTemplateViewerPopup.scss';

function TestcaseTemplateViewerPopup({ className, testcaseTemplate, onClose }) {
  const { t } = useTranslation();

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  console.log(testcaseTemplate);

  const hasOptionType = value => {
    return value === 'RADIO' || value === 'SELECT';
  };

  return (
    <Modal className={`${className} testcase-template-viewer-popup-wrapper`} isOpen>
      <ModalHeader className="modal-header" onClose={onClose}>
        {testcaseTemplate.name}
      </ModalHeader>
      <ModalBody className="template-content">
        <ul>
          {testcaseTemplate?.testcaseTemplateItems?.map((testcaseTemplateItem, inx) => {
            return (
              <li key={inx} className={`testcase-template-item ${testcaseTemplateItem.crud === 'D' ? 'hidden' : ''}`} style={{ width: `calc(${(testcaseTemplateItem.size / 12) * 100}% - 1rem)` }}>
                <div>
                  <div className="type">
                    <div className="type-text">
                      <span>{testcaseTemplateItem.type}</span>
                    </div>
                    {hasOptionType(testcaseTemplateItem.type) && (
                      <div className="option-count">
                        <Button
                          size="xs"
                          onClick={() => {
                            setSelectedOptionIndex(selectedOptionIndex ? null : inx);
                          }}
                        >
                          {testcaseTemplateItem.options.length} OPTIONS
                        </Button>
                      </div>
                    )}
                    {inx === selectedOptionIndex && (
                      <div className="options-list">
                        <div className="arrow">
                          <div />
                        </div>
                        <ul>
                          {testcaseTemplateItem?.options?.map((option, jnx) => {
                            return <li key={jnx}>{option}</li>;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="item-info">{testcaseTemplateItem.label}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </ModalBody>
      <ModalFooter className="template-footer">
        <Button
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          {t('닫기')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

TestcaseTemplateViewerPopup.defaultProps = {
  className: '',
  testcaseTemplate: null,
  onClose: null,
};

TestcaseTemplateViewerPopup.propTypes = {
  className: PropTypes.string,
  testcaseTemplate: TestcaseTemplatePropTypes,
  onClose: PropTypes.func,
};

export default TestcaseTemplateViewerPopup;
