import React from 'react';
import PropTypes from 'prop-types';
import './CardContent.scss';

function CardContent({ className, children, scroll }) {
  return (
    <div className={`card-content-wrapper ${className} ${scroll ? 'scrollable' : ''}`}>
      <div>{children}</div>
    </div>
  );
}

CardContent.defaultProps = {
  className: '',
  scroll: false,
};

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  scroll: PropTypes.bool,
};

export default CardContent;
