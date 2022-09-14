import React from 'react';
import PropTypes from 'prop-types';
import './PageContent.scss';

function PageContent({ className, children }) {
  return <div className={`page-content-wrapper ${className}`}>{children}</div>;
}

PageContent.defaultProps = {
  className: '',
  children: '',
};

PageContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default PageContent;
