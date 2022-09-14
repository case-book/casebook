import React from 'react';
import PropTypes from 'prop-types';
import './Page.scss';
import useStores from '@/hooks/useStores';

function Page({ className, children, colored, list }) {
  const {
    themeStore: { theme },
  } = useStores();

  return <div className={`page-wrapper ${className} ${colored ? 'colored' : ''} ${list ? 'list-page' : ''}  theme-${theme}`}>{children}</div>;
}

Page.defaultProps = {
  className: '',
  children: '',
  colored: false,
  list: false,
};

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  colored: PropTypes.bool,
  list: PropTypes.bool,
};

export default Page;
