import React, { useEffect, useState } from 'react';
import { Block, Label, Page, PageButtons, PageContent, PageTitle, Table, Tag, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import BlockRow from '@/components/BlockRow/BlockRow';
import moment from 'moment-timezone';
import UserService from '@/services/UserService';
import { COUNTRIES, LANGUAGES, SYSTEM_ROLE } from '@/constants/constants';
import './MyInfoPage.scss';

function MyInfoPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    UserService.getMyDetailInfo(info => {
      setUser(info);
    });
  }, []);

  return (
    <Page className="my-info-page-wrapper">
      <PageTitle>{t('내 정보')}</PageTitle>
      <PageContent>
        <Title>{t('내 정보')}</Title>
        <Block>
          <BlockRow>
            <Label>{t('이름')}</Label>
            <Text>{user?.name}</Text>
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
              <Text>{SYSTEM_ROLE[user?.activeSystemRole]}</Text>
            </BlockRow>
          )}
          <BlockRow>
            <Label>{t('언어 및 지역')}</Label>
            <Text>
              {LANGUAGES[user?.language] || user?.language} / {COUNTRIES[user?.country] || user?.country}
            </Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('타임존')}</Label>
            {user?.timezone && <Text className="timezone">{user?.timezone}</Text>}
            {!user?.timezone && (
              <Text className="timezone">
                <span>{moment.tz.guess()}</span>
                <Tag className="browser">BROWSER</Tag>
              </Text>
            )}
          </BlockRow>
        </Block>
        {1 > 2 && (
          <>
            <Title>{t('참여중인 스페이스')}</Title>
            <Block>
              <Table cols={['100%', '200px']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('스페이스 명')}</Th>
                    <Th align="center">{t('권한')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {user?.spaces?.map(space => {
                    return (
                      <Tr key={space.id}>
                        <Td>
                          <Link to={`/spaces/${space.code}/info`}>{space.name}</Link>
                        </Td>
                        <Td align="center">
                          <Tag uppercase>{space.isAdmin ? t('관리자') : t('멤버')}</Tag>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Block>
          </>
        )}
        <PageButtons
          onDelete={() => {
            navigate('/users/my/password');
          }}
          onDeleteText={t('비밀번호 변경')}
          onBack={() => {
            navigate(-1);
          }}
          onEdit={() => {
            navigate('/users/my/edit');
          }}
        />
      </PageContent>
    </Page>
  );
}

MyInfoPage.defaultProps = {};

MyInfoPage.propTypes = {};

export default MyInfoPage;
