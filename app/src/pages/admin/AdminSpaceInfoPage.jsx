import React, { useEffect, useState } from 'react';
import { Block, EmptyContent, Label, Page, PageButtons, PageContent, PageTitle, Table, Tag, Tbody, Td, Text, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import { APPROVAL_STATUS_INFO } from '@/constants/constants';
import AdminService from '@/services/AdminService';
import './AdminSpaceInfoPage.scss';

function AdminSpaceInfoPage() {
  const { t } = useTranslation();
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    AdminService.selectSpaceInfo(spaceId, info => {
      setSpace(info);
    });
  }, [spaceId]);

  return (
    <Page className="admin-space-info-page-wrapper">
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
            to: '/admin/spaces',
            text: t('스페이스 관리'),
          },
          {
            to: `/admin/spaces/${spaceId}`,
            text: space?.name,
          },
        ]}
        links={[
          {
            to: `/spaces/${space.code}/edit`,
            text: t('편집'),
            color: 'primary',
          },
        ]}
        onListClick={() => {
          navigate('/admin/spaces');
        }}
      >
        {t('스페이스')}
      </PageTitle>
      <PageContent>
        <Title border={false} marginBottom={false}>
          {t('스페이스 정보')}
        </Title>
        <Block>
          <BlockRow>
            <Label>{t('이름')}</Label>
            <Text>{space?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('코드')}</Label>
            <Text>{space?.code}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('설명')}</Label>
            <Text>{space?.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('사용 여부')}</Label>
            <Text>{space?.activated ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('검색 허용')}</Label>
            <Text>{space?.allowSearch ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('자동 가입')}</Label>
            <Text>{space?.allowAutoJoin ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('토큰')}</Label>
            <Text>{space?.token}</Text>
          </BlockRow>
        </Block>
        <Title border={false} paddingBottom={false}>
          {t('스페이스 사용자')}
        </Title>
        <Block>
          <div className="table-content">
            <Table cols={['1px', '1px', '100%']} border>
              <THead>
                <Tr>
                  <Th align="center">{t('권한')}</Th>
                  <Th align="left">{t('이름')}</Th>
                  <Th align="left">{t('이메일')}</Th>
                </Tr>
              </THead>
              <Tbody>
                {space.users?.map(user => {
                  return (
                    <Tr key={user.id}>
                      <Td>
                        <Tag uppercase>{user.role}</Tag>
                      </Td>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </div>
        </Block>
        <Title border={false} paddingBottom={false}>
          {t('스페이스 참여 요청')}
        </Title>
        <Block>
          {space.applicants?.length < 1 && (
            <EmptyContent className="empty-content">
              <div>{t('요청 정보가 없습니다.')}</div>
            </EmptyContent>
          )}
          {space.applicants?.length > 0 && (
            <div className="table-content">
              <Table className="applicant-list" cols={['1px', '1px', '1px', '100%', '1px']} border>
                <THead>
                  <Tr>
                    <Th align="center">{t('상태')}</Th>
                    <Th align="left">{t('이름')}</Th>
                    <Th align="left">{t('이메일')}</Th>
                    <Th align="left">{t('메세지')}</Th>
                    <Th />
                  </Tr>
                </THead>
                <Tbody>
                  {space.applicants?.map(applicant => {
                    return (
                      <Tr key={applicant.id}>
                        <Td className={`request-status ${applicant.approvalStatusCode}`}>
                          <Tag border rounded={false}>
                            {APPROVAL_STATUS_INFO[applicant.approvalStatusCode]}
                          </Tag>
                        </Td>
                        <Td>{applicant.userName}</Td>
                        <Td className="user-email">{applicant.userEmail}</Td>
                        <Td className="message">{applicant.message}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          )}
        </Block>
        <Title paddingBottom={false} border={false}>
          {t('프로젝트 목록')}
        </Title>
        <Block>
          {space?.projects?.length < 1 && (
            <EmptyContent className="empty-content">
              <div>{t('프로젝트가 없습니다.')}</div>
            </EmptyContent>
          )}
          {space?.projects?.length > 0 && (
            <div className="table-content">
              <Table cols={['100%', '1px', '1px']} border>
                <THead>
                  <Tr>
                    <Th align="left">{t('프로젝트 명')}</Th>
                    <Th align="center">{t('상태')}</Th>
                    <Th align="center">{t('테스트케이스')}</Th>
                    <Th align="center">{t('테스트런')}</Th>
                  </Tr>
                </THead>
                <Tbody>
                  {space?.projects?.map(project => {
                    return (
                      <Tr key={project.id}>
                        <Td className="project-name">
                          <Link to={`/spaces/${space.code}/projects/${project.id}/info`}>{project.name}</Link>
                        </Td>
                        <Td align="center" className="activated">
                          <Tag uppercase border>
                            {project.activated ? 'activated' : 'disabled'}
                          </Tag>
                        </Td>
                        <Td align="right" className="testcase-count">
                          <div>
                            <span>{project.testcaseCount}</span>
                          </div>
                        </Td>
                        <Td align="right" className="bug-count">
                          <div>
                            <span>{project.testrunCount}</span>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          )}
        </Block>
        <PageButtons
          onList={() => {
            navigate('/admin/spaces');
          }}
          onBack={() => {
            navigate(-1);
          }}
          onEdit={() => {
            navigate(`/spaces/${space.code}/edit`);
          }}
        />
      </PageContent>
    </Page>
  );
}

AdminSpaceInfoPage.defaultProps = {};

AdminSpaceInfoPage.propTypes = {};

export default AdminSpaceInfoPage;
