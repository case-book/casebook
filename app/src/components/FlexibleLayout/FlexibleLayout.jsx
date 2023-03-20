import React, { useRef, useState } from 'react';
import { getOption, setOption } from '@/utils/storageUtil';
import './FlexibleLayout.scss';
import PropTypes from 'prop-types';

function FlexibleLayout({ min, left, right, layoutOptionKey, vertical, className, defaultSize }) {
  const [testcaseGroupSize, setTestcaseGroupSize] = useState(() => {
    if (layoutOptionKey?.length === 3) {
      let option = getOption(layoutOptionKey[0], layoutOptionKey[1], layoutOptionKey[2]);

      if (vertical && option && window.innerHeight - 250 < option) {
        option = window.innerHeight - 250;
      }

      return option ? `${option}px` : defaultSize;
    }

    return defaultSize;
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
      if (vertical) {
        const distanceY = e.clientY - resizeInfo.startY;
        resizeInfo.endY = e.clientY;
        if (testcaseGroupElement.current) {
          testcaseGroupElement.current.style.height = `${resizeInfo.startHeight + distanceY}px`;
        }
      } else {
        const distanceX = e.clientX - resizeInfo.startX;
        resizeInfo.endX = e.clientX;
        if (testcaseGroupElement.current) {
          testcaseGroupElement.current.style.width = `${resizeInfo.startWidth + distanceX}px`;
        }
      }
    }
  };

  const onGrabMouseUp = () => {
    if (resizeInfo.moving) {
      document.removeEventListener('mousemove', onGrabMouseMove);
      document.removeEventListener('mouseup', onGrabMouseUp);

      if (vertical) {
        const height = resizeInfo.startHeight + (resizeInfo.endY - resizeInfo.startY);
        setTestcaseGroupSize(`${height}px`);
        resizeInfo.moving = false;
        resizeInfo.startY = null;
        resizeInfo.startHeight = null;

        if (layoutOptionKey?.length === 3) {
          setOption(layoutOptionKey[0], layoutOptionKey[1], layoutOptionKey[2], height);
        }
      } else {
        const width = resizeInfo.startWidth + (resizeInfo.endX - resizeInfo.startX);
        setTestcaseGroupSize(`${width}px`);
        resizeInfo.moving = false;
        resizeInfo.startX = null;
        resizeInfo.startWidth = null;

        if (layoutOptionKey?.length === 3) {
          setOption(layoutOptionKey[0], layoutOptionKey[1], layoutOptionKey[2], width);
        }
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

    if (vertical) {
      resizeInfo.moving = true;
      resizeInfo.startY = e.clientY;
      resizeInfo.startHeight = rects[0].height;
    } else {
      resizeInfo.moving = true;
      resizeInfo.startX = e.clientX;
      resizeInfo.startWidth = rects[0].width;
    }
  };

  return (
    <div className={`flexible-layout-wrapper ${vertical ? 'vertical' : 'horizontal'} ${className}`}>
      <div
        className={`left-layout ${min ? 'min' : ''}`}
        ref={testcaseGroupElement}
        style={
          vertical
            ? {
                height: testcaseGroupSize,
              }
            : {
                width: testcaseGroupSize,
              }
        }
      >
        {left}
      </div>
      <div className="grabber" onMouseDown={onGrabMouseDown} onMouseUp={onGrabMouseUp} onMouseMove={onGrabMouseMove} />
      <div
        className="right-layout"
        style={
          vertical
            ? {
                height: `calc(100% - ${testcaseGroupSize})`,
              }
            : {
                width: `calc(100% - ${testcaseGroupSize})`,
              }
        }
      >
        <div>{right}</div>
      </div>
    </div>
  );
}

FlexibleLayout.defaultProps = {
  className: '',
  min: false,
  left: null,
  right: null,
  layoutOptionKey: [],
  vertical: false,
  defaultSize: '300px',
};

FlexibleLayout.propTypes = {
  className: PropTypes.string,
  min: PropTypes.bool,
  left: PropTypes.node,
  right: PropTypes.node,
  layoutOptionKey: PropTypes.arrayOf(PropTypes.string),
  vertical: PropTypes.bool,
  defaultSize: PropTypes.string,
};

export default FlexibleLayout;
