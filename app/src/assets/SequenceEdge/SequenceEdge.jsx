import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, StepEdge, useReactFlow } from '@xyflow/react';
import classNames from 'classnames';
import './SequenceEdge.scss';

function SequenceEdge(props) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data } = props;
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges(edges => edges.filter(edge => edge.id !== id));
  };

  const [isRemoveButtonHovered, setIsRemoveButtonHovered] = useState(false);

  return (
    <>
      {data.curveType === 'step' && (
        <StepEdge
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          className={classNames('button-edge-wrapper', { hovered: isRemoveButtonHovered })}
          markerEnd={markerEnd}
          style={{
            stroke: isRemoveButtonHovered ? '#e3242b' : '',
            strokeWidth: 2,
          }}
        />
      )}
      {data.curveType === 'bezier' && <BaseEdge className={classNames('button-edge-wrapper', { hovered: isRemoveButtonHovered })} path={edgePath} markerEnd={markerEnd} style={style} />}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {data.editable && (
            <button
              className="button-edge-remove-button"
              onClick={onEdgeClick}
              onMouseEnter={() => {
                setIsRemoveButtonHovered(true);
              }}
              onMouseLeave={() => {
                setIsRemoveButtonHovered(false);
              }}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

SequenceEdge.defaultProps = {
  id: null,
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  style: null,
  markerEnd: null,
  data: {
    curveType: 'bezier',
    editable: false,
  },
};

SequenceEdge.propTypes = {
  id: PropTypes.string,
  sourceX: PropTypes.number,
  sourceY: PropTypes.number,
  targetX: PropTypes.number,
  targetY: PropTypes.number,
  sourcePosition: PropTypes.string,
  targetPosition: PropTypes.string,
  style: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
  }),
  markerEnd: PropTypes.string,
  data: PropTypes.shape({
    curveType: PropTypes.string,
    editable: PropTypes.bool,
  }),
};

export default memo(SequenceEdge);
