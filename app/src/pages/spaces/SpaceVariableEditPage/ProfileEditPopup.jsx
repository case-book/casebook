import React, { useEffect, useMemo, useState } from 'react';
import { Block, BlockRow, Button, CheckBox, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './VariableCommonPopup.scss';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const labelMinWidth = '80px';

function ProfileEditPopup({ data, setOpened, onSave, onDelete }) {
  const { t } = useTranslation();

  const [spaceProfile, setSpaceProfile] = useState({
    id: null,
    name: '',
    default: false,
  });

  const isEdit = useMemo(() => {
    return !!data?.id;
  }, [data]);

  useEffect(() => {
    setSpaceProfile({ ...data });
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
          onSave(spaceProfile);
        }}
      >
        <ModalHeader>{isEdit ? t('프로파일 변경') : t('프로파일 추가')}</ModalHeader>
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
              <Label minWidth={labelMinWidth}>{t('디폴트')}</Label>
              <CheckBox
                type="checkbox"
                value={spaceProfile.default}
                onChange={val => {
                  setSpaceProfile({
                    ...spaceProfile,
                    default: val,
                  });
                }}
              />
            </BlockRow>
            <div className="description" style={{ marginLeft: labelMinWidth }}>
              {t('디폴트 프로파일은 테스트런 생성 시 선택 상태로 표시됩니다.')}
            </div>
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
                      <div>{t('프로파일과 프로파일에 등록된 프로파일 변수가 모두 삭제됩니다. 삭제하시겠습니까?')}</div>,
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
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfileEditPopup;
