import React, { useRef, useState } from 'react';
import { getOption, setOption } from '@/utils/storageUtil';
import './FlexibleLayout.scss';
import PropTypes from 'prop-types';

function FlexibleLayout({ min, left, right, layoutOptionKey }) {
  const [testcaseGroupWidth, setTestcaseGroupWidth] = useState(() => {
    if (layoutOptionKey?.length === 3) {
      return getOption(layoutOptionKey[0], layoutOptionKey[1], layoutOptionKey[2]) || 300;
    }

    return 300;
  });

  const testcaseGroupElement = useRef(null);

  const resizeInfo = useRef({
    moving: false,
    startX: null,
    endX: null,
    startWidth: null,
  }).current;

  const onGrabMouseMove = e => {
    if (resizeInfo.moving) {
      const distanceX = e.clientX - resizeInfo.startX;
      resizeInfo.endX = e.clientX;
      if (testcaseGroupElement.current) {
        testcaseGroupElement.current.style.width = `${resizeInfo.startWidth + distanceX}px`;
      }
    }
  };

  const onGrabMouseUp = () => {
    if (resizeInfo.moving) {
      document.removeEventListener('mousemove', onGrabMouseMove);
      document.removeEventListener('mouseup', onGrabMouseUp);
      const width = resizeInfo.startWidth + (resizeInfo.endX - resizeInfo.startX);
      setTestcaseGroupWidth(width);
      resizeInfo.moving = false;
      resizeInfo.startX = null;
      resizeInfo.startWidth = null;

      if (layoutOptionKey?.length === 3) {
        setOption(layoutOptionKey[0], layoutOptionKey[1], layoutOptionKey[2], width);
      }
    }
  };

  const onGrabMouseDown = e => {
    if (!testcaseGroupElement.current) {
      return;
    }

    const rects = testcaseGroupElement.current.getClientRects();

    if (rects?.length < 1) {
      return;
    }

    document.addEventListener('mousemove', onGrabMouseMove);
    document.addEventListener('mouseup', onGrabMouseUp);

    resizeInfo.moving = true;
    resizeInfo.startX = e.clientX;
    resizeInfo.startWidth = rects[0].width;
  };

  return (
    <div className="flexible-layout-wrapper">
      <div
        className={`left-layout ${min ? 'min' : ''}`}
        ref={testcaseGroupElement}
        style={{
          width: `${testcaseGroupWidth || 300}px`,
        }}
      >
        {left}
      </div>
      <div className="grabber" onMouseDown={onGrabMouseDown} onMouseUp={onGrabMouseUp} onMouseMove={onGrabMouseMove} />
      <div className="right-layout">{right}</div>
    </div>
  );
}

FlexibleLayout.defaultProps = {
  min: false,
  left: null,
  right: null,
  layoutOptionKey: [],
};

FlexibleLayout.propTypes = {
  min: PropTypes.bool,
  left: PropTypes.node,
  right: PropTypes.node,
  layoutOptionKey: PropTypes.arrayOf(PropTypes.string),
};

export default FlexibleLayout;
