import React from 'react';
import PropTypes from 'prop-types';
import './Version.scss';
import { Link } from 'react-router-dom';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import { THEMES } from '@/constants/constants';
import { Liner } from '@/components';

function Version({ className }) {
  const {
    configStore: { version, openReleasePopup },
    themeStore: { theme },
  } = useStores();

  return (
    <div className={`version-wrapper ${className}`}>
      <div>
        <div className="app-version">
          <a href="https://github.com/case-book/casebook/releases" target="_blank" rel="noreferrer">
            CASEBOOK {version?.version}
          </a>
        </div>
        <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 8px" />
        <div className="list-link">
          <Link
            to="/"
            onClick={e => {
              e.preventDefault();
              openReleasePopup();
            }}
          >
            RELEASE LIST
          </Link>
          <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 8px" />
          <Link to="/apis">APIS</Link>
          <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 8px" />
          <Link to="/start">
            <i className="fa-solid fa-circle-info" />
          </Link>
        </div>
      </div>
    </div>
  );
}

Version.defaultProps = {
  className: '',
};

Version.propTypes = {
  className: PropTypes.string,
};

export default observer(Version);
