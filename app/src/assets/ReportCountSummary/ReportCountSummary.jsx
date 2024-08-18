import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TESTRUN_RESULT_CODE } from '@/constants/constants';
import CommentBadge from '@/pages/spaces/projects/reports/ReportInfoPage/CommentBadge';
import './ReportCountSummary.scss';
import * as PropTypes from 'prop-types';

function ReportCountSummary({ info, onCardClick }) {
  const { t } = useTranslation();

  return (
    <div className="report-count-summary-warpper">
      <div>
        <div>{t('전체')}</div>
        <div className="count">
          <Link
            className="ALL"
            to="/"
            onClick={e => {
              onCardClick(null, false, e);
            }}
          >
            {info.totalTestcaseCount}
          </Link>
        </div>
        <CommentBadge
          count={info.totalTestcaseHasCommentCount}
          onClick={() => {
            onCardClick(null, true);
          }}
        />
      </div>
      <div>
        <div>{TESTRUN_RESULT_CODE.PASSED}</div>
        <div className="count">
          <Link
            className="PASSED"
            to="/"
            onClick={e => {
              onCardClick('PASSED', false, e);
            }}
          >
            {info.passedTestcaseCount}
          </Link>
        </div>
        <CommentBadge
          count={info.passedTestcaseHasCommentCount}
          onClick={() => {
            onCardClick('PASSED', true);
          }}
        />
      </div>
      <div>
        <div>{TESTRUN_RESULT_CODE.FAILED}</div>
        <div className="count">
          <Link
            className="FAILED"
            to="/"
            onClick={e => {
              onCardClick('FAILED', false, e);
            }}
          >
            {info.failedTestcaseCount}
          </Link>
        </div>
        <CommentBadge
          count={info.failedTestcaseHasCommentCount}
          onClick={() => {
            onCardClick('FAILED', true);
          }}
        />
      </div>
      <div>
        <div>{TESTRUN_RESULT_CODE.UNTESTABLE}</div>
        <div className="count">
          <Link
            className="UNTESTABLE"
            to="/"
            onClick={e => {
              onCardClick('UNTESTABLE', false, e);
            }}
          >
            {info.untestableTestcaseCount}
          </Link>
        </div>
        <CommentBadge
          count={info.untestableTestcaseHasCommentCount}
          onClick={() => {
            onCardClick('UNTESTABLE', true);
          }}
        />
      </div>
      <div>
        <div>{TESTRUN_RESULT_CODE.UNTESTED}</div>
        <div className="count">
          <Link
            className="UNTESTED"
            to="/"
            onClick={e => {
              onCardClick('UNTESTED', false, e);
            }}
          >
            {!Number.isNaN(info.totalTestcaseCount - info.testedCount) ? info.totalTestcaseCount - info.testedCount : ''}
          </Link>
        </div>
        <CommentBadge
          count={info.untestedTestcaseHasCommentCount}
          onClick={() => {
            onCardClick('UNTESTED', true);
          }}
        />
      </div>
    </div>
  );
}

ReportCountSummary.defaultProps = {
  onCardClick: null,
};

ReportCountSummary.propTypes = {
  info: PropTypes.shape({
    testedCount: PropTypes.number,
    untestableTestcaseCount: PropTypes.number,
    passedTestcaseCount: PropTypes.number,
    totalTestcaseCount: PropTypes.number,
    untestableTestcaseHasCommentCount: PropTypes.number,
    untestedTestcaseHasCommentCount: PropTypes.number,
    failedTestcaseHasCommentCount: PropTypes.number,
    failedTestcaseCount: PropTypes.number,
    passedTestcaseHasCommentCount: PropTypes.number,
    totalTestcaseHasCommentCount: PropTypes.number,
  }).isRequired,
  onCardClick: PropTypes.func,
};

export default ReportCountSummary;
