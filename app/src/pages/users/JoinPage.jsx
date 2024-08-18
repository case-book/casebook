import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from '@/components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import dialogUtil from '@/utils/dialogUtil';
import useStores from '@/hooks/useStores';
import { setToken } from '@/utils/request';
import './JoinPage.scss';

function JoinPage() {
  const { userStore } = useStores();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    alias: '',
    country: 'KR',
    language: 'ko',
    password: '',
    passwordConfirm: '',
  });

  const onSubmit = e => {
    e.preventDefault();
    const next = { ...userInfo };

    if (next.password !== next.passwordConfirm) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('비밀번호 불일치'), t('입력하신 비밀번호가 일치하지 않습니다.'));
      return;
    }

    UserService.join(next, data => {
      setToken(data.token);
      userStore.setUser(data);
      navigate('/');
    });
  };

  return (
    <div className="join-wrapper">
      <div className="join-box">
        <div className="join-title">JOIN</div>
        <Form onSubmit={onSubmit}>
          <div className="label">{t('이메일')}</div>
          <div className="input">
            <Input
              type="email"
              underline
              required
              placeholder="이메일"
              value={userInfo.email}
              onChange={val =>
                setUserInfo({
                  ...userInfo,
                  email: val,
                })
              }
              minLength={1}
            />
          </div>
          <div className="label">{t('이름')}</div>
          <div className="input">
            <Input
              type="text"
              underline
              required
              placeholder="이름"
              value={userInfo.name}
              onChange={val =>
                setUserInfo({
                  ...userInfo,
                  name: val,
                })
              }
              minLength={1}
            />
          </div>
          <div className="label">{t('비밀번호')}</div>
          <div className="input">
            <Input
              type="password"
              underline
              required
              placeholder="비밀번호"
              value={userInfo.password}
              onChange={val =>
                setUserInfo({
                  ...userInfo,
                  password: val,
                })
              }
              minLength={1}
            />
          </div>
          <div className="label">{t('비밀번호')}</div>
          <div className="input">
            <Input
              type="password"
              underline
              required
              placeholder="비밀번호 확인"
              value={userInfo.passwordConfirm}
              onChange={val =>
                setUserInfo({
                  ...userInfo,
                  passwordConfirm: val,
                })
              }
              minLength={1}
            />
          </div>
          <div className="button">
            <Button type="submit" color="primary" size="md">
              {t('회원 가입')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default observer(JoinPage);
