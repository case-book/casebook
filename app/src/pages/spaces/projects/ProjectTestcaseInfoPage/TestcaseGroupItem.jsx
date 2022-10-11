import React from 'react';
import { Input } from '@/components';
import PropTypes from 'prop-types';
import './TestcaseGroupItem.scss';

function TestcaseGroupItem({
  group,
  selectedId,
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
}) {
  return (
    <li key={group.id} className={`testcase-group-item-wrapper ${group.id === selectedId ? 'selected' : ''}`}>
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
                    selectedId={selectedId}
                    onSelect={onSelect}
                    lastChild={(group?.children?.length || 0) - 1 === inx}
                    onChangeEditName={onChangeEditName}
                    clearEditing={clearEditing}
                    onChangeTestcaseGroupName={onChangeTestcaseGroupName}
                    onClickGroupName={onClickGroupName}
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
  selectedId: null,
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
};

TestcaseGroupItem.propTypes = {
  group: PropTypes.shape({
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
  }).isRequired,
  dragInfo: PropTypes.shape({
    toChildren: PropTypes.bool,
    targetId: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(null)]),
    destinationId: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(null)]),
  }),
  editInfo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]),
    name: PropTypes.string,
    clickTime: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(null)]),
    clickId: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(null)]),
  }),
  onContextMenu: PropTypes.func.isRequired,
  setDragInfo: PropTypes.func.isRequired,
  contextMenuInfo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(null)]),
    x: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(null)]),
    y: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(null)]),
    name: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
  onDrop: PropTypes.func.isRequired,
  lastChild: PropTypes.bool,
  onChangeEditName: PropTypes.func.isRequired,
  clearEditing: PropTypes.func.isRequired,
  onChangeTestcaseGroupName: PropTypes.func.isRequired,
  onClickGroupName: PropTypes.func.isRequired,
};

export default TestcaseGroupItem;
