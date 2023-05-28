import React, { useCallback, useEffect, useState } from 'react';
import { Button, EmptyContent, Liner, Page, PageContent, Radio, Search, Tag, Version } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SpaceService from '@/services/SpaceService';
import { THEMES } from '@/constants/constants';
import useStores from '@/hooks/useStores';
import { observer } from 'mobx-react';
import useQueryString from '@/hooks/useQueryString';
import './SpaceListPage.scss';

function SpaceListPage() {
  const { t } = useTranslation();

  const {
    themeStore: { theme },
  } = useStores();

  const { query, setQuery } = useQueryString();
  const { my = 'Y', text = '', type = 'card' } = query;
  const isMine = my === 'Y';
  const isCardType = type === 'card';
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);

  const onSearch = useCallback(() => {
    if (isMine) {
      SpaceService.selectMySpaceList(
        text,
        list => {
          setSpaces(list);
        },
        null,
      );
    } else {
      SpaceService.selectSpaceList(text, list => {
        setSpaces(list);
      });
    }
  }, [text, isMine]);

  useEffect(() => {
    onSearch();
  }, [text, isMine]);

  return (
    <Page className="space-list-page-wrapper" pure>
      <PageContent className="page-content">
        <div className="search">
          <div>
            <Radio
              type="inline"
              size="md"
              checked={isMine}
              onChange={() => {
                setQuery({
                  my: 'Y',
                });
              }}
              label={t('내 스페이스')}
            />
            <Radio
              type="inline"
              size="md"
              checked={!isMine}
              onChange={() => {
                setQuery({
                  my: 'N',
                });
              }}
              label={t('모든 스페이스')}
            />
          </div>
          <div>
            <Search
              value={text}
              placeholder={t('스페이스 이름이나 코드를 입력해주세요.')}
              onSearch={value => {
                setQuery({
                  text: value,
                });
              }}
            />
          </div>
          <div>
            <Button
              size="md"
              color="primary"
              onClick={() => {
                onSearch();
              }}
            >
              {t('검색')}
            </Button>
            <Button
              size="md"
              color="primary"
              onClick={() => {
                navigate('/spaces/new');
              }}
            >
              <i className="fa-solid fa-plus" /> {t('새 스페이스')}
            </Button>
          </div>
        </div>
        <div className="type">
          <Radio
            type="inline"
            size="xs"
            checked={isCardType}
            onChange={() => {
              setQuery({
                type: 'card',
              });
            }}
            label={<i className="fa-regular fa-rectangle-list" />}
          />
          <Radio
            type="inline"
            size="xs"
            checked={!isCardType}
            onChange={() => {
              setQuery({
                type: 'table',
              });
            }}
            label={<i className="fa-solid fa-table-list" />}
          />
        </div>
        <div className={`space-list ${isCardType ? 'card-type' : ''}`}>
          {spaces?.length < 1 && (
            <EmptyContent fill border>
              {t('조회된 스페이스가 없습니다.')}
            </EmptyContent>
          )}
          {spaces?.length > 0 && (
            <ul>
              {spaces?.map((space, inx) => {
                return (
                  <li
                    key={space.id}
                    style={{
                      animationDelay: `${inx * 0.05}s`,
                    }}
                  >
                    <div className="info">
                      <div className="name">
                        <div>
                          <span
                            onClick={() => {
                              navigate(`/spaces/${space.code}/projects`);
                            }}
                          >
                            {space.name}
                          </span>
                          <span>
                            <Liner width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 0.5rem" />
                          </span>
                          <span>
                            <Tag border>{space.code}</Tag>
                          </span>
                          {space.isMember && (
                            <>
                              <span>
                                <Liner width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 0.5rem" />
                              </span>
                              <span className="count">{space.projectCount} 프로젝트</span>
                              <span>
                                <Liner width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 0.5rem" />
                              </span>
                              <span className="count">{space.userCount} 사용자</span>
                            </>
                          )}
                          {!space.isMember && (
                            <>
                              <span>
                                <Liner width="1px" height="10px" color={theme === THEMES.LIGHT ? 'gray' : 'white'} margin="0 0.5rem" />
                              </span>
                              <span className="count">{space.allowAutoJoin ? '자동 가입' : '승인 필요'}</span>
                            </>
                          )}
                        </div>
                        <div>
                          {space.isMember && (
                            <Button
                              rounded
                              outline
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                navigate(`/spaces/${space.code}/info`);
                              }}
                            >
                              <i className="fa-solid fa-gear" />
                            </Button>
                          )}
                          {!space.isMember && <Link to={`/spaces/${space.code}/info`}>{t('참여')}</Link>}
                        </div>
                      </div>
                      <div className="description">
                        <div>{space.description}</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <Version className="version" />
      </PageContent>
    </Page>
  );
}

export default observer(SpaceListPage);
