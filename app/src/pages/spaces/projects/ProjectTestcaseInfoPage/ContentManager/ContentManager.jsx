import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import TestcaseManager from '@/pages/spaces/projects/ProjectTestcaseInfoPage/ContentManager/TestcaseManager';
import TestcaseGroupManager from '@/pages/spaces/projects/ProjectTestcaseInfoPage/ContentManager/TestcaseGroupManager';
import { ITEM_TYPE } from '@/constants/constants';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import './ContentManager.scss';
import { EmptyContent, Loader } from '@/components';

function ContentManager({ type, content: originalContent, testcaseTemplates, loading, setContentChanged, onSaveTestcase, users, createTestcaseImage, onSaveTestcaseGroup }) {
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState({});

  useEffect(() => {
    setContent(cloneDeep(originalContent));
  }, [originalContent]);

  const changeContent = next => {
    setContentChanged(true);
    setContent(next);
  };

  const onCancel = () => {
    setIsEdit(false);
    setContentChanged(false);
    setContent(cloneDeep(originalContent));
  };

  return (
    <div className="content-manager-wrapper">
      <div className="manager-content">
        {loading && <Loader />}
        {!content && (
          <EmptyContent className="empty-content">
            <div className="icon">
              <i className="fa-solid fa-circle-info" />
            </div>
            <div>아이템을 선택해주세요.</div>
          </EmptyContent>
        )}
        {content && type === ITEM_TYPE.TESTCASE && (
          <TestcaseManager
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            content={content}
            testcaseTemplates={testcaseTemplates}
            setContent={changeContent}
            onSave={() => {
              onSaveTestcase(content, () => {
                setIsEdit(false);
              });
            }}
            onCancel={onCancel}
            users={users}
            createTestcaseImage={createTestcaseImage}
          />
        )}
        {content && type === ITEM_TYPE.TESTCASE_GROUP && (
          <TestcaseGroupManager
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            content={content}
            onSave={() => {
              onSaveTestcaseGroup(content, () => {
                setIsEdit(false);
              });
            }}
            onCancel={onCancel}
            setContent={changeContent}
          />
        )}
      </div>
    </div>
  );
}

ContentManager.defaultProps = {
  type: null,
  content: null,
  testcaseTemplates: [],
  loading: false,
  users: [],
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
  onSaveTestcaseGroup: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  createTestcaseImage: PropTypes.func.isRequired,
};

export default ContentManager;
