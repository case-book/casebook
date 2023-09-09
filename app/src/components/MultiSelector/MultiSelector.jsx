import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Tag } from '..';
import './MultiSelector.scss';

function MultiSelector({ className, onChange, placeholder, items, value, size, separator, maxWidth, minWidth, radius, disabled, onClick }) {
  const [open, setOpen] = useState(false);
  const [bottomList, setBottomList] = useState(true);

  const element = useRef(null);
  const list = useRef(null);

  const valueSet = useMemo(() => new Set(value.map(v => v.key)), [value]);

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

  return (
    <div
      ref={element}
      className={`multi-selector-wrapper g-no-select ${className} size-${size} ${radius ? 'radius' : ''} ${disabled ? 'disabled' : ''} ${open ? 'opened' : ''}`}
      style={{
        minWidth: `${minWidth}`,
        maxWidth: `${maxWidth}`,
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
        <div className="selector-selected-text">
          {valueSet.size === 0 && <span className="placeholder">{placeholder}</span>}
          {items
            .filter(item => valueSet.has(item.key))
            .map(item => (
              <Tag key={item.key} size={size}>
                {item.value}
              </Tag>
            ))}
        </div>
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
            {items.map(item => {
              return (
                <li key={item.key} className={valueSet.has(item.key) ? 'selected' : ''} onClick={() => onChange(_.xor([...valueSet], [item.key]))}>
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

MultiSelector.defaultProps = {
  className: '',
  placeholder: '',
  size: 'md',
  separator: true,
  minWidth: 'auto',
  maxWidth: 'auto',
  radius: false,
  disabled: false,
  value: '',
  items: [],
  onChange: PropTypes.func,
  onClick: null,
};

MultiSelector.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),

  size: PropTypes.string,
  separator: PropTypes.bool,
  minWidth: PropTypes.string,
  maxWidth: PropTypes.string,
  radius: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default MultiSelector;
