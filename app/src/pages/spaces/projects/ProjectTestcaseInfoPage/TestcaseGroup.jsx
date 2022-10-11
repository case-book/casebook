import React, { useRef, useState } from 'react';
import { Button, Input, Liner } from '@/components';
import PropTypes from 'prop-types';
import './TestcaseGroup.scss';

function TestcaseGroup({ testcaseGroups, addTestcaseGroup, onChangeTestcaseOrderChange, selectedId, onSelect, onDelete, onChangeTestcaseGroupName }) {
  const dragInfo = useRef({}).current;

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
          const e = document.querySelector('input.name-editor');
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
      setEditInfo({ ...editInfo, clickTime: Date.now(), clickId: group.id });
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

  const getGroup = (group, lastChild) => {
    return (
      <li key={group.id} className={`${group.id === selectedId ? 'selected' : ''}`}>
        <div className="border-bottom" />
        <div className="border-top" />
        <div
          className={`group-content 
          ${dragInfo.targetId === group.id ? 'drag-target' : ''} 
          ${dragInfo.destinationId === group.id ? 'drag-destination' : ''}  
          ${dragInfo.toChildren ? 'to-children' : ''} 
          ${contextMenuInfo.id === group.id ? 'context-menu-target' : ''}
          ${editInfo.id === group.id ? 'name-editing' : ''}
          `}
          onContextMenu={e => {
            onSelect(group.id);
            onContextMenu(e, group.id, group.name);
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
            {editInfo.id === group.id && (
              <Input
                className="name-editor"
                underline={false}
                value={editInfo.name}
                onChange={onChangeEditName}
                size="sm"
                required
                minLength={1}
                maxLength={100}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    clearEditing();
                  } else if (e.key === 'Enter') {
                    onChangeTestcaseGroupName(editInfo.id, editInfo.name);
                    clearEditing();
                  }
                }}
              />
            )}
            {editInfo.id !== group.id && (
              <div
                onClick={() => {
                  onClickGroupName(group);
                }}
              >
                {group.name}
              </div>
            )}
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
                  onClickGroupName(
                    {
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
  onChangeTestcaseGroupName: PropTypes.func.isRequired,
};

export default TestcaseGroup;
