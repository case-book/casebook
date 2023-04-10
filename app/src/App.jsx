import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Common, Header, Join, Login, Message, SetUpPage, SpaceListPage } from '@/pages';
import SpacesRoutes from '@/pages/spaces';
import UsersRoutes from '@/pages/users';
import useStores from '@/hooks/useStores';
import AdminRoutes from '@/pages/admin';
import ProjectsRoutes from '@/pages/spaces/projects';
import { Button, LogoIcon, Star } from '@/components';
import { debounce } from 'lodash';
import './App.scss';
import { useTranslation } from 'react-i18next';

function App() {
  const {
    themeStore: { theme },
    userStore: { isLogin, tried },
    configStore: { setUp },
  } = useStores();

  const location = useLocation();
  const { t } = useTranslation();

  const [starInfo, setStarInfo] = useState({
    star1: {
      top: -30,
      left: -20,
    },
    star2: {
      bottom: 0,
      right: 0,
    },
  });

  const setScreenSize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  const setScreenSizeDebounce = debounce(() => {
    setScreenSize();
  }, 200);

  useEffect(() => {
    setStarInfo({
      star1: {
        top: `-${25 + Math.round(Math.random() * 20)}%`,
        left: `-${20 + Math.round(Math.random() * 10)}%`,
      },
      star2: {
        bottom: `${-10 + Math.round(Math.random() * 10)}%`,
        right: `${-20 + Math.round(Math.random() * 20)}%`,
      },
    });

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
    <div className={`app-wrapper theme-${theme}`}>
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
          <Header />
          <main className="main-content">
            <div className="bg">
              <div
                className="star star-1"
                style={{
                  top: `${starInfo.star1.top}`,
                  left: `${starInfo.star1.left}`,
                }}
              >
                <Star />
              </div>
              <div
                className="star star-2"
                style={{
                  bottom: `${starInfo.star2.bottom}`,
                  right: `${starInfo.star2.right}`,
                }}
              >
                <Star />
              </div>
            </div>
            {isLogin && (
              <Routes location={location}>
                <Route path="/" element={<SpaceListPage />} />
                <Route path="/users/*" element={<UsersRoutes />} />
                <Route path="/spaces/*" element={<SpacesRoutes />} />
                <Route path="/projects/*" element={<ProjectsRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="*" element={<Message code="404" />} />
              </Routes>
            )}
            {!isLogin && (
              <Routes location={location}>
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
