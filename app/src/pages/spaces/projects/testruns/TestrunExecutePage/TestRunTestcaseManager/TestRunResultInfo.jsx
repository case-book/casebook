import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import { Button, CloseIcon, TestcaseItem } from '@/components';
import { observer } from 'mobx-react';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import useStores from '@/hooks/useStores';
import { DEFAULT_TESTRUN_RESULT_ITEM, DEFAULT_TESTRUN_TESTER_ITEM } from '@/constants/constants';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { getBaseURL } from '@/utils/configUtil';
import { Editor } from '@toast-ui/react-editor';
import { useTranslation } from 'react-i18next';
import { CommentList } from '@/assets';

function TestRunTestcaseManager({
  content,
  testcaseTemplates,
  users,
  createTestrunImage,

  onSaveComment,
  onDeleteComment,

  resultLayoutPosition,
  onChangeTestResult,
  onChangeTester,
  onChangeTestcaseItem,
  resultPopupOpened,
  setResultPopupOpened,
}) {
  const {
    themeStore: { theme },
  } = useStores();

  const { t } = useTranslation();

  const caseContentElement = useRef(null);

  const editor = useRef(null);

  const resultInfoElement = useRef(null);

  const testcaseTemplate = useMemo(() => {
    return testcaseTemplates.find(d => d.id === content?.testcaseTemplateId);
  }, [content?.testcaseTemplateId]);

  const [openTooltipInfo, setOpenTooltipInfo] = useState({
    inx: null,
    type: '',
  });

  const [comment, setComment] = useState('');

  useEffect(() => {
    if (resultInfoElement.current && resultInfoElement.current.parentNode && resultInfoElement.current.parentNode.parentNode) {
      resultInfoElement.current.parentNode.parentNode.scrollTop = 0;
    }

    setComment('');
    editor.current?.getInstance().setHTML('');
  }, [content?.id]);

  return (
    <div className={`testrun-result-info ${resultPopupOpened ? 'opened' : ''}`} ref={resultInfoElement}>
      <div>
        <div className="result-liner title-liner" />
        <div className="layout-title">
          <span>{t('테스트 결과 입력')}</span>
          <Button
            className="exit-button"
            color="transparent"
            onClick={() => {
              setResultPopupOpened(false);
            }}
          >
            <span>
              <CloseIcon size="sm" />
            </span>
          </Button>
        </div>
        <div className="testrun-result-content">
          <div className="testrun-result-list is-edit">
            <TestcaseItem
              selectUserOnly
              type={false}
              size="sm"
              isEdit
              testcaseTemplateItem={{
                ...DEFAULT_TESTRUN_RESULT_ITEM,
                size: resultLayoutPosition === 'RIGHT' ? 12 : DEFAULT_TESTRUN_RESULT_ITEM.size,
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
              type={false}
              size="sm"
              isEdit
              testcaseTemplateItem={{
                ...DEFAULT_TESTRUN_TESTER_ITEM,
                size: resultLayoutPosition === 'RIGHT' ? 12 : DEFAULT_TESTRUN_RESULT_ITEM.size,
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
                    testcaseTemplateItem={{
                      ...testcaseTemplateItem,
                      size: resultLayoutPosition === 'RIGHT' ? 12 : DEFAULT_TESTRUN_RESULT_ITEM.size,
                    }}
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
            <div className="text">{t('코멘트')}</div>
            <CommentList comments={content.comments} onDeleteComment={onDeleteComment} />
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
    </div>
  );
}

TestRunTestcaseManager.defaultProps = {
  content: null,
  testcaseTemplates: [],
  users: [],
  onSaveComment: null,
  user: null,
  onDeleteComment: null,
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
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  createTestrunImage: PropTypes.func.isRequired,
  onSaveComment: PropTypes.func,

  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  onDeleteComment: PropTypes.func,

  resultLayoutPosition: PropTypes.string.isRequired,
  onChangeTestResult: PropTypes.func.isRequired,
  onChangeTester: PropTypes.func.isRequired,
  onChangeTestcaseItem: PropTypes.func.isRequired,
  resultPopupOpened: PropTypes.bool.isRequired,
  setResultPopupOpened: PropTypes.func.isRequired,
};

export default observer(TestRunTestcaseManager);
