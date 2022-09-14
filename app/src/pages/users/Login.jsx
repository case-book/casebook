import React, { useState } from 'react';
import './Login.scss';
import { Button, CheckBox, Form, Input, Logo } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import useStores from '@/hooks/useStores';

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
      userStore.setUser(data);
      navigate('/');
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <Form onSubmit={onSubmit}>
          <div className="logo-content">
            <div className="logo">
              <Logo icon={false} />
            </div>
          </div>
          <div className="label">{t('이메일')}</div>
          <div className="input">
            <Input
              value={info.email}
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
                size="sm"
                type="checkbox"
                value={info.activated}
                onChange={val =>
                  setInfo({
                    ...info,
                    activated: val,
                  })
                }
              />
            </div>
            <div>{t('자동 로그인')}</div>
          </div>
          <div className="button">
            <Button type="submit" outline>
              로그인
            </Button>
          </div>
        </Form>
        {location.pathname !== '/users/login' && <div className="message">로그인이 필요합니다.</div>}
      </div>
    </div>
  );
}

Login.defaultProps = {};

Login.propTypes = {};

export default Login;
