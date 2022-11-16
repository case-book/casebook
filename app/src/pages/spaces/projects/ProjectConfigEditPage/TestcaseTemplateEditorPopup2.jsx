import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Button, CheckBox, EmptyContent, Input, Liner, Modal, ModalBody, ModalFooter, ModalHeader, Radio, Selector } from '@/components';
import { useTranslation } from 'react-i18next';
import { TestcaseTemplateEditPropTypes } from '@/proptypes';
import './TestcaseTemplateEditorPopup2.scss';

function TestcaseTemplateEditorPopup2({ className, testcaseTemplate, onClose, onChange, testcaseItemTypes, testcaseItemCategories, opened, editor }) {
  const { t } = useTranslation();

  const [selectedItem, setSelectedItem] = useState({});

  const [template, setTemplate] = useState(null);
  const [caseTemplateItems, setCaseTemplateItems] = useState([]);
  const [resultTemplateItems, setResultTemplateItems] = useState([]);

  useEffect(() => {
    setTemplate(cloneDeep(testcaseTemplate));
    setSelectedItem({});
    setCaseTemplateItems(testcaseTemplate?.testcaseTemplateItems?.filter(d => d.category === 'CASE') || []);
    setResultTemplateItems(testcaseTemplate?.testcaseTemplateItems?.filter(d => d.category === 'RESULT') || []);
  }, [testcaseTemplate, opened]);

  const hasOptionType = value => {
    return value === 'RADIO' || value === 'SELECT';
  };
  const onChangeTestcaseTemplateItem = (testcaseTemplateItemInx, category, key, val) => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);
    const nextTemplateItem = nextTemplateItems[testcaseTemplateItemInx];
    nextTemplateItem[key] = val;

    if (category === 'CASE') {
      setCaseTemplateItems(nextTemplateItems);
    } else {
      setResultTemplateItems(nextTemplateItems);
    }
  };

  const onChangeTestcaseTemplateItemCategory = (testcaseTemplateItemInx, currentCategory, nextCategory) => {
    if (currentCategory === nextCategory) {
      return;
    }
    const targetTemplateItems = currentCategory === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);
    const destTemplateItems = currentCategory !== 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);

    const moveItem = targetTemplateItems.splice(testcaseTemplateItemInx, 1);

    moveItem[0].category = currentCategory === 'CASE' ? 'RESULT' : 'CASE';
    destTemplateItems.push(moveItem[0]);

    if (currentCategory === 'CASE') {
      setCaseTemplateItems(targetTemplateItems);
      setResultTemplateItems(destTemplateItems);
    } else {
      setCaseTemplateItems(destTemplateItems);
      setResultTemplateItems(targetTemplateItems);
    }

    const nextSelectedItem = { ...selectedItem };
    nextSelectedItem.item.category = nextCategory;
    nextSelectedItem.inx = destTemplateItems.length - 1;

    setSelectedItem(nextSelectedItem);
  };

  const onChangeTestcaseTemplateItemOption = (testcaseTemplateItemInx, category, optionInx, val) => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);
    const nextTemplateItem = nextTemplateItems[testcaseTemplateItemInx];
    nextTemplateItem.options[optionInx] = val;
    if (category === 'CASE') {
      setCaseTemplateItems(nextTemplateItems);
    } else {
      setResultTemplateItems(nextTemplateItems);
    }
  };

  const onDeleteTestcaseTemplateItemOption = (testcaseTemplateItemInx, category, optionInx) => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);
    const nextTemplateItem = nextTemplateItems[testcaseTemplateItemInx];
    nextTemplateItem.options.splice(optionInx, 1);
    if (category === 'CASE') {
      setCaseTemplateItems(nextTemplateItems);
    } else {
      setResultTemplateItems(nextTemplateItems);
    }
  };

  const onAddTestcaseTemplateItemOption = (testcaseTemplateItemInx, category) => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);
    const nextTemplateItem = nextTemplateItems[testcaseTemplateItemInx];
    if (!nextTemplateItem.options) {
      nextTemplateItem.options = [];
    }
    nextTemplateItem.options.push(`옵션 ${nextTemplateItem.options.length + 1}`);
    if (category === 'CASE') {
      setCaseTemplateItems(nextTemplateItems);
    } else {
      setResultTemplateItems(nextTemplateItems);
    }
  };

  const addTestcaseTemplateItem = category => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);
    nextTemplateItems.push({
      type: 'TEXT',
      itemOrder: nextTemplateItems.length,
      label: t('라벨'),
      size: 4,
      options: null,
      category,
    });

    if (category === 'CASE') {
      setCaseTemplateItems(nextTemplateItems);
    } else {
      setResultTemplateItems(nextTemplateItems);
    }
  };

  const onChangeTestcaseTemplateItemSize = (testcaseTemplateItemInx, category, option) => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);

    const nextTemplateItem = nextTemplateItems[testcaseTemplateItemInx];

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

    if (category === 'CASE') {
      setCaseTemplateItems(nextTemplateItems);
    } else {
      setResultTemplateItems(nextTemplateItems);
    }
  };

  const onDeleteTestcaseTemplateItem = (testcaseTemplateItemInx, category) => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);
    const nextTemplateItem = nextTemplateItems[testcaseTemplateItemInx];
    if (nextTemplateItem.id) {
      nextTemplateItem.crud = 'D';
    } else {
      nextTemplateItems.splice(testcaseTemplateItemInx, 1);
    }

    if (category === 'CASE') {
      setCaseTemplateItems(nextTemplateItems);
    } else {
      setResultTemplateItems(nextTemplateItems);
    }
    setSelectedItem({});
  };

  const onChangeTestcaseTemplateItemOrder = (testcaseTemplateItemInx, category, option) => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);

    if (option === 'left' && testcaseTemplateItemInx > 0) {
      const target = nextTemplateItems.splice(testcaseTemplateItemInx, 1);
      nextTemplateItems.splice(testcaseTemplateItemInx - 1, 0, target[0]);
      setSelectedItem({ ...selectedItem, inx: selectedItem.inx - 1 });
    } else if (option === 'right' && testcaseTemplateItemInx < nextTemplateItems.length - 1) {
      const target = nextTemplateItems.splice(testcaseTemplateItemInx, 1);
      nextTemplateItems.splice(testcaseTemplateItemInx + 1, 0, target[0]);
      setSelectedItem({ ...selectedItem, inx: selectedItem.inx + 1 });
    }

    nextTemplateItems.forEach((item, inx) => {
      const nextItem = item;
      nextItem.itemOrder = inx;
    });

    if (category === 'CASE') {
      setCaseTemplateItems(nextTemplateItems);
    } else {
      setResultTemplateItems(nextTemplateItems);
    }
  };

  const getItem = (testcaseTemplateItem, inx) => {
    return (
      <li
        key={inx}
        className={`testcase-template-item ${testcaseTemplateItem.crud === 'D' ? 'hidden' : ''} ${
          editor && selectedItem?.item?.category === testcaseTemplateItem.category && selectedItem?.inx === inx ? 'selected' : ''
        }`}
        style={{ width: `calc(${(testcaseTemplateItem.size / 12) * 100}% - 0.5rem)` }}
        onClick={() => {
          if (selectedItem.inx === inx && selectedItem?.item?.category === testcaseTemplateItem.category) {
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
            <span className="type-text">
              {testcaseTemplateItem.type}
              {!editor && hasOptionType(testcaseTemplateItem.type) && inx === selectedItem?.inx && selectedItem?.item?.category === testcaseTemplateItem.category && (
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
            </span>
            {hasOptionType(testcaseTemplateItem.type) && (
              <span className="count-badge">
                <span>{testcaseTemplateItem?.options?.length || 0}</span>
              </span>
            )}
          </div>
          <div className="item-info">{testcaseTemplateItem.label}</div>
        </div>
      </li>
    );
  };

  return (
    <Modal
      className={`${className} testcase-template-editor-popup-wrapper2 ${editor ? 'is-edit' : ''}`}
      isOpen={opened}
      size="xxl"
      toggle={() => {
        onClose();
      }}
    >
      <ModalHeader
        className="modal-header"
        onClose={() => {
          onClose();
        }}
      >
        {template?.name}
      </ModalHeader>
      <ModalBody className="testcase-template-editor-content">
        <div onClick={e => e.stopPropagation()}>
          <div className="editor-content">
            <div className="template-content">
              {editor && (
                <div className="control">
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
                    <CheckBox
                      type="checkbox"
                      value={template?.isDefault}
                      label={t('기본 템플릿')}
                      onChange={val => {
                        setTemplate({
                          ...template,
                          isDefault: val,
                        });
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="editor">
                <div className="items">
                  <div>
                    <div className="sub-title">
                      <div className="text">{t('테스트케이스 레이아웃')}</div>
                      {editor && (
                        <div className="button">
                          <Button
                            size="xs"
                            outline
                            onClick={() => {
                              addTestcaseTemplateItem('CASE');
                            }}
                          >
                            {t('아이템 추가')}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="layout">
                      {caseTemplateItems?.length < 1 && <EmptyContent>{t('아이템이 없습니다.')}</EmptyContent>}
                      {caseTemplateItems?.length > 0 && (
                        <ul>
                          {caseTemplateItems
                            ?.sort((a, b) => a.itemOrder - b.itemOrder)
                            .map((testcaseTemplateItem, inx) => {
                              return getItem(testcaseTemplateItem, inx);
                            })}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="sub-title">
                      <div className="text">
                        <div>{t('테스트 결과 레이아웃')}</div>
                      </div>
                      {editor && (
                        <div className="button">
                          <Button
                            outline
                            size="xs"
                            onClick={() => {
                              addTestcaseTemplateItem('RESULT');
                            }}
                          >
                            {t('아이템 추가')}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="layout">
                      {resultTemplateItems?.length < 1 && <EmptyContent>{t('아이템이 없습니다.')}</EmptyContent>}
                      {resultTemplateItems?.length > 0 && (
                        <ul>
                          {resultTemplateItems?.map((testcaseTemplateItem, inx) => {
                            return getItem(testcaseTemplateItem, inx);
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                {editor && (
                  <div className="properties">
                    <div className="sub-title">{t('속성')}</div>
                    <div className="properties-content">
                      {!selectedItem?.item && <EmptyContent>{t('아이템을 선택해주세요.')}</EmptyContent>}
                      {selectedItem?.item && (
                        <>
                          <div className="properties-button">
                            <Button
                              outline
                              size="xs"
                              rounded
                              onClick={() => {
                                onChangeTestcaseTemplateItemOrder(selectedItem.inx, selectedItem?.item?.category, 'left');
                              }}
                            >
                              <i className="fa-solid fa-arrow-left" />
                            </Button>
                            <Button
                              outline
                              size="xs"
                              rounded
                              onClick={() => {
                                onChangeTestcaseTemplateItemOrder(selectedItem.inx, selectedItem?.item?.category, 'right');
                              }}
                            >
                              <i className="fa-solid fa-arrow-right" />
                            </Button>
                            <Liner display="inline-block" width="1px" height="10px" color="white" margin="0 0.5rem 0 0.25rem" />
                            <Button
                              outline
                              size="xs"
                              rounded
                              onClick={() => {
                                onChangeTestcaseTemplateItemSize(selectedItem.inx, selectedItem?.item?.category, 'down');
                              }}
                            >
                              <i className="fa-solid fa-right-left" />
                            </Button>
                            <Button
                              outline
                              size="xs"
                              rounded
                              onClick={() => {
                                onChangeTestcaseTemplateItemSize(selectedItem.inx, selectedItem?.item?.category, 'up');
                              }}
                            >
                              <i className="fa-solid fa-left-right" />
                            </Button>
                            <Button
                              outline
                              size="xs"
                              rounded
                              onClick={() => {
                                onChangeTestcaseTemplateItemSize(selectedItem.inx, selectedItem?.item?.category, 'fill');
                              }}
                            >
                              <i className="fa-solid fa-expand" />
                            </Button>
                            <Liner display="inline-block" width="1px" height="10px" color="white" margin="0 0.5rem 0 0.25rem" />
                            <Button
                              outline
                              size="xs"
                              rounded
                              color="danger"
                              onClick={() => {
                                onDeleteTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category);
                              }}
                            >
                              <i className="fa-regular fa-trash-can" />
                            </Button>
                          </div>
                          <div className="type">
                            <div className="title">{t('카테고리')}</div>
                            <div className="properties-control">
                              {testcaseItemCategories.map(d => {
                                return (
                                  <Radio
                                    key={d}
                                    label={d}
                                    size="md"
                                    value={d}
                                    checked={d === selectedItem?.item?.category}
                                    onChange={() => {
                                      onChangeTestcaseTemplateItemCategory(selectedItem.inx, selectedItem?.item?.category, d);
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          <div className="label">
                            <div className="title">{t('라벨')}</div>
                            <div className="properties-control">
                              <Input
                                size="md"
                                color="white"
                                value={selectedItem?.item?.label}
                                onChange={val => {
                                  onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'label', val);
                                }}
                                required
                                minLength={1}
                              />
                            </div>
                          </div>
                          <div className="type">
                            <div className="title">{t('타입')}</div>
                            <div className="properties-control">
                              <Selector
                                className="selector"
                                size="md"
                                items={testcaseItemTypes.map(d => {
                                  return {
                                    key: d,
                                    value: d,
                                  };
                                })}
                                value={selectedItem?.item?.type}
                                onChange={val => {
                                  onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'type', val);
                                }}
                              />
                            </div>
                          </div>
                          {!hasOptionType(selectedItem?.item?.type) && selectedItem?.item?.type === 'CHECKBOX' && (
                            <div className="default-value">
                              <div className="title">{t('기본 값')}</div>
                              <div className="properties-control">
                                <CheckBox
                                  size="sm"
                                  value={selectedItem?.item?.defaultValue === 'Y'}
                                  onChange={() => {
                                    if (selectedItem?.item?.defaultValue === 'Y') {
                                      onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'defaultValue', 'N');
                                    } else {
                                      onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'defaultValue', 'Y');
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {!hasOptionType(selectedItem?.item?.type) && selectedItem?.item?.type !== 'CHECKBOX' && (
                            <div className="default-value">
                              <div className="title">{t('기본 값')}</div>
                              <div className="properties-control">
                                <Input
                                  size="md"
                                  color="white"
                                  value={selectedItem?.item?.defaultValue || ''}
                                  onChange={val => {
                                    onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'defaultValue', val);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {hasOptionType(selectedItem?.item?.type) && (
                            <div className="options">
                              <div className="title">
                                <div>옵션</div>
                                <div className="option-button">
                                  <Button
                                    size="xs"
                                    onClick={() => {
                                      onAddTestcaseTemplateItemOption(selectedItem.inx, selectedItem?.item?.category);
                                    }}
                                  >
                                    {t('추가')}
                                  </Button>
                                </div>
                              </div>
                              <div className="properties-control">
                                <div>
                                  <ul>
                                    {selectedItem?.item?.options?.map((d, jnx) => {
                                      return (
                                        <li key={jnx}>
                                          <div>
                                            <dic className="default-options">
                                              <CheckBox
                                                size="sm"
                                                value={d === selectedItem?.item?.defaultValue}
                                                onChange={() => {
                                                  if (selectedItem?.item?.defaultValue === d) {
                                                    onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'defaultValue', '');
                                                  } else {
                                                    onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'defaultValue', d);
                                                  }
                                                }}
                                              />
                                            </dic>
                                            <div className="input">
                                              <Input
                                                size="sm"
                                                color="white"
                                                value={d}
                                                onChange={val => {
                                                  onChangeTestcaseTemplateItemOption(selectedItem.inx, selectedItem.item.category, jnx, val);
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
                                                  onDeleteTestcaseTemplateItemOption(selectedItem.inx, selectedItem.item.category, jnx);
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
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        {editor && (
          <>
            <Button
              outline
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
            >
              {t('취소')}
            </Button>
            <Button
              outline
              onClick={() => {
                if (onChange) {
                  const nextTemplate = { ...template };
                  nextTemplate.testcaseTemplateItems = [].concat(caseTemplateItems).concat(resultTemplateItems);
                  onChange(nextTemplate);
                  onClose();
                }
              }}
            >
              {t('적용')}
            </Button>
          </>
        )}
        {!editor && (
          <Button
            outline
            onClick={() => {
              onClose();
            }}
          >
            {t('닫기')}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}

TestcaseTemplateEditorPopup2.defaultProps = {
  className: '',
  testcaseTemplate: null,
  onClose: null,
  onChange: null,
  testcaseItemTypes: [],
  testcaseItemCategories: [],
  opened: false,
  editor: true,
};

TestcaseTemplateEditorPopup2.propTypes = {
  className: PropTypes.string,
  testcaseTemplate: TestcaseTemplateEditPropTypes,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  testcaseItemTypes: PropTypes.arrayOf(PropTypes.string),
  testcaseItemCategories: PropTypes.arrayOf(PropTypes.string),
  opened: PropTypes.bool,
  editor: PropTypes.bool,
};

export default TestcaseTemplateEditorPopup2;
