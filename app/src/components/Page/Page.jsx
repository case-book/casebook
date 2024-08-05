import React from 'react';
import PropTypes from 'prop-types';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './Page.scss';

function Page({ className, children, colored, list }) {
  const {
    themeStore: { theme },
  } = useStores();

  return <div className={`page-wrapper ${className} ${colored ? 'colored' : ''} ${list ? 'list-page' : 'info-page'} theme-${theme}`}>{children}</div>;
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

export default observer(Page);
