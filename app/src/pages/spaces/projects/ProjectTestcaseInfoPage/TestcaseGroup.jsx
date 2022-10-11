import React, { useRef, useState } from 'react';
import { Button, Liner } from '@/components';
import PropTypes from 'prop-types';
import './TestcaseGroup.scss';
import TestcaseGroupItem from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupItem';
import TestcaseGroupContextMenu from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupContextMenu';

function TestcaseGroup({ testcaseGroups, addTestcaseGroup, onChangeTestcaseOrderChange, selectedId, onSelect, onDelete, onChangeTestcaseGroupName }) {
  const dragInfo = useRef({
    targetId: null,
    destinationId: null,
    toChildren: false,
  }).current;

  const [editInfo, setEditInfo] = useState({
    id: null,
    name: '',
    clickTime: null,
    clickId: null,
  });

  const [dragChange, setDragChange] = useState(null);
  const [contextMenuInfo, setContextMenuInfo] = useState({
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
      onChangeTestcaseOrderChange(dragInfo);
    }
  };

  const onContextMenu = (e, id, name) => {
    e.preventDefault();

    setContextMenuInfo({
      id,
      x: e.pageX,
      y: e.pageY,
      name,
    });
  };

  const onClearContextMenu = () => {
    setContextMenuInfo({
      id: null,
      x: null,
      y: null,
      name: '',
    });
  };

  const onClickGroupName = (group, force) => {
    if (editInfo.clickTime || force) {
      if (force || (editInfo.clickId === group.id && Date.now() - editInfo.clickTime > 300 && Date.now() - editInfo.clickTime < 1200)) {
        setEditInfo({ ...editInfo, id: group.id, clickTime: null, name: group.name, clickId: null });
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
        clickTime: Date.now(),
        clickId: group.id,
      });
    }
  };

  const clearEditing = () => {
    setEditInfo({ id: null, clickTime: null, name: '', clickId: null });
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
        <Button size="xs" onClick={addTestcaseGroup}>
          케이스 추가
        </Button>
        <Liner display="inline-block" width="1px" height="10px" color="white" margin="0 0.5rem" />
        <Button size="xs" onClick={addTestcaseGroup}>
          그룹 추가
        </Button>
      </div>
      <div className="summary">설명</div>
      <div className="trees">
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
                    selectedId={selectedId}
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
  selectedId: null,
};

TestcaseGroup.propTypes = {
  testcaseGroups: PropTypes.arrayOf(
    PropTypes.shape({
      depth: PropTypes.number,
      id: PropTypes.number,
      itemOrder: PropTypes.number,
      name: PropTypes.string,
      parentId: PropTypes.number,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          depth: PropTypes.number,
          id: PropTypes.number,
          itemOrder: PropTypes.number,
          name: PropTypes.string,
          parentId: PropTypes.number,
        }),
      ),
    }),
  ),
  addTestcaseGroup: PropTypes.func.isRequired,
  onChangeTestcaseOrderChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
  onChangeTestcaseGroupName: PropTypes.func.isRequired,
};

export default TestcaseGroup;
