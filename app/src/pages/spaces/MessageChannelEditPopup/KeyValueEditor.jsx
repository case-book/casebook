import React from 'react';
import { Button, EmptyContent, Input, Tag } from '@/components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './KeyValueEditor.scss';

function KeyValueEditor({ list, onChange }) {
  const { t } = useTranslation();
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

  return (
    <div className="key-value-editor-wrapper">
      {(!list || list?.length < 1) && <EmptyContent minHeight="60px">{t('데이터가 없습니다.')}</EmptyContent>}
      {list?.length > 0 && (
        <ul>
          {list.map((d, index) => {
            return (
              <li key={index}>
                <div className="key">
                  <div className="label">
                    <Tag>KEY</Tag>
                  </div>
                  <div>
                    <Input
                      required
                      size="sm"
                      value={d.dataKey}
                      onChange={v => {
                        onChangeKey(index, v);
                      }}
                    />
                  </div>
                </div>
                <div className="value">
                  <div className="label">
                    <Tag>VALUE</Tag>
                  </div>
                  <div>
                    <Input
                      size="sm"
                      value={d.dataValue}
                      onChange={v => {
                        onChangeValue(index, v);
                      }}
                    />
                  </div>
                </div>
                <div className="button">
                  <Button
                    size="xs"
                    color="primary"
                    rounded
                    onClick={() => {
                      const newList = [...list];
                      newList.splice(index, 1);
                      onChange(newList);
                    }}
                  >
                    <i className="fa-solid fa-xmark" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
