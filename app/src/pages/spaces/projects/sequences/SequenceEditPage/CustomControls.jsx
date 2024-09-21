import React from 'react';
import { useReactFlow } from '@xyflow/react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '@/components';
import './CustomControls.scss';

function CustomControls({ className, position, isInteractive, setIsInteractive }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className={classNames('custom-controls-wrapper', className, position)}>
      <Button size="sm" rounded onClick={zoomIn}>
        <i className="fa-solid fa-plus" />
      </Button>
      <Button size="sm" rounded onClick={zoomOut}>
        <i className="fa-solid fa-minus" />
      </Button>
      <Button size="sm" rounded onClick={fitView}>
        <i className="fa-solid fa-expand" />
      </Button>
      <Button
        size="sm"
        rounded
        onClick={() => {
          setIsInteractive(!isInteractive);
        }}
      >
        {isInteractive && <i className="fa-solid fa-unlock" />}
        {!isInteractive && <i className="fa-solid fa-lock" />}
      </Button>
    </div>
  );
}

CustomControls.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  className: PropTypes.string,
  isInteractive: PropTypes.bool.isRequired,
  setIsInteractive: PropTypes.func.isRequired,
};

CustomControls.defaultProps = {
  position: 'bottom-left',
  className: '',
};

export default CustomControls;
