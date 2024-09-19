import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Handle, NodeResizer, Position } from '@xyflow/react';
import './TestcaseNode.scss';

function TestcaseNode(props) {
  console.log(props);
  const { width, height, data } = props;
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
    </div>
  );
}

TestcaseNode.defaultProps = {
  data: null,
  width: null,
  height: null,
};

TestcaseNode.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.shape({
    seqId: PropTypes.string,
    label: PropTypes.string,
    editable: PropTypes.bool,
  }),
};

export default memo(TestcaseNode);
