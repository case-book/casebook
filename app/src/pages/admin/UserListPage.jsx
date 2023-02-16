import React, { useEffect, useState } from 'react';
import { Page, PageContent, PageTitle, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminService from '@/services/AdminService';
import './UserListPage.scss';
import { SYSTEM_ROLE } from '@/constants/constants';

function UserListPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const getUserList = () => {
    AdminService.selectUserList(list => {
      setUsers(list);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserList();
  }, []);

  return (
    <Page className="user-list-page-wrapper">
      <PageTitle>{t('사용자 관리')}</PageTitle>
      <PageContent>
        <Title border={false}>{t('사용자 목록')}</Title>
        <Table className="applicant-list" cols={['1px', '1px', '1px', '1px', '1px', '1px', '1px', '1px', '100%']} border>
          <THead>
            <Tr>
              <Th align="center">{t('아이디')}</Th>
              <Th align="left">{t('사용자')}</Th>
              <Th align="center">{t('언어 및 지역')}</Th>
              <Th align="center">{t('타임존')}</Th>
              <Th align="center">{t('시스템 권한')}</Th>
              <Th align="center">{t('적용 권한')}</Th>
              <Th align="center">{t('사용 여부')}</Th>
              <Th align="center">{t('계정 활성화')}</Th>
              <Th align="left">{t('참여 스페이스')}</Th>
            </Tr>
          </THead>
          <Tbody>
            {users?.map(user => {
              return (
                <Tr key={user.id}>
                  <Td align="right">{user.id}</Td>
                  <Td className="user-info">
                    <div
                      onClick={() => {
                        navigate(`/admin/users/${user.id}`);
                      }}
                    >
                      <div className="name">{user.name}</div>
                      <div className="email">{user.email}</div>
                    </div>
                  </Td>
                  <Td align="center" className="tag-info">
                    <Tag border color="white">
                      {user.language}
                    </Tag>
                    <Tag border color="white">
                      {user.country}
                    </Tag>
                  </Td>
                  <Td align="center">{user.timezone || t('브라우저 설정')}</Td>
                  <Td align="center">
                    <Tag border={false} color={user.systemRole === 'ROLE_ADMIN' ? 'danger' : 'gray'}>
                      {SYSTEM_ROLE[user.systemRole]}
                    </Tag>
                  </Td>
                  <Td align="center">
                    <Tag border={false} color={user.activeSystemRole === 'ROLE_ADMIN' ? 'danger' : 'gray'}>
                      {SYSTEM_ROLE[user.activeSystemRole]}
                    </Tag>
                  </Td>
                  <Td align="center">{user.useYn ? 'Y' : 'N'}</Td>
                  <Td align="center">{user.activateYn ? 'Y' : 'N'}</Td>
                  <Td className="tag-info">
                    {user.spaces?.map(space => {
                      return (
                        <Tag className="space-tag" key={space.id} border color="white">
                          {space.name}
                          {space.isAdmin && <div className="is-admin">ADMIN</div>}
                        </Tag>
                      );
                    })}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </PageContent>
    </Page>
  );
}

UserListPage.defaultProps = {};

UserListPage.propTypes = {};

export default UserListPage;
