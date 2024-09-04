import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import './TestcaseNode.scss';

function TestcaseNode({ data }) {
  console.log(data);

  const [resizable] = useState(data.resizable);

  return (
    <div className="testcase-node-wrapper">
      <NodeResizer isVisible={resizable} minWidth={100} minHeight={60} />
      <div className="node-content">
        <div className="inner">{data.label || 'no node connected'}</div>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

TestcaseNode.defaultProps = {
  data: null,
};

TestcaseNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    resizable: PropTypes.bool,
  }),
};

export default memo(TestcaseNode);
