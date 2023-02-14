import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import { useTranslation } from 'react-i18next';
import copyText from 'copy-to-clipboard';
import './SeqId.scss';

function TestcaseManager({ className, children, type, size, copy }) {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  return (
    <div className={`seq-id-wrapper ${className} type-${type} ${copy ? 'copy' : ''} size-${size}`}>
      <div
        onClick={e => {
          if (copy) {
            e.stopPropagation();
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1000);
            copyText(children);
          }
        }}
      >
        {copied && (
          <div className="copied-message" onClick={e => e.stopPropagation()}>
            <div>
              <div className="arrow">
                <div />
              </div>
              <div className="icon">
                <span>
                  <i className="fa-solid fa-copy" />
                </span>
              </div>
              <div className="copied-text">{t('복사되었습니다')}</div>
            </div>
          </div>
        )}
        <span className="seq-id-text">{children}</span>
      </div>
    </div>
  );
}

TestcaseManager.defaultProps = {
  className: null,
  children: null,
  copy: true,
  size: 'md',
};

TestcaseManager.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string,
  type: PropTypes.oneOf(['case', 'group', 'testrun']).isRequired,
  copy: PropTypes.bool,
  size: PropTypes.string,
};

export default TestcaseManager;
