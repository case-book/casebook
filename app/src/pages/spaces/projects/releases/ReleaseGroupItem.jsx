import React from 'react';
import { TestcaseGroupPropTypes } from '@/proptypes';
import PropTypes from 'prop-types';
import { SeqId, Tag, Td, Tr } from '@/components';
import { ITEM_TYPE } from '@/constants/constants';
import './ReleaseGroupItem.scss';

function ReleaseGroupItem({ testcaseGroup, parentGroupName, releaseId, onNameClick, releaseNameMap }) {
  const testcases = testcaseGroup.testcases
    .filter(testcase => testcase.projectReleaseIds.includes(Number(releaseId)))
    .map(testcase => {
      return {
        ...testcase,
        projectReleases: testcase.projectReleaseIds.sort((a, b) => b - a).map(projectReleaseId => releaseNameMap[projectReleaseId]),
      };
    });

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
              <Td align="left" className="releases">
                {testcase.projectReleases.map((projectRelease, jnx) => {
                  return (
                    <Tag key={jnx} border bold>
                      {projectRelease}
                    </Tag>
                  );
                })}
              </Td>
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
            releaseNameMap={releaseNameMap}
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
};

ReleaseGroupItem.propTypes = {
  testcaseGroup: TestcaseGroupPropTypes,
  parentGroupName: PropTypes.string,
  onNameClick: PropTypes.func.isRequired,
  releaseNameMap: PropTypes.shape({
    [PropTypes.number]: PropTypes.string,
  }),
  releaseId: PropTypes.string.isRequired,
};

export default ReleaseGroupItem;
