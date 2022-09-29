import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Form, Input, Label, Page, PageButtons, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import dialogUtil from '@/utils/dialogUtil';
import useStores from '@/hooks/useStores';
import { getOption } from '@/utils/storageUtil';

const labelMinWidth = '100px';

function Join() {
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
    privacy: false,
    terms: false,
    recommendationInfo: getOption('user', 'info', 'recommendation') || '',
  });

  const onSubmit = e => {
    e.preventDefault();
    const next = { ...userInfo };

    if (next.password !== next.passwordConfirm) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '비밀번호 불일치', '입력하신 비밀번호가 일치하지 않습니다.');
      return;
    }

    UserService.join(next, data => {
      userStore.setUser(data);
      navigate('/');
    });
  };

  return (
    <Page className="oauth-register-wrapper">
      <PageTitle>{t('사용자 등록')}</PageTitle>
      <PageContent>
        <Form className="form" onSubmit={onSubmit}>
          <div className="register-content">
            <Block className="block">
              <BlockRow>
                <Label size="lg" minWidth={labelMinWidth} required>
                  {t('이메일')}
                </Label>
                <Input
                  type="email"
                  size="lg"
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
              </BlockRow>
              <BlockRow>
                <Label size="lg" minWidth={labelMinWidth} required>
                  {t('비밀번호')}
                </Label>
                <Input
                  type="password"
                  size="lg"
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
              </BlockRow>
              <BlockRow>
                <Label size="lg" minWidth={labelMinWidth} required>
                  {t('비밀번호')}
                </Label>
                <Input
                  type="password"
                  size="lg"
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
              </BlockRow>
              <BlockRow>
                <Label size="lg" minWidth={labelMinWidth}>
                  {t('이름')}
                </Label>
                <Input
                  type="text"
                  size="lg"
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
              </BlockRow>
            </Block>
            <PageButtons
              className="page-button"
              onList={() => {
                navigate('/');
              }}
              onListText="취소"
              onSubmit={() => {}}
              onSubmitText="회원가입"
            />
          </div>
        </Form>
      </PageContent>
    </Page>
  );
}

export default observer(Join);
