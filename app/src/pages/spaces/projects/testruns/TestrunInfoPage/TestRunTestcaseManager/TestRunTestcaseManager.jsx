import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import { Button, EmptyContent, FlexibleLayout, Liner, Loader, SeqId, TestcaseItem } from '@/components';
import { observer } from 'mobx-react';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import { debounce } from 'lodash';
import useStores from '@/hooks/useStores';
import { DEFAULT_TESTRUN_RESULT_ITEM, DEFAULT_TESTRUN_TESTER_ITEM, ITEM_TYPE } from '@/constants/constants';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { getBaseURL } from '@/utils/configUtil';
import { Editor, Viewer } from '@toast-ui/react-editor';
import dateUtil from '@/utils/dateUtil';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TestRunTestcaseManager.scss';

function TestRunTestcaseManager({
  content,
  testcaseTemplates,
  setContent,
  users,
  createTestrunImage,
  onSaveTestResultItem,
  contentLoading,
  onSaveComment,
  user,
  onDeleteComment,
  onSaveResult,
  onSaveTester,
}) {
  const {
    themeStore: { theme },
  } = useStores();

  const { t } = useTranslation();

  const { testcaseItems } = content;

  const caseContentElement = useRef(null);

  const editor = useRef(null);

  const testcaseTemplate = useMemo(() => {
    return testcaseTemplates.find(d => d.id === content?.testcaseTemplateId);
  }, [content?.testcaseTemplateId]);

  const [openTooltipInfo, setOpenTooltipInfo] = useState({
    inx: null,
    type: '',
  });

  const [vertical] = useState(true);

  const [comment, setComment] = useState('');

  const onChangeDebounce = React.useMemo(
    () =>
      debounce(target => {
        onSaveTestResultItem(target);
      }, 500),
    [],
  );

  const onChangeTestcaseItem = (testcaseTemplateItemId, type, field, value, templateItemType) => {
    const nextTestrunTestcaseItems = (content?.testrunTestcaseItems || []).slice(0);

    const index = nextTestrunTestcaseItems.findIndex(d => d.testcaseTemplateItemId === testcaseTemplateItemId);
    let target = null;
    if (index > -1) {
      target = nextTestrunTestcaseItems[index];
    } else {
      target = {
        type,
        testcaseId: content.testcaseId,
        testrunTestcaseGroupId: content.testrunTestcaseGroupId,
        testrunTestcaseGroupTestcaseId: content.id,
        testcaseTemplateItemId,
      };
      nextTestrunTestcaseItems.push(target);
    }

    target.type = type;
    target[field] = value;

    const nextContent = {
      ...content,
      testrunTestcaseItems: nextTestrunTestcaseItems,
    };

    setContent(nextContent);

    if (templateItemType === 'RADIO' || templateItemType === 'CHECKBOX' || templateItemType === 'SELECT' || templateItemType === 'USER') {
      onSaveTestResultItem(target);
    } else {
      onChangeDebounce(target);
    }
  };

  const onChangeTestResult = (_testcaseTemplateItemId, _type, _field, value) => {
    const nextContent = {
      ...content,
      testResult: value,
    };
    setContent(nextContent);
    onSaveResult(value);
  };

  const onChangeTester = (_testcaseTemplateItemId, _type, _field, value) => {
    const nextContent = {
      ...content,
      testerId: value,
    };
    setContent(nextContent);
    onSaveTester(value);
  };

  return (
    <div className="testrun-testcase-manager-wrapper">
      {contentLoading && <Loader />}
      <FlexibleLayout
        vertical={vertical}
        defaultSize="60%"
        layoutOptionKey={['testrun', 'testrun-testcase-manager', 'height']}
        className="manager-layout"
        left={
          <div className="manager-content">
            <div className="testcase-title">
              <SeqId type={ITEM_TYPE.TESTCASE}>{content.seqId}</SeqId>
              <div className="name">{content.name}</div>
            </div>
            <div className="title-liner" />
            <div className="case-content" ref={caseContentElement}>
              {content.description && <div className="case-description">{content.description}</div>}
              <div className="testcase-item-list">
                {testcaseTemplate?.testcaseTemplateItems
                  .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'CASE')
                  .map((testcaseTemplateItem, inx) => {
                    let testcaseItem;
                    if (testcaseTemplateItem.systemLabel) {
                      testcaseItem = content?.testrunTestcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};
                    } else {
                      testcaseItem = testcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};
                    }

                    return (
                      <TestcaseItem
                        key={inx}
                        type={false}
                        isEdit={false}
                        testcaseTemplateItem={testcaseTemplateItem}
                        testcaseItem={testcaseItem}
                        content={content}
                        theme={theme}
                        createImage={createTestrunImage}
                        users={users.map(d => {
                          return {
                            ...d,
                            id: d.userId,
                          };
                        })}
                        setOpenTooltipInfo={setOpenTooltipInfo}
                        caseContentElement={caseContentElement}
                        openTooltipInfo={openTooltipInfo}
                        inx={inx}
                        onChangeTestcaseItem={onChangeTestcaseItem}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        }
        right={
          <div className="testurn-result-info">
            <div className="testrun-result-content">
              <div className="testrun-result-list is-edit">
                <TestcaseItem
                  selectUserOnly
                  size="sm"
                  isEdit
                  testcaseTemplateItem={{
                    ...DEFAULT_TESTRUN_RESULT_ITEM,
                  }}
                  testcaseItem={{ value: content.testResult }}
                  content={content}
                  theme={theme}
                  createImage={createTestrunImage}
                  users={users}
                  setOpenTooltipInfo={setOpenTooltipInfo}
                  caseContentElement={caseContentElement}
                  openTooltipInfo={openTooltipInfo}
                  onChangeTestcaseItem={onChangeTestResult}
                  isTestResult
                />
                <TestcaseItem
                  selectUserOnly
                  size="sm"
                  isEdit
                  testcaseTemplateItem={{
                    ...DEFAULT_TESTRUN_TESTER_ITEM,
                  }}
                  testcaseItem={{ value: content.testerId }}
                  content={content}
                  theme={theme}
                  createImage={createTestrunImage}
                  users={users}
                  setOpenTooltipInfo={setOpenTooltipInfo}
                  caseContentElement={caseContentElement}
                  openTooltipInfo={openTooltipInfo}
                  onChangeTestcaseItem={onChangeTester}
                />
              </div>
              <div className="testrun-result-list is-edit">
                {testcaseTemplate?.testcaseTemplateItems
                  .filter(testcaseTemplateItem => testcaseTemplateItem.category === 'RESULT')
                  .map((testcaseTemplateItem, inx) => {
                    const testcaseItem = content?.testrunTestcaseItems?.find(d => d.testcaseTemplateItemId === testcaseTemplateItem.id) || {};

                    return (
                      <TestcaseItem
                        selectUserOnly
                        size="sm"
                        type={false}
                        key={inx}
                        isEdit
                        testcaseTemplateItem={testcaseTemplateItem}
                        testcaseItem={testcaseItem}
                        content={content}
                        theme={theme}
                        createImage={createTestrunImage}
                        users={users}
                        setOpenTooltipInfo={setOpenTooltipInfo}
                        caseContentElement={caseContentElement}
                        openTooltipInfo={openTooltipInfo}
                        inx={inx}
                        onChangeTestcaseItem={onChangeTestcaseItem}
                        isTestResultItem
                      />
                    );
                  })}
              </div>
              <div className="testrun-testcase-comments">
                <div className="text">코멘트</div>
                <div className="comment-list">
                  {(!content.comments || content.comments.length < 1) && (
                    <EmptyContent minHeight="auto" className="empty-comments">
                      <div>{t('코멘트가 없습니다.')}</div>
                    </EmptyContent>
                  )}
                  {content.comments?.length > 0 && (
                    <ul>
                      {content.comments?.map(info => {
                        return (
                          <li key={info.id} className="comment">
                            <div className="comment-content">
                              <Viewer className="viewer" theme={theme === 'DARK' ? 'dark' : 'white'} initialValue={info.comment || '<span className="none-text">&nbsp;</span>'} />
                            </div>
                            <div className="comment-user-info">
                              <div>{dateUtil.getDateString(info.lastUpdateDate)}</div>
                              <div>
                                <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                              </div>
                              <div>{users.find(u => u.userId === info.userId)?.name || ''}</div>
                              {user?.id === info.userId && (
                                <div>
                                  <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
                                </div>
                              )}
                              {user?.id === info.userId && (
                                <div>
                                  <Link
                                    to="#1"
                                    onClick={e => {
                                      e.stopPropagation();
                                      onDeleteComment(info.id);
                                    }}
                                  >
                                    삭제
                                  </Link>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div className="comment-editor">
                  <Editor
                    key={theme}
                    ref={editor}
                    theme={theme === 'DARK' ? 'dark' : 'white'}
                    placeholder="내용을 입력해주세요."
                    previewStyle="vertical"
                    height="160px"
                    initialEditType="wysiwyg"
                    plugins={[colorSyntax]}
                    autofocus={false}
                    toolbarItems={[
                      ['heading', 'bold', 'italic', 'strike'],
                      ['hr', 'quote'],
                      ['ul', 'ol', 'task', 'indent', 'outdent'],
                      ['table', 'image', 'link'],
                      ['code', 'codeblock'],
                    ]}
                    hooks={{
                      addImageBlobHook: async (blob, callback) => {
                        const result = await createTestrunImage(content.id, blob.name, blob.size, blob.type, blob);
                        callback(`${getBaseURL()}/api/${result.data.spaceCode}/projects/${result.data.projectId}/images/${result.data.id}?uuid=${result.data.uuid}`);
                      },
                    }}
                    initialValue={comment || ''}
                    onChange={() => {
                      setComment(editor.current?.getInstance()?.getHTML());
                    }}
                  />
                  <div className="buttons">
                    <Button
                      outline
                      onClick={() => {
                        setComment('');
                        editor.current?.getInstance().setHTML('');
                      }}
                      size="sm"
                    >
                      {t('취소')}
                    </Button>
                    <Button
                      outline
                      size="sm"
                      onClick={() => {
                        if (comment) {
                          onSaveComment(null, comment, () => {
                            setComment('');
                            editor.current?.getInstance().setHTML('');
                          });
                        }
                      }}
                    >
                      {t('코멘트 추가')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

TestRunTestcaseManager.defaultProps = {
  content: null,
  testcaseTemplates: [],
  users: [],
  onSaveComment: null,
  contentLoading: false,
  user: null,
  onDeleteComment: null,
  onSaveResult: null,
  onSaveTester: null,
  onSaveTestResultItem: null,
};

TestRunTestcaseManager.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.number,
    testrunTestcaseGroupId: PropTypes.number,
    testcaseId: PropTypes.number,
    seqId: PropTypes.string,
    testcaseGroupId: PropTypes.number,
    testcaseTemplateId: PropTypes.number,
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
    testrunTestcaseItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        testcaseId: PropTypes.number,
        testcaseTemplateItemId: PropTypes.number,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.string,
      }),
    ),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        testrunTestcaseGroupTestcaseId: PropTypes.number,
        comment: PropTypes.string,
      }),
    ),
    testResult: PropTypes.string,
    testerId: PropTypes.number,
  }),
  testcaseTemplates: PropTypes.arrayOf(TestcaseTemplatePropTypes),
  setContent: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  createTestrunImage: PropTypes.func.isRequired,
  onSaveComment: PropTypes.func,
  contentLoading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  onDeleteComment: PropTypes.func,
  onSaveResult: PropTypes.func,
  onSaveTester: PropTypes.func,
  onSaveTestResultItem: PropTypes.func,
};

export default observer(TestRunTestcaseManager);
