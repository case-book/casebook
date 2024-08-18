import React, { useEffect, useMemo, useState } from 'react';
import { Button, Liner, Modal, ModalBody, ModalFooter, ModalHeader, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TestrunPropTypes } from '@/proptypes';
import ReportService from '@/services/ReportService';
import './SelectOpenLinkTestrunPopup.scss';
import { OpenLinkReportList } from '@/assets';

function SelectOpenLinkTestrunPopup({ spaceCode, projectId, setOpened, onApply, testruns }) {
  const { t } = useTranslation();

  const [pageNo, setPageNo] = useState(0);
  const [reports, setReports] = useState([]);
  const [selectedTestruns, setSelectedTestruns] = useState([]);

  const selectReportList = no => {
    ReportService.selectPagingReportList(spaceCode, projectId, no, list => {
      setReports(list);
    });
  };

  const selectedTestrunById = useMemo(() => {
    return selectedTestruns.reduce((acc, report) => {
      acc[report.id] = report;
      return acc;
    }, {});
  }, [selectedTestruns]);

  useEffect(() => {
    setSelectedTestruns(testruns);
  }, [testruns]);

  useEffect(() => {
    window.scrollTo(0, 0);
    selectReportList(pageNo);
  }, [projectId, pageNo]);

  return (
    <Modal
      className="select-open-link-testrun-popup-wrapper"
      isOpen
      size="lg"
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader className="modal-header">
        <div className="title">
          <div>{t('리포트 선택')}</div>
          <Liner display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
          <Tag className="count-tag" border>
            {t('@개 선택', { count: selectedTestruns.length })}
          </Tag>
        </div>
      </ModalHeader>
      <ModalBody>
        <OpenLinkReportList
          className="open-link-report-list"
          reports={reports}
          isChecked={report => {
            return !!selectedTestrunById[report.id];
          }}
          onCheck={(report, val) => {
            if (val) {
              setSelectedTestruns([...selectedTestruns, report]);
            } else {
              setSelectedTestruns(selectedTestruns.filter(testrun => testrun.id !== report.id));
            }
          }}
        />
        <div className="pager">
          <Button
            rounded
            disabled={pageNo <= 0}
            onClick={() => {
              if (pageNo > 0) {
                setPageNo(pageNo - 1);
              }
            }}
          >
            <i className="fa-solid fa-chevron-left" />
          </Button>
          <Button
            rounded
            onClick={() => {
              setPageNo(pageNo + 1);
            }}
          >
            <i className="fa-solid fa-chevron-right" />
          </Button>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => setOpened(false)}>
          {t('취소')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            if (onApply) {
              onApply(selectedTestruns);
            }

            if (setOpened) {
              setOpened(false);
            }
          }}
        >
          {t('선택')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

SelectOpenLinkTestrunPopup.defaultProps = {};

SelectOpenLinkTestrunPopup.propTypes = {
  setOpened: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  spaceCode: PropTypes.string.isRequired,
  testruns: PropTypes.arrayOf(TestrunPropTypes).isRequired,
};

export default SelectOpenLinkTestrunPopup;
