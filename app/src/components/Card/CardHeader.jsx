import React from 'react';
import PropTypes from 'prop-types';
import './CardHeader.scss';

function CardHeader({ className, children, control }) {
  return (
    <div className={`card-header-wrapper ${className}`}>
      <div className="card-header-content">{children}</div>
      {control && <div className="card-header-control">{control}</div>}
    </div>
  );
}

CardHeader.defaultProps = {
  className: '',
  control: null,
};

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  control: PropTypes.node,
};

export default CardHeader;
