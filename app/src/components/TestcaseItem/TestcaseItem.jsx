import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './TestcaseItem.scss';
import { CheckBox, Input, Radio, Selector, TestcaseViewerLabel, UserSelector } from '@/components';
import { getUserText } from '@/utils/userUtil';
import { Editor, Viewer } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { getBaseURL } from '@/utils/configUtil';

function TestcaseItem({ isEdit, testcaseTemplateItem, testcaseItem, users, createImage, content, theme, onChangeTestcaseItem, setOpenTooltipInfo, caseContentElement, openTooltipInfo, inx }) {
  const editor = useRef(null);

  return (
    <div key={testcaseTemplateItem.id} className={`testcase-item-wrapper size-${testcaseTemplateItem?.size}`}>
      <div>
        <TestcaseViewerLabel testcaseTemplateItem={testcaseTemplateItem} setOpenTooltipInfo={setOpenTooltipInfo} caseContentElement={caseContentElement} openTooltipInfo={openTooltipInfo} inx={inx} />
        <div className="case-liner" />
        <div className={`value ${testcaseTemplateItem.type}`}>
          <div>
            {testcaseTemplateItem.type === 'RADIO' && (
              <div className="radio">
                {!isEdit && <div>{testcaseItem.value}</div>}
                {isEdit &&
                  testcaseTemplateItem?.options?.map(d => {
                    return (
                      <Radio
                        key={d}
                        type="inline"
                        size="md"
                        readOnly={!isEdit}
                        value={d}
                        checked={d === testcaseItem.value}
                        onChange={val => {
                          onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val);
                        }}
                        label={d}
                      />
                    );
                  })}
              </div>
            )}
            {testcaseTemplateItem.type === 'CHECKBOX' && (
              <div className="checkbox">
                {!isEdit && <div>{testcaseItem.value === 'Y' ? 'Y' : 'N'}</div>}
                {isEdit && (
                  <CheckBox
                    size="md"
                    value={testcaseItem.value === 'Y'}
                    onChange={() => {
                      if (testcaseItem.value === 'Y') {
                        onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', 'N');
                      } else {
                        onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', 'Y');
                      }
                    }}
                  />
                )}
              </div>
            )}
            {(testcaseTemplateItem.type === 'URL' || testcaseTemplateItem.type === 'TEXT' || testcaseTemplateItem.type === 'NUMBER') && (
              <div className="url">
                {!isEdit && <div>{testcaseItem.value}</div>}
                {isEdit && (
                  <Input
                    type={testcaseTemplateItem.type.toLowerCase()}
                    value={testcaseItem.value}
                    size="md"
                    outline
                    color="black"
                    onChange={val => {
                      onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val);
                    }}
                    required
                    minLength={1}
                  />
                )}
              </div>
            )}
            {testcaseTemplateItem.type === 'SELECT' && (
              <div className="select">
                {!isEdit && <div>{testcaseItem.value}</div>}
                {isEdit && (
                  <Selector
                    color="black"
                    className="selector"
                    size="md"
                    items={testcaseTemplateItem?.options?.map(d => {
                      return {
                        key: d,
                        value: d,
                      };
                    })}
                    value={testcaseItem.value}
                    onChange={val => {
                      onChangeTestcaseItem(testcaseTemplateItem.id, 'value', 'value', val);
                    }}
                  />
                )}
              </div>
            )}
            {testcaseTemplateItem.type === 'USER' && (
              <div className="url">
                {!isEdit && <div>{getUserText(users, testcaseItem.type, testcaseItem.value) || ''}</div>}
                {isEdit && (
                  <UserSelector
                    users={users}
                    type={testcaseItem.type}
                    value={testcaseItem.value}
                    onChange={(type, val) => {
                      onChangeTestcaseItem(testcaseTemplateItem.id, type, 'value', val);
                    }}
                  />
                )}
              </div>
            )}
            {testcaseTemplateItem.type === 'EDITOR' && (
              <div className="editor" key={`${content.id}-${theme}`}>
                {!isEdit && <Viewer className="viewer" theme={theme === 'DARK' ? 'dark' : 'white'} initialValue={testcaseItem?.text || '<span className="none-text">&nbsp;</span>'} />}
                {isEdit && (
                  <Editor
                    ref={editor}
                    theme={theme === 'DARK' ? 'dark' : 'white'}
                    placeholder="내용을 입력해주세요."
                    previewStyle="vertical"
                    height="400px"
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
                        const result = await createImage(content.id, blob.name, blob.size, blob.type, blob);
                        callback(
                          `${getBaseURL()}/api/${result.data.spaceCode}/projects/${result.data.projectId}/testcases/${result.data.testcaseId}/images/${result.data.id}?uuid=${result.data.uuid}`,
                        );
                      },
                    }}
                    initialValue={testcaseItem?.text || ''}
                    onChange={() => {
                      onChangeTestcaseItem(testcaseTemplateItem.id, 'text', 'text', editor.current?.getInstance()?.getHTML());
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

TestcaseItem.defaultProps = {
  isEdit: false,
  testcaseTemplateItem: {},
  testcaseItem: {},
  setOpenTooltipInfo: null,
  caseContentElement: null,
  openTooltipInfo: {},
  inx: null,
  users: [],
  content: {},
  theme: null,
  createImage: null,
  onChangeTestcaseItem: null,
};

TestcaseItem.propTypes = {
  isEdit: PropTypes.bool,
  testcaseTemplateItem: PropTypes.shape({
    id: PropTypes.number,
    size: PropTypes.number,
    label: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    example: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
  }),
  testcaseItem: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    type: PropTypes.string,
    text: PropTypes.string,
  }),
  content: PropTypes.shape({
    id: PropTypes.number,
  }),
  theme: PropTypes.string,
  createImage: PropTypes.func,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
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
  onChangeTestcaseItem: PropTypes.func,
};

export default TestcaseItem;
