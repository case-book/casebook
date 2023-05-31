import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Liner, TargetSelector } from '@/components';
import { STATIC_MENUS } from '@/constants/menu';
import { useTranslation } from 'react-i18next';
import ProjectService from '@/services/ProjectService';
import { THEMES } from '@/constants/constants';
import './Menu.scss';

function MainMenu({ className, closeMobileMenu }) {
  const {
    userStore: { user },
    themeStore: { theme },
    contextStore: { spaceCode, projectId, isProjectSelected, isSpaceSelected, refreshProjectTime },
  } = useStores();

  const navigate = useNavigate();

  const location = useLocation();

  const timer = useRef(null);

  const { t } = useTranslation();

  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    const spaceCodeRegex = /^[A-Z\d_-]+$/;

    if (spaceCodeRegex.test(spaceCode)) {
      ProjectService.selectProjectList(
        spaceCode,
        list => {
          setProjectList(list);
        },
        () => {
          return true;
        },
        false,
      );
    }
  }, [spaceCode, refreshProjectTime]);

  const [menuAlert, setMenuAlert] = useState({
    inx: null,
    message: '',
  });

  return (
    <ul className={`main-menu-wrapper common-menu-wrapper ${isProjectSelected ? 'project-selected' : ''} ${className}`}>
      {STATIC_MENUS.filter(d => d.pc)
        .filter(d => !d.admin || (d.admin && user.activeSystemRole === 'ROLE_ADMIN'))
        .map((d, inx) => {
          const isSelected = d.selectedAlias.reduce((p, c) => {
            return p || c.test(location.pathname);
          }, false);

          return (
            <li
              key={inx}
              className={`${isSelected ? 'selected' : ''} ${d.key}`}
              style={{
                animationDelay: `${inx * 0.1}s`,
              }}
            >
              <Link
                className="menu-item"
                to="/"
                onClick={e => {
                  e.preventDefault();
                  if (d.prefixSpace) {
                    if (isSpaceSelected) {
                      if (closeMobileMenu) {
                        closeMobileMenu();
                      }
                      navigate(`/spaces/${spaceCode}${d.to}`);
                    } else {
                      setMenuAlert({
                        inx,
                        message: t('스페이스를 먼저 선택해주세요.'),
                      });

                      if (timer.current) {
                        clearTimeout(timer.current);
                        timer.current = null;
                      }

                      timer.current = setTimeout(() => {
                        timer.current = null;
                        setMenuAlert({
                          inx: null,
                          message: '',
                        });
                      }, 2000);
                    }
                  } else {
                    if (!d.list) {
                      navigate(d.to);
                    }
                    if (closeMobileMenu) {
                      closeMobileMenu();
                    }
                  }
                }}
              >
                <span className="text">{d.name}</span>
                {menuAlert.inx === inx && (
                  <span className="alert-message">
                    <div />
                    {menuAlert.message}
                  </span>
                )}
                {d.list?.length > 0 && (
                  <ul className="sub-menu-list">
                    {d.list?.map(sub => {
                      return (
                        <li
                          key={sub.key}
                          onClick={() => {
                            navigate(`${d.to}${sub.to}`);
                          }}
                        >
                          {sub.name}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Link>
              {d.key === 'space' && isSpaceSelected && (
                <TargetSelector
                  className="target-select"
                  value={spaceCode}
                  list={user?.spaces?.map(space => {
                    return {
                      key: space.code,
                      value: space.name,
                    };
                  })}
                  onClick={value => {
                    navigate(`/spaces/${value}/projects`);
                  }}
                />
              )}
              {d.key === 'project' && isProjectSelected && (
                <TargetSelector
                  className="target-select"
                  value={Number(projectId)}
                  list={projectList?.map(project => {
                    return {
                      key: project.id,
                      value: project.name,
                    };
                  })}
                  onClick={value => {
                    navigate(`/spaces/${spaceCode}/projects/${value}`);
                  }}
                />
              )}
              <Liner className="liner" display="inline-block" width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 12px" />
            </li>
          );
        })}
    </ul>
  );
}

MainMenu.defaultProps = {
  className: '',
  closeMobileMenu: null,
};

MainMenu.propTypes = {
  className: PropTypes.string,
  closeMobileMenu: PropTypes.func,
};

export default observer(MainMenu);
