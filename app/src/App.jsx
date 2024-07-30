import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Common, Join, Login, Message, SetUpPage } from '@/pages';
import SpacesRoutes from '@/pages/spaces';
import UsersRoutes from '@/pages/users';
import useStores from '@/hooks/useStores';
import AdminRoutes from '@/pages/admin';
import ProjectsRoutes from '@/pages/spaces/projects';
import { Button, LogoIcon } from '@/components';
import { debounce } from 'lodash';
import './App.scss';
import { useTranslation } from 'react-i18next';
import GuestHeader from '@/pages/common/Header/GuestHeader';
import ApiRoutes from '@/pages/apis';
import SideBar from '@/assets/SideBar/SideBar';
import ProjectListPage from '@/pages/spaces/projects/ProjectListPage';

function App() {
  const {
    themeStore: { theme },
    userStore: { isLogin, tried },
    contextStore: { isProjectSelected },
    configStore: { setUp },
  } = useStores();

  const location = useLocation();
  const { t } = useTranslation();

  const setScreenSize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  const setScreenSizeDebounce = debounce(() => {
    setScreenSize();
  }, 200);

  useEffect(() => {
    setScreenSize();
    window.addEventListener('resize', setScreenSizeDebounce);

    return () => {
      setScreenSizeDebounce?.cancel();
      window.removeEventListener('resize', setScreenSizeDebounce);
    };
  }, []);

  useEffect(() => {
    document.querySelector('html').setAttribute('class', `theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    document.querySelector('body').classList.add('page-moving');
    setTimeout(() => {
      document.querySelector('body').classList.remove('page-moving');
    }, 100);
  }, [location.pathname]);

  return (
    <div className={`app-wrapper theme-${theme} ${isLogin && isProjectSelected ? 'project-selected' : ''}`}>
      <SideBar />
      <Common />
      {(tried === null || setUp == null) && (
        <div className="tried-content">
          <div>
            <div className="logo">
              <div>
                <LogoIcon className="logo-icon" size="md" />
                <div>CASEBOOK</div>
              </div>
            </div>
            {tried && setUp == null && (
              <div className="network-error">
                <div>{t('서버에 접속할 수 없습니다.')}</div>
                <div>
                  <Button
                    size="sm"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    {t('재시도')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {tried && setUp != null && !setUp && <SetUpPage />}
      {tried && setUp != null && setUp && (
        <div className="app-content">
          {!isLogin && <GuestHeader />}

          <main className="main-content">
            {isLogin && (
              <Routes location={location}>
                <Route path="/" element={<ProjectListPage />} />
                <Route path="/users/*" element={<UsersRoutes />} />
                <Route path="/spaces/*" element={<SpacesRoutes />} />
                <Route path="/projects/*" element={<ProjectsRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/apis/*" element={<ApiRoutes />} />
                <Route path="*" element={<Message code="404" />} />
              </Routes>
            )}
            {!isLogin && (
              <Routes location={location}>
                <Route path="/apis/*" element={<ApiRoutes />} />
                <Route path="/users/join" element={<Join />} />
                <Route path="*" element={<Login />} />
              </Routes>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default observer(App);
