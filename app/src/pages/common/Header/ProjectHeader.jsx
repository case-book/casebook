import React, { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components';
import ProjectMenu from '@/pages/common/Header/ProjectMenu';
import UserHeaderControl from '@/pages/common/Header/UserHeaderControl';
import './Menu.scss';
import './ProjectHeader.scss';
import MobileMenu from '@/pages/common/Header/MobileMenu';

function ProjectHeader({ className }) {
  const {
    themeStore: { theme },
  } = useStores();

  const navigate = useNavigate();
  const location = useLocation();
  const isRoot = location.pathname === '/';
  const [open, setOpen] = useState(false);

  return (
    <header className={`${className} g-no-select project-header-wrapper ${isRoot ? 'is-main' : ''} theme-${theme}`}>
      <div className="header-content">
        <div className="mobile-menu">
          <div
            onClick={() => {
              setOpen(!open);
            }}
          >
            <div>
              <i className="fa-solid fa-bars" />
            </div>
          </div>
        </div>
        {open && <MobileMenu className="mobile-menu-list" setOpen={setOpen} />}
        <div className={`back-navigator ${isRoot ? 'is-root' : ''}`}>
          <div
            onClick={() => {
              navigate(-1);
            }}
          >
            <div>
              <i className="fa-solid fa-chevron-left" />
            </div>
          </div>
        </div>
        <div className="logo">
          <Logo
            animation={false}
            onClick={() => {
              navigate('/');
            }}
          />
        </div>
        <ProjectMenu className="project-menu" />
        <UserHeaderControl className="user-header-control" />
      </div>
    </header>
  );
}

ProjectHeader.defaultProps = {
  className: '',
};

ProjectHeader.propTypes = {
  className: PropTypes.string,
};

export default observer(ProjectHeader);
