import React, { useEffect, useState } from 'react';
import { Block, CheckBox, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Selector, Tag, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import { COUNTRIES, LANGUAGES, SYSTEM_ROLE, TIMEZONES } from '@/constants/constants';
import AdminService from '@/services/AdminService';
import dateUtil from '@/utils/dateUtil';
import './UserEditPage.scss';
import moment from 'moment-timezone';

const labelMinWidth = '130px';

function UserInfoPage() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    AdminService.selectUserInfo(userId, info => {
      setUser(info);
    });
  }, [userId]);

  const onSubmit = e => {
    e.preventDefault();
    AdminService.updateUserInfo(userId, user, () => {
      navigate(`/admin/users/${userId}`);
    });
  };

  return (
    <Page className="user-edit-page-wrapper">
      <PageTitle
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: '/admin',
            text: t('시스템 관리'),
          },
          {
            to: '/admin/users',
            text: t('사용자 목록'),
          },
          {
            to: `/admin/users/${userId}`,
            text: user?.name,
          },
          {
            to: `/admin/users/${userId}/edit`,
            text: t('변경'),
          },
        ]}
        onListClick={() => {
          navigate('/admin/users');
        }}
      >
        {t('사용자 정보')}
      </PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Title border={false} marginBottom={false}>
            {t('사용자 정보')}
          </Title>
          <Block>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('아이디')}</Label>
              <Text>{user.id}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('이름')}</Label>
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
              <Label minWidth={labelMinWidth}>{t('이메일')}</Label>
              <Text>{user.email}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>UUID</Label>
              <Text>{user.uuid}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('언어')}</Label>
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
              <Label minWidth={labelMinWidth}>{t('지역')}</Label>
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
              <Label minWidth={labelMinWidth}>{t('타임존')}</Label>
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
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('시스템 권한')}</Label>
              <Selector
                items={Object.keys(SYSTEM_ROLE).map(key => {
                  return {
                    key,
                    value: SYSTEM_ROLE[key],
                  };
                })}
                value={user?.systemRole}
                onChange={value => {
                  setUser({
                    ...user,
                    systemRole: value,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('적용 권한')}</Label>
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
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('사용 여부')}</Label>
              <CheckBox
                size="xs"
                type="checkbox"
                value={user.useYn}
                onChange={val =>
                  setUser({
                    ...user,
                    useYn: val,
                  })
                }
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('계정 활성화')}</Label>
              <CheckBox
                size="xs"
                type="checkbox"
                value={user.activateYn}
                onChange={val =>
                  setUser({
                    ...user,
                    activateYn: val,
                  })
                }
              />
            </BlockRow>
          </Block>
          <Title border={false} marginBottom={false}>
            {t('설정 정보')}
          </Title>
          <Block>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('자동 로그인')}</Label>
              <Text>{user.autoLogin ? 'Y' : 'N'}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('마지막 알림 확인')}</Label>
              <Text>{dateUtil.getDateString(user.lastSeen)}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('로그인 토큰')}</Label>
              <Text>{user.loginToken}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('참여 스페이스')}</Label>
              <Text>
                {user.spaces?.map(space => {
                  return (
                    <Tag className="space-tag" key={space.id} border color="white" size="sm">
                      {space.name}
                      {space.isAdmin && <div className="is-admin">ADMIN</div>}
                    </Tag>
                  );
                })}
              </Text>
            </BlockRow>
          </Block>
          <PageButtons
            onList={() => {
              navigate('/admin/users');
            }}
            onBack={() => {
              navigate(-1);
            }}
            onSubmit={() => {}}
          />
        </Form>
      </PageContent>
    </Page>
  );
}

UserInfoPage.defaultProps = {};

UserInfoPage.propTypes = {};

export default UserInfoPage;
