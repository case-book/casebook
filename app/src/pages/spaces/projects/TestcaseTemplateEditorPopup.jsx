import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Button, Form, Input, Liner, Modal, ModalBody, ModalFooter, ModalHeader, Selector } from '@/components';
import { useTranslation } from 'react-i18next';
import { TestcaseTemplatePropTypes } from '@/proptypes';
import './TestcaseTemplateEditorPopup.scss';

function TestcaseTemplateEditorPopup({ className, testcaseTemplate, onClose, onChange, testcaseItemTypes }) {
  const { t } = useTranslation();

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  const [selectedItem, setSelectedItem] = useState({});

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    setTemplate(cloneDeep(testcaseTemplate));
  }, [testcaseTemplate]);

  console.log(testcaseTemplate);

  const hasOptionType = value => {
    return value === 'RADIO' || value === 'SELECT';
  };
  const onChangeTestcaseTemplateItem = (testcaseTemplateItemInx, key, val) => {
    const nextTemplate = { ...template };
    const nextTemplateItem = nextTemplate.testcaseTemplateItems[testcaseTemplateItemInx];
    nextTemplateItem[key] = val;
    setTemplate(nextTemplate);
  };

  const onChangeTestcaseTemplateItemOption = (testcaseTemplateItemInx, optionInx, val) => {
    const nextTemplate = { ...template };
    const nextTemplateItem = nextTemplate.testcaseTemplateItems[testcaseTemplateItemInx];
    nextTemplateItem.options[optionInx] = val;
    setTemplate(nextTemplate);
  };

  const onDeleteTestcaseTemplateItemOption = (testcaseTemplateItemInx, optionInx) => {
    const nextTemplate = { ...template };
    const nextTemplateItem = nextTemplate.testcaseTemplateItems[testcaseTemplateItemInx];
    nextTemplateItem.options.splice(optionInx, 1);
    setTemplate(nextTemplate);
  };

  const onAddTestcaseTemplateItemOption = testcaseTemplateItemInx => {
    const nextTemplate = { ...template };
    const nextTemplateItem = nextTemplate.testcaseTemplateItems[testcaseTemplateItemInx];
    if (!nextTemplateItem.options) {
      nextTemplateItem.options = [];
    }
    nextTemplateItem.options.push(`옵션 ${nextTemplateItem.options.length + 1}`);
    setTemplate(nextTemplate);
  };

  const addTestcaseTemplateItem = () => {
    const nextTemplate = { ...template };

    if (!nextTemplate.testcaseTemplateItems) {
      nextTemplate.testcaseTemplateItems = [];
    }

    nextTemplate.testcaseTemplateItems.push({
      type: 'TEXT',
      itemOrder: nextTemplate.testcaseTemplateItems.length,
      label: '라벨',
      size: 4,
      options: [],
    });

    setTemplate(nextTemplate);
  };

  const onChangeTestcaseTemplateItemSize = (testcaseTemplateItemInx, option) => {
    const nextTemplate = { ...template };
    const nextTemplateItem = nextTemplate.testcaseTemplateItems[testcaseTemplateItemInx];

    if (option === 'up') {
      nextTemplateItem.size += 1;
    } else if (option === 'down') {
      nextTemplateItem.size -= 1;
    } else if (option === 'fill') {
      nextTemplateItem.size = 12;
    }

    if (nextTemplateItem.size > 12) {
      nextTemplateItem.size = 12;
    }

    if (nextTemplateItem.size < 3) {
      nextTemplateItem.size = 3;
    }

    setTemplate(nextTemplate);
  };

  const onDeleteTestcaseTemplateItem = testcaseTemplateItemInx => {
    const nextTemplate = { ...template };
    const nextTemplateItem = nextTemplate.testcaseTemplateItems[testcaseTemplateItemInx];
    if (nextTemplateItem.id) {
      nextTemplateItem.crud = 'D';
    } else {
      nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx, 1);
    }

    setTemplate(nextTemplate);
  };

  const onChangeTestcaseTemplateItemOrder = (testcaseTemplateItemInx, option) => {
    const nextTemplate = { ...template };

    if (option === 'left' && testcaseTemplateItemInx > 0) {
      const target = nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx, 1);
      nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx - 1, 0, target[0]);
      setSelectedItem({ ...selectedItem, inx: selectedItem.inx - 1 });
    } else if (option === 'right' && testcaseTemplateItemInx < nextTemplate.testcaseTemplateItems.length - 1) {
      const target = nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx, 1);
      nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx + 1, 0, target[0]);
      setSelectedItem({ ...selectedItem, inx: selectedItem.inx + 1 });
    }

    nextTemplate.testcaseTemplateItems.forEach((item, inx) => {
      const nextItem = item;
      nextItem.itemOrder = inx;
    });

    setTemplate(nextTemplate);
  };

  return (
    <Modal className={`${className} testcase-template-editor-popup-wrapper`} isOpen>
      <ModalHeader className="modal-header" onClose={onClose}>
        템플릿 에디터
      </ModalHeader>
      <ModalBody className="template-content">
        <div className="control">
          <div>{t('이름')}</div>
          <div>
            <Input
              size="md"
              value={template?.name}
              onChange={name => {
                setTemplate({
                  ...template,
                  name,
                });
              }}
              required
              minLength={1}
            />
          </div>
          <div>
            <Button
              onClick={() => {
                addTestcaseTemplateItem();
              }}
            >
              아이템 추가
            </Button>
          </div>
        </div>
        <div className="editor">
          <div className="items">
            <div className="sub-title">레이아웃</div>
            <div className="layout">
              <ul>
                {template?.testcaseTemplateItems?.map((testcaseTemplateItem, inx) => {
                  return (
                    <li
                      key={inx}
                      className={`testcase-template-item ${testcaseTemplateItem.crud === 'D' ? 'hidden' : ''} ${selectedItem?.inx === inx ? 'selected' : ''}`}
                      style={{ width: `calc(${(testcaseTemplateItem.size / 12) * 100}%)` }}
                      onClick={() => {
                        if (selectedItem.inx === inx) {
                          setSelectedItem({});
                        } else {
                          setSelectedItem({
                            inx,
                            item: testcaseTemplateItem,
                          });
                        }
                      }}
                    >
                      <div>
                        <div className="type">
                          <span>{testcaseTemplateItem.type}</span>
                          {hasOptionType(testcaseTemplateItem.type) && (
                            <span className="count-badge">
                              <span>{testcaseTemplateItem.options.length}</span>
                            </span>
                          )}
                        </div>
                        <div className="item-info">{testcaseTemplateItem.label}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="properties">
            <div className="sub-title">속성</div>
            <div className="properties-content">
              {!selectedItem?.item && (
                <div className="empty-message">
                  <div>아이템을 선택해주세요</div>
                </div>
              )}
              {selectedItem?.item && (
                <>
                  <div className="properties-button">
                    <Button
                      size="xs"
                      rounded
                      onClick={() => {
                        onChangeTestcaseTemplateItemOrder(selectedItem.inx, 'left');
                      }}
                    >
                      <i className="fa-solid fa-arrow-left" />
                    </Button>
                    <Button
                      size="xs"
                      rounded
                      onClick={() => {
                        onChangeTestcaseTemplateItemOrder(selectedItem.inx, 'right');
                      }}
                    >
                      <i className="fa-solid fa-arrow-right" />
                    </Button>
                    <Liner display="inline-block" width="1px" height="10px" color="white" margin="0 0.5rem 0 0.25rem" />
                    <Button
                      size="xs"
                      rounded
                      onClick={() => {
                        onChangeTestcaseTemplateItemSize(selectedItem.inx, 'down');
                      }}
                    >
                      <i className="fa-solid fa-right-left" />
                    </Button>
                    <Button
                      size="xs"
                      rounded
                      onClick={() => {
                        onChangeTestcaseTemplateItemSize(selectedItem.inx, 'up');
                      }}
                    >
                      <i className="fa-solid fa-left-right" />
                    </Button>
                    <Button
                      size="xs"
                      rounded
                      onClick={() => {
                        onChangeTestcaseTemplateItemSize(selectedItem.inx, 'fill');
                      }}
                    >
                      <i className="fa-solid fa-expand" />
                    </Button>
                    <Liner display="inline-block" width="1px" height="10px" color="white" margin="0 0.5rem 0 0.25rem" />
                    <Button
                      size="xs"
                      rounded
                      color="danger"
                      onClick={() => {
                        onDeleteTestcaseTemplateItem(selectedItem.inx);
                      }}
                    >
                      <i className="fa-regular fa-trash-can" />
                    </Button>
                  </div>
                  <div className="label">
                    <div className="title">라벨</div>
                    <div className="properties-control">
                      <Input
                        size="md"
                        value={selectedItem?.item?.label}
                        onChange={val => {
                          onChangeTestcaseTemplateItem(selectedItem.inx, 'label', val);
                        }}
                        required
                        minLength={1}
                      />
                    </div>
                  </div>
                  <div className="type">
                    <div className="title">타입</div>
                    <div className="properties-control">
                      <Selector
                        className="selector"
                        outline
                        size="sm"
                        items={testcaseItemTypes.map(d => {
                          return {
                            key: d,
                            value: d,
                          };
                        })}
                        value={selectedItem?.item?.type}
                        onChange={val => {
                          onChangeTestcaseTemplateItem(selectedItem.inx, 'type', val);
                        }}
                      />
                    </div>
                  </div>
                  {hasOptionType(selectedItem?.item?.type) && (
                    <div className="options">
                      <div className="title">
                        옵션
                        <Button
                          size="xs"
                          onClick={() => {
                            onAddTestcaseTemplateItemOption(selectedItem.inx);
                          }}
                        >
                          추가
                        </Button>
                      </div>
                      <div className="properties-control">
                        <div>
                          <ul>
                            {selectedItem?.item?.options?.map((d, jnx) => {
                              return (
                                <li key={jnx}>
                                  <div>
                                    <div className="input">
                                      <Input
                                        size="sm"
                                        value={d}
                                        onChange={val => {
                                          onChangeTestcaseTemplateItemOption(selectedItem.inx, jnx, val);
                                        }}
                                        required
                                        minLength={1}
                                      />
                                    </div>
                                    <div className="button">
                                      <Button
                                        size="sm"
                                        rounded
                                        color="danger"
                                        onClick={() => {
                                          onDeleteTestcaseTemplateItemOption(selectedItem.inx, jnx);
                                        }}
                                      >
                                        <i className="fa-regular fa-trash-can" />
                                      </Button>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <Form className="form-test">
          <ul>
            {template?.testcaseTemplateItems?.map((testcaseTemplateItem, inx) => {
              return (
                <li key={inx} className={`testcase-template-item ${testcaseTemplateItem.crud === 'D' ? 'hidden' : ''}`} style={{ width: `calc(${(testcaseTemplateItem.size / 12) * 100}% - 1rem)` }}>
                  <div>
                    <div className="type">
                      <div className="type-text">
                        <span>{testcaseTemplateItem.type}</span>
                      </div>
                      {hasOptionType(testcaseTemplateItem.type) && (
                        <div className="option-count">
                          <Button
                            size="xs"
                            onClick={() => {
                              setSelectedOptionIndex(selectedOptionIndex ? null : inx);
                            }}
                          >
                            {testcaseTemplateItem.options.length} OPTIONS
                          </Button>
                        </div>
                      )}
                      {inx === selectedOptionIndex && (
                        <div className="options-list">
                          <div className="arrow">
                            <div />
                          </div>
                          <ul>
                            {testcaseTemplateItem?.options?.map((option, jnx) => {
                              return <li key={jnx}>{option}</li>;
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="item-info">{testcaseTemplateItem.label}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Form>
      </ModalBody>
      <ModalFooter className="template-footer">
        <Button
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          {t('취소')}
        </Button>
        <Button
          onClick={() => {
            if (onChange) {
              onChange(template);
            }
          }}
        >
          {t('설정')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

TestcaseTemplateEditorPopup.defaultProps = {
  className: '',
  testcaseTemplate: null,
  onClose: null,
  onChange: null,
  testcaseItemTypes: [],
};

TestcaseTemplateEditorPopup.propTypes = {
  className: PropTypes.string,
  testcaseTemplate: TestcaseTemplatePropTypes,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  testcaseItemTypes: PropTypes.arrayOf(PropTypes.string),
};

export default TestcaseTemplateEditorPopup;
