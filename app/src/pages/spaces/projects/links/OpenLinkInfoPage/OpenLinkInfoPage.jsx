import React, { useEffect, useState } from 'react';
import { Block, Button, EmptyContent, Label, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import copy from 'copy-to-clipboard';
import ProjectService from '@/services/ProjectService';
import SpaceService from '@/services/SpaceService';
import { Viewer } from '@toast-ui/react-editor';
import OpenLinkService from '@/services/OpenLinkService';
import OpenLinkReportPopup from '@/pages/spaces/projects/links/OpenLinkInfoPage/OpenLinkReportPopup/OpenLinkReportPopup';
import { OpenLinkReportList } from '@/assets';
import './OpenLinkInfoPage.scss';
import useStores from '@/hooks/useStores';
import dateUtil from '@/utils/dateUtil';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const labelMinWidth = '140px';

function OpenLinkInfoPage() {
  const { t } = useTranslation();

  const {
    themeStore: { theme },
  } = useStores();

  const { projectId, spaceCode, openLinkId } = useParams();

  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);

  const [project, setProject] = useState({});

  const [spaceName, setSpaceName] = useState('');

  const [openLink, setOpenLink] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });
  }, [projectId]);

  useEffect(() => {
    SpaceService.selectSpaceName(spaceCode, name => {
      setSpaceName(name);
    });
  }, [spaceCode]);

  useEffect(() => {
    OpenLinkService.selectOpenLinkInfo(spaceCode, projectId, openLinkId, info => {
      setOpenLink(info);
    });
  }, [spaceCode, projectId, openLinkId]);

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('오픈 링크 삭제'),
      <div>{t('오픈 링크를 삭제하면, 오픈 링크를 통해 리포트 내용에 더 이상 접근할 수 없습니다. 삭제하시겠습니까?')}</div>,
      () => {
        OpenLinkService.deleteOpenLink(spaceCode, projectId, openLinkId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/links`);
        });
      },
      null,
      t('삭제'),
    );
  };

  const onStop = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('오픈 링크 공유 중지'),
      <div>{t('오픈 링크를 만료시킵니다. 오픈 링크를 통해 리포트 내용에 더 이상 접근할 수 없습니다. 중지하시겠습니까?')}</div>,
      () => {
        OpenLinkService.closeOpenLink(spaceCode, projectId, openLinkId, () => {
          navigate(`/spaces/${spaceCode}/projects/${projectId}/links`);
        });
      },
      null,
      t('중지'),
    );
  };

  return (
    <>
      <Page className="open-link-edit-page-wrapper">
        <PageTitle
          name={t('오픈 링크')}
          breadcrumbs={[
            {
              to: '/',
              text: t('HOME'),
            },

            {
              to: `/spaces/${spaceCode}/info`,
              text: spaceName,
            },
            {
              to: `/spaces/${spaceCode}/projects`,
              text: t('프로젝트 목록'),
            },
            {
              to: `/spaces/${spaceCode}/projects/${projectId}/links`,
              text: t('오픈 링크 목록'),
            },
            {
              to: `/spaces/${spaceCode}/projects/${projectId}/links/${openLinkId}`,
              text: openLink?.name,
            },
          ]}
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects/${projectId}/links`);
          }}
        >
          {t('오픈 링크')}
        </PageTitle>
        {openLink && (
          <PageContent>
            <Title border={false} marginBottom={false}>
              {t('오픈 링크 정보')}
            </Title>
            <Block>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('프로젝트')}</Label>
                <Text>{project.name}</Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('이름')}</Label>
                <Text>{openLink.name}</Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('공유')}</Label>
                <Text>{openLink.opened ? 'Y' : 'N'}</Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('공유 기간')}</Label>
                <Text>{dateUtil.getDateString(openLink.openEndDateTime)}</Text>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('공유 URL')}</Label>
                <Text>
                  {`${window.location.origin}/links/${openLink.token}`}{' '}
                  <Button
                    size="xs"
                    onClick={() => {
                      copy(`${window.location.origin}/links/${openLink.token}`);
                      dialogUtil.setToast(t('클립 보드에 오픈 링크 공유를 위한 URL이 복사되었습니다.'));
                    }}
                  >
                    {t('복사')}
                  </Button>
                </Text>
              </BlockRow>
            </Block>
            <Title>{t('리포트 목록')}</Title>
            <Block>
              <OpenLinkReportList reports={openLink.testruns} />
            </Block>
            <Title>{t('코멘트')}</Title>
            <Block className="viewer-block">
              {openLink.comment && <Viewer theme={theme === 'DARK' ? 'dark' : 'white'} initialValue={openLink.comment || '<span className="none-text">&nbsp;</span>'} />}
              {!openLink.comment && <EmptyContent border>{t('코멘트가 없습니다.')}</EmptyContent>}
            </Block>
            <Title>{t('관리')}</Title>
            <Block danger>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('오픈 링크 공유 중지')}</Label>
                <Button size="sm" color="danger" onClick={onStop}>
                  {t('공유 중지')}
                </Button>
              </BlockRow>
              <BlockRow>
                <Label minWidth={labelMinWidth}>{t('오픈 링크 삭제')}</Label>
                <Button size="sm" color="danger" onClick={onDelete}>
                  {t('오픈 링크 삭제')}
                </Button>
              </BlockRow>
            </Block>
            <PageButtons
              onBack={() => {
                navigate(-1);
              }}
              onCancelIcon=""
              onInfo={() => {
                setOpened(true);
              }}
              onInfoText={t('미리 보기')}
            />
          </PageContent>
        )}
      </Page>
      {opened && <OpenLinkReportPopup token={openLink.token} setOpened={setOpened} />}
    </>
  );
}

OpenLinkInfoPage.defaultProps = {};

OpenLinkInfoPage.propTypes = {};

export default OpenLinkInfoPage;
