import React, { useEffect, useMemo, useState } from 'react';
import { Button, CheckBox, Liner, Modal, ModalBody, ModalFooter, ModalHeader, Tag } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TestrunPropTypes } from '@/proptypes';
import ReportService from '@/services/ReportService';
import './SelectOpenLinkTestrunPopup.scss';
import dateUtil from '@/utils/dateUtil';

function SelectOpenLinkTestrunPopup({ spaceCode, projectId, setOpened, onApply, testruns }) {
  const { t } = useTranslation();

  const [pageNo, setPageNo] = useState(0);
  const [reports, setReports] = useState([]);
  const [selectedTestruns, setSelectedTestruns] = useState([]);

  console.log(pageNo, setPageNo, reports, selectedTestruns);

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
        <ul className="report-list">
          {reports.map(report => {
            return (
              <li key={report.id}>
                <div>
                  <div>
                    <CheckBox
                      type="checkbox"
                      size="xs"
                      value={!!selectedTestrunById[report.id]}
                      onChange={val => {
                        if (val) {
                          setSelectedTestruns([...selectedTestruns, report]);
                        } else {
                          setSelectedTestruns(selectedTestruns.filter(testrun => testrun.id !== report.id));
                        }
                      }}
                    />
                  </div>
                  <div className="report-name">
                    <div className="name">{report.name}</div>
                    <div className="testrun-others">
                      <div className="time-info">
                        <div className="calendar">
                          <i className="fa-regular fa-clock" />
                        </div>
                        {report.startDateTime && <div>{dateUtil.getDateString(report.startDateTime, 'monthsDaysHoursMinutes')}</div>}
                        <div className={`end-date-info ${!report.startDateTime ? 'no-start-time' : ''}`}>
                          {(report.startDateTime || report.closedDate || report.endDateTime) && <Liner width="6px" height="1px" display="inline-block" margin="0 0.5rem" />}
                          {report.startDateTime && (report.closedDate || report.endDateTime) && <span>{dateUtil.getEndDateString(report.startDateTime, report.closedDate || report.endDateTime)}</span>}
                          {!report.startDateTime && (report.closedDate || report.endDateTime) && <span>{dateUtil.getDateString(report.closedDate || report.endDateTime)}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div>
          <Button
            onClick={() => {
              if (pageNo > 0) {
                setPageNo(pageNo - 1);
              }
            }}
          >
            PREV
          </Button>
          <Button
            onClick={() => {
              setPageNo(pageNo + 1);
            }}
          >
            NEXT
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
