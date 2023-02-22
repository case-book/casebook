import React, { useEffect, useState } from 'react';
import { Block, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Selector, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BlockRow from '@/components/BlockRow/BlockRow';
import moment from 'moment-timezone';
import UserService from '@/services/UserService';
import { COUNTRIES, LANGUAGES, SYSTEM_ROLE, TIMEZONES } from '@/constants/constants';
import i18n from 'i18next';
import useStores from '@/hooks/useStores';

function MyEditPage() {
  const { t } = useTranslation();

  const {
    userStore: { setLocale },
  } = useStores();

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    UserService.getMyDetailInfo(info => {
      setUser(info);
    });
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    UserService.updateMyInfo(user, () => {
      i18n.changeLanguage(user.language);
      setLocale(user.language, user.country);
      navigate('/users/my');
    });
  };

  return (
    <Page>
      <PageTitle>{t('내 정보 변경')}</PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Title>{t('내 정보')}</Title>
          <Block>
            <BlockRow>
              <Label>{t('이름')}</Label>
              <Input
                value={user?.name}
                onChange={val =>
                  setUser({
                    ...user,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('이메일')}</Label>
              <Text>{user?.email}</Text>
            </BlockRow>
            {user?.systemRole === 'ROLE_ADMIN' && (
              <BlockRow>
                <Label>{t('시스템 권한')}</Label>
                <Text>{SYSTEM_ROLE[user?.systemRole]}</Text>
              </BlockRow>
            )}
            {user?.systemRole === 'ROLE_ADMIN' && (
              <BlockRow>
                <Label>{t('적용 권한')}</Label>
                <Selector
                  items={Object.keys(SYSTEM_ROLE).map(key => {
                    return {
                      key,
                      value: SYSTEM_ROLE[key],
                    };
                  })}
                  value={user?.activeSystemRole}
                  onChange={value => {
                    setUser({
                      ...user,
                      activeSystemRole: value,
                    });
                  }}
                />
              </BlockRow>
            )}
            <BlockRow>
              <Label>{t('언어')}</Label>
              <Selector
                items={Object.keys(LANGUAGES).map(key => {
                  return {
                    key,
                    value: LANGUAGES[key],
                  };
                })}
                value={user?.language}
                onChange={value => {
                  setUser({
                    ...user,
                    language: value,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('지역')}</Label>
              <Selector
                items={Object.keys(COUNTRIES).map(key => {
                  return {
                    key,
                    value: COUNTRIES[key],
                  };
                })}
                value={user?.country}
                onChange={value => {
                  setUser({
                    ...user,
                    country: value,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('타임존')}</Label>
              <Selector
                items={[
                  {
                    key: null,
                    value: `${t('브라우저 설정')} - ${moment.tz.guess()}`,
                  },
                ].concat(
                  Object.keys(TIMEZONES).map(key => {
                    return {
                      key,
                      value: TIMEZONES[key].name,
                    };
                  }),
                )}
                value={user?.timezone}
                onChange={value => {
                  setUser({
                    ...user,
                    timezone: value,
                  });
                }}
              />
            </BlockRow>
          </Block>
          <PageButtons
            onBack={() => {
              navigate(-1);
            }}
            onSubmit={() => {}}
            onSubmitText={t('저장')}
          />
        </Form>
      </PageContent>
    </Page>
  );
}

MyEditPage.defaultProps = {};

MyEditPage.propTypes = {};

export default MyEditPage;
