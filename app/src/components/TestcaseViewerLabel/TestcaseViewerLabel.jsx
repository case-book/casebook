import React from 'react';
import PropTypes from 'prop-types';
import './TestcaseViewerLabel.scss';
import DescriptionTooltip from '@/pages/spaces/projects/DescriptionTooltip';

function TestcaseViewerLabel({ testcaseTemplateItem, setOpenTooltipInfo, caseContentElement, openTooltipInfo, inx }) {
  return (
    <div className="testcase-viewer-label-wrapper">
      <div className="text">{testcaseTemplateItem.label}</div>
      {testcaseTemplateItem.description && (
        <DescriptionTooltip
          type={testcaseTemplateItem.type}
          onClose={() => {
            setOpenTooltipInfo({
              inx: null,
              type: null,
              category: null,
            });
          }}
          parentElement={caseContentElement}
          icon={<i className="fa-solid fa-info" />}
          title="설명"
          text={testcaseTemplateItem.description}
          opened={openTooltipInfo.inx === inx && openTooltipInfo.type === 'description' && openTooltipInfo.category === 'CASE'}
          onClick={() => {
            if (openTooltipInfo.inx === inx && openTooltipInfo.type === 'description' && openTooltipInfo.category === 'CASE') {
              setOpenTooltipInfo({
                inx: null,
                type: null,
                category: null,
              });
            } else {
              setOpenTooltipInfo({
                inx,
                type: 'description',
                category: 'CASE',
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
              category: null,
            });
          }}
          parentElement={caseContentElement}
          icon={<i className="fa-solid fa-receipt" />}
          title="샘플"
          clipboard
          text={testcaseTemplateItem.example}
          opened={openTooltipInfo.inx === inx && openTooltipInfo.type === 'example' && openTooltipInfo.category === 'CASE'}
          onClick={() => {
            if (openTooltipInfo.inx === inx && openTooltipInfo.type === 'example' && openTooltipInfo.category === 'CASE') {
              setOpenTooltipInfo({
                inx: null,
                type: null,
                category: null,
              });
            } else {
              setOpenTooltipInfo({
                inx,
                type: 'example',
                category: 'CASE',
              });
            }
          }}
        />
      )}
      <div className="type">{testcaseTemplateItem.type}</div>
    </div>
  );
}

TestcaseViewerLabel.defaultProps = {
  testcaseTemplateItem: {},
  setOpenTooltipInfo: null,
  caseContentElement: null,
  openTooltipInfo: {},
  inx: null,
};

TestcaseViewerLabel.propTypes = {
  testcaseTemplateItem: PropTypes.shape({
    label: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    example: PropTypes.string,
  }),
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
};

export default TestcaseViewerLabel;
