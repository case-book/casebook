import React, { useEffect, useMemo, useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import './VariableCommonPopup.scss';

const labelMinWidth = '100px';

function VariableEditPopup({ data, setOpened, onSave, onDelete }) {
  const { t } = useTranslation();

  const [spaceVariable, setSpaceVariable] = useState({
    id: null,
    name: '',
  });

  const isEdit = useMemo(() => {
    return !!data?.id;
  }, [data]);

  useEffect(() => {
    setSpaceVariable({ ...data });
  }, [data]);

  return (
    <Modal
      isOpen
      className="variable-common-popup-wrapper"
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form
        onSubmit={e => {
          e.preventDefault();
          onSave(spaceVariable);
        }}
      >
        <ModalHeader>{isEdit ? t('변수 변경') : t('변수 추가')}</ModalHeader>
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
          <div className="controls">
            <div className="delete">
              {isEdit && (
                <Button
                  color="danger"
                  onClick={() => {
                    dialogUtil.setConfirm(
                      MESSAGE_CATEGORY.WARNING,
                      t('변수 삭제'),
                      <div>{t('변수와 변수에 등록된 프로파일 변수가 모두 삭제됩니다. 삭제하시겠습니까?')}</div>,
                      () => {
                        onDelete(data.id);
                      },
                      null,
                      t('삭제'),
                      null,
                      'danger',
                    );
                  }}
                >
                  {t('삭제')}
                </Button>
              )}
            </div>
            <div className="others">
              <Button onClick={() => setOpened(false)}>{t('취소')}</Button>
              <Button type="submit">{t('저장')}</Button>
            </div>
          </div>
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
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default VariableEditPopup;
