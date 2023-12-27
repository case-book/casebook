import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useClickOutside from '@/hooks/useClickOutside';
import useKeyboard from '@/hooks/useKeyboard';
import { useTranslation } from 'react-i18next';
import './VariableInput.scss';

function VariableInput({
  className,
  type,
  value,
  size,
  disabled,
  outline,
  required,
  onChange,
  placeholder,
  minLength,
  maxLength,
  onRef,
  underline,
  color,
  onKeyDown,
  pattern,
  onBlur,
  autoComplete,
  variables: variablesProp,
}) {
  const { t } = useTranslation();
  const list = useRef(null);
  const element = useRef();
  const inputElement = useRef();
  const [targetKeyPressCount, setTargetKeyPressCount] = useState(0);
  const [opened, setOpened] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');
  useClickOutside(element, () => setOpened(false));
  const { pressed: isUpArrowPressed, register: upPressRegister, unregister: upPressUnregister } = useKeyboard('ArrowUp');
  const { pressed: isDownArrowPressed, register: downPressRegister, unregister: downPressUnregister } = useKeyboard('ArrowDown');
  const { pressed: isEnterPressed, register: enterPressRegister, unregister: enterPressUnregister } = useKeyboard('Enter');

  const variables = useMemo(() => {
    if (!query) {
      return variablesProp;
    }

    return variablesProp.filter(({ name }) => name.toUpperCase().includes(query.toUpperCase()));
  }, [query]);

  useEffect(() => {
    if (opened) {
      upPressRegister();
      downPressRegister();
      enterPressRegister();
    } else {
      upPressUnregister();
      downPressUnregister();
      enterPressUnregister();
    }

    return () => {
      upPressUnregister();
      downPressUnregister();
      enterPressUnregister();
    };
  }, [opened]);

  useEffect(() => {
    if (opened) {
      if (selectedIndex > variables.length - 1) {
        setSelectedIndex(variables.length - 1);
      }
    }
  }, [variables.length, selectedIndex, opened]);

  useEffect(() => {
    if (isUpArrowPressed) {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      } else {
        setSelectedIndex(variables.length - 1);
      }
    }
  }, [isUpArrowPressed]);

  useEffect(() => {
    if (isDownArrowPressed) {
      if (selectedIndex >= variables.length - 1) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    }
  }, [isDownArrowPressed]);

  useEffect(() => {
    if (opened && isEnterPressed && selectedIndex > -1) {
      const { name } = variables[selectedIndex];
      const currentPosition = inputElement.current.selectionStart;

      const pre = `${value.substring(0, cursor)}{{${name}}}`;
      const nextValue = `${pre}${value.substring(currentPosition, value.length)}`;
      onChange(nextValue);

      setTimeout(() => {
        inputElement.current.setSelectionRange(pre.length, pre.length);
      }, 100);
      setOpened(false);
    }
  }, [inputElement, cursor, isEnterPressed, selectedIndex, value, opened]);

  return (
    <div className={`variable-input-wrapper ${className}`} ref={element}>
      <input
        ref={e => {
          inputElement.current = e;
          if (onRef) {
            onRef(e);
          }
        }}
        className={`variable-input-wrapper ${className} size-${size} ${outline ? 'outline' : ''} ${underline ? 'underline' : ''} color-${color}`}
        type={type}
        pattern={pattern}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onClick={() => {
          if (opened) {
            setOpened(false);
          }
        }}
        onKeyUp={e => {
          if (e.key === '{' && e.shiftKey && !opened) {
            const nextCount = targetKeyPressCount + 1;
            setTargetKeyPressCount(nextCount);
            if (nextCount === 2) {
              if (variables.length > 0) {
                setSelectedIndex(0);
              } else {
                setSelectedIndex(-1);
              }
              const currentPosition = inputElement.current.selectionStart;
              if (currentPosition >= 2) {
                setCursor(currentPosition - 2);
              } else {
                setCursor(-1);
              }

              setQuery('');
              setOpened(true);
            }
          } else {
            setTargetKeyPressCount(0);
          }
        }}
        onChange={e => {
          if (onChange) {
            const v = e.target.value;
            onChange(v, e);
            if (opened && cursor > -1) {
              const currentPosition = inputElement.current.selectionStart;
              if (cursor + 2 <= currentPosition + 1) {
                setQuery(v.substring(cursor + 2, currentPosition));
              } else {
                setQuery('');
              }

              if (currentPosition < cursor + +2) {
                setOpened(false);
              }
            }
          }
        }}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        value={value}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
      />
      {opened && (
        <div ref={list} className="variables">
          {!(variables?.length > 0) && <div className="empty">{t('일치하는 변수가 없습니다.')}</div>}
          {variables?.length > 0 && (
            <ul>
              {variables.map((variable, index) => {
                const { name } = variable;
                let filteredIndex = -1;
                if (query) {
                  filteredIndex = name.toUpperCase().indexOf(query.toUpperCase());
                }

                return (
                  <li
                    className={selectedIndex === index ? 'selected' : ''}
                    key={variable.id}
                    onClick={() => {
                      setOpened(false);
                    }}
                  >
                    <span className="select-arrow" />
                    {filteredIndex > -1 && (
                      <>
                        <span>{name.substring(0, filteredIndex)}</span>
                        <span className="filtered">{name.substring(filteredIndex, filteredIndex + query.length)}</span>
                        <span>{name.substring(filteredIndex + query.length, name.length)}</span>
                      </>
                    )}
                    {filteredIndex < 0 && name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

VariableInput.defaultProps = {
  className: '',
  type: 'text',
  size: 'md',
  value: '',
  required: false,
  disabled: false,
  outline: true,
  onChange: null,
  placeholder: '',
  minLength: null,
  maxLength: null,
  onRef: null,
  underline: false,
  color: 'default',
  onKeyDown: null,
  pattern: null,
  onBlur: null,
  autoComplete: 'off',
  variables: [],
};

VariableInput.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onRef: PropTypes.func,
  underline: PropTypes.bool,
  color: PropTypes.string,
  onKeyDown: PropTypes.func,
  pattern: PropTypes.string,
  onBlur: PropTypes.func,
  autoComplete: PropTypes.string,
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

export default React.memo(VariableInput);
