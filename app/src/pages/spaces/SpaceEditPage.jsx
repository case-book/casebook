import React, { useEffect, useMemo, useState } from 'react';
import { Block, Button, CheckBox, EmptyContent, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Table, Tag, Tbody, Td, Text, TextArea, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SpaceService from '@/services/SpaceService';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import useStores from '@/hooks/useStores';
import dialogUtil from '@/utils/dialogUtil';
import { DATE_FORMATS, MESSAGE_CATEGORY } from '@/constants/constants';
import MemberCardManager from '@/components/MemberManager/MemberCardManager';
import HolidayEditPopup from '@/pages/spaces/HolidayEditPopup';
import PropTypes from 'prop-types';
import './SpaceEditPage.scss';
import dateUtil from '@/utils/dateUtil';
import moment from 'moment';

function SpaceEditPage({ type }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    userStore: { addSpace },
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
    holidays: [],
  });

  const [holidayPopupInfo, setHolidayPopupInfo] = useState({
    isOpened: false,
    index: null,
    id: null,
    isRegular: true,
    date: '',
    name: '',
  });

  const isEdit = useMemo(() => {
    return type === 'edit';
  }, [type]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && isEdit) {
      SpaceService.selectSpaceInfo(id, info => {
        setSpace(info);
      });
    }
  }, [type, id]);

  const onSubmit = e => {
    e.preventDefault();

    if (type === 'new') {
      SpaceService.createSpace(space, result => {
        addSpace(result);
        navigate('/spaces');
      });
    } else if (isEdit) {
      if ((space?.users?.filter(d => d.crud !== 'D') || []).length < 1) {
        dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '스페이스 사용자 오류', '최소한 1명의 스페이스 사용자는 존재해야 합니다.');
        return;
      }

      if ((space?.users?.filter(d => d.crud !== 'D' && d.role === 'ADMIN') || []).length < 1) {
        dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, '스페이스 사용자 오류', '최소한 1명의 스페이스 관리자는 지정되어야 합니다.');
        return;
      }

      SpaceService.updateSpace(space, () => {
        navigate(`/spaces/${id}/info`);
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
          onListClick={() => {
            navigate('/spaces');
          }}
        >
          {isEdit ? t('스페이스') : t('새 스페이스')}
        </PageTitle>
        <PageContent>
          <Form onSubmit={onSubmit}>
            <Title>{t('스페이스 정보')}</Title>
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
                    pattern="^([A-Z]+)([A-Z0-9_-]){2,}$"
                    disabled={isEdit}
                    onChange={val =>
                      setSpace({
                        ...space,
                        code: val.toUpperCase(),
                      })
                    }
                    required
                    minLength={1}
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
                  control={
                    <Button
                      size="sm"
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
                    <Table cols={['1px', '1px', '100%']} border>
                      <THead>
                        <Tr>
                          <Th align="center">{t('타입')}</Th>
                          <Th align="left">{t('날짜')}</Th>
                          <Th align="left">{t('이름')}</Th>
                          <Th />
                        </Tr>
                      </THead>
                      <Tbody>
                        {space.holidays.map((holiday, inx) => {
                          let holidayDate;
                          if (holiday.isRegular) {
                            holidayDate = moment(holiday.date, 'MMDD');
                          } else {
                            holidayDate = moment(holiday.date, 'YYYYMMDD');
                          }

                          return (
                            <Tr key={inx}>
                              <Td align="center">
                                <Tag size="sm" color="white" border>
                                  {holiday.isRegular ? t('정기 휴일') : t('지정 휴일')}
                                </Tag>
                              </Td>
                              <Td className={holidayDate.isValid() ? '' : 'invalid'}>
                                {holidayDate.isValid() ? holidayDate.format(DATE_FORMATS[dateUtil.getUserLocale()][holiday.isRegular ? 'days' : 'yearsDays'].moment) : t('잘못된 날짜')}
                              </Td>
                              <Td>{holiday.name}</Td>
                              <Td className="holiday-button">
                                <Button
                                  size="sm"
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
                                <Button
                                  size="sm"
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
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  )}
                </Block>
              </>
            )}
            <PageButtons
              outline
              onCancel={() => {
                if (isEdit) {
                  navigate(`/spaces/${id}/info`);
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
              nextHoliday.isRegular = holiday.isRegular;
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
