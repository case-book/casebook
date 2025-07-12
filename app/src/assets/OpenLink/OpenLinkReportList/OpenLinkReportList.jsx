import React from 'react';
import { CheckBox, CloseIcon, EmptyContent, Liner, SeqId } from '@/components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import dateUtil from '@/utils/dateUtil';
import classNames from 'classnames';
import { ITEM_TYPE } from '@/constants/constants';
import './OpenLinkReportList.scss';

function OpenLinkReportList({ className, reports, onRemove, onCheck, isChecked }) {
  const { t } = useTranslation();

  return (
    <>
      {reports?.length === 0 && (
        <EmptyContent border fill>
          {t('리포트가 없습니다.')}
        </EmptyContent>
      )}
      {reports?.length > 0 && (
        <ul className={classNames('open-link-report-list-wrapper', className)}>
          {reports.map(report => {
            return (
              <li key={report.id}>
                <div className="report-name">
                  {onCheck && (
                    <div>
                      <CheckBox
                        type="checkbox"
                        size="xs"
                        value={isChecked(report)}
                        onChange={val => {
                          onCheck(report, val);
                        }}
                      />
                    </div>
                  )}
                  <div className="seq-id">
                    <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTRUN} copy={false}>
                      {report.seqId}
                    </SeqId>
                  </div>
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
                  {onRemove && (
                    <div className="remove-button">
                      <CloseIcon color="danger" size="xs" onClick={() => onRemove(report.id)} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

OpenLinkReportList.defaultProps = {
  className: '',
  onRemove: null,
  onCheck: null,
  isChecked: null,
};

OpenLinkReportList.propTypes = {
  className: PropTypes.string,
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.shape,
    }),
  ).isRequired,
  onRemove: PropTypes.func,
  isChecked: PropTypes.func,
  onCheck: PropTypes.func,
};

export default OpenLinkReportList;
