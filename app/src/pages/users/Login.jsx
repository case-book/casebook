import React, { useState } from 'react';
import './Login.scss';
import { Button, CheckBox, Form, Input } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import useStores from '@/hooks/useStores';
import { setToken } from '@/utils/request';

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

  const onSubmit = e => {
    e.preventDefault();
    UserService.login(info, data => {
      setToken(data.token);
      userStore.setUser(data);
      navigate('/');
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-title">LOGIN</div>
        <Form onSubmit={onSubmit}>
          <div className="label">{t('이메일')}</div>
          <div className="input">
            <Input
              value={info.email}
              underline
              color="white"
              size="xxl"
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
              underline
              color="white"
              size="xxl"
              value={info.password}
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
                size="md"
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
            <Button type="submit" size="xl">
              로그인
            </Button>
          </div>
        </Form>
        {location.pathname !== '/users/login' && (
          <div className="message">
            <span>{t('로그인이 필요합니다.')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

Login.defaultProps = {};

Login.propTypes = {};

export default Login;
