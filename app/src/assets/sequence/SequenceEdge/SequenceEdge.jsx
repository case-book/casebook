import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, SmoothStepEdge, StepEdge, useReactFlow } from '@xyflow/react';
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

  const onEdgeRemoveButtonClick = useCallback(() => {
    setEdges(edges => edges.filter(edge => edge.id !== id));
  }, [setEdges]);

  const [isRemoveButtonHovered, setIsRemoveButtonHovered] = useState(false);

  useEffect(() => {
    setEdges(edges => {
      if (isRemoveButtonHovered) {
        return edges.map(edge => {
          if (edge.id === id) {
            return {
              ...edge,
              style: { ...edge.style, zIndex: 1, opacity: 1 },
            };
          }
          return {
            ...edge,
            style: { ...edge.style, zIndex: 1, opacity: 0.4 },
          };
        });
      }

      return edges.map(edge => {
        return {
          ...edge,
          style: { ...edge.style, zIndex: 0, opacity: 1 },
        };
      });
    });
  }, [isRemoveButtonHovered]);

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
            ...style,
            stroke: isRemoveButtonHovered ? '#e3242b' : '',
          }}
        />
      )}
      {data.curveType === 'bezier' && (
        <BaseEdge
          className={classNames('button-edge-wrapper', { hovered: isRemoveButtonHovered })}
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            ...style,
            stroke: isRemoveButtonHovered ? '#e3242b' : '',
          }}
        />
      )}

      {data.curveType === 'straight' && (
        <BaseEdge
          className={classNames('button-edge-wrapper', { hovered: isRemoveButtonHovered })}
          path={`M ${sourceX},${sourceY} L ${targetX},${targetY}`}
          markerEnd={markerEnd}
          style={{
            ...style,
            stroke: isRemoveButtonHovered ? '#e3242b' : '',
          }}
        />
      )}
      {data.curveType === 'smoothstep' && (
        <SmoothStepEdge
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          className={classNames('button-edge-wrapper', { hovered: isRemoveButtonHovered })}
          markerEnd={markerEnd}
          style={{
            ...style,
            stroke: isRemoveButtonHovered ? '#e3242b' : '',
          }}
        />
      )}

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
              onClick={onEdgeRemoveButtonClick}
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
