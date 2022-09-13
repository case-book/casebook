import React from 'react';
import PropTypes from 'prop-types';
import './Tabs.scss';
import { KeyValuePropTypes } from '@/proptypes';

function Tabs({ className, tabs, value, onSelect }) {
  return (
    <div className={`tabs-wrapper ${className}`}>
      <div>
        {tabs?.length > 0 && (
          <ul>
            {tabs.map((tab, inx) => {
              return (
                <li
                  key={inx}
                  className={`${value === tab.key ? 'selected' : ''}`}
                  onClick={() => {
                    if (onSelect) {
                      onSelect(tab.key);
                    }
                  }}
                >
                  {tab.value}
                  <div className="line" />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

Tabs.defaultProps = {
  className: '',
  tabs: [],
  value: null,
  onSelect: null,
};

Tabs.propTypes = {
  className: PropTypes.string,
  tabs: KeyValuePropTypes,
  value: PropTypes.string,
  onSelect: PropTypes.func,
};

export default Tabs;
