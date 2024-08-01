import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Input, Label, Selector, Tag, Title } from '@/components';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import ReleaseService from '@/services/ReleaseService';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import useClickOutside from '@/hooks/useClickOutside';
import useKeyboard from '@/hooks/useKeyboard';
import { getFilterIdsFromIdStrings, MAX_ID_RANGE_END } from './testcaseFilterUtils';
import './TestcaseNavigatorFilter.scss';

function TestcaseNavigatorFilter({ width, testcaseFilter, onChangeTestcaseFilter }) {
  const { t } = useTranslation();
  const filterRef = useRef(null);
  const filterNameInputRef = useRef(null); // transition을 활용하기 위해서 uncontrolled input을 사용
  const [isFilterFolded, setIsFilterFolded] = useState(true);
  const [isFloatingFilterOpened, setFloatingFilterOpened] = useState(false);
  const [filterIdsInput, setFilterIdsInput] = useState('');
  const [filterIdTags, setFilterIdTags] = useState([]);
  const [projectReleases, setProjectReleases] = useState([]);
  useClickOutside(filterRef, () => {
    setFloatingFilterOpened(false);
  });
  const { register, unregister, pressed } = useKeyboard('Escape');

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

  const isFiltered = useMemo(() => testcaseFilter.ids.length > 0 || testcaseFilter.name || testcaseFilter.releaseIds.length > 0, [testcaseFilter]);

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

  useEffect(() => {
    register();
    return () => unregister();
  }, [register, unregister]);

  useEffect(() => {
    if (pressed) setFloatingFilterOpened(false);
  }, [pressed]);

  return (
    <div className={`testcase-navigator-filter-wrapper ${width < 280 ? 'small-control' : ''} ${width < 230 ? 'smaller-control' : ''}`} ref={filterRef}>
      <Title
        border={false}
        paddingBottom={false}
        marginBottom={false}
        icon={false}
        type="h3"
        control={
          width < 280 ? (
            <div>
              <Button
                size="xs"
                rounded
                onClick={() => {
                  onChangeTestcaseFilter({ name: '', ids: [], releaseIds: [] });
                  setFilterIdTags([]);
                  filterNameInputRef.current.value = '';
                }}
                tip={t('필터 리셋')}
                color={isFiltered ? 'primary' : 'white'}
                disabled={!isFiltered}
              >
                <i className={`fa-solid ${isFiltered ? 'fa-filter-circle-xmark' : 'fa-filter'}`} />
              </Button>
              <Button size="xs" rounded onClick={() => setFloatingFilterOpened(prev => !prev)} tip={t(isFloatingFilterOpened ? '필터 닫기' : '필터 열기')}>
                <i className={`fa-solid ${isFloatingFilterOpened ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
              </Button>
            </div>
          ) : (
            <div>
              <Button
                size="xs"
                rounded
                onClick={() => {
                  onChangeTestcaseFilter({ name: '', ids: [], releaseIds: [] });
                  setFilterIdTags([]);
                  filterNameInputRef.current.value = '';
                }}
                tip={t('필터 리셋')}
                color={isFiltered ? 'primary' : 'white'}
                disabled={!isFiltered}
              >
                <i className={`fa-solid ${isFiltered ? 'fa-filter-circle-xmark' : 'fa-filter'}`} />
              </Button>
              <Button size="xs" rounded tip={t('필터 확장/축소')} onClick={() => setIsFilterFolded(prev => !prev)}>
                <i className={`fa-solid fa-${isFilterFolded ? 'chevron-down' : 'chevron-up'}`} />
              </Button>
            </div>
          )
        }
      >
        {width < 230 ? t('필터') : t('테스트케이스 필터')}
      </Title>
      <div className={`filter-input-wrapper ${isFloatingFilterOpened ? 'floating' : ''}`} style={{ transform: `translateX(${width < 280 ? width : 0}px)` }}>
        <div className="filter-input-group">
          <Label minWidth="70px">{t('이름')}</Label>
          <Input
            onRef={node => {
              filterNameInputRef.current = node;
            }}
            value={testcaseFilter?.name}
            size="sm"
            placeholder={t('테스트케이스 이름')}
            onChange={value => {
              onChangeTestcaseFilter({ ...testcaseFilter, name: value });
            }}
          />
        </div>
        {(isFloatingFilterOpened || (!isFilterFolded && width > 280)) && (
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

TestcaseNavigatorFilter.defaultProps = {
  width: null,
};

TestcaseNavigatorFilter.propTypes = {
  width: PropTypes.number,
  testcaseFilter: PropTypes.shape({
    ids: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    releaseIds: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChangeTestcaseFilter: PropTypes.func.isRequired,
};

export default observer(TestcaseNavigatorFilter);
