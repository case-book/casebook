import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Selector.scss';

function Selector({ className, onChange, items, value, addAll, size, separator, minWidth, radius, disabled, onClick }) {
  const [open, setOpen] = useState(false);
  const [bottomList, setBottomList] = useState(true);

  const element = useRef(null);
  const list = useRef(null);

  const handleOutsideClick = event => {
    if (element.current && !element.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);

      if (element.current) {
        const elementRect = element.current.getClientRects();
        if (elementRect.length > 0) {
          const gab = window.innerHeight - elementRect[0].top;
          if (gab < 200) {
            setBottomList(false);
          } else {
            setBottomList(true);
          }
        }
      }

      if (list.current) {
        const selectedItem = list.current.querySelector('.selected');
        if (selectedItem) {
          list.current.scrollTop = selectedItem.offsetTop;
        }
      }
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);

  let selectedItem = items.find(item => String(item.key) === String(value));
  if (addAll && value === '') {
    selectedItem = {
      key: '',
      value: 'ALL',
    };
  }

  return (
    <div
      ref={element}
      className={`selector-wrapper g-no-select ${className} size-${size} ${radius ? 'radius' : ''} ${disabled ? 'disabled' : ''} ${open ? 'opened' : ''}`}
      style={{
        minWidth: `${minWidth}`,
      }}
      onClick={e => {
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {open && (
        <div
          className="selector-overlay g-overlay"
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
      <div
        className={`${open ? 'open' : ''} selector-current`}
        onClick={() => {
          if (!disabled) {
            setOpen(!open);
          }
        }}
      >
        <span className="selector-selected-text">{selectedItem ? selectedItem.value : ' '}</span>
        {separator && (
          <span className="liner">
            <span />
          </span>
        )}
        <span className="icon">
          <i className={`fas fa-chevron-${open ? 'up' : 'down'} normal`} />
          <i className={`fas fa-chevron-${open ? 'up' : 'down'} hover`} />
        </span>
      </div>
      {open && (
        <div ref={list} className={`${open ? 'd-block' : 'd-none'} ${bottomList ? '' : 'bottom-top'} selector-list scrollbar-sm`}>
          <ul>
            {addAll && (
              <li
                className={value === '' ? 'selected' : ''}
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
              >
                <span className="select-arrow" />
                ALL
              </li>
            )}
            {items.map(item => {
              return (
                <li
                  key={item.key}
                  className={value === item.key ? 'selected' : ''}
                  onClick={() => {
                    onChange(item.key);
                    setOpen(false);
                  }}
                >
                  <span className="select-arrow" />
                  {item.value}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

Selector.defaultProps = {
  className: '',
  addAll: false,

  size: 'md',
  separator: true,
  minWidth: 'auto',
  radius: false,
  disabled: false,
  value: '',
  items: [],
  onChange: PropTypes.func,
  onClick: null,
};

Selector.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  addAll: PropTypes.bool,

  size: PropTypes.string,
  separator: PropTypes.bool,
  minWidth: PropTypes.string,
  radius: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Selector;
