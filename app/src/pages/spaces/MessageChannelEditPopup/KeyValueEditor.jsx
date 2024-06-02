import React from 'react';
import { Button, Input } from '@/components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './KeyValueEditor.scss';

function KeyValueEditor({ list, onChange }) {
  const onChangeKey = (index, value) => {
    const newList = [...list];
    newList[index].dataKey = value;
    onChange(newList);
  };

  const onChangeValue = (index, value) => {
    const newList = [...list];
    newList[index].dataValue = value;
    onChange(newList);
  };

  const { t } = useTranslation();

  return (
    <div className="key-value-editor-wrapper">
      <ul>
        {list.map((d, index) => {
          return (
            <li key={d.index}>
              <div className="label">키</div>
              <div>
                <Input
                  size="sm"
                  value={d.dataKey}
                  onChange={v => {
                    onChangeKey(index, v);
                  }}
                />
              </div>
              <div className="label">값</div>
              <div>
                <Input
                  size="sm"
                  value={d.dataValue}
                  onChange={v => {
                    onChangeValue(index, v);
                  }}
                />
              </div>
              <div className="button">
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => {
                    const newList = [...list];
                    newList.splice(index, 1);
                    onChange(newList);
                  }}
                >
                  {t('삭제')}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

KeyValueEditor.defaultProps = {
  list: [],
};

KeyValueEditor.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      dataValue: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func.isRequired,
};

export default KeyValueEditor;
