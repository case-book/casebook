import React from 'react';
import PropTypes from 'prop-types';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './Page.scss';

function Page({ className, children, colored, list, wide, pure }) {
  const {
    themeStore: { theme },
    controlStore: { hideHeader },
  } = useStores();

  return (
    <div
      className={`page-wrapper ${className} ${colored ? 'colored' : ''} ${list ? 'list-page' : 'info-page'} ${wide ? 'wide' : ''} ${pure ? 'pure-page' : ''} theme-${theme} ${
        hideHeader ? 'hide-header' : ''
      }`}
    >
      {children}
    </div>
  );
}

Page.defaultProps = {
  className: '',
  children: '',
  colored: false,
  list: false,
  wide: false,
  pure: false,
};

Page.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  colored: PropTypes.bool,
  list: PropTypes.bool,
  wide: PropTypes.bool,
  pure: PropTypes.bool,
};

export default observer(Page);
