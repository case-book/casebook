import React from 'react';
import PropTypes from 'prop-types';
import './CardContent.scss';

function CardContent({ className, children, scroll, horizontal }) {
  return (
    <div className={`card-content-wrapper ${className} ${scroll ? 'scrollable' : ''} ${horizontal ? 'horizontal' : ''}`}>
      <div>{children}</div>
    </div>
  );
}

CardContent.defaultProps = {
  className: '',
  scroll: false,
  horizontal: false,
};

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  scroll: PropTypes.bool,
  horizontal: PropTypes.bool,
};

export default CardContent;
