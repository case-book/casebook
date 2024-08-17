import React, { useEffect, useState } from 'react';
import { Block, Button, EmptyContent, Page, PageContent, PageTitle, Table, Tag, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ProjectService from '@/services/ProjectService';
import copy from 'copy-to-clipboard';
import OpenLinkService from '@/services/OpenLinkService';
import dateUtil from '@/utils/dateUtil';
import dialogUtil from '@/utils/dialogUtil';
import classNames from 'classnames';
import './OpenLinkListPage.scss';

function OpenLinkListPage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [openLinks, setOpenLinks] = useState([]);

  useEffect(() => {
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [spaceCode, projectId]);

  const selectOpenLinkList = () => {
    OpenLinkService.selectOpenLinkList(spaceCode, projectId, list => {
      setOpenLinks(list);
    });
  };

  useEffect(() => {
    selectOpenLinkList();
  }, [spaceCode, projectId]);

  return (
    <Page className="open-link-list-page-wrapper">
      <PageTitle
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: `/spaces/${spaceCode}/info`,
            text: spaceCode,
          },
          {
            to: `/spaces/${spaceCode}/projects`,
            text: t('프로젝트 목록'),
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}`,
            text: project?.name,
          },
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/links`,
            text: t('오픈 링크 목록'),
          },
        ]}
        links={[
          {
            to: `/spaces/${spaceCode}/projects/${projectId}/links/new`,
            text: t('오픈 링크'),
            icon: <i className="fa-solid fa-plus" />,
          },
        ]}
        onListClick={() => {
          navigate(`/spaces/${spaceCode}/projects`);
        }}
      >
        {t('오픈 링크')}
      </PageTitle>
      <PageContent className="page-content" flex>
        <Title border={false} marginBottom={false} paddingBottom={openLinks?.length <= 0}>
          {t('오픈 링크')}
        </Title>
        {openLinks?.length <= 0 && (
          <EmptyContent fill border>
            {t('조회된 오픈 링크가 없습니다.')}
          </EmptyContent>
        )}
        <Block>
          {openLinks?.length > 0 && (
            <Table className="table" cols={['100%', '1px', '1px']} border>
              <THead>
                <Tr>
                  <Th align="left">{t('오픈 링크')}</Th>
                  <Th align="center">{t('공유 기간')}</Th>
                  <Th align="center">{t('공유')}</Th>
                  <Th align="center">{t('공유 링크')}</Th>
                </Tr>
              </THead>
              <Tbody>
                {openLinks.map(openLink => {
                  return (
                    <Tr key={openLink.id}>
                      <Td>
                        <Link className="g-text-link" to={`/spaces/${spaceCode}/projects/${projectId}/links/${openLink.id}`}>
                          {openLink.name}
                        </Link>
                      </Td>
                      <Td align="center" className={classNames({ expired: openLink.openEndDateTime && dateUtil.getDate(openLink.openEndDateTime).getTime() < Date.now() })}>
                        {dateUtil.getDateString(openLink.openEndDateTime)}
                      </Td>
                      <Td align="center">
                        <Tag border>{openLink.opened ? '열림' : '닫힘'}</Tag>
                      </Td>
                      <Td align="center">
                        <Button
                          size="xs"
                          onClick={() => {
                            copy(`${window.location.origin}/links/${openLink.token}`);
                            dialogUtil.setToast(t('클립 보드에 오픈 링크 공유를 위한 URL이 복사되었습니다.'));
                          }}
                        >
                          {t('링크 복사')}
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </Block>
      </PageContent>
    </Page>
  );
}

export default OpenLinkListPage;
