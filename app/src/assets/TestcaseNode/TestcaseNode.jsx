import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Handle, NodeResizer, Position, useReactFlow } from '@xyflow/react';
import './TestcaseNode.scss';

function TestcaseNode({ id, width, height, data }) {
  const { setNodes, setEdges } = useReactFlow();

  const onRemoveClick = () => {
    setEdges(edges => edges.filter(edge => !(edge.source === id || edge.target === id)));
    setNodes(nodes => nodes.filter(edge => edge.id !== id));
  };

  return (
    <div
      className="testcase-node-wrapper"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <NodeResizer isVisible={data.editable} minWidth={100} minHeight={60} />
      <div className="node-content">
        <div className="inner">
          <span className="seq-id">{data.seqId}</span>
          {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      {data.editable && (
        <button className="button-node-remove-button" onClick={onRemoveClick}>
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  );
}

TestcaseNode.defaultProps = {
  id: null,
  data: null,
  width: null,
  height: null,
};

TestcaseNode.propTypes = {
  id: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.shape({
    seqId: PropTypes.string,
    label: PropTypes.string,
    editable: PropTypes.bool,
  }),
};

export default memo(TestcaseNode);
