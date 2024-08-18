import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ProjectPropTypes, ProjectReleasePropTypes } from '@/proptypes';
import { observer } from 'mobx-react';
import './TestcaseViewerPopup.scss';
import TestcaseService from '@/services/TestcaseService';
import TestcaseManager from '@/pages/spaces/projects/ProjectTestcaseEditPage/ContentManager/TestcaseManager/TestcaseManager';
import useKeyboard from '@/hooks/useKeyboard';
import { CloseIcon, Loader } from '@/components';
import dialogUtil from '@/utils/dialogUtil';
import { useTranslation } from 'react-i18next';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { cloneDeep } from 'lodash';

function TestcaseViewerPopup({ spaceCode, project, releases, users, testcaseGroupId, testcaseGroupTestcaseId, setOpened, editEnabled, onTestcaseChange }) {
  const { t } = useTranslation();
  const [testcase, setTestcase] = useState(null);
  const [orginalTestcase, setOrginalTestcase] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const targetRelease = useMemo(() => {
    return releases.find(d => d.isTarget);
  }, [releases]);

  const tags = useMemo(() => {
    const tagMap = {};

    project.users.forEach(d => {
      const currentTags = d.tags?.split(';').filter(i => !!i) || [];
      currentTags.forEach(word => {
        tagMap[word] = true;
      });
    });

    return Object.keys(tagMap);
  }, [project]);

  useEffect(() => {
    TestcaseService.selectTestcase(spaceCode, project.id, testcaseGroupTestcaseId, data => {
      setTestcase(data);
      setOrginalTestcase(cloneDeep(data));
    });
  }, [testcaseGroupId, testcaseGroupTestcaseId]);

  const { register, unregister, pressed } = useKeyboard('Escape');

  useEffect(() => {
    if (pressed) setOpened(false);
  }, [pressed]);

  useEffect(() => {
    register();
    return () => unregister();
  }, [register, unregister]);

  useEffect(() => {
    const body = document.querySelector('body');
    body.classList.add('stop-scroll');

    return () => {
      body.classList.remove('stop-scroll');
    };
  }, []);

  const updateTestcase = info => {
    setContentLoading(true);
    TestcaseService.updateTestcase(
      spaceCode,
      project.id,
      info.id,
      info,
      result => {
        setTestcase(result);
        setTimeout(() => {
          setContentLoading(false);
        }, 200);

        setIsEdit(false);
        if (onTestcaseChange) {
          onTestcaseChange(result);
        }
      },
      () => {
        setTimeout(() => {
          setContentLoading(false);
        }, 200);
      },
    );
  };

  const onSaveTestcase = info => {
    if (targetRelease && !info.projectReleaseIds.includes(targetRelease.id)) {
      dialogUtil.setConfirm(
        MESSAGE_CATEGORY.WARNING,
        t('타켓 릴리스 추가 확인'),
        t('설정된 프로젝트의 타켓 릴리스가 현재 테스트케이스에 추가되어 있지 않습니다. 테스트케이스에 타켓 릴리스를 추가하시겠습니까?'),
        () => {
          info.projectReleaseIds.push(targetRelease.id);
          updateTestcase(info);
        },
        () => {
          updateTestcase(info);
        },
        '추가',
        '추가 안함',
      );
    } else {
      updateTestcase(info);
    }
  };

  const createTestcaseImage = (testcaseId, name, size, type, file) => {
    return TestcaseService.createImage(spaceCode, project.id, testcaseId, name, size, type, file);
  };

  const onCancel = () => {
    setIsEdit(false);
    setTestcase(cloneDeep(orginalTestcase));
  };

  return (
    <div
      className="testcase-viewer-popup-wrapper"
      onClick={() => {
        setOpened(false);
      }}
    >
      {contentLoading && <Loader />}
      {testcase && (
        <div className="popup-content" onClick={e => e.stopPropagation()}>
          <div className="popup-content-layout">
            {testcase && (
              <TestcaseManager
                isEdit={isEdit}
                setIsEdit={editEnabled ? setIsEdit : null}
                content={testcase}
                testcaseTemplates={project.testcaseTemplates}
                setContent={setTestcase}
                onSave={() => {
                  onSaveTestcase(testcase);
                }}
                onCancel={onCancel}
                releases={releases}
                users={users}
                createTestcaseImage={createTestcaseImage}
                tags={tags}
                llms={null}
                onParaphrase={() => {}}
                paraphraseInfo={null}
                onAcceptParaphraseContent={() => {}}
                onRemoveParaphraseContent={() => {}}
                aiEnabled={false}
                headerControl={
                  <CloseIcon
                    className="testcase-viewer-close-icon"
                    onClick={() => {
                      setOpened(false);
                    }}
                  />
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

TestcaseViewerPopup.defaultProps = {
  users: [],
  editEnabled: false,
  onTestcaseChange: null,
};

TestcaseViewerPopup.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
  spaceCode: PropTypes.string.isRequired,
  testcaseGroupId: PropTypes.number.isRequired,
  testcaseGroupTestcaseId: PropTypes.number.isRequired,
  setOpened: PropTypes.func.isRequired,
  project: ProjectPropTypes.isRequired,
  releases: PropTypes.arrayOf(ProjectReleasePropTypes).isRequired,
  editEnabled: PropTypes.bool,
  onTestcaseChange: PropTypes.func,
};

export default observer(TestcaseViewerPopup);
