import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import { Button, UserContentViewer } from '@/components';
import './DescriptionTooltip.scss';

function DescriptionTooltip({ className, icon, onClick, title, text, opened, clipboard, parentElement, onClose, type }) {
  const [copied, setCopied] = useState(false);
  const [leftList, setLeftList] = useState(true);
  const tooltip = useRef(null);
  const element = useRef(null);

  const handleOutsideClick = event => {
    if (tooltip.current && !tooltip.current.contains(event.target) && element.current && !element.current.contains(event.target)) {
      if (onClose) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (opened) {
      document.addEventListener('mousedown', handleOutsideClick);

      if (parentElement?.current) {
        const elementRect = parentElement.current.getClientRects();
        if (elementRect.length > 0) {
          const tooltipRect = tooltip.current.getClientRects();

          if (elementRect[0].right > tooltipRect[0].right + 400) {
            setLeftList(true);
          } else {
            setLeftList(false);
          }
        }
      }
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [opened]);

  return (
    <span
      className={`${className} description-tooltip-wrapper`}
      ref={element}
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      {icon}
      {opened && (
        <div ref={tooltip} className={`${leftList ? 'left' : 'right'} description-tooltip`} onClick={e => e.stopPropagation()}>
          <div className="arrow" />
          <div className="tooltip-title">
            <span>{title}</span>
            {clipboard && (
              <span className="copy-button g-no-select">
                <Button
                  size="xs"
                  onClick={e => {
                    e.stopPropagation();
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 1000);
                    copy(text);
                  }}
                >
                  <span className="copy-text">{copied ? '복사됨' : '복사'}</span>
                </Button>
              </span>
            )}
          </div>
          {type === 'EDITOR' && <UserContentViewer content={text} />}
          {type !== 'EDITOR' && <div className="description-text">{text}</div>}
        </div>
      )}
    </span>
  );
}

DescriptionTooltip.defaultProps = {
  className: '',
  title: '',
  text: '',
  opened: false,
  clipboard: false,
  parentElement: null,
  onClose: null,
  type: null,
};

DescriptionTooltip.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  opened: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  clipboard: PropTypes.bool,
  onClose: PropTypes.func,
  parentElement: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  type: PropTypes.string,
};

export default DescriptionTooltip;
