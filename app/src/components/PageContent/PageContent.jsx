import React from 'react';
import PropTypes from 'prop-types';
import './PageContent.scss';

function PageContent({ className, children, flex }) {
  return <div className={`page-content-wrapper ${className} ${flex ? 'flex' : ''}`}>{children}</div>;
}

PageContent.defaultProps = {
  className: '',
  children: '',
  flex: false,
};

PageContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  flex: PropTypes.bool,
};

export default PageContent;
