import React, { useEffect, useState } from 'react';
import { Block, Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Page, PageButtons, PageContent, PageTitle, Tag, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY, SYSTEM_ROLE } from '@/constants/constants';
import AdminService from '@/services/AdminService';
import dateUtil from '@/utils/dateUtil';
import './UserInfoPage.scss';

const labelMinWidth = '130px';

function UserInfoPage() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [changePasswordPopupInfo, setChangePasswordPopupInfo] = useState({
    isOpened: false,
    nextPassword: '',
    nextPasswordConfirm: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    AdminService.selectUserInfo(userId, info => {
      setUser(info);
    });
  }, [userId]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('사용자 삭제'),
      <div>{t('사용자 데이터 및 사용자가 입력한 모든 데이터가 삭제됩니다. 삭제하시겠습니까?')}</div>,
      () => {
        AdminService.deleteUserInfo(userId, () => {
          navigate('/admin/users');
        });
      },
      null,
      t('삭제'),
    );
  };

  return (
    <>
      <Page className="user-info-page-wrapper">
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
          ]}
          links={[
            {
              to: `/admin/users/${userId}/edit`,
              text: t('변경'),
              color: 'primary',
            },
          ]}
          onListClick={() => {
            navigate('/admin/users');
          }}
        >
          {t('사용자 정보')}
        </PageTitle>
        <PageContent>
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
              <Text>{user.name}</Text>
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
              <Text>{user.language}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('지역')}</Label>
              <Text>{user.country}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('타임존')}</Label>
              <Text>{user.timezone}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('시스템 권한')}</Label>
              <Text>{SYSTEM_ROLE[user.systemRole]}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('적용 권한')}</Label>
              <Text>{SYSTEM_ROLE[user.activeSystemRole]}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('사용 여부')}</Label>
              <Text>{user.useYn ? 'Y' : 'N'}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('계정 활성화')}</Label>
              <Text>{user.activateYn ? 'Y' : 'N'}</Text>
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
          <Title paddingBottom={false} border={false} marginBottom={false}>
            {t('관리')}
          </Title>
          <Block>
            <BlockRow>
              <Label>{t('비밀번호 변경')}</Label>
              <Text>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => {
                    setChangePasswordPopupInfo({
                      isOpened: true,
                      nextPassword: '',
                      nextPasswordConfirm: '',
                    });
                  }}
                >
                  {t('비밀번호 변경')}
                </Button>
              </Text>
            </BlockRow>
            <BlockRow>
              <Label>{t('사용자 삭제')}</Label>
              <Text>
                <Button size="sm" color="danger" onClick={onDelete}>
                  {t('사용자 삭제')}
                </Button>
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
            onEdit={() => {
              navigate(`/admin/users/${userId}/edit`);
            }}
          />
        </PageContent>
      </Page>
      {changePasswordPopupInfo.isOpened && (
        <Modal
          className="change-user-password-popup-wrapper"
          isOpen
          toggle={() => {
            setChangePasswordPopupInfo({
              isOpened: false,
              nextPassword: '',
              nextPasswordConfirm: '',
            });
          }}
        >
          <ModalHeader>{t('사용자 비밀번호 변경')}</ModalHeader>
          <ModalBody>
            <Block>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('사용자')}</Label>
                <Text>
                  <span>{user.name}</span>-<span>{user.email}</span>
                </Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('새 비밀번호')}</Label>
                <Input
                  type="password"
                  value={changePasswordPopupInfo?.nextPassword}
                  onChange={val =>
                    setChangePasswordPopupInfo({
                      ...changePasswordPopupInfo,
                      nextPassword: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('새 비밀번호 확인')}</Label>
                <Input
                  type="password"
                  value={changePasswordPopupInfo?.nextPasswordConfirm}
                  onChange={val =>
                    setChangePasswordPopupInfo({
                      ...changePasswordPopupInfo,
                      nextPasswordConfirm: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
            </Block>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setChangePasswordPopupInfo({
                  isOpened: false,
                  nextPassword: '',
                  nextPasswordConfirm: '',
                });
              }}
            >
              {t('취소')}
            </Button>
            <Button
              onClick={() => {
                AdminService.updateUserPasswordInfo(userId, changePasswordPopupInfo, () => {
                  setChangePasswordPopupInfo({
                    isOpened: false,
                    nextPassword: '',
                    nextPasswordConfirm: '',
                  });
                  dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('변경 완료'), t('사용자 비밀번호가 변경되었습니다.'));
                });
              }}
            >
              {t('저장')}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}

UserInfoPage.defaultProps = {};

UserInfoPage.propTypes = {};

export default UserInfoPage;
