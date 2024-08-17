import { Input, SeqId } from '@/components';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import React from 'react';
import PropTypes from 'prop-types';
import { NullableNumber, TestcaseGroupPropTypes, TestcaseGroupSettingPropTypes } from '@/proptypes';

function TestcaseNavigatorTestcaseItem({
  testcase,
  onSelect,
  dragInfo,
  setDragInfo,
  onDrop,
  contextMenuInfo,
  editInfo,
  selectedItemInfo,
  copyInfo,
  watcherInfo,
  setting,
  showTestResult,
  enableDrag,
  onClickGroupName,
  onChangeEditName,
  onContextMenu,
  clearDragInfo,
  onKeyDown,
}) {
  return (
    <li className="testcase-content" key={testcase.id}>
      <div
        className={`testcase-info
            ${dragInfo.targetType === ITEM_TYPE.TESTCASE && dragInfo.targetId === testcase.id ? 'drag-target' : ''} 
            ${dragInfo.destinationType === ITEM_TYPE.TESTCASE && dragInfo.destinationId === testcase.id ? 'drag-destination' : ''}
            ${contextMenuInfo.type === ITEM_TYPE.TESTCASE && contextMenuInfo.id === testcase.id ? 'context-menu-target' : ''}
            ${editInfo.type === ITEM_TYPE.TESTCASE && editInfo.id === testcase.id ? 'name-editing' : ''}
            ${selectedItemInfo.type === ITEM_TYPE.TESTCASE && testcase.id === selectedItemInfo.id ? 'selected' : ''}
            ${copyInfo.type === ITEM_TYPE.TESTCASE && testcase.id === copyInfo.id ? 'copied' : ''}
            
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
        {watcherInfo && watcherInfo[testcase.id]?.length > 0 && watcherInfo[testcase.id]?.length < 3 && (
          <div className="watcher">
            <ul>
              {watcherInfo[testcase.id].map(watcher => {
                return (
                  <li key={watcher.userId}>
                    <div className="user-email-char">
                      <span>{watcher.userEmail.substring(0, 1)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {watcherInfo && watcherInfo[testcase.id]?.length >= 3 && (
          <div className="watcher">
            <ul>
              {watcherInfo[testcase.id]
                .filter((d, inx) => inx < 1)
                .map(watcher => {
                  return (
                    <li key={watcher.userId}>
                      <div className="user-email-char">
                        <span>{watcher.userEmail.substring(0, 1)}</span>
                      </div>
                    </li>
                  );
                })}
              <li>
                <div className="user-email-char">
                  <span>+{watcherInfo[testcase.id].length - 1}</span>
                </div>
              </li>
            </ul>
          </div>
        )}
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
          <div className={`testrun-result ${testcase.testResult}`}>
            <div>{TESTRUN_RESULT_CODE[testcase.testResult]}</div>
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
}

TestcaseNavigatorTestcaseItem.defaultProps = {
  selectedItemInfo: {
    id: null,
    type: null,
  },
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
  testcase: {},
  setting: {},
  showTestResult: false,
  enableDrag: true,
  watcherInfo: null,
  copyInfo: null,
  onContextMenu: () => {},
  clearDragInfo: () => {},
};

TestcaseNavigatorTestcaseItem.propTypes = {
  testcase: TestcaseGroupPropTypes,
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
  onChangeEditName: PropTypes.func.isRequired,
  onClickGroupName: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  setting: TestcaseGroupSettingPropTypes,
  showTestResult: PropTypes.bool,
  enableDrag: PropTypes.bool,
  watcherInfo: PropTypes.shape({
    [PropTypes.number]: PropTypes.shape({
      userId: PropTypes.number,
      userEmail: PropTypes.string,
    }),
  }),
  copyInfo: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  onContextMenu: PropTypes.func,
  clearDragInfo: PropTypes.func,
};

export default TestcaseNavigatorTestcaseItem;
