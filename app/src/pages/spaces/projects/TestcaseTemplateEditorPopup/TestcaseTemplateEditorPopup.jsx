import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Button, CheckBox, EmptyContent, Input, Liner, Modal, ModalBody, ModalFooter, ModalHeader, Radio, Selector, Text, TextArea, UserSelector } from '@/components';
import { useTranslation } from 'react-i18next';
import { TestcaseTemplateEditPropTypes } from '@/proptypes';
import './TestcaseTemplateEditorPopup.scss';
import TestcaseTemplateItem from '@/pages/spaces/projects/TestcaseTemplateEditorPopup/TestcaseTemplateItem';
import ExampleEditor from '@/pages/spaces/projects/TestcaseTemplateEditorPopup/ExampleEditor';

function TestcaseTemplateEditorPopup({ className, testcaseTemplate, onClose, onChange, testcaseItemTypes, testcaseItemCategories, opened, editor, createProjectImage, users }) {
  const { t } = useTranslation();

  const element = useRef(null);

  const [selectedItem, setSelectedItem] = useState({});

  const [template, setTemplate] = useState(null);
  const [caseTemplateItems, setCaseTemplateItems] = useState([]);
  const [resultTemplateItems, setResultTemplateItems] = useState([]);
  const [exampleMax, setExampleMax] = useState(false);

  useEffect(() => {
    setTemplate(cloneDeep(testcaseTemplate));
    setSelectedItem({});
    setCaseTemplateItems(testcaseTemplate?.testcaseTemplateItems?.filter(d => d.category === 'CASE') || []);
    setResultTemplateItems(testcaseTemplate?.testcaseTemplateItems?.filter(d => d.category === 'RESULT') || []);
  }, [testcaseTemplate, opened]);

  const hasOptionType = value => {
    return value === 'RADIO' || value === 'SELECT';
  };
  const onChangeTestcaseTemplateItem = (testcaseTemplateItemInx, category, key, val, type) => {
    const nextTemplateItems = category === 'CASE' ? caseTemplateItems.slice(0) : resultTemplateItems.slice(0);
    const nextTemplateItem = nextTemplateItems[testcaseTemplateItemInx];
    nextTemplateItem[key] = val;
    if (type) {
      nextTemplateItem.defaultType = type;
    }

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
      editable: true,
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
    console.log(nextTemplateItem);
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

  return (
    <Modal
      className={`${className} testcase-template-editor-popup-wrapper ${editor ? 'is-edit' : ''}`}
      isOpen={opened}
      size="xxl"
      toggle={() => {
        onClose();
      }}
    >
      <ModalHeader className="modal-header">{template?.name}</ModalHeader>
      <ModalBody className="testcase-template-editor-content">
        <div onClick={e => e.stopPropagation()} ref={element}>
          <div className="editor-content">
            <div className="template-content">
              {exampleMax && (
                <div className={`max-example-editor ${exampleMax ? 'max' : ''}`}>
                  <ExampleEditor
                    onChange={value => {
                      onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'example', value);
                    }}
                    initialValue={selectedItem?.item?.example || ''}
                    max={exampleMax}
                    setMax={setExampleMax}
                    itemId={selectedItem.id}
                  />
                </div>
              )}
              {editor && (
                <div className="template-content-control">
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
                              return (
                                <TestcaseTemplateItem
                                  key={inx}
                                  inx={inx}
                                  editor={editor}
                                  testcaseTemplateItem={testcaseTemplateItem}
                                  selected={selectedItem?.item?.category === testcaseTemplateItem.category && selectedItem?.inx === inx}
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
                                  parentElement={element}
                                />
                              );
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
                            return (
                              <TestcaseTemplateItem
                                key={inx}
                                inx={inx}
                                editor={editor}
                                testcaseTemplateItem={testcaseTemplateItem}
                                selected={selectedItem?.item?.category === testcaseTemplateItem.category && selectedItem?.inx === inx}
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
                                parentElement={element}
                              />
                            );
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
                              tip={t('왼쪽으로')}
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
                              tip={t('오른쪽으로')}
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
                              tip={t('너비 작게')}
                              onClick={() => {
                                onChangeTestcaseTemplateItemSize(selectedItem.inx, selectedItem?.item?.category, 'down');
                              }}
                            >
                              <i className="fa-solid fa-right-left" />
                            </Button>
                            <Button
                              outline
                              size="xs"
                              tip={t('너비 크게')}
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
                              tip={t('최대 너비')}
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
                              tip={t('아이템 삭제')}
                              size="xs"
                              disabled={!selectedItem?.item?.editable}
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
                            {selectedItem?.item?.editable && (
                              <div className="properties-control">
                                {testcaseItemCategories.map(d => {
                                  return (
                                    <Radio
                                      key={d}
                                      label={d}
                                      size="sm"
                                      value={d}
                                      checked={d === selectedItem?.item?.category}
                                      onChange={() => {
                                        onChangeTestcaseTemplateItemCategory(selectedItem.inx, selectedItem?.item?.category, d);
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            )}
                            {!selectedItem?.item?.editable && (
                              <div className="properties-control">
                                <Text className="readonly-text" size="sm">
                                  {selectedItem?.item?.category}
                                </Text>
                              </div>
                            )}
                          </div>
                          <div className="label">
                            <div className="title">{t('라벨')}</div>
                            <div className="properties-control">
                              <Input
                                size="sm"
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
                          <div className="label">
                            <div className="title">{t('설명')}</div>
                            <div className="properties-control">
                              <TextArea
                                value={selectedItem?.item?.description || ''}
                                placeholder={`"${selectedItem?.item?.label}" 항목에 대한 설명`}
                                size="sm"
                                rows={3}
                                onChange={val => {
                                  onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'description', val);
                                }}
                              />
                            </div>
                          </div>
                          {(selectedItem?.item?.type === 'URL' || selectedItem?.item?.type === 'TEXT' || selectedItem?.item?.type === 'NUMBER') && (
                            <div className="label">
                              <div className="title">{t('샘플')}</div>
                              <div className="properties-control">
                                <TextArea
                                  value={selectedItem?.item?.example || ''}
                                  placeholder={`"${selectedItem?.item?.label}"에 입력에 참고할 샘플 데이터`}
                                  size="sm"
                                  rows={3}
                                  onChange={val => {
                                    onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'example', val);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {selectedItem?.item?.type === 'EDITOR' && (
                            <div className={`example-editor ${exampleMax ? 'max' : ''}`}>
                              <ExampleEditor
                                onChange={value => {
                                  onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'example', value);
                                }}
                                initialValue={selectedItem?.item?.example || ''}
                                max={exampleMax}
                                setMax={setExampleMax}
                                itemId={selectedItem.id}
                                buttonText="확대"
                                createProjectImage={createProjectImage}
                              />
                            </div>
                          )}
                          <div className="type">
                            <div className="title">{t('타입')}</div>
                            <div className="properties-control">
                              {selectedItem?.item?.editable && (
                                <Selector
                                  className="selector"
                                  size="sm"
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
                              )}
                              {!selectedItem?.item?.editable && (
                                <Text className="readonly-text" size="sm">
                                  {selectedItem?.item?.type}
                                </Text>
                              )}
                            </div>
                          </div>
                          {!hasOptionType(selectedItem?.item?.type) && selectedItem?.item?.type === 'CHECKBOX' && (
                            <div className="default-value">
                              <div className="title">{t('기본 선택 여부')}</div>
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
                          {selectedItem?.item?.type === 'USER' && (
                            <div className="default-value">
                              <div className="title">{t('기본 값')}</div>
                              <div className="properties-control">
                                <div>
                                  <UserSelector
                                    size="sm"
                                    users={users}
                                    type={selectedItem?.item?.defaultType || ''}
                                    value={selectedItem?.item?.defaultValue || ''}
                                    onChange={(type, val) => {
                                      onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'defaultValue', val, type);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedItem?.item?.type !== 'USER' && !hasOptionType(selectedItem?.item?.type) && selectedItem?.item?.type !== 'CHECKBOX' && (
                            <div className="default-value">
                              <div className="title">{t('기본 값')}</div>
                              <div className="properties-control">
                                <Input
                                  size="sm"
                                  color="white"
                                  placeholder={`"${selectedItem?.item?.label}" 생성시 입력될 기본 값`}
                                  value={selectedItem?.item?.defaultValue || ''}
                                  onChange={val => {
                                    onChangeTestcaseTemplateItem(selectedItem.inx, selectedItem?.item?.category, 'defaultValue', val);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {selectedItem?.item?.type !== 'USER' && hasOptionType(selectedItem?.item?.type) && (
                            <div className="options">
                              <div className="title">
                                <div>옵션</div>
                                <div className="option-button">
                                  <Button
                                    size="xs"
                                    outline
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
                                            <div className="default-options">
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
                                            </div>
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
                                                size="xs"
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

TestcaseTemplateEditorPopup.defaultProps = {
  className: '',
  testcaseTemplate: null,
  onClose: null,
  onChange: null,
  testcaseItemTypes: [],
  testcaseItemCategories: [],
  opened: false,
  editor: true,
  createProjectImage: null,
  users: [],
};

TestcaseTemplateEditorPopup.propTypes = {
  className: PropTypes.string,
  testcaseTemplate: TestcaseTemplateEditPropTypes,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  testcaseItemTypes: PropTypes.arrayOf(PropTypes.string),
  testcaseItemCategories: PropTypes.arrayOf(PropTypes.string),
  opened: PropTypes.bool,
  editor: PropTypes.bool,
  createProjectImage: PropTypes.func,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
};

export default TestcaseTemplateEditorPopup;
