import React, { useEffect, useMemo, useState } from 'react';
import { Block, Button, CheckBox, DatePicker, Form, Input, Label, Liner, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import ProjectService from '@/services/ProjectService';
import SpaceService from '@/services/SpaceService';
import './OpenLinkEditPage.scss';
import DateCustomInput from '@/components/DateRange/DateCustomInput/DateCustomInput';
import SelectOpenLinkTestrunPopup from '@/pages/spaces/projects/links/OpenLinkEditPage/SelectOpenLinkTestrunPopup/SelectOpenLinkTestrunPopup';
import dateUtil from '@/utils/dateUtil';
import OpenLinkService from '@/services/OpenLinkService';

const labelMinWidth = '160px';

function OpenLinkEditPage({ type }) {
  const { t } = useTranslation();

  const { projectId, spaceCode } = useParams();

  const navigate = useNavigate();

  const [project, setProject] = useState({});
  const [openedSelectPopup, setOpenedSelectPopup] = useState(false);
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

  const onSubmit = e => {
    e.preventDefault();
    const request = {
      ...openLink,
      testrunIds: openLink.testruns.map(report => report.id),
    };
    OpenLinkService.createOpenLinkInfo(spaceCode, projectId, request, d => {
      console.log(d);
    });
  };

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
          <Form onSubmit={onSubmit}>
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
            <Title
              control={
                <Button
                  outline
                  size="sm"
                  onClick={() => {
                    setOpenedSelectPopup(true);
                  }}
                >
                  {t('추가')}
                </Button>
              }
            >
              {t('리포트 목록')}
            </Title>
            <Block>
              <ul className="report-list">
                {openLink.testruns.map(report => {
                  return (
                    <li key={report.id}>
                      <div>
                        <div className="report-name">
                          <div className="name">{report.name}</div>
                          <div className="testrun-others">
                            <div className="time-info">
                              <div className="calendar">
                                <i className="fa-regular fa-clock" />
                              </div>
                              {report.startDateTime && <div>{dateUtil.getDateString(report.startDateTime, 'monthsDaysHoursMinutes')}</div>}
                              <div className={`end-date-info ${!report.startDateTime ? 'no-start-time' : ''}`}>
                                {(report.startDateTime || report.closedDate || report.endDateTime) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.5rem" />}
                                {report.startDateTime && (report.closedDate || report.endDateTime) && (
                                  <span>{dateUtil.getEndDateString(report.startDateTime, report.closedDate || report.endDateTime)}</span>
                                )}
                                {!report.startDateTime && (report.closedDate || report.endDateTime) && <span>{dateUtil.getDateString(report.closedDate || report.endDateTime)}</span>}
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
              onSubmit={() => {}}
              onSubmitText={t('저장')}
            />
          </Form>
        </PageContent>
      </Page>
      {openedSelectPopup && (
        <SelectOpenLinkTestrunPopup
          spaceCode={spaceCode}
          projectId={projectId}
          setOpened={setOpenedSelectPopup}
          onApply={selectedTestruns => {
            setOpenedSelectPopup(false);
            setOpenLink({
              ...openLink,
              testruns: selectedTestruns,
            });
          }}
          testruns={openLink.testruns}
        />
      )}
    </>
  );
}

OpenLinkEditPage.defaultProps = {
  type: 'new',
};

OpenLinkEditPage.propTypes = {
  type: PropTypes.string,
};

export default OpenLinkEditPage;
