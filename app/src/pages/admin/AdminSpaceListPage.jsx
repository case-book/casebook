import React, { useEffect, useState } from 'react';
import { Page, PageContent, PageTitle, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminService from '@/services/AdminService';
import './AdminSpaceListPage.scss';

function AdminSpaceListPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);

  const getUserList = () => {
    AdminService.selectSpaceList(list => {
      setSpaces(list);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserList();
  }, []);

  return (
    <Page className="admin-space-list-page-wrapper">
      <PageTitle>{t('스페이스 관리')}</PageTitle>
      <PageContent>
        <Title border={false}>{t('스페이스 목록')}</Title>
        <Table cols={['1px', '1px', '100%', '1px', '1px', '1px', '1px', '1px']} border>
          <THead>
            <Tr>
              <Th align="center">{t('아이디')}</Th>
              <Th align="left">{t('코드')}</Th>
              <Th align="left">{t('이름')}</Th>
              <Th align="center">{t('활성화')}</Th>
              <Th align="center">{t('검색 허용')}</Th>
              <Th align="center">{t('자동 가입')}</Th>
              <Th align="center">{t('프로젝트 수')}</Th>
              <Th align="center">{t('사용자 수')}</Th>
            </Tr>
          </THead>
          <Tbody>
            {spaces?.map(space => {
              return (
                <Tr key={space.id}>
                  <Td align="right">{space.id}</Td>
                  <Td>
                    <Tag border color="white">
                      {space.code}
                    </Tag>
                  </Td>
                  <Td>
                    <span
                      className="space-name"
                      onClick={() => {
                        navigate(`/admin/spaces/${space.id}`);
                      }}
                    >
                      {space.name}
                    </span>
                  </Td>
                  <Td align="center">{space.activated ? 'Y' : 'N'}</Td>
                  <Td align="center">{space.allowSearch ? 'Y' : 'N'}</Td>
                  <Td align="center">{space.allowAutoJoin ? 'Y' : 'N'}</Td>
                  <Td align="right">{space.projectCount}</Td>
                  <Td align="right">{space.userCount}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </PageContent>
    </Page>
  );
}

AdminSpaceListPage.defaultProps = {};

AdminSpaceListPage.propTypes = {};

export default AdminSpaceListPage;
