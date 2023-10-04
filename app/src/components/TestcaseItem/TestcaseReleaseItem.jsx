import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './TestcaseReleaseItem.scss';
import { Button, Selector, Tag, TestcaseViewerLabel } from '@/components';
import { useTranslation } from 'react-i18next';

import { ProjectReleasePropTypes } from '@/proptypes';

function TestcaseReleaseItem({ isEdit, testcaseTemplateItem, content, onChangeTestcaseItem, setOpenTooltipInfo, caseContentElement, openTooltipInfo, inx, size, releases, onAdd, onRemove }) {
  const { t } = useTranslation();

  const element = useRef(null);
  const list = useRef(null);
  const [bottomList, setBottomList] = useState(true);
  const [open, setOpen] = useState(false);

  const handleOutsideClick = event => {
    if (element.current && !element.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);

      if (element.current) {
        const elementRect = element.current.getClientRects();
        if (elementRect.length > 0) {
          const gab = window.innerHeight - elementRect[0].top;
          if (gab < 300) {
            setBottomList(false);
          } else {
            setBottomList(true);
          }
        }
      }

      if (list.current) {
        const selectedItem = list.current.querySelector('.selected');
        if (selectedItem) {
          list.current.scrollTop = selectedItem.offsetTop;
        }
      }
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);

  const releaseNameMap = useMemo(() => {
    const nextReleaseNameMap = {};
    releases.forEach(projectRelease => {
      nextReleaseNameMap[projectRelease.id] = projectRelease.name;
    });
    return nextReleaseNameMap;
  }, [releases]);

  return (
    <div ref={element} className={`testcase-release-item-wrapper size-${testcaseTemplateItem?.size}`}>
      <div>
        <TestcaseViewerLabel
          testcaseTemplateItem={testcaseTemplateItem}
          setOpenTooltipInfo={setOpenTooltipInfo}
          caseContentElement={caseContentElement}
          openTooltipInfo={openTooltipInfo}
          inx={inx}
          showType={isEdit}
        />
        <div className="value">
          <div>
            <div className={`case-release ${isEdit ? 'is-edit' : ''}`}>
              <div className="release-list">
                {!(content.projectReleaseIds?.length > 0) && <div className="no-release">{t('릴리즈가 없습니다.')}</div>}
                {content.projectReleaseIds?.length > 0 &&
                  content.projectReleaseIds
                    ?.sort((a, b) => b - a)
                    .map(projectReleaseId => {
                      return (
                        <Tag
                          key={projectReleaseId}
                          border
                          bold
                          onRemove={
                            isEdit
                              ? () => {
                                  if (onRemove) {
                                    onRemove(projectReleaseId);
                                  }
                                }
                              : null
                          }
                        >
                          {releaseNameMap[projectReleaseId]}
                        </Tag>
                      );
                    })}
              </div>
              {isEdit && (
                <div>
                  <Button size="sm" color="transparent" onClick={() => setOpen(!open)}>
                    <i className="fa-solid fa-plus" />
                  </Button>
                </div>
              )}

              {isEdit && (
                <div className="ssss">
                  <Selector
                    size={size}
                    minWidth="130px"
                    value={releases.find(d => d.id === content.projectReleaseIds)?.id ?? null}
                    items={[
                      { key: null, value: t('릴리스 없음') },
                      ...releases.map(release => ({
                        key: release.id,
                        value: release.name,
                      })),
                    ]}
                    onChange={val => {
                      onChangeTestcaseItem(val);
                    }}
                  />
                </div>
              )}
            </div>
            {open && (
              <div ref={list} className={`${bottomList ? '' : 'bottom-top'} release-selector`}>
                <ul>
                  {releases
                    .filter(release => !content.projectReleaseIds.includes(release.id))
                    .map(release => {
                      return (
                        <li
                          key={release.id}
                          // className={value === item.key ? 'selected' : ''}
                          onClick={() => {
                            if (onAdd) {
                              onAdd(release.id);
                            }
                            setOpen(false);
                          }}
                        >
                          <div>{release.name}</div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

TestcaseReleaseItem.defaultProps = {
  isEdit: false,
  testcaseTemplateItem: {},
  testcaseItem: {},
  setOpenTooltipInfo: null,
  caseContentElement: null,
  openTooltipInfo: {},
  inx: null,
  content: {},
  onChangeTestcaseItem: null,
  size: 'md',
  releases: [],
  onAdd: null,
  onRemove: null,
};

TestcaseReleaseItem.propTypes = {
  isEdit: PropTypes.bool,
  testcaseTemplateItem: PropTypes.shape({
    id: PropTypes.number,
    size: PropTypes.number,
    label: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    example: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
  }),
  testcaseItem: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    type: PropTypes.string,
    text: PropTypes.string,
  }),
  content: PropTypes.shape({
    id: PropTypes.number,
    projectReleaseIds: PropTypes.arrayOf(PropTypes.number),
  }),

  setOpenTooltipInfo: PropTypes.func,
  caseContentElement: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  openTooltipInfo: PropTypes.shape({
    inx: PropTypes.number,
    type: PropTypes.string,
    category: PropTypes.string,
  }),
  inx: PropTypes.number,
  onChangeTestcaseItem: PropTypes.func,
  size: PropTypes.string,
  releases: PropTypes.arrayOf(ProjectReleasePropTypes),
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};

export default TestcaseReleaseItem;
