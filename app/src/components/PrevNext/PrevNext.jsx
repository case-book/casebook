import React from 'react';
import './PrevNext.scss';
import PropTypes from 'prop-types';
import { Button } from '@/components';

function PrevNext({ className, currentPage, isNext, isPrev, onNextClick, onPrevClick }) {
  return (
    <div className={`prevnext-wrapper ${className}`}>
      <span>
        <Button size="xs" disabled={!isPrev} type="button" onClick={onPrevClick} className="btn_prev">
          <span className="ico_comm ico_arr_l">PREV</span>
        </Button>
      </span>
      <span>
        <span className="txt_page">
          <em className="txt_active">{currentPage}</em>
        </span>
      </span>
      <span>
        <Button size="xs" disabled={!isNext} type="button" className="btn_next" onClick={onNextClick}>
          <span className="ico_comm ico_arr_l">NEXT</span>
        </Button>
      </span>
    </div>
  );
}

PrevNext.propTypes = {
  className: PropTypes.string,
  currentPage: PropTypes.number,
  onPrevClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  isNext: PropTypes.bool.isRequired,
  isPrev: PropTypes.bool.isRequired,
};

PrevNext.defaultProps = {
  className: '',
  currentPage: null,
};

export default PrevNext;
