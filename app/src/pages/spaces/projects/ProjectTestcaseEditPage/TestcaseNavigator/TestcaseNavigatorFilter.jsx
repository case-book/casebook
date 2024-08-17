import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Block, BlockRow, Button, CloseIcon, Input, Liner, Radio, Selector, Tag, Title } from '@/components';
import ReleaseService from '@/services/ReleaseService';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import './TestcaseNavigatorFilter.scss';

function TestcaseNavigatorFilter({ testcaseFilter, onChangeTestcaseFilter, setOpened }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [type, setType] = useState('words');
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

  const isFiltered = useMemo(() => testcaseFilter.words.length > 0 || testcaseFilter.releaseIds.length > 0, [testcaseFilter]);

  const addWord = () => {
    const nextTestcaseFilter = { ...testcaseFilter };
    const nextWord = nextTestcaseFilter.words.slice(0);
    nextWord.push(text);
    nextTestcaseFilter.words = nextWord;
    onChangeTestcaseFilter(nextTestcaseFilter);
    setText('');
  };

  useEffect(() => {
    ReleaseService.selectReleaseList(spaceCode, projectId, setProjectReleases, () => {}, false);
  }, [spaceCode, projectId]);

  return (
    <div className="testcase-navigator-filter-wrapper">
      <div className="close-button">
        <CloseIcon
          size="xs"
          onClick={() => {
            setOpened(false);
          }}
        />
      </div>
      <Title
        className="testcase-filter-title"
        border={false}
        paddingBottom={false}
        marginBottom={false}
        icon={false}
        type="h3"
        control={
          <div className="filter-control">
            <Button
              size="xs"
              rounded
              onClick={() => {
                onChangeTestcaseFilter({ words: [], releaseIds: [] });
                setText('');
              }}
              tip={t('필터 리셋')}
              color={isFiltered ? 'primary' : 'white'}
              disabled={!isFiltered}
            >
              <i className="fa-solid fa-eraser" />
            </Button>
            <Liner className="liner" display="inline-block" width="1px" height="10px" margin="0 0.5rem" />
            <div className="type">
              <Radio
                size="xs"
                type="inline"
                value="words"
                checked={type === 'words'}
                onChange={val => {
                  setType(val);
                }}
                label="검색"
              />
              <Radio
                size="xs"
                type="inline"
                value="release"
                checked={type === 'release'}
                onChange={val => {
                  setType(val);
                }}
                label="릴리스"
              />
            </div>
          </div>
        }
      >
        {t('필터')}
      </Title>
      <Block>
        <BlockRow>
          <div className="filter-condition">
            <div className="condition">
              {type === 'words' && (
                <div className="button-group">
                  <Input
                    size="sm"
                    value={text}
                    placeholder={t('이름 또는 TC 번호 입력 후 엔터')}
                    onChange={v => setText(v)}
                    onKeyDown={e => {
                      if (e.key !== 'Enter') {
                        return;
                      }
                      addWord();
                    }}
                  />
                  <Button size="sm" onClick={addWord} shadow={false}>
                    <i className="fa-solid fa-plus" />
                  </Button>
                </div>
              )}
              {type === 'release' && (
                <div className="selector">
                  <Selector
                    minWidth="100%"
                    size="sm"
                    items={filterReleaseIdsOptions}
                    placeholder={t('릴리스 선택')}
                    onChange={v => {
                      if (testcaseFilter.releaseIds.includes(v)) {
                        return;
                      }
                      onChangeTestcaseFilter({
                        ...testcaseFilter,
                        releaseIds: [...testcaseFilter.releaseIds, v],
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </BlockRow>
      </Block>
      <Block className="filter-items-block">
        <div className="filter-items">
          {testcaseFilter.words.map(word => {
            return (
              <Tag
                key={word}
                border
                size="xs"
                onRemove={() => {
                  onChangeTestcaseFilter({
                    ...testcaseFilter,
                    words: testcaseFilter.words.filter(d => d !== word),
                  });
                }}
              >
                {word}
              </Tag>
            );
          })}
          {testcaseFilter.releaseIds.map(releaseId => {
            return (
              <Tag
                key={releaseId}
                border
                size="xs"
                onRemove={() => {
                  onChangeTestcaseFilter({
                    ...testcaseFilter,
                    releaseIds: testcaseFilter.releaseIds.filter(d => d !== releaseId),
                  });
                }}
                text={releaseId}
              >
                {projectReleaseMap.get(releaseId)}
              </Tag>
            );
          })}
        </div>
      </Block>
    </div>
  );
}

TestcaseNavigatorFilter.defaultProps = {};

TestcaseNavigatorFilter.propTypes = {
  testcaseFilter: PropTypes.shape({
    words: PropTypes.arrayOf(PropTypes.string),
    ids: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    releaseIds: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChangeTestcaseFilter: PropTypes.func.isRequired,
  setOpened: PropTypes.func.isRequired,
};

export default observer(TestcaseNavigatorFilter);
