import React from 'react';
import PropTypes from 'prop-types';
import './TestcaseGroupContextMenu.scss';
import { NullableNumber } from '@/proptypes';

function TestcaseGroupContextMenu({ onClearContextMenu, contextMenuInfo, onClickGroupName, onDelete }) {
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
            삭제
          </li>
          <li
            onClick={() => {
              onClickGroupName(
                {
                  type: contextMenuInfo.type,
                  id: contextMenuInfo.id,
                  name: contextMenuInfo.name,
                },
                true,
              );

              onClearContextMenu();
            }}
          >
            이름 변경
          </li>
        </ul>
      </div>
    </div>
  );
}

TestcaseGroupContextMenu.defaultProps = {};

TestcaseGroupContextMenu.propTypes = {
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
};

export default TestcaseGroupContextMenu;
