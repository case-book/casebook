import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components';
import PropTypes from 'prop-types';
import { NullableNumber, TestcaseGroupPropTypes } from '@/proptypes';
import './TestcaseGroupItem.scss';

function TestcaseGroupItem({
  group,
  selectedItemInfo,
  dragInfo,
  onClickGroupName,
  onChangeEditName,
  onChangeTestcaseGroupName,
  clearEditing,
  onDrop,
  lastChild,
  contextMenuInfo,
  onSelect,
  onContextMenu,
  editInfo,
  setDragInfo,
  allOpen,
  setAllOpen,
}) {
  const [treeOpen, setTreeOpen] = useState(false);

  useEffect(() => {
    if (allOpen !== null) {
      setTreeOpen(allOpen);
    }
  }, [allOpen]);

  const onKeyDown = e => {
    if (e.key === 'Escape') {
      clearEditing();
    } else if (e.key === 'Enter') {
      onChangeTestcaseGroupName(editInfo.type, editInfo.id, editInfo.name);
      clearEditing();
    }
  };

  const clearDragInfo = () => {
    setDragInfo({
      targetType: null,
      targetId: null,
      destinationType: null,
      destinationId: null,
      toChildren: false,
    });
  };

  const hasChild = useMemo(() => {
    return group?.testcases?.length > 0 || group?.children?.length > 0;
  }, [group]);

  return (
    <li key={group.id} className="testcase-group-item-wrapper">
      <div className="border-bottom-liner" />
      <div className="border-top-liner" />
      <div className="group-content">
        <div
          className={`group-info
          ${selectedItemInfo.type === 'group' && group.id === selectedItemInfo.id ? 'selected' : ''} 
          ${dragInfo.targetType === 'group' && dragInfo.targetId === group.id ? 'drag-target' : ''} 
          ${dragInfo.destinationType === 'group' && dragInfo.destinationId === group.id ? 'drag-destination' : ''}  
          ${dragInfo.toChildren ? 'to-children' : ''} 
          ${contextMenuInfo.type === 'group' && contextMenuInfo.id === group.id ? 'context-menu-target' : ''}
          ${editInfo.type === 'group' && editInfo.id === group.id ? 'name-editing' : ''}
          `}
          onClick={() => {
            onSelect({ id: group.id, type: 'group' });
          }}
          onContextMenu={e => {
            onSelect({ id: group.id, type: 'group' });
            onContextMenu(e, 'group', group.id, group.name);
          }}
          onDragEnter={() => {
            if (dragInfo.targetId !== group.id) {
              setDragInfo({
                destinationType: 'group',
                destinationId: group.id,
              });
            } else {
              setDragInfo({
                destinationType: null,
                destinationId: null,
              });
            }
          }}
          onDragLeave={() => {
            setDragInfo({
              destinationType: null,
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
            <div className={`child-tree-mark ${lastChild ? 'last-child' : ''}`}>
              <div>
                <div className="line line-1" />
                <div className="line line-2" />
              </div>
            </div>
          )}
          <div className={`tree-toggle ${hasChild ? 'has-child' : ''}`}>
            <span
              onClick={e => {
                e.stopPropagation();
                setAllOpen(null);
                setTreeOpen(!treeOpen);
              }}
            >
              {hasChild && (
                <>
                  {!treeOpen && <i className="fa-solid fa-folder-plus" />}
                  {treeOpen && <i className="fa-solid fa-folder-minus" />}
                </>
              )}
              {!hasChild && <i className="fa-solid fa-folder" />}
            </span>
          </div>
          <div
            className="name"
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {editInfo.type === 'group' && editInfo.id === group.id && (
              <Input className="name-editor" underline={false} value={editInfo.name} onChange={onChangeEditName} size="xs" required minLength={1} maxLength={100} onKeyDown={onKeyDown} />
            )}
            {!(editInfo.type === 'group' && editInfo.id === group.id) && (
              <div
                onClick={() => {
                  onClickGroupName('group', group);
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
                targetType: 'group',
                targetId: group.id,
                destinationType: null,
                destinationId: null,
              });
            }}
            onDragEnd={clearDragInfo}
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
              if (dragInfo.targetType === 'group' && dragInfo.targetId === group.id) {
                setDragInfo({
                  destinationType: null,
                  destinationId: null,
                });
              } else {
                setDragInfo({
                  destinationType: 'group',
                  destinationId: group.id,
                  toChildren: dragInfo.targetType === 'group',
                });
              }
            }}
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
              if (dragInfo.targetType === 'group' && dragInfo.targetId === group.id) {
                setDragInfo({
                  destinationType: null,
                  destinationId: null,
                });
              } else {
                setDragInfo({
                  toChildren: false,
                });
              }
            }}
          />
        </div>
        {treeOpen && group.testcases?.length > 0 && (
          <div
            className="group-testcases"
            style={{
              marginLeft: `${12 + group.depth * 10 + (group.depth > 0 ? 10 : 0)}px`,
            }}
          >
            <ul>
              {group.testcases
                .sort((a, b) => {
                  return a.itemOrder - b.itemOrder;
                })
                .map(testcase => {
                  return (
                    <li className="testcase-content" key={testcase.id}>
                      <div
                        className={`testcase-info
                        ${dragInfo.targetType === 'case' && dragInfo.targetId === testcase.id ? 'drag-target' : ''} 
                        ${dragInfo.destinationType === 'case' && dragInfo.destinationId === testcase.id ? 'drag-destination' : ''}
                        ${contextMenuInfo.type === 'case' && contextMenuInfo.id === testcase.id ? 'context-menu-target' : ''}
                        ${editInfo.type === 'case' && editInfo.id === testcase.id ? 'name-editing' : ''}
                        ${selectedItemInfo.type === 'case' && testcase.id === selectedItemInfo.id ? 'selected' : ''}
                        `}
                        onClick={e => {
                          e.stopPropagation();
                          onSelect({ id: testcase.id, type: 'case' });
                        }}
                        onDragEnter={e => {
                          e.stopPropagation();
                          if (dragInfo.targetType === 'case' && dragInfo.targetId !== testcase.id) {
                            setDragInfo({
                              destinationType: 'case',
                              destinationId: testcase.id,
                            });
                          } else {
                            setDragInfo({
                              destinationType: null,
                              destinationId: null,
                            });
                          }
                        }}
                        onDragLeave={e => {
                          e.stopPropagation();
                          setDragInfo({
                            destinationType: null,
                            destinationId: null,
                          });
                        }}
                        onDragOver={e => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={onDrop}
                        onContextMenu={e => {
                          onSelect({ id: testcase.id, type: 'case' });
                          onContextMenu(e, 'case', testcase.id, testcase.name);
                        }}
                      >
                        <div className="case-icon">
                          <span>
                            <i className="fa-solid fa-flask" />
                          </span>
                        </div>
                        <div
                          className="name"
                          onDragLeave={e => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          {editInfo.type === 'case' && editInfo.id === testcase.id && (
                            <Input className="name-editor" underline={false} value={editInfo.name} onChange={onChangeEditName} size="xs" required minLength={1} maxLength={100} onKeyDown={onKeyDown} />
                          )}
                          {!(editInfo.type === 'case' && editInfo.id === testcase.id) && (
                            <div
                              onClick={() => {
                                onClickGroupName('case', testcase);
                              }}
                            >
                              {testcase.name}
                            </div>
                          )}
                        </div>
                        <div
                          draggable
                          className="grab"
                          onDragStart={() => {
                            setDragInfo({
                              targetType: 'case',
                              targetId: testcase.id,
                              destinationType: null,
                              destinationId: null,
                            });
                          }}
                          onDragEnd={clearDragInfo}
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
                            if (dragInfo.targetType === 'case' && dragInfo.targetId !== testcase.id) {
                              setDragInfo({
                                destinationType: 'case',
                                destinationId: testcase.id,
                                toChildren: false,
                              });
                            } else {
                              setDragInfo({
                                destinationType: null,
                                destinationId: null,
                                toChildren: false,
                              });
                            }
                          }}
                          onDragLeave={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (dragInfo.targetType === 'case' && dragInfo.targetId !== testcase.id) {
                              setDragInfo({
                                toChildren: false,
                              });
                            } else {
                              setDragInfo({
                                destinationType: null,
                                destinationId: null,
                                toChildren: false,
                              });
                            }
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
      {treeOpen && group.children && (
        <div className="group-children">
          <ul>
            {group.children
              .sort((a, b) => {
                return a.itemOrder - b.itemOrder;
              })
              .map((childGroup, inx) => {
                return (
                  <TestcaseGroupItem
                    key={childGroup.id}
                    group={childGroup}
                    dragInfo={dragInfo}
                    setDragInfo={setDragInfo}
                    onDrop={onDrop}
                    editInfo={editInfo}
                    contextMenuInfo={contextMenuInfo}
                    onContextMenu={onContextMenu}
                    selectedItemInfo={selectedItemInfo}
                    onSelect={onSelect}
                    lastChild={(group?.children?.length || 0) - 1 === inx}
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
      )}
    </li>
  );
}

TestcaseGroupItem.defaultProps = {
  selectedItemInfo: {
    id: null,
    type: null,
  },
  lastChild: false,
  dragInfo: {
    targetId: null,
    destinationId: null,
    toChildren: false,
  },
  editInfo: {
    id: null,
    name: '',
    clickTime: null,
    clickId: null,
  },
  group: {},
  allOpen: null,
};

TestcaseGroupItem.propTypes = {
  group: TestcaseGroupPropTypes,
  dragInfo: PropTypes.shape({
    toChildren: PropTypes.bool,
    targetType: PropTypes.string,
    targetId: NullableNumber,
    destinationType: PropTypes.string,
    destinationId: NullableNumber,
  }),
  editInfo: PropTypes.shape({
    type: PropTypes.string,
    id: NullableNumber,
    name: PropTypes.string,
    clickTime: NullableNumber,
    clickId: NullableNumber,
  }),
  onContextMenu: PropTypes.func.isRequired,
  setDragInfo: PropTypes.func.isRequired,
  contextMenuInfo: PropTypes.shape({
    type: PropTypes.string,
    id: NullableNumber,
    x: NullableNumber,
    y: NullableNumber,
    name: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedItemInfo: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
  }),
  onDrop: PropTypes.func.isRequired,
  lastChild: PropTypes.bool,
  onChangeEditName: PropTypes.func.isRequired,
  clearEditing: PropTypes.func.isRequired,
  onChangeTestcaseGroupName: PropTypes.func.isRequired,
  onClickGroupName: PropTypes.func.isRequired,
  allOpen: PropTypes.bool,
  setAllOpen: PropTypes.func.isRequired,
};

export default TestcaseGroupItem;
