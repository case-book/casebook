import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Common, Header, Join, Login, Message, SpaceListPage } from '@/pages';
import SpacesRoutes from '@/pages/spaces';
import ProjectsRoutes from '@/pages/spaces/projects';
import UsersRoutes from '@/pages/users';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import ConfigsRoutes from '@/pages/configs';
import { Star } from '@/components';
import Roulette from './Roulette';
import './App.scss';

function App() {
  const {
    themeStore: { theme },
    userStore: { isLogin, tried },
  } = useStores();

  const location = useLocation();

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
  }, []);

  useEffect(() => {
    document.querySelector('html').setAttribute('class', `theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    document.querySelector('body').classList.add('page-moving');
    setTimeout(() => {
      document.querySelector('body').classList.remove('page-moving');
    }, 1000);
  }, [location.pathname]);

  const roulette = true;

  return (
    <div className={`app-wrapper theme-${theme}`}>
      {roulette && <Roulette />}
      <Common />
      {!roulette && tried && (
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
