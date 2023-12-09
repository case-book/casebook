import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const labelMinWidth = '100px';

function ProfileVariableEditPopup({ data, setOpened, onApply, onDelete }) {
  const { t } = useTranslation();

  const isEdit = !!data?.id;

  const [spaceProfileVariable, setSpaceProfileVariable] = useState({
    id: null,
    value: '',
    spaceVariableId: null,
    spaceProfileId: null,
  });

  useEffect(() => {
    setSpaceProfileVariable({
      ...data,
    });
  }, [data]);

  const onSubmit = e => {
    e.preventDefault();
    console.log(data);
    onApply(data.spaceVariable.id, data.spaceProfile.id, spaceProfileVariable);
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
        <ModalHeader>{isEdit ? t('프로파일 변수 변경') : t('프로파일 변수 등록')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('값')}
              </Label>
              <Input
                type="text"
                value={spaceProfileVariable.value}
                onChange={val =>
                  setSpaceProfileVariable({
                    ...spaceProfileVariable,
                    value: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
          </Block>
        </ModalBody>
        <ModalFooter className="modal-footer">
          {isEdit && (
            <Button
              onClick={() => {
                onDelete(data);
              }}
            >
              {t('삭제')}
            </Button>
          )}
          <Button onClick={() => setOpened(false)}>{t('취소')}</Button>
          <Button type="submit">{isEdit ? t('변경') : t('추가')}</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

ProfileVariableEditPopup.defaultProps = {
  data: null,
};

ProfileVariableEditPopup.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    value: PropTypes.string,
    spaceVariable: PropTypes.shape({
      id: PropTypes.number,
    }),
    spaceProfile: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfileVariableEditPopup;
