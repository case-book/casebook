import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './ReactSelect.scss';
import { useTranslation } from 'react-i18next';

function ReactSelect({ minWidth, value, onChange, options, size, defaultValue }) {
  const { t } = useTranslation();
  return (
    <Select
      className={`react-select-wrapper size-${size}`}
      classNamePrefix="react-select"
      placeholder={t('선택')}
      noOptionsMessage={() => {
        return t('일치하는 목록이 없습니다.');
      }}
      value={value}
      onChange={onChange}
      options={options}
      styles={{
        control: baseStyles => ({
          ...baseStyles,
          minWidth,
        }),
      }}
      defaultValue={defaultValue}
    />
  );
}

ReactSelect.defaultProps = {
  minWidth: 'auto',
  size: 'md',
  value: '',
  onChange: null,
  options: [],
  defaultValue: '',
};

ReactSelect.propTypes = {
  minWidth: PropTypes.string,
  size: PropTypes.string,
  value: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  defaultValue: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

export default ReactSelect;
