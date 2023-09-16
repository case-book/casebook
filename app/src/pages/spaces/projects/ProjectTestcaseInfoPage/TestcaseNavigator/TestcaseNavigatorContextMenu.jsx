import React from 'react';
import PropTypes from 'prop-types';
import { NullableNumber } from '@/proptypes';
import './TestcaseNavigatorContextMenu.scss';
import { useTranslation } from 'react-i18next';

function TestcaseNavigatorContextMenu({ onClearContextMenu, contextMenuInfo, onClickGroupName, onDelete, onCopy, copyInfo, onPaste }) {
  const { t } = useTranslation();
  return (
    <div
      className={`testcase-group-context-menu-wrapper ${contextMenuInfo?.id ? 'on' : ''}`}
      onClick={() => {
        onClearContextMenu();
      }}
      onContextMenu={e => {
        e.preventDefault();
        onClearContextMenu();
      }}
    >
      <div
        style={{
          left: contextMenuInfo.x,
          top: contextMenuInfo.y,
        }}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <ul>
          <li
            onClick={() => {
              if (contextMenuInfo.id) {
                onDelete(contextMenuInfo.type, contextMenuInfo.id);
                onClearContextMenu();
              }
            }}
          >
            {t('삭제')}
          </li>
          <li
            onClick={() => {
              onClickGroupName(
                contextMenuInfo.type,
                {
                  id: contextMenuInfo.id,
                  name: contextMenuInfo.name,
                },
                true,
              );

              onClearContextMenu();
            }}
          >
            {t('이름 변경')}
          </li>
          {onCopy && (
            <li
              onClick={() => {
                onCopy(contextMenuInfo.type, contextMenuInfo.id, contextMenuInfo.name);
                onClearContextMenu();
              }}
            >
              {t('복사')}
            </li>
          )}
          {copyInfo?.id && (
            <li
              onClick={() => {
                onPaste(contextMenuInfo.type, contextMenuInfo.id, contextMenuInfo.name);
                onCopy(null, null, null);
                onClearContextMenu();
              }}
            >
              {t('붙여넣기')}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

TestcaseNavigatorContextMenu.defaultProps = {
  onCopy: null,
  copyInfo: null,
  onPaste: null,
};

TestcaseNavigatorContextMenu.propTypes = {
  contextMenuInfo: PropTypes.shape({
    type: PropTypes.string,
    id: NullableNumber,
    x: NullableNumber,
    y: NullableNumber,
    name: PropTypes.string,
  }).isRequired,
  onClearContextMenu: PropTypes.func.isRequired,
  onClickGroupName: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCopy: PropTypes.func,
  copyInfo: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  onPaste: PropTypes.func,
};

export default TestcaseNavigatorContextMenu;
