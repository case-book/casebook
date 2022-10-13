import React, { useEffect, useRef, useState } from 'react';
import { Button, Liner } from '@/components';
import PropTypes from 'prop-types';
import TestcaseGroupItem from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupItem';
import TestcaseGroupContextMenu from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupContextMenu';
import { NullableNumber, NullableString, TestcaseGroupPropTypes } from '@/proptypes';
import './TestcaseGroup.scss';

function TestcaseGroup({ testcaseGroups, addTestcaseGroup, onPositionChange, selectedItemInfo, onSelect, onDelete, onChangeTestcaseGroupName, addTestcase }) {
  const scroller = useRef(null);

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

  const [allOpen, setAllOpen] = useState(true);

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

  useEffect(() => {
    if (selectedItemInfo.time && scroller.current) {
      setTimeout(() => {
        const focusElement = scroller.current?.querySelector('.selected');
        if (focusElement) {
          const scrollerRect = scroller.current.getClientRects();
          const elementRect = focusElement.getClientRects();
          if (scrollerRect?.length > 0 && elementRect?.length > 0) {
            scroller.current.scrollTop = elementRect[0].y - scrollerRect[0].y - 16;
          }
        }
      }, 100);
    }
  }, [selectedItemInfo.time]);

  return (
    <div className="testcase-groups-wrapper g-no-select">
      <div className="testcase-manage-button">
        <div className="left">
          <div className="controller">
            <div>
              <div className="bg" />
              <span className="controller-button start-button">
                <i className="fa-solid fa-gamepad" />
              </span>
              <div className="vertical">
                <span
                  className="controller-button"
                  onClick={() => {
                    setAllOpen(false);
                  }}
                >
                  <div className="all-open-toggle">
                    <div className="tree-icon">
                      <i className="fa-solid fa-folder-minus" />
                    </div>
                    <div className="all-text">
                      <span>ALL</span>
                    </div>
                  </div>
                </span>
                <span className="controller-button center-button" />
                <span
                  className="controller-button"
                  onClick={() => {
                    setAllOpen(true);
                  }}
                >
                  <div className="all-open-toggle">
                    <div className="tree-icon">
                      <i className="fa-solid fa-folder-plus" />
                    </div>
                    <div className="all-text">
                      <span>ALL</span>
                    </div>
                  </div>
                </span>
              </div>
              <div className="horizontal">
                <span className="controller-button">
                  <i className="fa-solid fa-arrow-right-arrow-left" />
                </span>
                <span className="controller-button center-button" />
                <span className="controller-button">
                  <i className="fa-solid fa-arrows-left-right-to-line" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <Button size="xs" onClick={addTestcase} disabled={!selectedItemInfo.type}>
            <i className="fa-solid fa-plus" />
            <i className="fa-solid fa-flask" /> 케이스
          </Button>
          <Liner display="inline-block" width="1px" height="10px" color="white" margin="0 0.5rem" />
          <Button size="xs" onClick={addTestcaseGroup}>
            <i className="fa-solid fa-folder-plus" /> 그룹
          </Button>
        </div>
      </div>
      <div className="summary">설명</div>
      <div className="testcase-groups-content">
        <div className={`content-scroller ${dragChange}`} ref={scroller}>
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
                    allOpen={allOpen}
                    setAllOpen={setAllOpen}
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
    time: null,
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
    id: NullableNumber,
    type: NullableString,
    time: NullableNumber,
  }),
  onChangeTestcaseGroupName: PropTypes.func.isRequired,
};

export default TestcaseGroup;
