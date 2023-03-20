import React, { useEffect, useState } from 'react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Block, BlockRow, Button, CheckBox, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Text } from '@/components';
import dateUtil from '@/utils/dateUtil';

const updatePopupLabelMinWidth = '140px';

function TokenDialog({ className, setOpened, setToken, token: initToken }) {
  const { t } = useTranslation();
  const { controlStore } = useStores();

  const [currentUserToken, setCurrentUserToken] = useState({
    id: '',
    name: '',
    token: '',
    lastAccess: '',
    enabled: true,
  });

  const onKeyDown = e => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      controlStore.setError(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    if (initToken) {
      setCurrentUserToken({
        ...initToken,
      });
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const isEdit = !!currentUserToken.id;

  return (
    <Modal
      size="lg"
      className={`token-dialog-wrapper ${className}`}
      isOpen
      toggle={() => {
        setOpened(false);
      }}
    >
      <Form
        onSubmit={e => {
          e.preventDefault();
          setToken(currentUserToken.id, currentUserToken.name, currentUserToken.enabled);
        }}
      >
        <ModalHeader>{t('토큰 변경')}</ModalHeader>
        <ModalBody>
          <Block>
            <BlockRow>
              <Label minWidth={updatePopupLabelMinWidth}>{t('이름')}</Label>
              <Input
                type="text"
                value={currentUserToken.name}
                onChange={val =>
                  setCurrentUserToken({
                    ...currentUserToken,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            {isEdit && (
              <BlockRow>
                <Label minWidth={updatePopupLabelMinWidth}>{t('토큰')}</Label>
                <Text>{currentUserToken.token}</Text>
              </BlockRow>
            )}
            <BlockRow>
              <Label minWidth={updatePopupLabelMinWidth}>{t('활성화 여부')}</Label>
              <CheckBox
                type="checkbox"
                value={currentUserToken.enabled}
                onChange={val => {
                  setCurrentUserToken({
                    ...currentUserToken,
                    enabled: val,
                  });
                }}
              />
            </BlockRow>
            {isEdit && (
              <BlockRow>
                <Label minWidth={updatePopupLabelMinWidth}>{t('마지막 사용일시')}</Label>
                <Text>{dateUtil.getDateString(currentUserToken.lastAccess)}</Text>
              </BlockRow>
            )}
          </Block>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              setOpened(false);
            }}
          >
            {t('취소')}
          </Button>
          <Button type="submit">{t('저장')}</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

TokenDialog.defaultProps = {
  className: '',
  token: null,
};

TokenDialog.propTypes = {
  className: PropTypes.string,
  setOpened: PropTypes.func.isRequired,
  token: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    token: PropTypes.string,
    lastAccess: PropTypes.string,
    enabled: PropTypes.bool,
  }),
  setToken: PropTypes.func.isRequired,
};

export default TokenDialog;
