import React, { useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Common, Header, Join, Login, Message, SpaceListPage } from '@/pages';
import SpacesRoutes from '@/pages/spaces';
import ProjectsRoutes from '@/pages/spaces/projects';
import UsersRoutes from '@/pages/users';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './App.scss';
import ConfigsRoutes from '@/pages/configs';
import { Star } from '@/components';

function App() {
  const {
    themeStore: { theme },
    userStore: { isLogin, tried },
  } = useStores();

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').setAttribute('class', `theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    document.querySelector('body').classList.add('page-moving');
    setTimeout(() => {
      document.querySelector('body').classList.remove('page-moving');
    }, 1000);
  }, [location.pathname]);

  return (
    <div className={`app-wrapper theme-${theme}`}>
      <Common />
      {tried && (
        <div className="app-content">
          <Header />
          <main className="main-content">
            <div className="bg">
              <div className="star star-1">
                <Star />
              </div>
              <div className="star star-2">
                <Star />
              </div>
            </div>
            {isLogin && (
              <Routes location={location}>
                <Route path="/" element={<SpaceListPage />} />
                <Route path="/users/*" element={<UsersRoutes />} />
                <Route path="/spaces/*" element={<SpacesRoutes />} />
                <Route path="/projects/*" element={<ProjectsRoutes />} />
                <Route path="/configs/*" element={<ConfigsRoutes />} />
                <Route path="*" element={<Message code="404" />} />
              </Routes>
            )}
            {!isLogin && (
              <TransitionGroup className="transition-group">
                <CSSTransition key={location.pathname} classNames="fade" timeout={500}>
                  <Routes location={location}>
                    <Route path="/users/join" element={<Join />} />
                    <Route path="*" element={<Login />} />
                  </Routes>
                </CSSTransition>
              </TransitionGroup>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default observer(App);
