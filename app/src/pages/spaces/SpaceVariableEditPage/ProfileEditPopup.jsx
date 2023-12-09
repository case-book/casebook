import React, { useState } from 'react';
import { Block, BlockRow, Button, CheckBox, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const labelMinWidth = '100px';

function ProfileEditPopup({ data, setOpened, onApply }) {
  const { t } = useTranslation();

  const isEdit = !!data?.id;

  const [spaceProfile, setSpaceProfile] = useState({
    id: null,
    name: '',
    isDefault: 'N',
  });

  const onSubmit = e => {
    e.preventDefault();
    onApply(spaceProfile);
  };

  return (
    <Modal
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader>{isEdit ? t('프로파일 변경') : t('프로파일 등록')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('이름')}
              </Label>
              <Input
                type="text"
                value={spaceProfile.name}
                onChange={val =>
                  setSpaceProfile({
                    ...spaceProfile,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('기본 프로파일')}
              </Label>
              <CheckBox
                type="checkbox"
                value={spaceProfile.isDefault === 'Y'}
                onChange={val => {
                  setSpaceProfile({
                    ...spaceProfile,
                    isDefault: val ? 'Y' : 'N',
                  });
                }}
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

ProfileEditPopup.defaultProps = {
  data: null,
};

ProfileEditPopup.propTypes = {
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

export default ProfileEditPopup;
