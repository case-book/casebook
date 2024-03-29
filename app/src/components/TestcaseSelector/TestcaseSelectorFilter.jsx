import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, DateRange, Input, Liner, MultiSelector } from '@/components';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import './TestcaseSelectorFilter.scss';
import { ProjectReleasePropTypes, TestcaseSelectorFilterPropTypes } from '@/proptypes';

function TestcaseSelectorFilter({ className, filter, releases, onChange, onAllCheck, dateRange, country, language }) {
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    return Object.values(filter).some(d => d && (d.length === undefined || d.length > 0));
  }, [filter]);

  const items = useMemo(() => [{ key: null, value: t('릴리스 없음') }, ...releases.map(({ id, name }) => ({ key: id, value: name }))], [releases]);

  return (
    <div className={`testcase-selector-filter-wrapper ${className}`}>
      <div className="filter-row">
        {onAllCheck && (
          <div>
            <Button size="sm" outline onClick={onAllCheck} disabled={filtered}>
              <i className="fa-solid fa-circle-check" /> ALL
            </Button>
          </div>
        )}
        <div>
          <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
        </div>
        <div>
          <Button
            className="filter-button"
            rounded
            size="sm"
            color={filtered ? 'primary' : 'white'}
            onClick={() => {
              onChange({
                name: '',
                minDate: null,
                maxDate: null,
                releases: [],
              });
            }}
          >
            <i className="fa-solid fa-filter" />
          </Button>
        </div>
        <div>
          <DateRange
            className="date-range"
            size="sm"
            country={country}
            language={language}
            startDate={filter.minDate?.valueOf()}
            endDate={filter.maxDate?.valueOf()}
            startDateKey="minDate"
            endDateKey="maxDate"
            onChange={(key, value) => {
              onChange({
                ...filter,
                [key]: value ? moment(value) : value,
              });
            }}
            nullable
            control={
              <Button
                className="fill-button"
                rounded
                size="xs"
                shadow={false}
                onClick={() => {
                  onChange({
                    ...filter,
                    minDate: dateRange.minDate,
                    maxDate: dateRange.maxDate,
                  });
                }}
              >
                <i className="fa-solid fa-fill-drip" />
              </Button>
            }
          />
        </div>
        <div className="icon">
          <i className="fa-solid fa-font" />
        </div>
        <Input
          value={filter.name}
          size="sm"
          placeholder={t('테스트케이스 및 그룹 이름')}
          onChange={value => {
            onChange({
              ...filter,
              name: value,
            });
          }}
        />
      </div>
      <div className="filter-row">
        <MultiSelector
          size="sm"
          minWidth="100%"
          maxWidth="100%"
          placeholder={t('릴리스 선택')}
          items={items}
          value={filter.releases}
          onChange={value => {
            onChange({ ...filter, releases: items.filter(({ key }) => value.includes(key)) });
          }}
        />
      </div>
    </div>
  );
}

TestcaseSelectorFilter.defaultProps = {
  className: '',
  country: 'KR',
  language: 'ko',
  onAllCheck: null,
};

TestcaseSelectorFilter.propTypes = {
  className: PropTypes.string,
  filter: TestcaseSelectorFilterPropTypes.isRequired,
  releases: PropTypes.arrayOf(ProjectReleasePropTypes).isRequired,
  dateRange: PropTypes.shape({ minDate: PropTypes.instanceOf(moment), maxDate: PropTypes.instanceOf(moment) }).isRequired,
  onChange: PropTypes.func.isRequired,
  onAllCheck: PropTypes.func,
  country: PropTypes.string,
  language: PropTypes.string,
};

export default TestcaseSelectorFilter;
