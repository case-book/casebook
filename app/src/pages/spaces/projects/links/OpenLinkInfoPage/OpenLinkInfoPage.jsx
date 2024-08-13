import React, { useEffect, useMemo, useState } from 'react';
import { Block, CheckBox, DatePicker, Input, Label, Liner, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import SpaceService from '@/services/SpaceService';
import './OpenLinkInfoPage.scss';
import ReportService from '@/services/ReportService';
import DateCustomInput from '@/components/DateRange/DateCustomInput/DateCustomInput';
import dateUtil from '@/utils/dateUtil';
import OpenLinkService from '@/services/OpenLinkService';
import OpenLinkReportPopup from '@/pages/spaces/projects/links/OpenLinkInfoPage/OpenLinkReportPopup/OpenLinkReportPopup';

const labelMinWidth = '160px';

function OpenLinkInfoPage({ type }) {
  const { t } = useTranslation();

  const { projectId, spaceCode, openLinkId } = useParams();

  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);

  const [project, setProject] = useState({});

  const [reports, setReports] = useState([]);
  const [spaceName, setSpaceName] = useState('');

  const [openLink, setOpenLink] = useState({
    id: null,
    name: '',
    token: '',
    testruns: [],
    openEndDateTime: null,
    opened: true,
  });

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  const selectReportList = pageNo => {
    ReportService.selectPagingReportList(spaceCode, projectId, pageNo, list => {
      setReports(list);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    ProjectService.selectProjectName(spaceCode, projectId, info => {
      setProject(info);
    });

    selectReportList(0);
  }, [projectId]);

  console.log(reports);

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

  return (
    <>
      <Page className="open-link-edit-page-wrapper">
        <PageTitle
          name={isEdit ? t('오픈 링크 변경') : t('오픈 링크 생성')}
          breadcrumbs={
            isEdit
              ? [
                  {
                    to: '/',
                    text: t('HOME'),
                  },
                  {
                    to: '/',
                    text: t('스페이스 목록'),
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
                    to: `/spaces/${spaceCode}/projects/${projectId}/info`,
                    text: project?.name,
                  },
                  {
                    to: `/spaces/${spaceCode}/edit`,
                    text: t('변경'),
                  },
                ]
              : [
                  {
                    to: '/',
                    text: t('HOME'),
                  },
                  {
                    to: '/',
                    text: t('스페이스 목록'),
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
                    to: `/spaces/${spaceCode}/projects/new`,
                    text: t('생성'),
                  },
                ]
          }
          onListClick={() => {
            navigate(`/spaces/${spaceCode}/projects`);
          }}
        >
          {type === 'edit' ? t('오픈 링크') : t('새 오픈 링크')}
        </PageTitle>
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
              <Label minWidth={labelMinWidth} required>
                {t('이름')}
              </Label>
              <Input
                value={openLink.name}
                onChange={val =>
                  setOpenLink({
                    ...openLink,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('오픈')}</Label>
              <CheckBox
                size="sm"
                type="checkbox"
                value={openLink.opened}
                onChange={val =>
                  setOpenLink({
                    ...openLink,
                    opened: val,
                  })
                }
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('공유 마감')}
              </Label>
              <div className="iteration-period">
                <DatePicker
                  className="date-picker start-date-picker"
                  date={openLink.openEndDateTime}
                  showTimeSelect
                  onChange={date => {
                    setOpenLink({
                      ...openLink,
                      openEndDateTime: date,
                    });
                  }}
                  customInput={<DateCustomInput />}
                />
              </div>
            </BlockRow>
          </Block>
          <Title>{t('리포트 목록')}</Title>
          <Block>
            <ul className="report-list">
              {openLink?.testruns?.map(testrun => {
                return (
                  <li key={testrun.id}>
                    <div>
                      <div className="report-name">
                        <div className="name">{testrun.name}</div>
                        <div className="testrun-others">
                          <div className="time-info">
                            <div className="calendar">
                              <i className="fa-regular fa-clock" />
                            </div>
                            {testrun.startDateTime && <div>{dateUtil.getDateString(testrun.startDateTime, 'monthsDaysHoursMinutes')}</div>}
                            <div className={`end-date-info ${!testrun.startDateTime ? 'no-start-time' : ''}`}>
                              {(testrun.startDateTime || testrun.closedDate || testrun.endDateTime) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.5rem" />}
                              {testrun.startDateTime && (testrun.closedDate || testrun.endDateTime) && (
                                <span>{dateUtil.getEndDateString(testrun.startDateTime, testrun.closedDate || testrun.endDateTime)}</span>
                              )}
                              {!testrun.startDateTime && (testrun.closedDate || testrun.endDateTime) && <span>{dateUtil.getDateString(testrun.closedDate || testrun.endDateTime)}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Block>
          <PageButtons
            onCancel={() => {
              navigate(-1);
            }}
            onInfo={() => {
              setOpened(true);
            }}
            onInfoText={t('리포트 보기')}
          />
        </PageContent>
      </Page>
      {opened && <OpenLinkReportPopup token={openLink.token} setOpened={setOpened} />}
    </>
  );
}

OpenLinkInfoPage.defaultProps = {
  type: 'new',
};

OpenLinkInfoPage.propTypes = {
  type: PropTypes.string,
};

export default OpenLinkInfoPage;
