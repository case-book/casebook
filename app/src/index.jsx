import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import '@/configurations/i18n';
// import AgentA from '@kakao/matrix-agenta';
import AgentA from './agenta';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/global.scss';
import './index.scss';
import 'split-pane-react/esm/themes/default.css';

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.REACT_APP_SENTRY_RELEASE || '',
    maxBreadcrumbs: 50,
    debug: true,
    tracesSampleRate: 0.05,
  });
}

console.log(AgentA);

AgentA.init({
  debug: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
