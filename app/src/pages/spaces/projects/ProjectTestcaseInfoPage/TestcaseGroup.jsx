import React, { useRef, useState } from 'react';
import { Button, Liner } from '@/components';
import PropTypes from 'prop-types';
import './TestcaseGroup.scss';

function TestcaseGroup({ testcaseGroups, addTestcaseGroup, onChangeTestcaseOrderChange, selectedId, onSelect, onDelete }) {
  const [dragChange, setDragChange] = useState(null);
  const [contextMenuInfo, setContextMenuInfo] = useState({
    id: null,
    x: null,
    y: null,
  });

  const dragInfo = useRef({}).current;

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

  const onContextMenu = (e, id) => {
    e.preventDefault();

    setContextMenuInfo({
      id,
      x: e.pageX,
      y: e.pageY,
    });
  };

  const onClearContextMenu = () => {
    setContextMenuInfo({
      id: null,
      x: null,
      y: null,
    });
  };

  const getGroup = (group, lastChild) => {
    return (
      <li key={group.id} className={`${group.id === selectedId ? 'selected' : ''}`}>
        <div
          className={`group-content 
          ${dragInfo.targetId === group.id ? 'drag-target' : ''} 
          ${dragInfo.destinationId === group.id ? 'drag-destination' : ''}  
          ${dragInfo.toChildren ? 'to-children' : ''} 
          ${contextMenuInfo.id === group.id ? 'context-menu-target' : ''}`}
          onContextMenu={e => {
            onSelect(group.id);
            onContextMenu(e, group.id);
          }}
          onClick={() => {
            onSelect(group.id);
          }}
          onDragEnter={() => {
            if (dragInfo.targetId !== group.id) {
              setDragInfo({
                destinationId: group.id,
              });
            } else {
              setDragInfo({
                destinationId: null,
              });
            }
          }}
          onDragLeave={() => {
            setDragInfo({
              destinationId: null,
            });
          }}
          onDragOver={e => {
            e.preventDefault();
          }}
          onDrop={onDrop}
          style={{
            marginLeft: `${group.depth * 10}px`,
          }}
        >
          {group.depth > 0 && (
            <div className={`tree-mark ${lastChild ? 'last-child' : ''}`}>
              <div>
                <div className="line line-1" />
                <div className="line line-2" />
              </div>
            </div>
          )}
          <div className="icon">
            <span>
              <span>
                <i className="fa-solid fa-book" />
              </span>
            </span>
          </div>
          <div
            className="name"
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {group.name}
          </div>
          <div
            draggable
            className="grab"
            onDragStart={() => {
              setDragInfo({
                targetId: group.id,
                destinationId: null,
              });
            }}
            onDragEnd={() => {
              setDragChange(Date.now());
              setDragInfo({
                targetId: null,
                destinationId: null,
              });
            }}
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <i className="fa-solid fa-grip-vertical" />
          </div>
          <div
            className="bar"
            onDrop={onDrop}
            onDragEnter={() => {
              if (dragInfo.targetId !== group.id) {
                setDragInfo({
                  destinationId: group.id,
                  toChildren: true,
                });
              } else {
                setDragInfo({
                  destinationId: null,
                });
              }
            }}
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
              if (dragInfo.targetId !== group.id) {
                setDragInfo({
                  toChildren: false,
                });
              } else {
                setDragInfo({
                  destinationId: null,
                });
              }
            }}
          />
        </div>
        {group.children && (
          <div className="group-children">
            <ul>
              {group.children
                .sort((a, b) => {
                  return a.itemOrder - b.itemOrder;
                })
                .map((d, inx) => {
                  return getGroup(d, group.children.length - 1 === inx);
                })}
            </ul>
          </div>
        )}
      </li>
    );
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
              .map(d => {
                return getGroup(d);
              })}
          </ul>
        </div>
      </div>
      {contextMenuInfo?.id && (
        <div
          className="context-menu"
          onClick={() => {
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
                    onDelete(contextMenuInfo.id);
                    onClearContextMenu();
                  }
                }}
              >
                삭제
              </li>
              <li
                onClick={() => {
                  onClearContextMenu();
                }}
              >
                이름 변경
              </li>
            </ul>
          </div>
        </div>
      )}
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
};

export default TestcaseGroup;
