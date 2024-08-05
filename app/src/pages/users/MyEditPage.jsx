import React, { useEffect, useState } from 'react';
import { Block, Button, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Selector, Text, UserAvatar } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BlockRow from '@/components/BlockRow/BlockRow';
import moment from 'moment-timezone';
import UserService from '@/services/UserService';
import { COUNTRIES, LANGUAGES, SYSTEM_ROLE, TIMEZONES } from '@/constants/constants';
import i18n from 'i18next';
import useStores from '@/hooks/useStores';
import UserIconEditorPopup from '@/pages/users/UserIconEditorPopup';
import './MyEditPage.scss';

function MyEditPage() {
  const { t } = useTranslation();

  const {
    userStore: { setLocale, setAvatarInfo },
  } = useStores();

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    UserService.getMyDetailInfo(info => {
      setUser(info);
    });
  }, []);

  const onSubmit = e => {
    e.preventDefault();

    const nextUser = { ...user };
    UserService.updateMyInfo(nextUser, () => {
      i18n.changeLanguage(user.language);
      setAvatarInfo(user.avatarInfo);
      setLocale(user.language, user.country);
      navigate('/users/my');
    });
  };

  return (
    <Page className="my-edit-page-wrapper">
      <PageTitle
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: '/users/my',
            text: t('내 정보'),
          },
          {
            to: '/users/my/edit',
            text: t('변경'),
          },
        ]}
        onListClick={() => {
          navigate('/');
        }}
      >
        {t('내 정보 변경')}
      </PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <div className="my-info-content">
            <div>
              <UserAvatar avatarInfo={user?.avatarInfo} size={128} fill />
              <div>
                <Button
                  outline
                  onClick={() => {
                    setOpened(true);
                  }}
                >
                  {t('변경')}
                </Button>
              </div>
            </div>
            <div>
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
            </div>
          </div>
          <PageButtons
            onBack={() => {
              navigate(-1);
            }}
            onSubmit={() => {}}
            onSubmitText={t('저장')}
          />
        </Form>
      </PageContent>
      {opened && (
        <UserIconEditorPopup
          data={user?.avatarInfo}
          onChange={info => {
            setUser({ ...user, avatarInfo: info });
          }}
          setOpened={setOpened}
        />
      )}
    </Page>
  );
}

MyEditPage.defaultProps = {};

MyEditPage.propTypes = {};

export default MyEditPage;
