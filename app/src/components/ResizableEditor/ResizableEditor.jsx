import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import useStores from '@/hooks/useStores';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { Editor } from '@toast-ui/react-editor';
import './ResizableEditor.scss';

function ResizableEditor({ onAddImageHook, minHeight, defaultHeight, onBlur, initialValue, onKeyup, onChange, onHeightChange, onEditorRef }) {
  const {
    themeStore: { theme },
  } = useStores();

  const editor = useRef(null);
  const container = useRef();
  const isResizing = useRef(false);
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    if (onEditorRef) {
      onEditorRef(editor?.current);
    }
  }, [editor?.current]);

  useEffect(() => {
    const handleMouseMove = e => {
      if (!isResizing.current) return;
      const containerTop = container.current.getBoundingClientRect().top;
      const newHeight = e.clientY - containerTop + 8;
      if (typeof minHeight === 'number') {
        if (newHeight > minHeight) {
          setHeight(newHeight);
          if (onHeightChange) {
            onHeightChange(newHeight);
          }
        }
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    editor.current?.getInstance()?.setHTML(initialValue);
  }, [initialValue]);

  return (
    <div
      className="resizable-editor-wrapper"
      ref={container}
      style={{
        height,
      }}
    >
      <div className="editor-content">
        <Editor
          key={theme}
          ref={editor}
          theme={theme === 'DARK' ? 'dark' : 'white'}
          placeholder="내용을 입력해주세요."
          previewStyle="vertical"
          height="100%"
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
            addImageBlobHook: onAddImageHook,
          }}
          initialValue={initialValue || ''}
          onBlur={() => {
            if (onBlur) {
              onBlur(editor.current?.getInstance()?.getHTML());
            }
          }}
          onKeyup={(editorType, ev) => {
            if (onKeyup) {
              onKeyup(editor.current, editorType, ev);
            }
          }}
          onChange={() => {
            if (onChange) {
              onChange(editor.current?.getInstance()?.getHTML());
            }
          }}
        />
      </div>
      <div
        className="resizer g-no-select"
        onMouseDown={() => {
          isResizing.current = true;
        }}
      >
        <div>
          <div className="bar">
            <div />
          </div>
          <div className="bar">
            <div />
          </div>
          <div className="bar">
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}

ResizableEditor.defaultProps = {
  minHeight: 200,
  defaultHeight: 200,
  onBlur: null,
  onKeyup: null,
  onChange: null,
  onHeightChange: null,
  initialValue: '',
  onEditorRef: null,
};

ResizableEditor.propTypes = {
  onAddImageHook: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  initialValue: PropTypes.string,
  onKeyup: PropTypes.func,
  onChange: PropTypes.func,
  onHeightChange: PropTypes.func,
  onEditorRef: PropTypes.func,
};

export default observer(ResizableEditor);
