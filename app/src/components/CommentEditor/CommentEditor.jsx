import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ResizableEditor } from '@/components';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import './CommentEditor.scss';

function CommentEditor({ onSaveComment, onAddImageHook, minHeight, defaultHeight, onBlur, initialValue, onKeyup }) {
  const { t } = useTranslation();
  const container = useRef();
  const editor = useRef();
  const [comment, setComment] = useState('');
  const [height, setHeight] = useState(defaultHeight);

  return (
    <div
      className="comment-editor-wrapper"
      ref={container}
      style={{
        height,
      }}
    >
      <ResizableEditor
        onEditorRef={ref => {
          editor.current = ref;
        }}
        onHeightChange={h => {
          setHeight(h + 40);
        }}
        minHeight={minHeight}
        defaultHeight={defaultHeight - 40}
        onAddImageHook={onAddImageHook}
        initialValue={initialValue}
        onBlur={onBlur}
        onKeyup={onKeyup}
        onChange={html => {
          setComment(html);
        }}
      />

      <div className="buttons g-no-select">
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
              onSaveComment(comment);
              setComment('');
              editor.current?.getInstance().setHTML('');
            }
          }}
        >
          {t('코멘트 추가')}
        </Button>
      </div>
    </div>
  );
}

CommentEditor.defaultProps = {
  minHeight: 160,
  defaultHeight: 200,
  onBlur: null,
  onKeyup: null,
  initialValue: '',
};

CommentEditor.propTypes = {
  onSaveComment: PropTypes.func.isRequired,
  onAddImageHook: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  minHeight: PropTypes.number,
  defaultHeight: PropTypes.number,
  initialValue: PropTypes.string,
  onKeyup: PropTypes.func,
};

export default observer(CommentEditor);
