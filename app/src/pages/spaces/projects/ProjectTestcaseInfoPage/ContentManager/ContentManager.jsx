import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import TestcaseManager from '@/pages/spaces/projects/ProjectTestcaseInfoPage/ContentManager/TestcaseManager';
import TestcaseGroupManager from '@/pages/spaces/projects/ProjectTestcaseInfoPage/ContentManager/TestcaseGroupManager';
import { ITEM_TYPE } from '@/constants/constants';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import './ContentManager.scss';
import { Loader } from '@/components';

function ContentManager({ type, content: originalContent, testcaseTemplates, loading, setContentChanged, onSaveTestcase }) {
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState({});

  useEffect(() => {
    setContent(cloneDeep(originalContent));
  }, [originalContent]);

  const changeContent = next => {
    setContentChanged(true);
    setContent(next);
  };

  const onSave = () => {
    onSaveTestcase(content);
  };

  return (
    <div className="content-manager-wrapper">
      <div className="content-scroller">
        {loading && <Loader />}
        {content && type === ITEM_TYPE.TESTCASE && (
          <TestcaseManager isEdit={isEdit} setIsEdit={setIsEdit} content={content} testcaseTemplates={testcaseTemplates} setContent={changeContent} onSave={onSave} />
        )}
        {content && type === ITEM_TYPE.TESTCASE_GROUP && <TestcaseGroupManager content={content} />}
      </div>
    </div>
  );
}

ContentManager.defaultProps = {
  type: null,
  content: null,
  testcaseTemplates: [],
  loading: false,
};

ContentManager.propTypes = {
  type: PropTypes.string,
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
  loading: PropTypes.bool,
  setContentChanged: PropTypes.func.isRequired,
  onSaveTestcase: PropTypes.func.isRequired,
};

export default ContentManager;
