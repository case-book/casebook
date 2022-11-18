import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components';
import { useTranslation } from 'react-i18next';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { getBaseURL } from '@/utils/configUtil';
import { Editor } from '@toast-ui/react-editor';
import useStores from '@/hooks/useStores';
import './ExampleEditor.scss';

function ExampleEditor({ className, itemId, onChange, initialValue, max, setMax, buttonText, createProjectImage }) {
  const { t } = useTranslation();

  const {
    themeStore: { theme },
  } = useStores();

  const exampleEditor = useRef(null);

  const createImage = (testcaseId, name, size, typeText, file) => {
    return createProjectImage(name, size, typeText, file);
  };

  return (
    <div className={`max-example-editor-wrapper ${className} ${max ? 'max' : ''}`}>
      <div>
        <div className="title">
          <div>{t('샘플')}</div>
          <div>
            <Button
              size={max ? 'sm' : 'xs'}
              outline
              onClick={() => {
                setMax(!max);
              }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
        <div className="properties-control" key={`${itemId}-${max}`}>
          <Editor
            ref={exampleEditor}
            theme={theme === 'DARK' ? 'dark' : 'white'}
            placeholder="내용을 입력해주세요."
            previewStyle="vertical"
            height="100%"
            initialEditType="wysiwyg"
            hideModeSwitch
            plugins={[colorSyntax]}
            autofocus={false}
            toolbarItems={
              max
                ? [
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task', 'indent', 'outdent'],
                    ['table', 'image', 'link'],
                    ['code', 'codeblock'],
                  ]
                : [['heading', 'bold', 'italic', 'strike']]
            }
            hooks={{
              addImageBlobHook: async (blob, callback) => {
                const result = await createImage(itemId, blob.name, blob.size, blob.type, blob);
                callback(`${getBaseURL()}/api/${result.data.spaceCode}/projects/${result.data.projectId}/images/${result.data.id}?uuid=${result.data.uuid}`);
              },
            }}
            initialValue={initialValue}
            onChange={() => {
              onChange(exampleEditor.current?.getInstance()?.getHTML());
            }}
          />
        </div>
      </div>
    </div>
  );
}

ExampleEditor.defaultProps = {
  className: '',
  onChange: null,

  initialValue: '',
  max: false,
  setMax: null,
  itemId: null,
  buttonText: '축소',
  createProjectImage: null,
};

ExampleEditor.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,

  initialValue: PropTypes.string,
  max: PropTypes.bool,
  setMax: PropTypes.func,
  itemId: PropTypes.number,
  buttonText: PropTypes.string,
  createProjectImage: PropTypes.func,
};

export default ExampleEditor;
