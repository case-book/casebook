import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Liner, Selector, Input, Label, Tag } from '@/components';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import ReleaseService from '@/services/ReleaseService';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './TestcaseNavigatorControl.scss';

const MAX_ID_RANGE_END = 2000;
const getFilterIdsFromIdStrings = idStrings => {
  let isParsedRangeValid = true;
  const parsedIds = idStrings.map(idString => {
    const [[rangeStartString], [rangeEndString] = []] = idString.matchAll(/(\d+)/g);
    const rangeStart = Number(rangeStartString);
    const rangeEnd = rangeEndString ? Number(rangeEndString) : null;
    if (rangeStart > MAX_ID_RANGE_END || rangeStart < 1) {
      isParsedRangeValid = false;
    }
    if (rangeEnd && (rangeEnd > MAX_ID_RANGE_END || rangeStart >= rangeEnd || rangeEnd < 1)) {
      isParsedRangeValid = false;
    }
    return [rangeStart, rangeEnd];
  });

  if (!isParsedRangeValid) return null;

  const idSet = parsedIds.reduce((set, [rangeStart, rangeEnd]) => {
    if (!rangeEnd) {
      set.add(rangeStart);
      return set;
    }
    Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i).forEach(i => set.add(i));
    return set;
  }, new Set());

  return [...idSet];
};

function TestcaseNavigatorControl({
  className,
  min,
  setMin,
  onClickAllOpen,
  user,
  users,
  userFilter,
  onChangeUserFilter,
  addTestcase,
  addTestcaseGroup,
  selectedItemInfo,
  width,
  testcaseFilter,
  onChangeTestcaseFilter,
}) {
  const { t } = useTranslation();
  const filterNameInputRef = useRef(null); // transition을 활용하기 위해서 uncontrolled input을 사용
  const [isFilterFolded, setIsFilterFolded] = useState(false);
  const [filterIdsInput, setFilterIdsInput] = useState('');
  const [filterIdTags, setFilterIdTags] = useState([]);
  const [projectReleases, setProjectReleases] = useState([]);

  const {
    contextStore: { spaceCode, projectId },
  } = useStores();

  const filterReleaseIdsOptions = useMemo(() => {
    return projectReleases.map(release => ({
      key: release.id,
      value: release.name,
    }));
  }, [projectReleases]);

  const projectReleaseMap = useMemo(() => new Map(projectReleases.map(release => [release.id, release.name])), [projectReleases]);

  const onAddFilterIds = () => {
    if (!filterIdsInput || !/^\d+(?:\s*-\s*\d+)?$/.test(filterIdsInput)) {
      dialogUtil.setMessage(MESSAGE_CATEGORY.WARNING, t('입력 오류'), t('숫자 또는 숫자 범위 (ex. 1-10) 만 입력 가능합니다.'));
      setFilterIdsInput('');
      return;
    }
    const deblanked = filterIdsInput.replace(/\s/g, '');
    const nextFilterIdStrings = [...filterIdTags, deblanked];
    const nextFilterIds = getFilterIdsFromIdStrings(nextFilterIdStrings);
    if (!nextFilterIds) {
      dialogUtil.setMessage(
        MESSAGE_CATEGORY.WARNING,
        t('입력 오류'),
        t('잘못된 입력입니다. 번호는 1 보다 작거나 {{max}}보다 클 수 없고, 범위 시작은 범위 끝보다 작아야 합니다.', { max: MAX_ID_RANGE_END }),
      );
      return;
    }

    setFilterIdsInput('');
    setFilterIdTags(nextFilterIdStrings);
    onChangeTestcaseFilter({ ...testcaseFilter, ids: nextFilterIds });
  };

  useEffect(() => {
    if (isFilterFolded) return;

    ReleaseService.selectReleaseList(spaceCode, projectId, setProjectReleases, () => {}, false);
  }, [isFilterFolded, spaceCode, projectId]);

  return (
    <div className={`testcase-navigator-control-wrapper ${className}`}>
      <div className="testcase-manage-button">
        <div className="left">
          <div className="controller">
            <div>
              <div className="bg" />
              <span className="controller-button start-button">
                <i className="fa-solid fa-gamepad" />
              </span>
              {!min && (
                <div className="vertical">
                  <span
                    className="controller-button"
                    onClick={() => {
                      onClickAllOpen(false);
                    }}
                  >
                    <div className="all-open-toggle">
                      <div className="tree-icon">
                        <i className="fa-solid fa-folder-minus" />
                      </div>
                      <div className="all-text">
                        <span>ALL</span>
                      </div>
                    </div>
                  </span>
                  <span className="controller-button center-button" />
                  <span
                    className="controller-button"
                    onClick={() => {
                      onClickAllOpen(true);
                    }}
                  >
                    <div className="all-open-toggle">
                      <div className="tree-icon">
                        <i className="fa-solid fa-folder-plus" />
                      </div>
                      <div className="all-text">
                        <span>ALL</span>
                      </div>
                    </div>
                  </span>
                </div>
              )}
              <div className="horizontal">
                <span
                  className="controller-button"
                  onClick={() => {
                    setMin(true);
                  }}
                >
                  <i className="fa-solid fa-minimize" />
                </span>
                <span className="controller-button center-button" />
                <span
                  className="controller-button"
                  onClick={() => {
                    setMin(false);
                  }}
                >
                  <i className="fa-solid fa-maximize" />
                </span>
              </div>
            </div>
          </div>
        </div>
        {user && (
          <div className="navigation-filter">
            <div className="label">{t('테스터')}</div>
            <div>
              <Button
                size="xs"
                className="my-button"
                onClick={() => {
                  onChangeUserFilter(user.id);
                }}
              >
                MY
              </Button>
              <Selector
                className="selector"
                size="xs"
                items={[
                  {
                    userId: '',
                    name: t('전체'),
                  },
                ]
                  .concat(users)
                  .map(d => {
                    return {
                      key: d.userId,
                      value: d.name,
                    };
                  })}
                value={userFilter}
                onChange={val => {
                  onChangeUserFilter(val);
                }}
              />
            </div>
          </div>
        )}
        {addTestcase && addTestcaseGroup && (
          <div className={`navigation-controller ${width < 260 ? 'small-control' : ''} ${width < 160 ? 'smaller-control' : ''}`}>
            {addTestcaseGroup && (
              <Button
                size="xs"
                onClick={() => {
                  addTestcaseGroup(true);
                }}
                color="white"
              >
                <i className="fa-solid fa-folder-plus" /> <span className="button-text">{t('그룹')}</span>
              </Button>
            )}
            <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
            <Button
              className="add-testcase-button"
              size="xs"
              onClick={() => {
                addTestcase(true);
              }}
              disabled={!selectedItemInfo.type}
              color="white"
            >
              <i className="small-icon fa-solid fa-plus" />
              <i className="fa-solid fa-flask" /> <span className="button-text">{t('테스트케이스')}</span>
            </Button>
          </div>
        )}
      </div>
      <div className="testcase-filter-group">
        <div className="always-show-filter">
          <Input
            onRef={node => {
              filterNameInputRef.current = node;
            }}
            value={null}
            size="sm"
            placeholder={t('테스트케이스 이름')}
            onChange={value => {
              onChangeTestcaseFilter({ ...testcaseFilter, name: value });
            }}
          />
          <Button
            size="xs"
            rounded
            tip={t('필터 리셋')}
            onClick={() => {
              onChangeTestcaseFilter({ name: '', ids: [], releaseIds: [] });
              setFilterIdTags([]);
              filterNameInputRef.current.value = '';
            }}
          >
            <i className="fa-solid fa-rotate-left" />
          </Button>
          <Button size="xs" rounded tip={t('필터 확장/축소')} onClick={() => setIsFilterFolded(prev => !prev)}>
            <i className={`fa-solid fa-${isFilterFolded ? 'chevron-down' : 'chevron-up'}`} />
          </Button>
        </div>
        {!isFilterFolded && (
          <div className="foldable-filter">
            <div className="filter-input-group">
              <Label minWidth="70px">{t('TC 번호')}</Label>
              <Input
                size="sm"
                value={filterIdsInput}
                placeholder={t('숫자 또는 범위 (ex. 1-10) 입력')}
                onChange={v => setFilterIdsInput(v)}
                onKeyDown={e => {
                  if (e.key !== 'Enter') return;
                  onAddFilterIds();
                }}
              />
              <Button size="sm" onClick={() => onAddFilterIds()}>
                +
              </Button>
            </div>
            <div className="testcase-filter-ids-list">
              {filterIdTags.map(id => {
                return (
                  <Tag
                    key={id}
                    border
                    size="sm"
                    onRemove={() => {
                      const nextFilterIdStrings = filterIdTags.filter(d => d !== id);
                      const nextFilterIds = getFilterIdsFromIdStrings(nextFilterIdStrings);
                      if (!nextFilterIds) {
                        dialogUtil.setMessage(
                          MESSAGE_CATEGORY.WARNING,
                          t('입력 오류'),
                          t('잘못된 입력입니다. 번호는 1 보다 작거나 {{max}}보다 클 수 없고, 범위 시작은 범위 끝보다 작아야 합니다.', { max: MAX_ID_RANGE_END }),
                        );
                        return;
                      }
                      setFilterIdTags(nextFilterIdStrings);
                      onChangeTestcaseFilter({ ...testcaseFilter, ids: nextFilterIds });
                    }}
                    text={id}
                  >
                    {id}
                  </Tag>
                );
              })}
            </div>
            <div className="filter-input-group">
              <Label minWidth="70px">{t('릴리스')}</Label>
              <Selector
                size="sm"
                items={filterReleaseIdsOptions}
                onChange={v => {
                  if (testcaseFilter.releaseIds.includes(v)) return;
                  onChangeTestcaseFilter({ ...testcaseFilter, releaseIds: [...testcaseFilter.releaseIds, v] });
                }}
              />
            </div>
            <div className="testcase-filter-release-ids-list">
              {testcaseFilter.releaseIds.map(releaseId => {
                return (
                  <Tag
                    key={releaseId}
                    border
                    size="sm"
                    onRemove={() => {
                      onChangeTestcaseFilter({ ...testcaseFilter, releaseIds: testcaseFilter.releaseIds.filter(d => d !== releaseId) });
                    }}
                    text={releaseId}
                  >
                    {projectReleaseMap.get(releaseId)}
                  </Tag>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

TestcaseNavigatorControl.defaultProps = {
  className: '',
  user: null,
  users: [],
  addTestcase: null,
  addTestcaseGroup: null,
};

TestcaseNavigatorControl.propTypes = {
  className: PropTypes.string,
  min: PropTypes.bool.isRequired,
  setMin: PropTypes.func.isRequired,
  onClickAllOpen: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  users: PropTypes.array,
  userFilter: PropTypes.string.isRequired,
  onChangeUserFilter: PropTypes.func.isRequired,
  addTestcase: PropTypes.func,
  addTestcaseGroup: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  selectedItemInfo: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  testcaseFilter: PropTypes.shape({
    ids: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    releaseIds: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChangeTestcaseFilter: PropTypes.func.isRequired,
};

export default observer(TestcaseNavigatorControl);
