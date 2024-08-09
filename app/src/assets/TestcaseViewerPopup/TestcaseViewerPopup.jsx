import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ProjectPropTypes, ProjectReleasePropTypes } from '@/proptypes';
import { observer } from 'mobx-react';
import './TestcaseViewerPopup.scss';
import TestcaseService from '@/services/TestcaseService';
import TestcaseManager from '@/pages/spaces/projects/ProjectTestcaseEditPage/ContentManager/TestcaseManager/TestcaseManager';
import useKeyboard from '@/hooks/useKeyboard';
import { CloseIcon } from '@/components';

function TestcaseViewerPopup({ spaceCode, project, releases, users, testcaseGroupId, testcaseGroupTestcaseId, setOpened }) {
  const [testcase, setTestcase] = useState(null);

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

  return (
    <div
      className="testcase-viewer-popup-wrapper"
      onClick={() => {
        setOpened(false);
      }}
    >
      {testcase && (
        <div className="popup-content" onClick={e => e.stopPropagation()}>
          <div className="popup-content-layout">
            {testcase && (
              <TestcaseManager
                isEdit={false}
                content={testcase}
                testcaseTemplates={project.testcaseTemplates}
                setContent={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                releases={releases}
                users={users}
                createTestcaseImage={() => {}}
                tags={tags}
                llms={null}
                onParaphrase={() => {}}
                paraphraseInfo={null}
                onAcceptParaphraseContent={() => {}}
                onRemoveParaphraseContent={() => {}}
                aiEnabled={false}
                headerControl={
                  <CloseIcon
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
};

export default observer(TestcaseViewerPopup);
