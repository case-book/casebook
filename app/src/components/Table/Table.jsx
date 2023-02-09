import React from 'react';
import PropTypes from 'prop-types';
import './Table.scss';

function Table({ className, children, cols, border, size }) {
  return (
    <table className={`table-wrapper ${className} ${border ? 'table-border' : ''} size-${size}`}>
      {cols && cols?.length > 0 && (
        <colgroup>
          {cols.map((value, inx) => {
            if (value) {
              return <col key={inx} style={{ width: String(value) }} />;
            }
            return <col key={inx} />;
          })}
        </colgroup>
      )}
      {children}
    </table>
  );
}

Table.defaultProps = {
  className: '',
  cols: [],
  border: false,
  size: 'md',
};

Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  cols: PropTypes.arrayOf(PropTypes.string),
  border: PropTypes.bool,
  size: PropTypes.string,
};

export default Table;
