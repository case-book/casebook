import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './TargetSelector.scss';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';

function TargetSelector({ className, value, list, onClick }) {
  const {
    themeStore: { theme },
  } = useStores();
  const [opened, setOpened] = useState(false);
  const element = useRef(null);

  const text = list.find(d => d.key === value);

  const handleOutsideClick = event => {
    if (element.current && !element.current.contains(event.target)) {
      setOpened(false);
    }
  };

  useEffect(() => {
    if (opened) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [opened]);

  return (
    <div
      ref={element}
      className={`target-selector-wrapper ${className} ${opened ? 'opened' : ''} theme-${theme}`}
      onClick={() => {
        setOpened(!opened);
      }}
    >
      <div>
        <span className="selected-name">{text?.value}</span>
        <span className="icon">
          <i className="fa-solid fa-chevron-down" />
        </span>
      </div>

      {opened && (
        <div className="target-selector-list g-no-select scrollbar-sm">
          <ul>
            {list?.map(target => {
              return (
                <li
                  key={target.key}
                  className={target.key === value ? 'selected' : ''}
                  onClick={() => {
                    onClick(target.key);
                  }}
                >
                  <span>{target.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

TargetSelector.defaultProps = {
  className: '',
  value: '',
  list: [],
};

TargetSelector.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  list: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.string,
    }),
  ),
  onClick: PropTypes.func.isRequired,
};

export default observer(TargetSelector);
