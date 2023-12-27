import React, { useEffect, useState } from 'react';
import { Button, CheckBox, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useStores from '@/hooks/useStores';
import './ProfileSelectPopup.scss';
import SpaceProfileService from '@/services/SpaceProfileService';

function ProfileSelectPopup({ setOpened, onApply, profileIds }) {
  const { t } = useTranslation();
  const {
    contextStore: { spaceCode },
  } = useStores();

  const [spaceProfileList, setSpaceProfileList] = useState([]);
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);

  useEffect(() => {
    SpaceProfileService.selectSpaceProfileList(spaceCode, profiles => {
      setSpaceProfileList(profiles);
    });
  }, [spaceCode]);

  useEffect(() => {
    setSelectedProfileIds(profileIds.slice(0));
  }, [profileIds]);

  return (
    <Modal
      className="profile-select-popup-wrapper"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader className="modal-header">
        <span>{t('프로파일 선택')}</span>
      </ModalHeader>
      <ModalBody>
        <ul>
          {spaceProfileList?.length > 0 &&
            spaceProfileList.map(profile => (
              <li key={profile.id}>
                <div>
                  <div>
                    <CheckBox
                      type="checkbox"
                      size="xs"
                      value={selectedProfileIds.includes(profile.id)}
                      onChange={val => {
                        if (val) {
                          setSelectedProfileIds([...selectedProfileIds, profile.id]);
                        } else {
                          setSelectedProfileIds(selectedProfileIds.filter(id => id !== profile.id));
                        }
                      }}
                    />
                  </div>
                  <div className="profile-name">
                    {profile.name}
                    {selectedProfileIds.includes(profile.id) && (
                      <span className="badge">
                        <span>{selectedProfileIds.findIndex(id => id === profile.id) + 1}</span>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => setOpened(false)}>
          {t('취소')}
        </Button>
        <Button
          outline
          onClick={() => {
            if (onApply) {
              onApply(selectedProfileIds);
            }

            if (setOpened) {
              setOpened(false);
            }
          }}
        >
          {t('확인')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ProfileSelectPopup.defaultProps = {
  profileIds: [],
};

ProfileSelectPopup.propTypes = {
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  profileIds: PropTypes.arrayOf(PropTypes.number),
};

export default ProfileSelectPopup;
