import React, { useEffect, useState } from 'react';
import { Block, Button, Label, Page, PageButtons, PageContent, PageTitle, Table, Tag, Tbody, Td, Text, Th, THead, Title, TokenList, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import BlockRow from '@/components/BlockRow/BlockRow';
import moment from 'moment-timezone';
import UserService from '@/services/UserService';
import { COUNTRIES, LANGUAGES, MESSAGE_CATEGORY, SYSTEM_ROLE } from '@/constants/constants';
import './MyInfoPage.scss';
import dialogUtil from '@/utils/dialogUtil';
import TokenDialog from '@/pages/common/Header/TokenDialog';

function MyInfoPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userTokenList, setUserTokenList] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    UserService.getMyDetailInfo(info => {
      setUser(info);
    });
    UserService.getUserTokenList(tokens => {
      setUserTokenList(tokens);
    });
  }, []);

  const [createTokenPopupOpened, setCreateTokenPopupOpened] = useState(false);
  const [updateTokenPopupOpened, setUpdateTokenPopupOpened] = useState(false);

  const [updateTokenPopupInfo, setUpdateTokenPopupInfo] = useState({
    id: '',
    name: '',
    token: '',
    lastAccess: '',
    enabled: true,
  });

  const createUserToken = (name, enabled) => {
    UserService.createUserToken({ name, enabled }, userToken => {
      const nextUserTokenList = userTokenList.slice(0);
      nextUserTokenList.push(userToken);
      setUserTokenList(nextUserTokenList);
      setCreateTokenPopupOpened(false);
    });
  };

  const updateUserToken = (id, name, enabled) => {
    UserService.updateUserToken(id, { name, enabled }, userToken => {
      const nextUserTokenList = userTokenList.slice(0);
      const targetTokenIndex = nextUserTokenList.findIndex(d => d.id === id);
      if (targetTokenIndex > -1) {
        nextUserTokenList[targetTokenIndex] = userToken;
        setUserTokenList(nextUserTokenList);
      }
      setUpdateTokenPopupOpened(false);
    });
  };

  const deleteUserToken = id => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('토큰 삭제'),
      <div>{t('인증 토큰을 삭제하면, 해당 토큰을 사용하여 더 이상 로그인 할 수 없습니다. 삭제하시겠습니까?')}</div>,
      () => {
        UserService.deleteUserToken(id, () => {
          const nextUserTokenList = userTokenList.slice(0);
          const targetTokenIndex = nextUserTokenList.findIndex(d => d.id === id);
          if (targetTokenIndex > -1) {
            nextUserTokenList.splice(targetTokenIndex, 1);
          }
          setUserTokenList(nextUserTokenList);
        });
      },
      null,
      t('삭제'),
      null,
      'danger',
    );
  };

  return (
    <>
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
          <Title
            control={
              <Button
                size="sm"
                onClick={() => {
                  setCreateTokenPopupOpened(true);
                }}
              >
                {t('인증 토큰 추가')}
              </Button>
            }
          >
            {t('인증 토큰')}
          </Title>
          <Block>
            <TokenList
              tokens={userTokenList}
              onDeleteButtonClick={id => {
                deleteUserToken(id);
              }}
              onChangeButtonClick={info => {
                setUpdateTokenPopupInfo({
                  ...info,
                });
                setUpdateTokenPopupOpened(true);
              }}
            />
          </Block>
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
          <PageButtons
            onDelete={() => {
              navigate('/users/my/password');
            }}
            onDeleteText={t('비밀번호 변경')}
            onBack={() => {
              navigate(-1);
            }}
            onEditText={t('내 정보 변경')}
            onEdit={() => {
              navigate('/users/my/edit');
            }}
          />
        </PageContent>
      </Page>
      {createTokenPopupOpened && (
        <TokenDialog
          setOpened={() => {
            setCreateTokenPopupOpened(false);
          }}
          setToken={(id, name, enabled) => {
            createUserToken(name, enabled);
          }}
        />
      )}
      {updateTokenPopupOpened && (
        <TokenDialog
          setOpened={() => {
            setUpdateTokenPopupOpened(false);
          }}
          setToken={(id, name, enabled) => {
            updateUserToken(id, name, enabled);
          }}
          token={updateTokenPopupInfo}
        />
      )}
    </>
  );
}

MyInfoPage.defaultProps = {};

MyInfoPage.propTypes = {};

export default MyInfoPage;
