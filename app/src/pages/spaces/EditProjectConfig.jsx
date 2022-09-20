import React, { useEffect, useState } from 'react';
import './EditProjectConfig.scss';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import ProjectService from '@/services/ProjectService';
import { useParams } from 'react-router';
import ConfigService from '@/services/ConfigService';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Liner, Modal, ModalBody, ModalFooter, ModalHeader, Page, PageButtons, PageContent, PageTitle, Selector, Tag, Title } from '@/components';
import TestcaseService from '@/services/TestcaseService';

function ProjectConfig() {
  const { t } = useTranslation();
  const { id, spaceCode } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [testcaseItemTypes, setTestcaseItemTypes] = useState([]);

  const [templateNameModalInfo, setTemplateNameModalInfo] = useState({
    opened: false,
    name: '',
  });

  const [optionsModalInfo, setOptionsModalInfo] = useState({
    opened: false,
    label: null,
    options: [],
    testcaseTemplateInx: null,
    testcaseTemplateItemInx: null,
  });

  useEffect(() => {
    ConfigService.selectTestcaseItemTypes(list => {
      setTestcaseItemTypes(list);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    ProjectService.selectProjectInfo(spaceCode, id, info => {
      console.log(info);
      setProject(info);
    });
  }, [spaceCode, id]);

  const addTestcaseTemplate = name => {
    const nextProject = { ...project };
    if (!nextProject.testcaseTemplates) {
      nextProject.testcaseTemplates = [];
    }

    nextProject.testcaseTemplates.push({
      name,
      testcaseTemplateItems: [],
    });

    setProject(nextProject);
  };

  const addTestcaseTemplateItem = inx => {
    const nextProject = { ...project };
    const nextTemplate = nextProject.testcaseTemplates[inx];

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

    setProject(nextProject);
  };

  // eslint-disable-next-line no-unused-vars
  const onChangeTestcaseTemplate = (testcaseTemplateInx, key, val) => {
    const nextProject = { ...project };
    const nextTemplate = nextProject.testcaseTemplates[testcaseTemplateInx];
    nextTemplate[key] = val;
    setProject(nextProject);
  };

  const onChangeTestcaseTemplateItem = (testcaseTemplateInx, testcaseTemplateItemInx, key, val) => {
    const nextProject = { ...project };
    const nextTemplate = nextProject.testcaseTemplates[testcaseTemplateInx];
    const nextTemplateItem = nextTemplate.testcaseTemplateItems[testcaseTemplateItemInx];
    nextTemplateItem[key] = val;
    setProject(nextProject);
  };

  const onDeleteTestcaseTemplateItem = (testcaseTemplateInx, testcaseTemplateItemInx) => {
    const nextProject = { ...project };
    const nextTemplate = nextProject.testcaseTemplates[testcaseTemplateInx];
    const nextTemplateItem = nextTemplate.testcaseTemplateItems[testcaseTemplateItemInx];
    if (nextTemplateItem.id) {
      nextTemplateItem.crud = 'D';
    } else {
      nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx, 1);
    }

    setProject(nextProject);
  };

  const onChangeTestcaseTemplateItemSize = (testcaseTemplateInx, testcaseTemplateItemInx, option) => {
    const nextProject = { ...project };
    const nextTemplate = nextProject.testcaseTemplates[testcaseTemplateInx];
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

    setProject(nextProject);
  };

  const onChangeTestcaseTemplateItemOrder = (testcaseTemplateInx, testcaseTemplateItemInx, option) => {
    const nextProject = { ...project };
    const nextTemplate = nextProject.testcaseTemplates[testcaseTemplateInx];

    if (option === 'left' && testcaseTemplateItemInx > 0) {
      const target = nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx, 1);
      nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx - 1, 0, target[0]);
    } else if (option === 'right' && testcaseTemplateItemInx < nextTemplate.testcaseTemplateItems.length - 1) {
      const target = nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx, 1);
      nextTemplate.testcaseTemplateItems.splice(testcaseTemplateItemInx + 1, 0, target[0]);
    }

    nextTemplate.testcaseTemplateItems.forEach((item, inx) => {
      const nextItem = item;
      nextItem.itemOrder = inx;
    });

    setProject(nextProject);
  };

  const hasOptionType = value => {
    return value === 'RADIO' || value === 'SELECT';
  };

  console.log(testcaseItemTypes, project);

  const onSubmit = e => {
    e.preventDefault();

    const nextProject = { ...project };
    const nextTestcaseTemplates = nextProject.testcaseTemplates.filter(d => d.crud !== 'D');
    nextProject.testcaseTemplates = nextTestcaseTemplates;

    nextTestcaseTemplates.forEach(testcaseTemplate => {
      const nextTestcaseTemplate = testcaseTemplate;
      nextTestcaseTemplate.testcaseTemplateItems = testcaseTemplate.testcaseTemplateItems.filter(d => d.crud !== 'D');
    });

    console.log(nextProject);

    TestcaseService.updateConfig(spaceCode, id, nextProject, d => {
      console.log(d);
    });
  };

  return (
    <Page className="edit-project-config-wrapper">
      <PageTitle>
        {project?.name} {t('CONFIG')}
      </PageTitle>
      <PageContent>
        <Title
          type="h2"
          control={
            <Button
              outline
              onClick={() => {
                setTemplateNameModalInfo({
                  ...templateNameModalInfo,
                  opened: true,
                });
              }}
            >
              <i className="fa-solid fa-plus" /> 템플릿 추가
            </Button>
          }
        >
          테스트케이스 템플릿
        </Title>
        <Form onSubmit={onSubmit}>
          <div>
            <div className="testcase-template-list">
              {project?.testcaseTemplates?.map((testcaseTemplate, inx) => {
                return (
                  <div className="testcase-template" key={inx}>
                    <div className="template-name">
                      <div className="line line-1">
                        <div />
                      </div>
                      <div className="name">
                        <Tag className="tag">템플릿</Tag>
                        {testcaseTemplate.name}
                      </div>
                      <div className="line line-2">
                        <div />
                      </div>
                      <div className="control">
                        <Button
                          size="sm"
                          outline
                          onClick={() => {
                            addTestcaseTemplateItem(inx);
                          }}
                        >
                          <i className="fa-solid fa-plus" /> 아이템 추가
                        </Button>
                      </div>
                      <div className="line line-3">
                        <div />
                      </div>
                    </div>
                    <div>
                      {testcaseTemplate?.testcaseTemplateItems?.map((testcaseTemplateItem, jnx) => {
                        return (
                          <div
                            key={jnx}
                            className={`testcase-template-item ${testcaseTemplateItem.crud === 'D' ? 'hidden' : ''}`}
                            style={{ width: `calc(${(testcaseTemplateItem.size / 12) * 100}% - 1rem)` }}
                          >
                            <div className="item-controller">
                              <div>
                                <Button
                                  outline
                                  size="xs"
                                  rounded
                                  onClick={() => {
                                    onChangeTestcaseTemplateItemOrder(inx, jnx, 'left');
                                  }}
                                >
                                  <i className="fa-solid fa-arrow-left" />
                                </Button>
                                <Button
                                  outline
                                  size="xs"
                                  rounded
                                  onClick={() => {
                                    onChangeTestcaseTemplateItemOrder(inx, jnx, 'right');
                                  }}
                                >
                                  <i className="fa-solid fa-arrow-right" />
                                </Button>
                                <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 0.5rem 0 0.25rem" />

                                <Button
                                  outline
                                  size="xs"
                                  rounded
                                  onClick={() => {
                                    onChangeTestcaseTemplateItemSize(inx, jnx, 'down');
                                  }}
                                >
                                  <i className="fa-solid fa-right-left" />
                                </Button>
                                <Button
                                  outline
                                  size="xs"
                                  rounded
                                  onClick={() => {
                                    onChangeTestcaseTemplateItemSize(inx, jnx, 'up');
                                  }}
                                >
                                  <i className="fa-solid fa-left-right" />
                                </Button>
                                <Button
                                  outline
                                  size="xs"
                                  rounded
                                  onClick={() => {
                                    onChangeTestcaseTemplateItemSize(inx, jnx, 'fill');
                                  }}
                                >
                                  <i className="fa-solid fa-expand" />
                                </Button>

                                <Liner display="inline-block" width="1px" height="10px" color="light" margin="0 0.5rem 0 0.25rem" />
                                <Button
                                  outline
                                  size="xs"
                                  rounded
                                  color="danger"
                                  onClick={() => {
                                    onDeleteTestcaseTemplateItem(inx, jnx);
                                  }}
                                >
                                  <i className="fa-regular fa-trash-can" />
                                </Button>
                              </div>
                            </div>
                            <div className="label">
                              <Input
                                size="sm"
                                value={testcaseTemplateItem.label}
                                onChange={val => {
                                  onChangeTestcaseTemplateItem(inx, jnx, 'label', val);
                                }}
                                required
                                minLength={1}
                              />
                            </div>
                            <div className="type">
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
                                value={testcaseTemplateItem.type}
                                onChange={val => {
                                  onChangeTestcaseTemplateItem(inx, jnx, 'type', val);
                                }}
                              />
                            </div>
                            {hasOptionType(testcaseTemplateItem.type) && (
                              <div className="options">
                                <Button
                                  color="white"
                                  outline
                                  size="sm"
                                  rounded
                                  onClick={() => {
                                    setOptionsModalInfo({
                                      label: testcaseTemplateItem.label,
                                      options: cloneDeep(testcaseTemplateItem.options),
                                      opened: true,
                                      testcaseTemplateInx: inx,
                                      testcaseTemplateItemInx: jnx,
                                    });
                                  }}
                                >
                                  <span className="badge">
                                    <span>{testcaseTemplateItem.options.length}</span>
                                  </span>
                                  <i className="fa-solid fa-list-ol" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="empty" />
          <PageButtons
            className="page-button"
            onBack={() => {
              navigate('/');
            }}
            onSubmit={() => {}}
            onSubmitText={t('저장')}
            onCancelIcon=""
          />
        </Form>
      </PageContent>

      <Modal
        isOpen={templateNameModalInfo.opened}
        toggle={() => {
          setTemplateNameModalInfo({
            ...templateNameModalInfo,
            opened: false,
          });
        }}
      >
        <ModalHeader>
          <span className="title">이름</span>
        </ModalHeader>
        <ModalBody>
          <Input
            value={templateNameModalInfo.name}
            onChange={val => {
              setTemplateNameModalInfo({
                ...templateNameModalInfo,
                name: val,
              });
            }}
            required
            minLength={1}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            onClick={() => {
              setTemplateNameModalInfo({
                name: '',
                opened: false,
              });
            }}
          >
            {t('취소')}
          </Button>
          <Button
            outline
            onClick={() => {
              addTestcaseTemplate(templateNameModalInfo.name);
              setTemplateNameModalInfo({
                name: '',
                opened: false,
              });
            }}
          >
            {t('확인')}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={optionsModalInfo.opened}
        toggle={() => {
          setOptionsModalInfo({
            ...optionsModalInfo,
            opened: false,
          });
        }}
      >
        <ModalHeader>
          <span className="title">{optionsModalInfo.label} 옵션 편집</span>
        </ModalHeader>
        <ModalBody>
          <div>
            <Button
              outline
              onClick={() => {
                const next = { ...optionsModalInfo };
                const nextOptions = next.options.slice(0);
                nextOptions.push(`옵션${next.options.length + 1}`);
                next.options = nextOptions;
                setOptionsModalInfo(next);
              }}
            >
              {t('옵션 추가')}
            </Button>
          </div>
          <div>
            {optionsModalInfo.options.map((option, inx) => {
              return (
                <div key={inx}>
                  <Input
                    value={option}
                    onChange={val => {
                      const next = { ...optionsModalInfo };
                      const nextOptions = next.options.slice(0);
                      nextOptions[inx] = val;
                      next.options = nextOptions;
                      setOptionsModalInfo(next);
                    }}
                    required
                    minLength={1}
                  />
                  <Button
                    outline
                    size="xs"
                    rounded
                    color="danger"
                    onClick={() => {
                      const next = { ...optionsModalInfo };
                      const nextOptions = next.options.slice(0);
                      nextOptions.splice(inx, 1);
                      next.options = nextOptions;
                      setOptionsModalInfo(next);
                    }}
                  >
                    <i className="fa-regular fa-trash-can" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            onClick={() => {
              setOptionsModalInfo({
                ...optionsModalInfo,
                opened: false,
              });
            }}
          >
            {t('취소')}
          </Button>
          <Button
            outline
            onClick={() => {
              const nextProject = { ...project };
              const nextTemplate = nextProject.testcaseTemplates[optionsModalInfo.testcaseTemplateInx];
              const nextTemplateItem = nextTemplate.testcaseTemplateItems[optionsModalInfo.testcaseTemplateItemInx];
              nextTemplateItem.options = cloneDeep(optionsModalInfo.options);
              setProject(nextProject);

              setOptionsModalInfo({
                opened: false,
                label: null,
                options: [],
                testcaseTemplateInx: null,
                testcaseTemplateItemInx: null,
              });
            }}
          >
            {t('변경')}
          </Button>
        </ModalFooter>
      </Modal>
    </Page>
  );
}

ProjectConfig.defaultProps = {};

ProjectConfig.propTypes = {};

export default ProjectConfig;
