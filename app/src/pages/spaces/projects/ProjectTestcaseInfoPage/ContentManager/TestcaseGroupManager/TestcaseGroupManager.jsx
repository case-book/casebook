import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, EmptyContent, Input, SeqId, TextArea } from '@/components';
import PropTypes from 'prop-types';
import { ITEM_TYPE } from '@/constants/constants';
import './TestcaseGroupManager.scss';

function TestcaseGroupManager({ isEdit, setIsEdit, onSaveTestcaseGroup, onCancel, content, setContent, addTestcase, onChangeTestcaseNameAndDescription, getPopupContent }) {
  const { t } = useTranslation();

  const [editInfo, setEditInfo] = useState({
    id: null,
    content: null,
  });

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
          <SeqId type={ITEM_TYPE.TESTCASE}>{content.seqId}</SeqId>
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
              <Button size="md" color="primary" outline onClick={onSaveTestcaseGroup}>
                저장
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="title-liner" />
      <div className="group-content">
        <div className={`group-description ${!isEdit && content.description ? '' : 'empty'}`}>
          <div className="description-content">
            {!isEdit && (
              <div className="text">
                {content.description && (
                  <div className="left">
                    <i className="fa-solid fa-quote-left" />
                  </div>
                )}
                {content.description && <div className="description">{content.description}</div>}
                {!content.description && (
                  <div className="description empty">
                    <div>{t('설명이 없습니다')}</div>
                  </div>
                )}
                {content.description && (
                  <div className="right">
                    <i className="fa-solid fa-quote-right" />
                  </div>
                )}
              </div>
            )}
            {isEdit && (
              <TextArea
                size="sm"
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
        <div className="list-title">
          <div>테스트케이스 리스트</div>
          <div>
            <Button
              size="sm"
              outline
              color="white"
              onClick={() => {
                addTestcase(false);
              }}
            >
              {t('추가')}
            </Button>
          </div>
        </div>
        {(!content.testcases || content.testcases?.length < 1) && (
          <div className="empty-layout">
            <EmptyContent className="empty-content" color="transparent">
              <div>{t('테스트케이스가 없습니다.')}</div>
            </EmptyContent>
          </div>
        )}
        {content.testcases?.length > 0 && (
          <ul className="testcase-list">
            {content.testcases
              ?.sort((a, b) => a.itemOrder - b.itemOrder)
              .map(testcase => {
                return (
                  <li
                    className={editInfo.id && editInfo.id === testcase.id ? '' : 'g-clickable'}
                    key={testcase.id}
                    onClick={() => {
                      if (!(editInfo.id && editInfo.id === testcase.id)) {
                        getPopupContent(testcase.id);
                      }
                    }}
                  >
                    <div className="id-name">
                      <SeqId type={ITEM_TYPE.TESTCASE}>{testcase.seqId}</SeqId>
                      <div className="name">
                        {editInfo.id !== testcase.id && <span>{testcase.name}</span>}
                        {editInfo.id === testcase.id && (
                          <Input
                            className="name-editor"
                            underline={false}
                            value={editInfo.content.name}
                            onChange={val => {
                              setEditInfo({
                                ...editInfo,
                                content: {
                                  ...editInfo.content,
                                  name: val,
                                },
                              });
                            }}
                            size="sm"
                            required
                            minLength={1}
                            maxLength={100}
                            onKeyDown={e => {
                              if (e.key === 'Escape') {
                                setEditInfo({
                                  id: null,
                                  content: null,
                                });
                              } else if (e.key === 'Enter') {
                                onChangeTestcaseNameAndDescription(editInfo.id, editInfo.content.name, editInfo.content.description, () => {
                                  setEditInfo({
                                    id: null,
                                    content: null,
                                  });
                                });
                              }
                            }}
                          />
                        )}
                      </div>
                      <div className="edit-button">
                        {editInfo.id && editInfo.id === testcase.id && (
                          <Button
                            size="sm"
                            outline
                            color="white"
                            onClick={e => {
                              e.stopPropagation();
                              setEditInfo({
                                id: null,
                                content: null,
                              });
                            }}
                          >
                            {t('취소')}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          outline
                          color="white"
                          onClick={e => {
                            e.stopPropagation();
                            if (editInfo.id && editInfo.id === testcase.id) {
                              onChangeTestcaseNameAndDescription(editInfo.id, editInfo.content.name, editInfo.content.description, () => {
                                setEditInfo({
                                  id: null,
                                  content: null,
                                });
                              });
                            } else {
                              setTimeout(() => {
                                const inputElement = e.target.parentElement?.parentElement?.querySelector('input');
                                if (inputElement) {
                                  inputElement.focus();
                                }
                              }, 200);

                              setEditInfo({
                                id: testcase.id,
                                content: {
                                  ...testcase,
                                },
                              });
                            }
                          }}
                        >
                          {!(editInfo.id && editInfo.id === testcase.id) && t('변경')}
                          {editInfo.id && editInfo.id === testcase.id && t('저장')}
                        </Button>
                      </div>
                    </div>
                    {editInfo.id && editInfo.id === testcase.id && (
                      <TextArea
                        className="testcase-description"
                        placeholder="테스트케이스에 대한 설명을 입력해주세요."
                        value={editInfo.content.description || ''}
                        rows={2}
                        size="sm"
                        onChange={val => {
                          setEditInfo({
                            ...editInfo,
                            content: {
                              ...editInfo.content,
                              description: val,
                            },
                          });
                        }}
                        autoHeight
                      />
                    )}
                    {!(editInfo.id && editInfo.id === testcase.id) && testcase.description && <div className="description">{testcase.description}</div>}
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
  onSaveTestcaseGroup: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  content: PropTypes.shape({
    id: PropTypes.number,
    seqId: PropTypes.string,
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
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        depth: PropTypes.number,
        description: PropTypes.string,
        itemOrder: PropTypes.number,
        name: PropTypes.string,
        parentId: PropTypes.number,
        seqId: PropTypes.string,
      }),
    ),
  }),
  setContent: PropTypes.func.isRequired,
  addTestcase: PropTypes.func.isRequired,
  onChangeTestcaseNameAndDescription: PropTypes.func.isRequired,
  getPopupContent: PropTypes.func.isRequired,
};

export default TestcaseGroupManager;
