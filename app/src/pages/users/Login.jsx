import React, { useState } from 'react';
import { Button, CheckBox, Form, Input, LogoIcon } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import useStores from '@/hooks/useStores';
import { setToken } from '@/utils/request';
import './Login.scss';

function Login() {
  const { t } = useTranslation();

  const { userStore } = useStores();

  const navigate = useNavigate();

  const location = useLocation();

  const [info, setInfo] = useState({
    email: '',
    password: '',
    autoLogin: true,
  });

  const getUserNotificationCount = () => {
    UserService.getUserNotificationCount(count => {
      userStore.setNotificationCount(count);
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    UserService.login(info, data => {
      setToken(data.token);
      userStore.setUser(data);
      getUserNotificationCount();
      navigate('/');
    });
  };

  return (
    <div className="login-wrapper">
      <div>
        <div className="login-box">
          <div className="logo">
            <LogoIcon />
          </div>
          <div className="login-title">LOGIN</div>
          <Form onSubmit={onSubmit}>
            <div className="label">{t('이메일')}</div>
            <div className="input">
              <Input
                type="email"
                value={info.email}
                placeholder={t('이메일')}
                size="lg"
                underline
                onChange={val =>
                  setInfo({
                    ...info,
                    email: val,
                  })
                }
                required
                minLength={1}
              />
            </div>
            <div className="label">{t('비밀번호')}</div>
            <div className="input">
              <Input
                type="password"
                size="lg"
                underline
                value={info.password}
                placeholder={t('비밀번호')}
                autoComplete="current-password"
                onChange={val =>
                  setInfo({
                    ...info,
                    password: val,
                  })
                }
                required
                minLength={1}
              />
            </div>
            <div className="auto-login">
              <div>
                <CheckBox
                  disabled
                  size="xs"
                  type="checkbox"
                  value={info.activated}
                  label={t('자동 로그인')}
                  onChange={val =>
                    setInfo({
                      ...info,
                      activated: val,
                    })
                  }
                />
              </div>
            </div>
            <div className="button">
              <Button type="submit" color="yellow" size="md">
                {t('로그인')}
              </Button>
            </div>
          </Form>
          {location.pathname !== '/users/login' && location.pathname !== '/users/join' && (
            <div className="message">
              <span>{t('로그인이 필요합니다.')}</span>
            </div>
          )}
        </div>
        <div className="join">
          <Link to="/users/join">{t('새로운 사용자 등록')}</Link>
        </div>
      </div>
    </div>
  );
}

Login.defaultProps = {};

Login.propTypes = {};

export default Login;
