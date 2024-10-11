import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MiniMap as MiniMapComponent } from '@xyflow/react';
import classNames from 'classnames';
import './MiniMap.scss';

function MiniMap({ className }) {
  const getNodeColor = useCallback(node => {
    switch (node.type) {
      case 'testcase':
        return '#386bd8';
      default:
        return '#CCC';
    }
  }, []);

  return (
    <MiniMapComponent
      className={classNames('minimap-wrapper', className)}
      nodeColor={getNodeColor}
      maskColor="#fafafa"
      maskStrokeColor="rgba(0,0,0,0.5)"
      maskStrokeWidth={0.4}
      pannable
      zoomable
      style={{
        width: '200',
        height: '132',
      }}
    />
  );
}

MiniMap.propTypes = {
  className: PropTypes.string,
};

MiniMap.defaultProps = {
  className: '',
};

export default memo(MiniMap);
