import React, { useEffect, useState } from 'react';
import {
  Block,
  Button,
  CheckBox,
  EmptyContent,
  Form,
  Input,
  Label,
  Liner,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Page,
  PageButtons,
  PageContent,
  PageTitle,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  THead,
  Title,
  Tr,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import BlockRow from '@/components/BlockRow/BlockRow';
import moment from 'moment-timezone';
import UserService from '@/services/UserService';
import { COUNTRIES, LANGUAGES, MESSAGE_CATEGORY, SYSTEM_ROLE } from '@/constants/constants';
import './MyInfoPage.scss';
import dateUtil from '@/utils/dateUtil';
import dialogUtil from '@/utils/dialogUtil';

const updatePopupLabelMinWidth = '140px';

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

  const [createTokenPopupInfo, setCreateTokenPopupInfo] = useState({
    isOpened: false,
    name: '',
    enabled: false,
  });

  const [updateTokenPopupInfo, setUpdateTokenPopupInfo] = useState({
    isOpened: false,
    id: '',
    name: '',
    token: '',
    lastAccess: '',
    enabled: true,
  });

  const closeCreateTokenPopup = () => {
    setCreateTokenPopupInfo({
      isOpened: false,
      name: '',
      enabled: true,
    });
  };

  const closeUpdateTokenPopup = () => {
    setUpdateTokenPopupInfo({
      isOpened: false,
      id: '',
      name: '',
      token: '',
      lastAccess: '',
      enabled: true,
    });
  };

  const createUserToken = (name, enabled) => {
    UserService.createUserToken({ name, enabled }, userToken => {
      const nextUserTokenList = userTokenList.slice(0);
      nextUserTokenList.push(userToken);
      setUserTokenList(nextUserTokenList);
      closeCreateTokenPopup();
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

      closeUpdateTokenPopup();
    });
  };

  const deleteUserToken = id => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('사용자 인증 토큰 삭제'),
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
                  setCreateTokenPopupInfo({
                    isOpened: true,
                    name: '',
                    enabled: true,
                  });
                }}
              >
                {t('인증 토큰 추가')}
              </Button>
            }
          >
            {t('인증 토큰')}
          </Title>
          <Block>
            {userTokenList?.length < 1 && (
              <EmptyContent className="empty-content">
                <div>{t('등록된 인증 토큰이 없습니다.')}</div>
              </EmptyContent>
            )}
            {userTokenList?.length > 0 && (
              <Table cols={['100%', '1px', '1px', '1px', '1px']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('이름')}</Th>
                    <Th align="left">{t('인증 토큰')}</Th>
                    <Th align="center">{t('활성화 여부')}</Th>
                    <Th align="center">{t('마지막 사용일시')}</Th>
                    <Th align="center" />
                  </Tr>
                </THead>
                <Tbody>
                  {userTokenList?.map(userToken => {
                    return (
                      <Tr key={userToken.id}>
                        <Td>{userToken.name}</Td>
                        <Td align="center">{userToken.token}</Td>
                        <Td align="center">{userToken.enabled ? 'Y' : 'N'}</Td>
                        <Td align="center">{dateUtil.getDateString(userToken.lastAccess)}</Td>
                        <Td align="center">
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => {
                              deleteUserToken(userToken.id);
                            }}
                          >
                            {t('삭제')}
                          </Button>
                          <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 0.75rem " />
                          <Button
                            size="sm"
                            onClick={() => {
                              setUpdateTokenPopupInfo({
                                isOpened: true,
                                id: userToken.id,
                                name: userToken.name,
                                token: userToken.token,
                                lastAccess: userToken.lastAccess,
                                enabled: userToken.enabled,
                              });
                            }}
                          >
                            {t('변경')}
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
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
      {createTokenPopupInfo.isOpened && (
        <Modal isOpen toggle={closeCreateTokenPopup}>
          <Form
            onSubmit={e => {
              e.preventDefault();
              createUserToken(createTokenPopupInfo.name, createTokenPopupInfo.enabled);
            }}
          >
            <ModalHeader>{t('사용자 인증 토큰 추가')}</ModalHeader>
            <ModalBody>
              <Block>
                <BlockRow>
                  <Label>{t('이름')}</Label>
                  <Input
                    type="text"
                    value={createTokenPopupInfo.name}
                    onChange={val =>
                      setCreateTokenPopupInfo({
                        ...createTokenPopupInfo,
                        name: val,
                      })
                    }
                    required
                    minLength={1}
                  />
                </BlockRow>
                <BlockRow>
                  <Label>{t('활성화 여부')}</Label>
                  <CheckBox
                    type="checkbox"
                    value={createTokenPopupInfo.enabled}
                    onChange={val => {
                      setCreateTokenPopupInfo({
                        ...createTokenPopupInfo,
                        enabled: val,
                      });
                    }}
                  />
                </BlockRow>
              </Block>
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeCreateTokenPopup}>{t('취소')}</Button>
              <Button type="submit">{t('저장')}</Button>
            </ModalFooter>
          </Form>
        </Modal>
      )}
      {updateTokenPopupInfo.isOpened && (
        <Modal size="lg" isOpen toggle={closeUpdateTokenPopup}>
          <Form
            onSubmit={e => {
              e.preventDefault();
              updateUserToken(updateTokenPopupInfo.id, updateTokenPopupInfo.name, updateTokenPopupInfo.enabled);
            }}
          >
            <ModalHeader>{t('사용자 인증 토큰 변경')}</ModalHeader>
            <ModalBody>
              <Block>
                <BlockRow>
                  <Label minWidth={updatePopupLabelMinWidth}>{t('이름')}</Label>
                  <Input
                    type="text"
                    value={updateTokenPopupInfo.name}
                    onChange={val =>
                      setUpdateTokenPopupInfo({
                        ...updateTokenPopupInfo,
                        name: val,
                      })
                    }
                    required
                    minLength={1}
                  />
                </BlockRow>
                <BlockRow>
                  <Label minWidth={updatePopupLabelMinWidth}>{t('토큰')}</Label>
                  <Text>{updateTokenPopupInfo.token}</Text>
                </BlockRow>
                <BlockRow>
                  <Label minWidth={updatePopupLabelMinWidth}>{t('활성화 여부')}</Label>
                  <CheckBox
                    type="checkbox"
                    value={updateTokenPopupInfo.enabled}
                    onChange={val => {
                      setUpdateTokenPopupInfo({
                        ...updateTokenPopupInfo,
                        enabled: val,
                      });
                    }}
                  />
                </BlockRow>
                <BlockRow>
                  <Label minWidth={updatePopupLabelMinWidth}>{t('마지막 사용일시')}</Label>
                  <Text>{dateUtil.getDateString(updateTokenPopupInfo.lastAccess)}</Text>
                </BlockRow>
              </Block>
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeUpdateTokenPopup}>{t('취소')}</Button>
              <Button type="submit">{t('저장')}</Button>
            </ModalFooter>
          </Form>
        </Modal>
      )}
    </>
  );
}

MyInfoPage.defaultProps = {};

MyInfoPage.propTypes = {};

export default MyInfoPage;
