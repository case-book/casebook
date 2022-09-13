import React, { useState } from 'react';
import './Login.scss';
import { Block, CheckBox, Form, Input, Label, Page, PageButtons, PageContent } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UserService from '@/services/UserService';

import BlockRow from '@/components/BlockRow/BlockRow';
import useStores from '@/hooks/useStores';

const labelMinWidth = '100px';

function Login() {
  const { t } = useTranslation();

  const { userStore } = useStores();

  const navigate = useNavigate();

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
    <Page className="edit-space-wrapper">
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Block className="pt-0">
            <BlockRow>
              <Label minWidth={labelMinWidth} size="sm" required>
                {t('이메일')}
              </Label>
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
            </BlockRow>
            <BlockRow>
              <Label size="sm" minWidth={labelMinWidth} required>
                {t('비밀번호')}
              </Label>
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
            </BlockRow>

            <BlockRow>
              <Label size="sm" minWidth={labelMinWidth}>
                {t('활성화')}
              </Label>
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
            </BlockRow>
          </Block>
          <PageButtons
            onCancel={() => {
              navigate('/spaces');
            }}
            onSubmit={() => {}}
            onSubmitText="저장"
            onCancelIcon=""
          />
        </Form>
      </PageContent>
    </Page>
  );
}

Login.defaultProps = {};

Login.propTypes = {};

export default Login;
