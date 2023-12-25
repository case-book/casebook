import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Text } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import './VariableCommonPopup.scss';

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
    onApply(data.spaceVariable.id, data.spaceProfile.id, spaceProfileVariable);
  };

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
      <Form onSubmit={onSubmit}>
        <ModalHeader>{isEdit ? t('프로파일 변수 변경') : t('프로파일 변수 추가')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('변수')}</Label>
              <Text>{data.variableName}</Text>
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('프로파일')}</Label>
              <Text>{data.profileName}</Text>
            </BlockRow>
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
          <div className="controls">
            <div className="delete">
              {isEdit && (
                <Button
                  color="danger"
                  onClick={() => {
                    dialogUtil.setConfirm(
                      MESSAGE_CATEGORY.WARNING,
                      t('프로파일 변수 삭제'),
                      <div>{t('프로파일 변수를 삭제하시겠습니까?')}</div>,
                      () => {
                        onDelete(data);
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
    profileName: PropTypes.string,
    variableName: PropTypes.string,
  }),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfileVariableEditPopup;
