import React, { useEffect, useMemo, useState } from 'react';
import { Input, SeqId } from '@/components';
import PropTypes from 'prop-types';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import { NullableNumber, TestcaseGroupPropTypes, TestcaseGroupSettingPropTypes } from '@/proptypes';
import './TestcaseNavigatorGroupItem.scss';

function TestcaseNavigatorGroupItem({
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
  setting,
  showTestResult,

  enableDrag,
}) {
  const [treeOpen, setTreeOpen] = useState(false);

  useEffect(() => {
    if (allOpen !== null) {
      setTreeOpen(allOpen);
    }
  }, [allOpen]);

  const onKeyDown = e => {
    if (onChangeTestcaseGroupName) {
      if (e.key === 'Escape') {
        clearEditing();
      } else if (e.key === 'Enter') {
        onChangeTestcaseGroupName(editInfo.type, editInfo.id, editInfo.name);
        clearEditing();
      }
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
    <li key={group.id} className="testcase-group-item-wrapper" onClick={e => e.stopPropagation()}>
      <div className="group-content">
        <div
          className={`group-info
          ${selectedItemInfo.type === ITEM_TYPE.TESTCASE_GROUP && group.id === selectedItemInfo.id ? 'selected' : ''} 
          ${dragInfo.targetType === ITEM_TYPE.TESTCASE_GROUP && dragInfo.targetId === group.id ? 'drag-target' : ''} 
          ${dragInfo.destinationType === ITEM_TYPE.TESTCASE_GROUP && dragInfo.destinationId === group.id ? 'drag-destination' : ''}  
          ${dragInfo.toChildren ? 'to-children' : ''} 
          ${contextMenuInfo.type === ITEM_TYPE.TESTCASE_GROUP && contextMenuInfo.id === group.id ? 'context-menu-target' : ''}
          ${editInfo.type === ITEM_TYPE.TESTCASE_GROUP && editInfo.id === group.id ? 'name-editing' : ''}
          `}
          onClick={() => {
            onSelect({ id: group.id, type: ITEM_TYPE.TESTCASE_GROUP });
          }}
          onContextMenu={e => {
            onContextMenu(e, ITEM_TYPE.TESTCASE_GROUP, group.id, group.name);
          }}
          onDragEnter={() => {
            if (dragInfo.targetId !== group.id) {
              setDragInfo({
                destinationType: ITEM_TYPE.TESTCASE_GROUP,
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
            {editInfo.type === ITEM_TYPE.TESTCASE_GROUP && editInfo.id === group.id && (
              <Input className="name-editor" underline={false} value={editInfo.name} onChange={onChangeEditName} size="sm" required minLength={1} maxLength={100} onKeyDown={onKeyDown} />
            )}
            {setting.testcaseGroupColumns.id?.show && (
              <SeqId size="sm" className="seq-id" type={ITEM_TYPE.TESTCASE_GROUP}>
                {group?.seqId}
              </SeqId>
            )}
            {setting.testcaseGroupColumns.itemOrder?.show && (
              <div className="group-col col-itemOrder">
                <div>
                  <i className="fa-solid fa-arrow-down-1-9" />
                </div>
                <div>{group?.itemOrder}</div>
              </div>
            )}
            {setting.testcaseGroupColumns.testcaseCount?.show && group?.testcases?.length > 0 && (
              <div className="col-testcase-count">
                <div>{group?.testcases.length}</div>
              </div>
            )}
            {!(editInfo.type === ITEM_TYPE.TESTCASE_GROUP && editInfo.id === group.id) && (
              <div
                className="col-name group"
                onClick={() => {
                  onClickGroupName(ITEM_TYPE.TESTCASE_GROUP, group);
                }}
              >
                {group.name}
              </div>
            )}
          </div>
          {enableDrag && (
            <div
              draggable
              className="grab"
              onDragStart={() => {
                setDragInfo({
                  targetType: ITEM_TYPE.TESTCASE_GROUP,
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
          )}
          <div
            className="bar"
            onDrop={onDrop}
            onDragEnter={() => {
              if (dragInfo.targetType === ITEM_TYPE.TESTCASE_GROUP && dragInfo.targetId === group.id) {
                setDragInfo({
                  destinationType: null,
                  destinationId: null,
                });
              } else {
                setDragInfo({
                  destinationType: ITEM_TYPE.TESTCASE_GROUP,
                  destinationId: group.id,
                  toChildren: dragInfo.targetType === ITEM_TYPE.TESTCASE_GROUP,
                });
              }
            }}
            onDragLeave={e => {
              e.stopPropagation();
              e.preventDefault();
              if (dragInfo.targetType === ITEM_TYPE.TESTCASE_GROUP && dragInfo.targetId === group.id) {
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
        {setting.testcaseGroupColumns.testcase?.show && treeOpen && group.testcases?.length > 0 && (
          <div
            className="group-testcases"
            style={{
              marginLeft: `${8 + group.depth * 10 + (group.depth > 0 ? 10 : 0)}px`,
            }}
          >
            <ul>
              {group.testcases.map(testcase => {
                const result = testcase.testResult;

                return (
                  <li className="testcase-content" key={testcase.id}>
                    <div
                      className={`testcase-info
                        ${dragInfo.targetType === ITEM_TYPE.TESTCASE && dragInfo.targetId === testcase.id ? 'drag-target' : ''} 
                        ${dragInfo.destinationType === ITEM_TYPE.TESTCASE && dragInfo.destinationId === testcase.id ? 'drag-destination' : ''}
                        ${contextMenuInfo.type === ITEM_TYPE.TESTCASE && contextMenuInfo.id === testcase.id ? 'context-menu-target' : ''}
                        ${editInfo.type === ITEM_TYPE.TESTCASE && editInfo.id === testcase.id ? 'name-editing' : ''}
                        ${selectedItemInfo.type === ITEM_TYPE.TESTCASE && testcase.id === selectedItemInfo.id ? 'selected' : ''}
                        `}
                      onClick={e => {
                        e.stopPropagation();
                        onSelect({ id: testcase.id, type: ITEM_TYPE.TESTCASE });
                      }}
                      onDragEnter={e => {
                        e.stopPropagation();
                        if (dragInfo.targetType === ITEM_TYPE.TESTCASE && dragInfo.targetId !== testcase.id) {
                          setDragInfo({
                            destinationType: ITEM_TYPE.TESTCASE,
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
                        onContextMenu(e, ITEM_TYPE.TESTCASE, testcase.id, testcase.name);
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
                        {editInfo.type === ITEM_TYPE.TESTCASE && editInfo.id === testcase.id && (
                          <Input className="name-editor" underline={false} value={editInfo.name} onChange={onChangeEditName} size="sm" required minLength={1} maxLength={100} onKeyDown={onKeyDown} />
                        )}
                        {setting.testcaseColumns.id?.show && (
                          <SeqId size="sm" className="seq-id" type={ITEM_TYPE.TESTCASE}>
                            {testcase?.seqId}
                          </SeqId>
                        )}
                        {setting.testcaseColumns.itemOrder?.show && (
                          <div className="case-col col-itemOrder">
                            <div>
                              <i className="fa-solid fa-arrow-down-1-9" />
                            </div>
                            <div>{testcase?.itemOrder}</div>
                          </div>
                        )}
                        {setting.testcaseColumns.closed?.show && testcase.closed && (
                          <div className="case-col col-closed">
                            <div>{testcase?.closed ? 'CLOSED' : ''}</div>
                          </div>
                        )}
                        {!(editInfo.type === ITEM_TYPE.TESTCASE && editInfo.id === testcase.id) && (
                          <div
                            className="col-name"
                            onClick={() => {
                              onClickGroupName(ITEM_TYPE.TESTCASE, testcase);
                            }}
                          >
                            {testcase.name}
                          </div>
                        )}
                      </div>
                      {showTestResult && (
                        <div className={`testrun-result ${result}`}>
                          <div>{TESTRUN_RESULT_CODE[result]}</div>
                        </div>
                      )}
                      {enableDrag && (
                        <div
                          draggable
                          className="grab"
                          onDragStart={() => {
                            setDragInfo({
                              targetType: ITEM_TYPE.TESTCASE,
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
                      )}
                      <div
                        className="bar"
                        onDrop={onDrop}
                        onDragEnter={() => {
                          if (dragInfo.targetType === ITEM_TYPE.TESTCASE && dragInfo.targetId !== testcase.id) {
                            setDragInfo({
                              destinationType: ITEM_TYPE.TESTCASE,
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
                          if (dragInfo.targetType === ITEM_TYPE.TESTCASE && dragInfo.targetId !== testcase.id) {
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
            {group.children.map((childGroup, inx) => {
              return (
                <TestcaseNavigatorGroupItem
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
                  setting={setting}
                />
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}

TestcaseNavigatorGroupItem.defaultProps = {
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
  setting: {},
  onChangeTestcaseGroupName: null,
  showTestResult: false,

  enableDrag: true,
};

TestcaseNavigatorGroupItem.propTypes = {
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
  onChangeTestcaseGroupName: PropTypes.func,
  onClickGroupName: PropTypes.func.isRequired,
  allOpen: PropTypes.bool,
  setAllOpen: PropTypes.func.isRequired,
  setting: TestcaseGroupSettingPropTypes,
  showTestResult: PropTypes.bool,
  enableDrag: PropTypes.bool,
};

export default TestcaseNavigatorGroupItem;
