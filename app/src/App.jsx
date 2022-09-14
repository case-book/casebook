import './App.scss';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Common, Header, Login, Message, Spaces } from '@/pages';
import SpacesRoutes from '@/pages/spaces';
import ProjectsRoutes from '@/pages/projects';
import UsersRoutes from '@/pages/users';
import { MENUS } from '@/constants/menu';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';

function App() {
  const {
    themeStore: { setTheme },
    userStore: { isLogin },
  } = useStores();

  const location = useLocation();
  const theme = MENUS.find(d => d.to === location.pathname)?.theme || 'white';

  useEffect(() => {
    setTheme(theme);
    document.querySelector('html').setAttribute('class', `theme-${theme}`);
  }, [theme]);

  return (
    <div className={`app-wrapper theme-${theme}`}>
      <Common />
      <div className="back">
        <div />
      </div>
      <div className="app-content">
        <Header theme={theme} />
        <main className="main-content">
          {isLogin && (
            <Routes>
              <Route path="/" element={<Spaces />} />
              <Route path="/users/*" element={<UsersRoutes />} />
              <Route path="/spaces/*" element={<SpacesRoutes />} />
              <Route path="/projects/*" element={<ProjectsRoutes />} />
              <Route path="/404" element={<Message code="404" />} />
            </Routes>
          )}
          {!isLogin && <Login />}
        </main>
      </div>
    </div>
  );
}

export default observer(App);
