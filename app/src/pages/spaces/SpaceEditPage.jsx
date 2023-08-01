import React, { useEffect, useMemo, useState } from 'react';
import {
  Block,
  Button,
  CheckBox,
  EmptyContent,
  Form,
  Input,
  Label,
  Liner,
  Page,
  PageButtons,
  PageContent,
  PageTitle,
  ReactSelect,
  Selector,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  TextArea,
  Th,
  THead,
  Title,
  Tr,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SpaceService from '@/services/SpaceService';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import useStores from '@/hooks/useStores';
import dialogUtil from '@/utils/dialogUtil';
import {
  COUNTRIES,
  DATE_FORMATS,
  DEFAULT_HOLIDAY,
  HOLIDAY_CONDITION_DAY_LIST,
  HOLIDAY_CONDITION_MONTH_LIST,
  HOLIDAY_CONDITION_WEEK_LIST,
  HOLIDAY_TYPE_CODE,
  MESSAGE_CATEGORY,
} from '@/constants/constants';
import MemberCardManager from '@/components/MemberManager/MemberCardManager';
import './SpaceEditPage.scss';
import dateUtil from '@/utils/dateUtil';
import moment from 'moment';
import ConfigService from '@/services/ConfigService';
import { cloneDeep } from 'lodash';
import HolidayEditPopup from '@/pages/spaces/HolidayEditPopup';
import PropTypes from 'prop-types';
import JiraIntegrationEditPopup from '@/pages/spaces/JiraIntegrationEditPopup';

function SpaceEditPage({ type }) {
  const { t } = useTranslation();
  const { spaceCode } = useParams();

  const {
    userStore: { addSpace, language, country },
  } = useStores();

  const navigate = useNavigate();

  const [space, setSpace] = useState({
    name: '',
    code: '',
    description: '',
    activated: true,
    token: uuidv4(),
    allowSearch: true,
    allowAutoJoin: false,
    timeZone: null, // country === 'KR' ? 'Asia/Seoul' : 'US/Central',
    country,
    holidays: country === 'KR' ? cloneDeep(DEFAULT_HOLIDAY.KR) : cloneDeep(DEFAULT_HOLIDAY.US),
  });

  const [integration, setIntegration] = useState();
  const [timeZoneList, setTimeZoneList] = useState([]);

  const [holidayPopupInfo, setHolidayPopupInfo] = useState({
    isOpened: false,
    index: null,
    id: null,
    holidayType: 'YEARLY',
    date: '',
    name: '',
    month: null,
    week: null,
    day: null,
  });

  const [jiraIntegrationPopupInfo, setJiraIntegrationPopupInfo] = useState({
    id: null,
    name: null,
    apiUrl: null,
    apiToken: null,
    isOpened: false,
  });

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    window.scrollTo(0, 0);
    ConfigService.selectTimeZoneList(language || 'ko', list => {
      const zoneList = list.map(timeZone => {
        return {
          value: timeZone.zoneId,
          label: `${timeZone.zoneId} (${timeZone.name})`,
        };
      });

      zoneList.sort((a, b) => {
        if (a.zoneId < b.zoneId) {
          return -1;
        }
        if (a.zoneId > b.zoneId) {
          return 1;
        }
        return 0;
      });

      setTimeZoneList(zoneList);

      if (!isEdit) {
        const defaultTimeZoneId = country === 'KR' ? 'Asia/Seoul' : 'US/Central';
        let defaultTimeZone = zoneList.find(d => d.value === defaultTimeZoneId);
        if (!defaultTimeZone) {
          if (zoneList.length > 0) {
            const [firstZone] = zoneList;
            defaultTimeZone = firstZone;
          }
        }

        setSpace({
          ...space,
          timeZone: defaultTimeZone,
        });
      } else if (spaceCode && isEdit) {
        SpaceService.selectSpaceInfo(spaceCode, info => {
          setSpace({
            ...info,
            timeZone: zoneList.find(d => d.value === info.timeZone),
          });
        });
        SpaceService.getIntegrationInfo(spaceCode, res => setIntegration({ ...res }));
      }
    });
  }, [type, spaceCode]);

  const onSubmit = e => {
    e.preventDefault();

    const spaceInfo = {
      ...space,
      timeZone: space.timeZone?.value,
    };

    if (type === 'new') {
      SpaceService.createSpace(spaceInfo, result => {
        addSpace(result);
        navigate('/spaces');
      });
    } else if (isEdit) {
      if ((spaceInfo?.users?.filter(d => d.crud !== 'D') || []).length < 1) {
        dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '스페이스 사용자 오류', '최소한 1명의 스페이스 사용자는 존재해야 합니다.');
        return;
      }

      if ((spaceInfo?.users?.filter(d => d.crud !== 'D' && d.role === 'ADMIN') || []).length < 1) {
        dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '스페이스 사용자 오류', '최소한 1명의 스페이스 관리자는 지정되어야 합니다.');
        return;
      }

      SpaceService.updateSpace(spaceInfo, () => {
        navigate(`/spaces/${spaceCode}/info`);
      });
    }
  };

  const changeSpaceUserRole = (userId, field, value) => {
    const next = { ...space };
    const spaceUser = next.users.find(d => d.userId === userId);
    spaceUser.crud = 'U';
    spaceUser[field] = value;
    setSpace(next);
  };

  const removeSpaceUser = userId => {
    const next = { ...space };
    const spaceUser = next.users.find(d => d.userId === userId);
    spaceUser.crud = 'D';
    setSpace(next);
  };

  const undoRemovalSpaceUser = userId => {
    const next = { ...space };
    const spaceUser = next.users.find(d => d.userId === userId);
    spaceUser.crud = 'U';
    setSpace(next);
  };

  return (
    <>
      <Page className="space-edit-page-wrapper">
        <PageTitle
          name={isEdit ? t('스페이스 편집') : t('스페이스 생성')}
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
                    text: space?.name,
                  },
                  {
                    to: `/spaces/${spaceCode}/edit`,
                    text: t('편집'),
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
                    to: '/spaces/new',
                    text: t('생성'),
                  },
                ]
          }
          onListClick={() => {
            navigate('/spaces');
          }}
        >
          {isEdit ? t('스페이스 편집') : t('새 스페이스')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title border={false} marginBottom={false}>
              {t('스페이스 정보')}
            </Title>
            <Block>
              <BlockRow>
                <Label required>{t('이름')}</Label>
                <Input
                  placeholder="스페이스 이름을 입력해주세요."
                  value={space.name}
                  onChange={val =>
                    setSpace({
                      ...space,
                      name: val,
                    })
                  }
                  required
                  minLength={1}
                />
              </BlockRow>
              <BlockRow>
                <Label required>{t('코드')}</Label>
                {!isEdit && (
                  <Input
                    className="code"
                    value={space.code}
                    placeholder="대문자 및 숫자, -, _ 기호로 코드를 입력할 수 있습니다. (최소 3자, 대문자로 시작 필수)"
                    pattern="^([A-Z]+)([A-Z0-9\-_]){2,}$"
                    disabled={isEdit}
                    onChange={val =>
                      setSpace({
                        ...space,
                        code: val.toUpperCase(),
                      })
                    }
                    required
                    minLength={3}
                  />
                )}
                {isEdit && <Text>{space.code}</Text>}
              </BlockRow>
              <BlockRow>
                <Label>{t('설명')}</Label>
                <TextArea
                  placeholder="스페이스에 대한 설명을 입력해주세요."
                  value={space.description || ''}
                  rows={4}
                  onChange={val => {
                    setSpace({
                      ...space,
                      description: val,
                    });
                  }}
                />
              </BlockRow>
              <BlockRow>
                <Label>{t('사용 여부')}</Label>
                <CheckBox
                  type="checkbox"
                  value={space.activated}
                  label="전체 스페이스의 기능을 ON/OFF 할 수 있습니다."
                  onChange={val =>
                    setSpace({
                      ...space,
                      activated: val,
                    })
                  }
                />
              </BlockRow>
              <BlockRow>
                <Label>{t('검색 허용')}</Label>
                <CheckBox
                  type="checkbox"
                  value={space.allowSearch}
                  label="스페이스 검색 결과 포함 여부를 설정할 수 있습니다."
                  onChange={val =>
                    setSpace({
                      ...space,
                      allowSearch: val,
                    })
                  }
                />
              </BlockRow>
              <BlockRow>
                <Label>{t('자동 가입')}</Label>
                <CheckBox
                  type="checkbox"
                  value={space.allowAutoJoin}
                  label="가입 신청 과정 없이 바로 스페이스에 사용자가 참여할 수 있습니다."
                  onChange={val =>
                    setSpace({
                      ...space,
                      allowAutoJoin: val,
                    })
                  }
                />
              </BlockRow>
              <BlockRow>
                <Label required tip={t('스페이스의 타임존은 휴일 관리에 입력된 조건들을 통해 휴일임을 판단하기 위한 용도로만 사용됩니다.')}>
                  {t('타임존')}
                </Label>
                <ReactSelect
                  minWidth="300px"
                  value={space.timeZone}
                  onChange={value => {
                    setSpace({
                      ...space,
                      timeZone: value,
                    });
                  }}
                  options={timeZoneList}
                  defaultValue={space.timeZone}
                />
              </BlockRow>
              <BlockRow>
                <Label tip={t('스페이스의 지역은 기본 휴일 데이터를 제안하기 위한 용도로만 사용됩니다.')}>{t('지역')}</Label>
                <Selector
                  className="selector"
                  items={[{ key: '', value: t('없음') }].concat(
                    Object.keys(COUNTRIES).map(d => {
                      return {
                        key: d,
                        value: COUNTRIES[d],
                      };
                    }),
                  )}
                  value={space.country}
                  onChange={val => {
                    if (val !== space.country) {
                      dialogUtil.setConfirm(
                        MESSAGE_CATEGORY.WARNING,
                        t('기본 휴일 목록 초기화 확인'),
                        t('휴일 관리 목록을 모두 초기화하고, 변경된 지역으로 미리 지정된 휴일 목록으로 다시 설정하시겠습니까?'),
                        () => {
                          setSpace({
                            ...space,
                            country: val,
                            holidays: cloneDeep(DEFAULT_HOLIDAY[val] || []),
                          });
                        },
                        null,
                        t('설정'),
                      );
                    }
                    setSpace({
                      ...space,
                      country: val,
                    });
                  }}
                />
              </BlockRow>
              <BlockRow>
                <Label>{t('토큰')}</Label>
                <Text inline>{space.token}</Text>
                <Button
                  rounded
                  size="sm"
                  outline
                  onClick={() => {
                    setSpace({
                      ...space,
                      token: uuidv4(),
                    });
                  }}
                >
                  <i className="fa-solid fa-arrows-rotate" />
                </Button>
              </BlockRow>
            </Block>
            {isEdit && (
              <>
                <Title>{t('스페이스 사용자')}</Title>
                <Block>
                  <MemberCardManager users={space?.users} edit onChangeUserRole={changeSpaceUserRole} onUndoRemovalUser={undoRemovalSpaceUser} onRemoveUser={removeSpaceUser} />
                </Block>
              </>
            )}
            {isEdit && (
              <>
                <Title
                  icon={<i className="fa-brands fa-jira" />}
                  control={
                    <Button
                      size="xs"
                      color="primary"
                      onClick={() => {
                        setJiraIntegrationPopupInfo({
                          ...jiraIntegrationPopupInfo,
                          isOpened: true,
                        });
                      }}
                    >
                      {t('수정')}
                    </Button>
                  }
                >
                  {t('Jira Integration')}
                </Title>
                <Block>
                  <BlockRow>
                    <Label>{t('이름')}</Label>
                    <Text>{integration?.jira.name ? integration.jira.name : 'N/A'}</Text>
                  </BlockRow>
                  <BlockRow>
                    <Label>{t('API URL')}</Label>
                    <Text>{integration?.jira.apiUrl ? integration.jira.apiUrl : 'N/A'}</Text>
                  </BlockRow>
                  <BlockRow>
                    <Label>{t('API Token')}</Label>
                    <Text>{integration?.jira.apiToken ? integration.jira.apiToken : 'N/A'}</Text>
                  </BlockRow>
                </Block>
              </>
            )}
            <Title
              control={
                <Button
                  size="xs"
                  color="primary"
                  onClick={() => {
                    setHolidayPopupInfo({
                      isOpened: true,
                      index: null,
                    });
                  }}
                >
                  {t('휴일 추가')}
                </Button>
              }
            >
              {t('휴일 관리')}
            </Title>
            <Block className="block">
              {!(space.holidays?.length > 0) && (
                <EmptyContent className="empty-content">
                  <div>{t('등록된 휴일이 없습니다.')}</div>
                </EmptyContent>
              )}
              {space.holidays?.length > 0 && (
                <Table cols={['1px', '1px', '100%', '1px']} border>
                  <THead>
                    <Tr>
                      <Th align="center">{t('타입')}</Th>
                      <Th align="left">{t('이름')}</Th>
                      <Th align="left">{t('조건')}</Th>
                      <Th />
                    </Tr>
                  </THead>
                  <Tbody>
                    {space.holidays.map((holiday, inx) => {
                      let holidayDate;
                      if (holiday.holidayType === 'YEARLY') {
                        holidayDate = moment(holiday.date, 'MMDD');
                      } else if (holiday.holidayType === 'SPECIFIED_DATE') {
                        holidayDate = moment(holiday.date, 'YYYYMMDD');
                      }

                      return (
                        <Tr key={inx}>
                          <Td align="center">
                            <Tag size="sm" color="white" border>
                              {HOLIDAY_TYPE_CODE[holiday.holidayType]}
                            </Tag>
                          </Td>
                          <Td>{holiday.name}</Td>
                          {(holiday.holidayType === 'YEARLY' || holiday.holidayType === 'SPECIFIED_DATE') && (
                            <Td className={`date-condition ${holidayDate.isValid() ? '' : 'invalid'}`}>
                              {holidayDate.isValid()
                                ? holidayDate.format(DATE_FORMATS[dateUtil.getUserLocale()][holiday.holidayType === 'SPECIFIED_DATE' ? 'yearsDays' : 'days'].moment)
                                : t('잘못된 날짜')}
                            </Td>
                          )}
                          {holiday.holidayType === 'CONDITION' && (
                            <Td className="condition">
                              <Tag size="sm" color="white" border>
                                {HOLIDAY_CONDITION_MONTH_LIST.find(d => d.key === holiday.month)?.value || ''}
                              </Tag>
                              <Tag size="sm" color="white" border>
                                {HOLIDAY_CONDITION_WEEK_LIST.find(d => d.key === holiday.week)?.value || ''}
                              </Tag>
                              <Tag size="sm" color="white" border>
                                {HOLIDAY_CONDITION_DAY_LIST.find(d => d.key === holiday.day)?.value || ''}
                              </Tag>
                            </Td>
                          )}
                          <Td>
                            <Button
                              size="xs"
                              color="danger"
                              onClick={() => {
                                const nextHolidays = space.holidays.slice(0);
                                nextHolidays.splice(inx, 1);
                                setSpace({
                                  ...space,
                                  holidays: nextHolidays,
                                });
                              }}
                            >
                              {t('삭제')}
                            </Button>
                            <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 0.5rem " />
                            <Button
                              size="xs"
                              color="primary"
                              onClick={() => {
                                setHolidayPopupInfo({
                                  ...holiday,
                                  isOpened: true,
                                  index: inx,
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
            <PageButtons
              onCancel={() => {
                if (isEdit) {
                  navigate(`/spaces/${spaceCode}/info`);
                } else {
                  navigate('/');
                }
              }}
              onSubmit={() => {}}
              onCancelIcon=""
            />
          </Form>
        </PageContent>
      </Page>
      {holidayPopupInfo.isOpened && (
        <HolidayEditPopup
          data={holidayPopupInfo}
          setOpened={() => {
            setHolidayPopupInfo({
              isOpened: false,
            });
          }}
          onApply={holiday => {
            const nextHolidays = space.holidays.slice(0);
            if (holiday.index === null) {
              nextHolidays.push(holiday);
            } else {
              const nextHoliday = nextHolidays[holiday.index];
              nextHoliday.id = holiday.id;
              nextHoliday.holidayType = holiday.holidayType;
              nextHoliday.month = holiday.month;
              nextHoliday.week = holiday.week;
              nextHoliday.day = holiday.day;
              nextHoliday.date = holiday.date;
              nextHoliday.name = holiday.name;
            }

            setSpace({
              ...space,
              holidays: nextHolidays,
            });
          }}
        />
      )}
      {jiraIntegrationPopupInfo.isOpened && (
        <JiraIntegrationEditPopup
          data={integration?.jira || {}}
          setOpened={() => {
            setJiraIntegrationPopupInfo({ isOpened: false });
          }}
          onApply={info => {
            SpaceService.updateJiraIntegration(space.code, info, () => {
              SpaceService.getIntegrationInfo(spaceCode, res => setIntegration({ ...res }));
            });
          }}
        />
      )}
    </>
  );
}

SpaceEditPage.defaultProps = {
  type: 'new',
};

SpaceEditPage.propTypes = {
  type: PropTypes.string,
};

export default SpaceEditPage;
