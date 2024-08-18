import React, { useState } from 'react';
import { Button, CheckBox, Form, Info, Input } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import useStores from '@/hooks/useStores';
import { setToken } from '@/utils/request';
import './LoginPage.scss';

function LoginPage() {
  const { t } = useTranslation();

  const { userStore } = useStores();

  const navigate = useNavigate();

  const location = useLocation();

  const [info, setInfo] = useState({
    email: '',
    password: '',
    autoLogin: false,
  });

  const getUserNotificationCount = () => {
    UserService.getUserNotificationCount(count => {
      userStore.setNotificationCount(count);
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    UserService.login(info, data => {
      setToken(data.token, data.refreshToken);
      userStore.setUser(data);
      getUserNotificationCount();

      if (location.pathname === '/users/login' || location.pathname === '/users/join') {
        navigate('/');
      }
    });
  };

  return (
    <div className="login-wrapper">
      <div>
        {location.pathname !== '/users/login' && location.pathname !== '/users/join' && (
          <div className="message">
            <Info color="danger">
              <span>{t('로그인이 필요한 페이지입니다.')}</span>
            </Info>
          </div>
        )}
        <div className="login-box">
          <div className="login-title">LOGIN</div>
          <Form onSubmit={onSubmit}>
            <div className="label">{t('이메일')}</div>
            <div className="input">
              <Input
                type="email"
                value={info.email}
                placeholder={t('이메일 주소를 입력해주세요.')}
                size="md"
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
                size="md"
                underline
                value={info.password}
                placeholder={t('비밀번호를 입력해주세요.')}
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
                  size="sm"
                  type="checkbox"
                  value={info.autoLogin}
                  label={t('자동 로그인')}
                  onChange={val =>
                    setInfo({
                      ...info,
                      autoLogin: val,
                    })
                  }
                />
              </div>
            </div>
            <div className="button">
              <Button type="submit" color="primary" size="md">
                {t('로그인')}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

LoginPage.defaultProps = {};

LoginPage.propTypes = {};

export default LoginPage;
