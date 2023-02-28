import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Radio, Selector } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './HolidayEditPopup.scss';
import { HOLIDAY_CONDITION_DAY_LIST, HOLIDAY_CONDITION_MONTH_LIST, HOLIDAY_CONDITION_WEEK_LIST, HOLIDAY_TYPE_CODE } from '@/constants/constants';

const labelMinWidth = '100px';

function HolidayEditPopup({ data, setOpened, onApply }) {
  const { t } = useTranslation();

  const isEdit = data.index !== null;

  const [holiday, setHoliday] = useState({
    id: null,
    index: null,
    holidayType: 'YEARLY',
    date: '',
    name: '',
    months: null,
    week: null,
    day: null,
  });

  useEffect(() => {
    if (data?.index !== null) {
      setHoliday({ ...data });
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    onApply(holiday);
    setOpened(false);
  };

  return (
    <Modal
      className="holiday-edit-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader>{isEdit ? t('휴일 변경') : t('휴일 등록')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth} tip={t('정기 휴일은 년 단위로 반복되는 휴일을 의미하며, 지정 휴일은 지정된 날짜만 휴일로 지정합니다.')}>
                {t('휴일 타입')}
              </Label>
              {Object.keys(HOLIDAY_TYPE_CODE).map(key => {
                return (
                  <Radio
                    key={key}
                    type="inline"
                    value={key}
                    checked={holiday.holidayType === key}
                    onChange={val => {
                      if (holiday.holidayType !== val) {
                        if (val === 'CONDITION') {
                          setHoliday({
                            ...holiday,
                            holidayType: val,
                            month: -1,
                            week: -1,
                            day: 1,
                          });
                        } else {
                          setHoliday({
                            ...holiday,
                            holidayType: val,
                          });
                        }
                      }
                    }}
                    label={HOLIDAY_TYPE_CODE[key]}
                  />
                );
              })}
            </BlockRow>
            {(holiday.holidayType === 'YEARLY' || holiday.holidayType === 'SPECIFIED_DATE') && (
              <>
                <BlockRow className="date-row">
                  <Label minWidth={labelMinWidth} required>
                    {t('날짜')}
                  </Label>
                  <Input
                    type="text"
                    placeholder={holiday.holidayType === 'YEARLY' ? 'MMDD' : 'YYYYMMDD'}
                    value={holiday.date}
                    pattern={holiday.holidayType === 'YEARLY' ? '[0-9]{4}' : '[0-9]{8}'}
                    onChange={val =>
                      setHoliday({
                        ...holiday,
                        date: val,
                      })
                    }
                    required
                    minLength={1}
                    maxLength={holiday.holidayType === 'YEARLY' ? 4 : 8}
                  />
                </BlockRow>
                <div className="description">{holiday.holidayType === 'YEARLY' ? t('정기 휴일은 MMDD 형식으로 입력해주세요.') : t('지정 휴일은 YYYYMMDD 형식으로 입력해주세요.')}</div>
              </>
            )}
            {holiday.holidayType === 'CONDITION' && (
              <BlockRow className="condition-row">
                <Label minWidth={labelMinWidth} required>
                  {t('조건')}
                </Label>
                <Selector
                  className="selector"
                  items={HOLIDAY_CONDITION_MONTH_LIST}
                  value={holiday.month}
                  onChange={val => {
                    setHoliday({
                      ...holiday,
                      month: val,
                    });
                  }}
                />
                <Selector
                  className="selector"
                  items={HOLIDAY_CONDITION_WEEK_LIST}
                  value={holiday.week}
                  onChange={val => {
                    setHoliday({
                      ...holiday,
                      week: val,
                    });
                  }}
                />
                <Selector
                  className="selector"
                  items={HOLIDAY_CONDITION_DAY_LIST}
                  value={holiday.day}
                  onChange={val => {
                    setHoliday({
                      ...holiday,
                      day: val,
                    });
                  }}
                />
              </BlockRow>
            )}

            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('이름')}
              </Label>
              <Input
                type="text"
                value={holiday.name}
                onChange={val =>
                  setHoliday({
                    ...holiday,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
          </Block>
        </ModalBody>
        <ModalFooter className="modal-footer">
          <Button onClick={() => setOpened(false)}>{t('취소')}</Button>
          <Button type="submit">{isEdit ? t('변경') : t('추가')}</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

HolidayEditPopup.defaultProps = {
  data: null,
};

HolidayEditPopup.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    holidayType: PropTypes.string,
    index: PropTypes.number,
    date: PropTypes.string,
    name: PropTypes.string,
    month: PropTypes.number,
    week: PropTypes.number,
    day: PropTypes.number,
  }),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default HolidayEditPopup;
