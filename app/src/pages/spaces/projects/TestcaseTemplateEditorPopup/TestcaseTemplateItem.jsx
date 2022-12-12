import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DescriptionTooltip from '@/pages/spaces/projects/DescriptionTooltip';
import './TestcaseTemplateItem.scss';
import { useTranslation } from 'react-i18next';

function TestcaseTemplateEditorPopup({ className, testcaseTemplateItem, inx, selected, onClick, editor, parentElement }) {
  const { t } = useTranslation();

  const [openTooltipInfo, setOpenTooltipInfo] = useState({
    inx: null,
    type: '',
  });

  const hasOptionType = value => {
    return value === 'RADIO' || value === 'SELECT';
  };

  return (
    <li
      key={inx}
      className={`testcase-template-item-wrapper ${className} ${testcaseTemplateItem.crud === 'D' ? 'hidden' : ''} ${testcaseTemplateItem.editable ? 'editable' : 'uneditable'} ${
        editor && selected ? 'selected' : ''
      }`}
      style={{ width: `calc(${(testcaseTemplateItem.size / 12) * 100}%)` }}
      onClick={onClick}
    >
      <div>
        <div className="type">
          <span className="type-text">
            {testcaseTemplateItem.type}
            {!editor && hasOptionType(testcaseTemplateItem.type) && selected && (
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
          </span>
          {hasOptionType(testcaseTemplateItem.type) && (
            <span className="count-badge">
              <span>{testcaseTemplateItem?.options?.length || 0}</span>
            </span>
          )}
          {(testcaseTemplateItem.description || testcaseTemplateItem.example) && (
            <div className="desc-and-example">
              {testcaseTemplateItem.description && (
                <DescriptionTooltip
                  type="description"
                  onClose={() => {
                    setOpenTooltipInfo({
                      inx: null,
                      type: null,
                    });
                  }}
                  parentElement={parentElement}
                  icon={<i className="fa-solid fa-info" />}
                  title="설명"
                  text={testcaseTemplateItem.description}
                  opened={openTooltipInfo.inx === inx && openTooltipInfo.type === 'description'}
                  onClick={() => {
                    if (openTooltipInfo.inx === inx && openTooltipInfo.type === 'description') {
                      setOpenTooltipInfo({
                        inx: null,
                        type: null,
                      });
                    } else {
                      setOpenTooltipInfo({
                        inx,
                        type: 'description',
                      });
                    }
                  }}
                />
              )}

              {testcaseTemplateItem.example && (
                <DescriptionTooltip
                  type={testcaseTemplateItem.type}
                  onClose={() => {
                    setOpenTooltipInfo({
                      inx: null,
                      type: null,
                    });
                  }}
                  parentElement={parentElement}
                  icon={<i className="fa-solid fa-receipt" />}
                  title="샘플"
                  clipboard
                  text={testcaseTemplateItem.example}
                  opened={openTooltipInfo.inx === inx && openTooltipInfo.type === 'example'}
                  onClick={() => {
                    if (openTooltipInfo.inx === inx && openTooltipInfo.type === 'example') {
                      setOpenTooltipInfo({
                        inx: null,
                        type: null,
                      });
                    } else {
                      setOpenTooltipInfo({
                        inx,
                        type: 'example',
                      });
                    }
                  }}
                />
              )}
            </div>
          )}
        </div>
        <div className="item-info">{t(testcaseTemplateItem.label)}</div>
      </div>
    </li>
  );
}

TestcaseTemplateEditorPopup.defaultProps = {
  className: '',
  editor: true,
  testcaseTemplateItem: {},
  selected: false,
  onClick: null,
  parentElement: null,
  inx: null,
};

TestcaseTemplateEditorPopup.propTypes = {
  className: PropTypes.string,
  editor: PropTypes.bool,
  testcaseTemplateItem: PropTypes.shape({
    id: PropTypes.number,
    itemOrder: PropTypes.number,
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    size: PropTypes.number,
    type: PropTypes.string,
    crud: PropTypes.string,
    description: PropTypes.string,
    example: PropTypes.string,
    editable: PropTypes.bool,
  }),
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  parentElement: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  inx: PropTypes.number,
};

export default TestcaseTemplateEditorPopup;
