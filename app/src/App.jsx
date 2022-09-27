import React, { useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Common, Header, Login, Message, SpaceListPage } from '@/pages';
import SpacesRoutes from '@/pages/spaces';
import ProjectsRoutes from '@/pages/spaces/projects';
import UsersRoutes from '@/pages/users';
import { MENUS } from '@/constants/menu';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './App.scss';

function App() {
  const {
    themeStore: { setTheme },
    userStore: { isLogin, tried },
  } = useStores();

  const location = useLocation();
  const theme = MENUS.find(d => d.to === location.pathname)?.theme || 'black';

  useEffect(() => {
    setTheme(theme);
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
          <Header theme={theme} />
          <main className="main-content">
            {isLogin && (
              <TransitionGroup className="transition-group">
                <CSSTransition key={location.pathname} classNames="fade" timeout={500}>
                  <Routes location={location}>
                    <Route path="/" element={<SpaceListPage />} />
                    <Route path="/users/*" element={<UsersRoutes />} />
                    <Route path="/spaces/*" element={<SpacesRoutes />} />
                    <Route path="/projects/*" element={<ProjectsRoutes />} />
                    <Route path="*" element={<Message code="404" />} />
                  </Routes>
                </CSSTransition>
              </TransitionGroup>
            )}
            {!isLogin && <Login />}
          </main>
        </div>
      )}
    </div>
  );
}

export default observer(App);
