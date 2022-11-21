import React from 'react';
import { useTranslation } from 'react-i18next';
import './TestcaseGroupManager.scss';
import { Button, EmptyContent, Input, TextArea } from '@/components';
import PropTypes from 'prop-types';

function TestcaseGroupManager({ isEdit, setIsEdit, onSave, onCancel, content, setContent }) {
  const { t } = useTranslation();

  const onChangeContent = (field, value) => {
    setContent({
      ...content,
      [field]: value,
    });
  };

  return (
    <div className={`testcase-group-manager-wrapper ${isEdit ? 'is-edit' : ''}`}>
      <div className="testcase-group-title">
        <div className="title-info">
          {isEdit && (
            <div className="control">
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
          {!isEdit && <div className="text">{content.name}</div>}
        </div>
        <div className="title-button">
          {!isEdit && (
            <Button
              size="md"
              outline
              color="white"
              onClick={() => {
                setIsEdit(true);
              }}
            >
              {t('변경')}
            </Button>
          )}
          {isEdit && (
            <>
              <Button outline size="md" color="white" onClick={onCancel}>
                취소
              </Button>
              <Button size="md" color="primary" outline onClick={onSave}>
                저장
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="title-liner" />
      <div className="group-content">
        <div className="group-description">
          <div className="description-title">설명</div>
          <div className="description-content">
            {!isEdit && <div>{content.description}</div>}
            {isEdit && (
              <TextArea
                placeholder="테스트케이스 그룹에 대한 설명을 입력해주세요."
                value={content.description || ''}
                rows={2}
                onChange={val => {
                  onChangeContent('description', val);
                }}
                autoHeight
              />
            )}
          </div>
        </div>
        <div className="list-title">테스트케이스 리스트</div>
        {content.testcases?.length < 1 && (
          <div className="empty-layout">
            <EmptyContent className="empty-content">
              <div>{t('사용자가 없습니다.')}</div>
            </EmptyContent>
          </div>
        )}
        {content.testcases?.length > 0 && (
          <ul>
            {content.testcases
              ?.sort((a, b) => a.itemOrder - b.itemOrder)
              .map(testcase => {
                return (
                  <li key={testcase.id}>
                    <div className="id-name">
                      <div className="seq-id">
                        <div>{testcase.seqId}</div>
                      </div>
                      <div className="name">{testcase.name}</div>
                    </div>
                    {testcase.description && <div className="description">{testcase.description}</div>}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}

TestcaseGroupManager.defaultProps = {
  content: {},
};

TestcaseGroupManager.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  content: PropTypes.shape({
    id: PropTypes.number,
    depth: PropTypes.number,
    itemOrder: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    parentId: PropTypes.number,
    testcases: PropTypes.arrayOf(
      PropTypes.shape({
        closed: PropTypes.bool,
        id: PropTypes.number,
        itemOrder: PropTypes.number,
        name: PropTypes.string,
        seqId: PropTypes.string,
        testcaseGroupId: PropTypes.number,
        testcaseTemplateId: PropTypes.number,
        description: PropTypes.string,
      }),
    ),
  }),
  setContent: PropTypes.func.isRequired,
};

export default TestcaseGroupManager;
