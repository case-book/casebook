import React, { useRef, useState } from 'react';
import { Button, Liner } from '@/components';
import PropTypes from 'prop-types';
import TestcaseGroupItem from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupItem';
import TestcaseGroupContextMenu from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupContextMenu';
import { TestcaseGroupPropTypes } from '@/proptypes';
import './TestcaseGroup.scss';

function TestcaseGroup({ testcaseGroups, addTestcaseGroup, onPositionChange, selectedItemInfo, onSelect, onDelete, onChangeTestcaseGroupName, addTestcase }) {
  const dragInfo = useRef({
    targetType: null,
    targetId: null,
    destinationType: null,
    destinationId: null,
    toChildren: false,
  }).current;

  const [editInfo, setEditInfo] = useState({
    type: null,
    id: null,
    name: '',
    clickTime: null,
    clickId: null,
  });

  const [dragChange, setDragChange] = useState(null);
  const [contextMenuInfo, setContextMenuInfo] = useState({
    type: null,
    id: null,
    x: null,
    y: null,
    name: '',
  });

  const setDragInfo = info => {
    setDragChange(Date.now());

    Object.keys(info).forEach(key => {
      dragInfo[key] = info[key];
    });
  };

  const onDrop = e => {
    e.stopPropagation();
    if (dragInfo.destinationId) {
      onPositionChange(dragInfo);
    }
  };

  const onContextMenu = (e, type, id, name) => {
    e.preventDefault();

    setContextMenuInfo({
      type,
      id,
      x: e.pageX,
      y: e.pageY,
      name,
    });
  };

  const onClearContextMenu = () => {
    setContextMenuInfo({
      type: null,
      id: null,
      x: null,
      y: null,
      name: '',
    });
  };

  const onClickGroupName = (type, item, force) => {
    console.log(type, item, editInfo);
    if (editInfo.clickTime || force) {
      if (force || (editInfo.type === type && editInfo.clickId === item.id && Date.now() - editInfo.clickTime > 300 && Date.now() - editInfo.clickTime < 1200)) {
        setEditInfo({ ...editInfo, type, id: item.id, clickTime: null, name: item.name, clickId: null });
        setTimeout(() => {
          const e = document.querySelector('.testcase-groups-wrapper input.name-editor');
          if (e?.focus) {
            e.focus();
          }
          if (e?.select) {
            e.select();
          }
        }, 200);
      } else {
        setEditInfo({ ...editInfo, clickTime: null, clickId: null });
      }
    } else {
      setEditInfo({
        ...editInfo,
        type,
        clickTime: Date.now(),
        clickId: item.id,
      });
    }
  };

  const clearEditing = () => {
    setEditInfo({ type: null, id: null, clickTime: null, name: '', clickId: null });
  };

  const onChangeEditName = name => {
    setEditInfo({
      ...editInfo,
      name,
    });
  };

  return (
    <div className="testcase-groups-wrapper">
      <div className="buttons">
        <Button size="xs" onClick={addTestcase}>
          <i className="fa-solid fa-plus" /> 테스트케이스
        </Button>
        <Liner display="inline-block" width="1px" height="10px" color="white" margin="0 0.5rem" />
        <Button size="xs" onClick={addTestcaseGroup}>
          <i className="fa-solid fa-plus" /> 그룹
        </Button>
      </div>
      <div className="summary">설명</div>
      <div className="testcase-groups-content">
        <div className={`content-scroller ${dragChange}`}>
          <ul>
            {testcaseGroups
              .sort((a, b) => {
                return a.itemOrder - b.itemOrder;
              })
              .map(group => {
                return (
                  <TestcaseGroupItem
                    key={group.id}
                    group={group}
                    dragInfo={dragInfo}
                    setDragInfo={setDragInfo}
                    onDrop={onDrop}
                    editInfo={editInfo}
                    contextMenuInfo={contextMenuInfo}
                    onContextMenu={onContextMenu}
                    selectedItemInfo={selectedItemInfo}
                    onSelect={onSelect}
                    lastChild={false}
                    onChangeEditName={onChangeEditName}
                    clearEditing={clearEditing}
                    onChangeTestcaseGroupName={onChangeTestcaseGroupName}
                    onClickGroupName={onClickGroupName}
                  />
                );
              })}
          </ul>
        </div>
      </div>
      <TestcaseGroupContextMenu onDelete={onDelete} onClearContextMenu={onClearContextMenu} onClickGroupName={onClickGroupName} contextMenuInfo={contextMenuInfo} />
    </div>
  );
}

TestcaseGroup.defaultProps = {
  testcaseGroups: [],
  selectedItemInfo: {
    id: null,
    type: null,
  },
};

TestcaseGroup.propTypes = {
  testcaseGroups: PropTypes.arrayOf(TestcaseGroupPropTypes),
  addTestcaseGroup: PropTypes.func.isRequired,
  addTestcase: PropTypes.func.isRequired,
  onPositionChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectedItemInfo: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
  }),
  onChangeTestcaseGroupName: PropTypes.func.isRequired,
};

export default TestcaseGroup;
