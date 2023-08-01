import React, { useEffect, useState } from 'react';
import { Block, BlockRow, Button, Form, Label, Modal, ModalBody, ModalFooter, ModalHeader, ReactSelect } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SpaceService from '@/services/SpaceService';
import './JiraProjectIntegrationEditPopup.scss';

const labelMinWidth = '100px';
const selectMinWidth = '500px';

function JiraProjectIntegrationEditPopup({ spaceCode, data, setOpened, onApply }) {
  const { t } = useTranslation();

  const [info, setInfo] = useState({ ...data });
  const [jiraProjects, setJiraProjects] = useState([]);

  useEffect(() => {
    SpaceService.getJiraProjects(spaceCode, res => {
      if ((res || []).length > 0 && !info.key) {
        setInfo(res[0]);
      }
      setJiraProjects(res);
    });
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    onApply(info);
    setOpened(false);
  };

  return (
    <Modal
      className="jira-project-integration-edit-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <Form onSubmit={onSubmit}>
        <ModalHeader>{t('설정 변경')}</ModalHeader>
        <ModalBody className="modal-body">
          <Block className="block">
            <BlockRow>
              <Label minWidth={labelMinWidth} required>
                {t('Jira Project')}
              </Label>
              <ReactSelect
                minWidth={selectMinWidth}
                maxMenuHeight={200}
                className="react-select"
                value={{ key: info.key, label: info.name }}
                defaultValue={{ key: info.key, label: info.name }}
                onChange={e => setInfo({ ...info, key: e.value, name: e.label })}
                options={jiraProjects.map(project => ({
                  value: project.key,
                  label: project.name,
                }))}
                searchable
              />
            </BlockRow>
          </Block>
        </ModalBody>
        <ModalFooter className="modal-footer">
          <Button onClick={() => setOpened(false)}>{t('취소')}</Button>
          <Button type="submit">{t('추가')}</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

JiraProjectIntegrationEditPopup.defaultProps = {
  data: null,
};

JiraProjectIntegrationEditPopup.propTypes = {
  spaceCode: PropTypes.string.isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    key: PropTypes.string,
  }),
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default JiraProjectIntegrationEditPopup;
