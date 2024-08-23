import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { LlmPropTypes, ParaphraseInfoPropTypes, ProjectReleasePropTypes, TestcaseTemplatePropTypes } from '@/proptypes';
import { Button, Liner, Selector, SeqId, TestcaseItem, VariableInput } from '@/components';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import useStores from '@/hooks/useStores';
import dialogUtil from '@/utils/dialogUtil';
import { DEFAULT_TESTRUN_RELEASE_ITEM, DEFAULT_TESTRUN_TESTER_ITEM, ITEM_TYPE, MESSAGE_CATEGORY } from '@/constants/constants';
import { useTranslation } from 'react-i18next';
import dateUtil from '@/utils/dateUtil';
import TestcaseReleaseItem from '@/components/TestcaseItem/TestcaseReleaseItem';
import useClickOutside from '@/hooks/useClickOutside';
import classNames from 'classnames';
import './TestcaseManager.scss';

function TestcaseManager({
  content,
  releases,
  testcaseTemplates,
  isEdit,
  setIsEdit,
  setContent,
  onSave,
  onCancel,
  users,
  createTestcaseImage,
  tags,
  variables,
  onParaphrase,
  llm,
  selectedModelId,
  setSelectedModelId,
  paraphraseInfo,
  onAcceptParaphraseContent,
  onRemoveParaphraseContent,
  aiEnabled,
  headerControl,
}) {
  const {
    themeStore: { theme },
  } = useStores();

  const { t } = useTranslation();
  const { testcaseItems } = content;

  const [openTooltipInfo, setOpenTooltipInfo] = useState({
    inx: null,
    type: '',
  });

  const [modelSelectorOpened, setModelSelectorOpened] = useState(false);
  const element = useRef();
  useClickOutside(element, () => setModelSelectorOpened(false));

  const caseContentElement = useRef(null);

  const testcaseTemplate = useMemo(() => {
    return testcaseTemplates.find(d => d.id === content?.testcaseTemplateId);
  }, [content?.testcaseTemplateId]);

  const onChangeContent = (field, value) => {
    setContent({
      ...content,
      [field]: value,
    });
  };

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

  const onChangeTestcaseTester = (type, value) => {
    setContent({
      ...content,
      testerType: type,
      testerValue: String(value),
    });
  };

  const onChangeTestcaseTemplateDescription = description => {
    setContent({
      ...content,
      description,
    });
  };

  const onChangeTestcaseTemplate = testcaseTemplateId => {
    if (content?.testcaseTemplateId !== testcaseTemplateId) {
      dialogUtil.setConfirm(
        MESSAGE_CATEGORY.WARNING,
        t('템플릿 변경 알림'),
        <div>{t('테스트케이스 템플릿을 변경하면, 현재 이 테스트케이스에 작성된 테스트케이스의 컨텐츠가 모두 초기화됩니다. 계속하시겠습니까?')}</div>,
        () => {
          const selectedTemplate = testcaseTemplates.find(d => d.id === testcaseTemplateId);

          const nextTestcaseItems = [];
          selectedTemplate.testcaseTemplateItems
            .filter(d => d.defaultValue != null)
            .forEach(d => {
              nextTestcaseItems.push({
                testcaseId: content.id,
                testcaseTemplateItemId: d.id,
                type: d.type === 'EDITOR' ? 'text' : 'value',
                text: d.type === 'EDITOR' ? d.defaultValue : undefined,
                value: d.type !== 'EDITOR' ? d.defaultValue : undefined,
              });
            });

          setContent({
            ...content,
            testcaseTemplateId,
            testcaseItems: nextTestcaseItems,
          });
        },
        null,
        t('확인'),
      );
    }
  };

  return (
    <div className={`testcase-manager-wrapper ${isEdit ? 'is-edit' : ''}`}>
      <div className="testcase-header">
        <div className="testcase-basic-info">
          <SeqId className="seq-id" type={ITEM_TYPE.TESTCASE}>
            {content.seqId}
          </SeqId>
          {isEdit && (
            <div className="type-input">
              <Selector
                className="selector"
                size="md"
                items={testcaseTemplates?.map(d => {
                  return {
                    key: d.id,
                    value: d.name,
                  };
                })}
                value={testcaseTemplate?.id}
                onChange={onChangeTestcaseTemplate}
              />
            </div>
          )}
        </div>
        <div className="testcase-title">
          <div className="text">
            {isEdit && (
              <div className="title-input">
                <div className="name-input">
                  <VariableInput
                    value={content.name}
                    size="md"
                    onChange={val => {
                      onChangeContent('name', val);
                    }}
                    required
                    minLength={1}
                    variables={variables}
                  />
                </div>
              </div>
            )}
            {!isEdit && <div className="name">{content.name}</div>}
          </div>
          <div className="title-button">
            {!isEdit && (
              <>
                {aiEnabled && (
                  <>
                    <Button
                      size="md"
                      color="primary"
                      className="ai-button"
                      disabled={!llm || paraphraseInfo.isLoading}
                      onClick={() => {
                        onParaphrase(content.id);
                        setModelSelectorOpened(false);
                      }}
                      tip={t('AI로 테스트케이스 내용을 재구성합니다.')}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles" />
                      {t('재구성')}
                    </Button>
                    <Button
                      className="model-selector"
                      size="md"
                      color="primary"
                      onClick={() => {
                        if (!modelSelectorOpened) {
                          setModelSelectorOpened(true);
                        }
                      }}
                    >
                      <i className="fa-solid fa-angle-down" />
                      {modelSelectorOpened && (
                        <ul className="model-list" ref={element}>
                          {llm.openAi.models.map(model => {
                            return (
                              <li
                                key={model.id}
                                className={classNames({ selected: selectedModelId === model.id })}
                                onClick={() => {
                                  if (setSelectedModelId) {
                                    setSelectedModelId(model.id);
                                  }
                                  setModelSelectorOpened(false);
                                }}
                              >
                                <div>{model.name}</div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </Button>

                    <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                  </>
                )}
                {setIsEdit && (
                  <Button
                    size="md"
                    color="primary"
                    onClick={() => {
                      setIsEdit(true);
                    }}
                  >
                    {t('변경')}
                  </Button>
                )}
              </>
            )}
            {isEdit && (
              <>
                <Button className="cancel-button" size="md" color="white" onClick={onCancel}>
                  {t('취소')}
                </Button>
                <Button size="md" color="primary" onClick={onSave}>
                  {t('저장')}
                </Button>
              </>
            )}
          </div>
          {headerControl && headerControl}
        </div>
      </div>
      <div className="title-liner" />
      <div className="case-content" ref={caseContentElement}>
        <div className="case-description">
          {!isEdit && <div className={`case-description-content ${content.description ? '' : 'empty'}`}>{content.description || t('설명이 없습니다.')}</div>}
          {isEdit && (
            <VariableInput
              textArea
              size="sm"
              placeholder={t('테스트케이스에 대한 설명을 입력해주세요.')}
              value={content.description || ''}
              rows={4}
              onChange={onChangeTestcaseTemplateDescription}
              autoHeight
              variables={variables}
            />
          )}
        </div>
        {testcaseTemplate?.testcaseTemplateItems
          .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'CASE')
          .sort((a, b) => a.itemOrder - b.itemOrder)
          .map((testcaseTemplateItem, inx) => {
            const testcaseItem = testcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};

            return (
              <TestcaseItem
                key={inx}
                isEdit={isEdit}
                testcaseTemplateItem={testcaseTemplateItem}
                testcaseItem={testcaseItem}
                content={content}
                theme={theme}
                createImage={createTestcaseImage}
                users={users}
                tags={tags}
                setOpenTooltipInfo={setOpenTooltipInfo}
                caseContentElement={caseContentElement}
                openTooltipInfo={openTooltipInfo}
                inx={inx}
                onChangeTestcaseItem={onChangeTestcaseItem}
                size="sm"
                variables={variables}
                paraphraseInfo={paraphraseInfo}
                onAcceptParaphraseContent={onAcceptParaphraseContent}
                onRemoveParaphraseContent={onRemoveParaphraseContent}
              />
            );
          })}
        <hr className="info-hr" />
        <div>
          <TestcaseReleaseItem
            isEdit={isEdit}
            testcaseTemplateItem={{
              ...DEFAULT_TESTRUN_RELEASE_ITEM,
            }}
            content={content}
            setOpenTooltipInfo={setOpenTooltipInfo}
            caseContentElement={caseContentElement}
            openTooltipInfo={openTooltipInfo}
            releases={releases}
            onAdd={id => {
              const nextProjectReleaseIds = (content.projectReleaseIds || []).slice(0);
              nextProjectReleaseIds.push(id);
              onChangeContent('projectReleaseIds', nextProjectReleaseIds);
            }}
            onRemove={id => {
              const nextProjectReleaseIds = (content.projectReleaseIds || []).slice(0);
              const index = nextProjectReleaseIds.findIndex(nextProjectReleaseId => nextProjectReleaseId === id);
              if (index > -1) {
                nextProjectReleaseIds.splice(index, 1);
              }
              onChangeContent('projectReleaseIds', nextProjectReleaseIds);
            }}
          />
          <TestcaseItem
            isEdit={isEdit}
            testcaseTemplateItem={{
              ...DEFAULT_TESTRUN_TESTER_ITEM,
            }}
            testcaseItem={{
              type: content.testerType,
              value: content.testerValue,
            }}
            content={content}
            theme={theme}
            createImage={createTestcaseImage}
            users={users}
            tags={tags}
            setOpenTooltipInfo={setOpenTooltipInfo}
            caseContentElement={caseContentElement}
            openTooltipInfo={openTooltipInfo}
            onChangeTestcaseItem={(id, typeValue, temp1, val) => {
              onChangeTestcaseTester(typeValue, val);
            }}
            size="sm"
            variables={variables}
            paraphraseInfo={paraphraseInfo}
            onAcceptParaphraseContent={onAcceptParaphraseContent}
            onRemoveParaphraseContent={onRemoveParaphraseContent}
          />
        </div>
        <div className="creator-info">
          <table>
            <tbody>
              <tr>
                <td>{t('생성')}</td>
                <td>{content.createdUserName}</td>
                <td>{dateUtil.getDateString(content.creationDate)}</td>
              </tr>
              <tr>
                <td>{t('마지막 변경')}</td>
                <td>{content.lastUpdatedUserName}</td>
                <td>{content.lastUpdatedUserName ? dateUtil.getDateString(content.lastUpdateDate) : ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

TestcaseManager.defaultProps = {
  content: null,
  testcaseTemplates: [],
  releases: [],
  users: [],
  tags: [],
  variables: [],
  llm: null,
  paraphraseInfo: {},
  aiEnabled: false,
  setIsEdit: null,
  headerControl: null,
  selectedModelId: null,
  setSelectedModelId: null,
};

TestcaseManager.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.number,
    seqId: PropTypes.string,
    testcaseGroupId: PropTypes.number,
    testcaseTemplateId: PropTypes.number,
    projectReleaseIds: PropTypes.arrayOf(PropTypes.number),
    name: PropTypes.string,
    description: PropTypes.string,
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
    testerType: PropTypes.string,
    testerValue: PropTypes.string,
    createdUserName: PropTypes.string,
    lastUpdatedUserName: PropTypes.string,
    creationDate: PropTypes.string,
    lastUpdateDate: PropTypes.string,
  }),
  testcaseTemplates: PropTypes.arrayOf(TestcaseTemplatePropTypes),
  isEdit: PropTypes.bool.isRequired,
  setIsEdit: PropTypes.func,
  setContent: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  releases: PropTypes.arrayOf(ProjectReleasePropTypes),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  createTestcaseImage: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  onParaphrase: PropTypes.func.isRequired,
  llm: LlmPropTypes,
  paraphraseInfo: ParaphraseInfoPropTypes,
  onAcceptParaphraseContent: PropTypes.func.isRequired,
  onRemoveParaphraseContent: PropTypes.func.isRequired,
  aiEnabled: PropTypes.bool,
  headerControl: PropTypes.node,
  selectedModelId: PropTypes.number,
  setSelectedModelId: PropTypes.func,
};

export default TestcaseManager;
