import React from 'react';
import PropTypes from 'prop-types';
import './EmptyContent.scss';

function EmptyContent({ className, children }) {
  return (
    <div className={`empty-content-wrapper ${className}`}>
      <div>{children}</div>
    </div>
  );
}

EmptyContent.defaultProps = {
  className: '',
  children: '데이터가 없습니다.',
};

EmptyContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default EmptyContent;
