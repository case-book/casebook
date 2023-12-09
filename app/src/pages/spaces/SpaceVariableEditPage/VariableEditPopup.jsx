import React, { useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const labelMinWidth = '100px';

function VariableEditPopup({ data, setOpened, onApply }) {
  const { t } = useTranslation();

  const isEdit = !!data?.id;

  const [spaceVariable, setSpaceVariable] = useState({
    id: null,
    name: '',
  });

  const onSubmit = e => {
    e.preventDefault();
    onApply(spaceVariable);
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
        <ModalHeader>{isEdit ? t('변수 변경') : t('변수 등록')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('이름')}
              </Label>
              <Input
                type="text"
                value={spaceVariable.name}
                onChange={val =>
                  setSpaceVariable({
                    ...spaceVariable,
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

VariableEditPopup.defaultProps = {
  data: null,
};

VariableEditPopup.propTypes = {
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

export default VariableEditPopup;
