import React, { useMemo } from 'react';
import { TestcaseGroupPropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import { SeqId, Tag, Td, Tr } from '@/components';
import { ITEM_TYPE, TESTRUN_RESULT_CODE } from '@/constants/constants';
import { useTranslation } from 'react-i18next';
import './ReleaseGroupItem.scss';

function ReleaseGroupItem({ testcaseGroup, parentGroupName, releaseId, onNameClick, releaseNameMap, selectedTestcaseIdMap, releaseSummary, showTester, showTestResult, userById }) {
  const { t } = useTranslation();

  const testcases = useMemo(() => {
    if (releaseId) {
      return testcaseGroup.testcases
        .filter(testcase => testcase.projectReleaseIds.includes(Number(releaseId)))
        .map(testcase => {
          return {
            ...testcase,
            projectReleases: testcase.projectReleaseIds.sort((a, b) => b - a).map(projectReleaseId => releaseNameMap[projectReleaseId]),
          };
        });
    }

    return testcaseGroup.testcases.filter(testcase => selectedTestcaseIdMap[testcase.id]);
  }, [testcaseGroup, releaseId, releaseNameMap, selectedTestcaseIdMap]);

  return (
    <>
      {testcases.length > 0 &&
        testcases?.map((testcase, inx) => {
          return (
            <Tr className="release-group-item-wrapper" key={testcase.id}>
              {inx === 0 && (
                <Td rowSpan={testcases.length} className="group-info">
                  {parentGroupName}
                  {parentGroupName ? ' > ' : ''}
                  {testcaseGroup.name}
                </Td>
              )}
              <Td>
                <div
                  className="seq-name"
                  onClick={() => {
                    onNameClick(testcaseGroup.id, testcase.id);
                  }}
                >
                  <div>
                    <SeqId className="seq-id" size="sm" type={ITEM_TYPE.TESTCASE} copy={false}>
                      {testcase.seqId}
                    </SeqId>
                  </div>
                  <div>{testcase.name}</div>
                </div>
              </Td>
              {releaseSummary && (
                <Td align="left" className="releases">
                  {testcase.projectReleases?.length > 0 && (
                    <>
                      <Tag border bold>
                        {testcase.projectReleases[0]}
                      </Tag>
                      {testcase.projectReleases.length > 1 && <span>{t('외 @개', { count: testcase.projectReleases.length - 1 })}</span>}
                    </>
                  )}
                </Td>
              )}
              {showTester && <Td align="left">{userById[selectedTestcaseIdMap[testcase.id]?.testerId]?.name}</Td>}
              {showTestResult && (
                <Td align="center">
                  <Tag size="xs" className={selectedTestcaseIdMap[testcase.id].testResult}>
                    {TESTRUN_RESULT_CODE[selectedTestcaseIdMap[testcase.id].testResult]}
                  </Tag>
                </Td>
              )}
            </Tr>
          );
        })}

      {testcaseGroup.children?.map(child => {
        return (
          <ReleaseGroupItem
            key={child.id}
            releaseId={releaseId}
            testcaseGroup={child}
            parentGroupName={parentGroupName ? `${parentGroupName} > ${testcaseGroup.name}` : testcaseGroup.name}
            onNameClick={onNameClick}
            selectedTestcaseIdMap={selectedTestcaseIdMap}
            releaseNameMap={releaseNameMap}
            releaseSummary={releaseSummary}
            showTester={showTester}
            showTestResult={showTestResult}
            userById={userById}
          />
        );
      })}
    </>
  );
}

ReleaseGroupItem.defaultProps = {
  testcaseGroup: {},
  parentGroupName: '',
  releaseNameMap: {},
  selectedTestcaseIdMap: {},
  releaseId: null,
  releaseSummary: false,
  showTestResult: false,
  showTester: false,
  userById: {},
};

ReleaseGroupItem.propTypes = {
  testcaseGroup: TestcaseGroupPropTypes,
  parentGroupName: PropTypes.string,
  onNameClick: PropTypes.func.isRequired,
  releaseNameMap: PropTypes.shape({
    [PropTypes.number]: PropTypes.string,
  }),
  releaseId: PropTypes.string,
  selectedTestcaseIdMap: PropTypes.shape({
    [PropTypes.number]: PropTypes.bool,
  }),
  releaseSummary: PropTypes.bool,
  showTestResult: PropTypes.bool,
  showTester: PropTypes.bool,
  userById: PropTypes.shape({
    [PropTypes.number]: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
};

export default ReleaseGroupItem;
