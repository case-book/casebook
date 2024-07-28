import React, { useEffect, useMemo, useState } from 'react';
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Selector } from '@/components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import './RequestBuilderPopup.scss';
import SpaceService from '@/services/SpaceService';
import ProjectService from '@/services/ProjectService';
import TestrunService from '@/services/TestrunService';
import TestcaseService from '@/services/TestcaseService';

function RequestBuilderPopup({ path, setOpened }) {
  const { t } = useTranslation();

  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectTokenId, setSelectedProjectTokenId] = useState(null);
  const [selectedProjectTestrunId, setSelectedProjectTestrunId] = useState(null);
  const [selectedProjectTestcaseId, setSelectedProjectTestcaseId] = useState(null);

  const [spaceList, setSpaceList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [projectTokenList, setProjectTokenList] = useState([]);
  const [projectTestrunList, setProjectTestrunList] = useState([]);
  const [projectTestcaseList, setProjectTestcaseList] = useState([]);

  const variables = useMemo(() => {
    const set = {};
    path.forEach(d => {
      if (d.type === 'variable') set[d.value] = true;
    });

    return set;
  }, [path]);

  const selectedSpace = useMemo(() => {
    return spaceList?.find(d => d.id === selectedSpaceId);
  }, [selectedSpaceId]);

  useEffect(() => {
    SpaceService.selectMySpaceList(null, list => {
      setSpaceList(list);
    });
  }, []);

  useEffect(() => {
    if (selectedSpace) {
      ProjectService.selectMyProjectList(selectedSpace.code, list => {
        setProjectList(list);
      });
    }
  }, [selectedSpace]);

  const selectedProject = useMemo(() => {
    return selectedProjectId ? projectList.find(d => d.id === selectedProjectId) : null;
  }, [projectList, selectedProjectId]);

  useEffect(() => {
    if (selectedSpace && selectedProjectId) {
      ProjectService.getProjectTokenList(selectedSpace.code, selectedProjectId, tokens => {
        setProjectTokenList(tokens);
      });

      TestrunService.selectProjectTestrunList(selectedSpace.code, selectedProjectId, list => {
        setProjectTestrunList(list);
      });

      TestcaseService.selectTestcaseList(selectedSpace.code, selectedProjectId, list => {
        setProjectTestcaseList(list);
      });
    }
  }, [selectedSpace, selectedProjectId]);

  const selectedProjectToken = useMemo(() => {
    return selectedProjectTokenId ? projectTokenList.find(d => d.id === selectedProjectTokenId) : null;
  }, [projectTokenList, selectedProjectTokenId]);

  const selectedTestrun = useMemo(() => {
    return selectedProjectTestrunId ? projectTestrunList.find(d => d.id === selectedProjectTestrunId) : null;
  }, [projectTestrunList, selectedProjectTestrunId]);

  const selectedTestcase = useMemo(() => {
    return selectedProjectTestcaseId ? projectTestcaseList.find(d => d.id === selectedProjectTestcaseId) : null;
  }, [projectTestcaseList, selectedProjectTestcaseId]);

  return (
    <Modal
      className="request-builder-popup-wrapper"
      size="lg"
      isOpen
      toggle={() => {
        if (setOpened) {
          setOpened(false);
        }
      }}
    >
      <ModalHeader>{t('리퀘스트 빌더')}</ModalHeader>
      <ModalBody className="modal-body">
        <div className="block">
          <div className="title">{t('프로젝트 선택')}</div>
          <div className="project-selector">
            <div>
              <Label minWidth="0px">{t('스페이스')}</Label>
              <Selector
                className="selector"
                size="sm"
                value={selectedSpaceId}
                items={[{ key: null, value: t('선택 안함') }].concat(
                  spaceList.map(d => {
                    return { key: d.id, value: d.name };
                  }),
                )}
                onChange={val => {
                  setSelectedSpaceId(val);
                  setSelectedProjectId(null);
                }}
              />
            </div>
            <div>
              <Label minWidth="0px">{t('프로젝트')}</Label>
              <Selector
                size="sm"
                className="selector"
                value={selectedProjectId}
                items={[{ key: null, value: t('선택 안함') }].concat(
                  projectList.map(d => {
                    return { key: d.id, value: d.name };
                  }),
                )}
                onChange={val => {
                  setSelectedProjectId(val);
                  setSelectedProjectTokenId(null);
                  setSelectedProjectTestrunId(null);
                  setSelectedProjectTestcaseId(null);
                }}
              />
            </div>
          </div>
        </div>
        {variables['PROJECT TOKEN'] && (
          <div className="block">
            <div className="title">{t('프로젝트 토큰 선택')}</div>
            {!(selectedSpaceId && selectedProjectId) && <div className="message">{t('프로젝트를 선택해주세요.')}</div>}
            {selectedSpaceId && selectedProjectId && (
              <>
                {!(projectTokenList?.length > 0) && (
                  <Link to={`/spaces/${selectedSpace?.code}/projects/${selectedProject?.id}/info`}>
                    <span>{t('프로젝트 관리 화면으로 이동')}</span>
                  </Link>
                )}
                {projectTokenList?.length > 0 && (
                  <Selector
                    size="sm"
                    minWidth="100%"
                    value={selectedProjectTokenId}
                    items={[{ key: null, value: t('선택 안함') }].concat(
                      projectTokenList.map(d => {
                        return { key: d.id, value: d.name };
                      }),
                    )}
                    onChange={val => {
                      setSelectedProjectTokenId(val);
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}

        {variables['TESTRUN SEQ NUMBER'] && (
          <div className="block">
            <div className="title">{t('테스트런 선택')}</div>
            {!(selectedSpaceId && selectedProjectId) && <div className="message">{t('프로젝트를 선택해주세요.')}</div>}
            {selectedSpaceId && selectedProjectId && (
              <Selector
                size="sm"
                minWidth="100%"
                value={selectedProjectTestrunId}
                items={[{ key: null, value: t('선택 안함') }].concat(
                  projectTestrunList.map(d => {
                    return { key: d.id, value: d.name };
                  }),
                )}
                onChange={val => {
                  setSelectedProjectTestrunId(val);
                }}
              />
            )}
          </div>
        )}
        {variables['TESTCASE SEQ NUMBER'] && (
          <div className="block">
            <div className="title">{t('테스트케이스 선택')}</div>
            {!(selectedSpaceId && selectedProjectId) && <div className="message">{t('프로젝트를 선택해주세요.')}</div>}
            {selectedSpaceId && selectedProjectId && (
              <Selector
                size="sm"
                minWidth="100%"
                value={selectedProjectTestcaseId}
                items={[{ key: null, value: t('선택 안함') }].concat(
                  projectTestcaseList.map(d => {
                    return { key: d.id, value: d.name };
                  }),
                )}
                onChange={val => {
                  setSelectedProjectTestcaseId(val);
                }}
              />
            )}
          </div>
        )}
        <div className="title">API PATH</div>
        <div className="path">
          {path.map((d, inx) => {
            return (
              <span key={inx} className={d.type}>
                {d.type === 'text' && d.value}
                {d.type === 'variable' && d.value === 'PROJECT TOKEN' && (selectedProjectToken?.token || d.value)}
                {d.type === 'variable' && d.value === 'TESTRUN SEQ NUMBER' && (selectedTestrun?.seqId.replace('R', '') || d.value)}
                {d.type === 'variable' && d.value === 'TESTCASE SEQ NUMBER' && (selectedTestcase?.seqId.replace('TC', '') || d.value)}
              </span>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter className="modal-footer">
        <Button onClick={() => setOpened(false)}>{t('닫기')}</Button>
        <Button
          onClick={() => {
            let text = '';
            path.forEach(d => {
              if (d.type === 'text') {
                text += d.value;
              } else if (d.type === 'variable' && d.value === 'PROJECT TOKEN') {
                text += selectedProjectToken?.token || d.value;
              } else if (d.type === 'variable' && d.value === 'TESTRUN SEQ NUMBER') {
                text += selectedTestrun?.seqId.replace('R', '') || d.value;
              } else if (d.type === 'variable' && d.value === 'TESTCASE SEQ NUMBER') {
                text += selectedTestcase?.seqId.replace('TC', '') || d.value;
              }
            });
            copy(text);
          }}
        >
          {t('복사')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

RequestBuilderPopup.defaultProps = {};

RequestBuilderPopup.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,

  setOpened: PropTypes.func.isRequired,
};

export default RequestBuilderPopup;
