import React, { useEffect, useRef, useState } from 'react';
import { Button, Liner } from '@/components';
import PropTypes from 'prop-types';
import TestcaseGroupItem from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupItem';
import TestcaseGroupContextMenu from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupContextMenu';
import { NullableNumber, NullableString, TestcaseGroupPropTypes } from '@/proptypes';
import { useResizeDetector } from 'react-resize-detector';
import './TestcaseGroup.scss';
import { getOption, setOption } from '@/utils/storageUtil';
import TestcaseGroupSetting from '@/pages/spaces/projects/ProjectTestcaseInfoPage/TestcaseGroupSetting';

function TestcaseGroup({ testcaseGroups, addTestcaseGroup, onPositionChange, selectedItemInfo, onSelect, onDelete, onChangeTestcaseGroupName, addTestcase, min, setMin, countSummary }) {
  const scroller = useRef(null);

  const { width, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'throttle',
    refreshRate: 100,
  });

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

  const [setting, setSetting] = useState(() => {
    const storageSetting = getOption('testcase', 'testcase-group-layout', 'setting') || {};

    return {
      show: false,
      testcaseGroupColumns: {
        id: {
          show: false,
          name: '아이디',
        },
        itemOrder: {
          show: false,
          name: '순서',
        },

        testcase: {
          show: true,
          name: '테스트케이스',
        },
        testcaseCount: {
          show: false,
          name: '테스트케이스 개수',
        },
        ...storageSetting?.testcaseGroupColumns,
      },
      testcaseColumns: {
        id: {
          show: false,
          name: '아이디',
        },
        itemOrder: {
          show: false,
          name: '순서',
        },
        closed: {
          show: false,
          name: '종료',
        },
        ...storageSetting?.testcaseColumns,
      },
    };
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
      }, 400);
    }
  }, [selectedItemInfo.time]);

  const onChangeSetting = (category, key, value) => {
    const nextSetting = {
      ...setting,
      [category]: {
        ...setting[category],
        [key]: {
          ...setting[category][key],
          show: value,
        },
      },
    };
    setSetting(nextSetting);

    setOption('testcase', 'testcase-group-layout', 'setting', nextSetting);
  };

  return (
    <div className={`testcase-groups-wrapper g-no-select ${min ? 'min' : ''}`} ref={ref}>
      <div className="testcase-manage-button">
        <div className="left">
          <div className="controller">
            <div>
              <div className="bg" />
              <span className="controller-button start-button">
                <i className="fa-solid fa-gamepad" />
              </span>
              {!min && (
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
              )}
              <div className="horizontal">
                <span
                  className="controller-button"
                  onClick={() => {
                    setMin(true);
                  }}
                >
                  <i className="fa-solid fa-minimize" />
                </span>
                <span className="controller-button center-button" />
                <span
                  className="controller-button"
                  onClick={() => {
                    setMin(false);
                  }}
                >
                  <i className="fa-solid fa-maximize" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={`right ${width < 260 ? 'small-control' : ''} ${width < 160 ? 'smaller-control' : ''}`}>
          <Button className="add-testcase-button" size="xs" onClick={addTestcase} disabled={!selectedItemInfo.type}>
            <i className="small-icon fa-solid fa-plus" />
            <i className="fa-solid fa-flask" /> <span className="button-text">테스트케이스</span>
          </Button>
          <Liner className="liner" display="inline-block" width="1px" height="10px" color="white" margin="0 0.5rem" />
          <Button size="xs" onClick={addTestcaseGroup}>
            <i className="fa-solid fa-folder-plus" /> <span className="button-text">그룹</span>
          </Button>
        </div>
      </div>
      <div
        className="testcase-groups-content"
        onClick={() => {
          onSelect({
            id: null,
            type: null,
            time: null,
          });
        }}
      >
        {min && (
          <div className="min-content">
            <div>
              <div className="label">GROUP</div>
              <div className="count">{countSummary.testcaseGroupCount}</div>
            </div>
            <div>
              <div className="label">CASE</div>
              <div className="count">{countSummary.testcaseCount}</div>
            </div>
          </div>
        )}
        <div className={`content-scroller ${dragChange}`} ref={scroller}>
          <ul>
            {testcaseGroups.map(group => {
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
                  setting={setting}
                />
              );
            })}
          </ul>
        </div>
      </div>
      {!min && (
        <div className="testcase-config-button">
          <Button
            size="xs"
            onClick={() => {
              setSetting({
                ...setting,
                show: true,
              });
            }}
            rounded
          >
            <i className="fa-solid fa-gear" />
          </Button>
          <TestcaseGroupSetting
            setting={setting}
            onChangeSetting={onChangeSetting}
            onClose={() => {
              setSetting({
                ...setting,
                show: false,
              });
            }}
          />
        </div>
      )}
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
  min: false,
  countSummary: {
    testcaseGroupCount: 0,
    testcaseCount: 0,
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
  min: PropTypes.bool,
  setMin: PropTypes.func.isRequired,
  countSummary: PropTypes.shape({
    testcaseGroupCount: PropTypes.number,
    testcaseCount: PropTypes.number,
  }),
};

export default TestcaseGroup;
