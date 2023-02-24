import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, CheckBox, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './HolidayEditPopup.scss';

const labelMinWidth = '100px';

function HolidayEditPopup({ data, setOpened, onApply }) {
  const { t } = useTranslation();

  const isEdit = data.index !== null;

  const [holiday, setHoliday] = useState({
    id: null,
    index: null,
    isRegular: true,
    date: '',
    name: '',
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
                {t('정기 휴일')}
              </Label>
              <CheckBox
                type="checkbox"
                value={holiday.isRegular}
                onChange={val =>
                  setHoliday({
                    ...holiday,
                    isRegular: val,
                  })
                }
              />
            </BlockRow>
            <BlockRow className="date-row">
              <Label minWidth={labelMinWidth} required>
                {t('날짜')}
              </Label>
              <Input
                type="text"
                placeholder={holiday.isRegular ? 'MMDD' : 'YYYYMMDD'}
                value={holiday.date}
                pattern={holiday.isRegular ? '[0-9]{4}' : '[0-9]{8}'}
                onChange={val =>
                  setHoliday({
                    ...holiday,
                    date: val,
                  })
                }
                required
                minLength={1}
                maxLength={holiday.isRegular ? 4 : 8}
              />
            </BlockRow>
            <div className="description">{holiday.isRegular ? t('정기 휴일은 MMDD 형식으로 입력해주세요.') : t('지정 휴일은 YYYYMMDD 형식으로 입력해주세요.')}</div>
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
    index: PropTypes.number,
    isRegular: PropTypes.bool,
    date: PropTypes.string,
    name: PropTypes.string,
  }),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default HolidayEditPopup;
