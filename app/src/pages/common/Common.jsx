import React, { useEffect, useState } from 'react';
import UserService from '@/services/UserService';
import useStores from '@/hooks/useStores';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import ConfirmDialog from '@/pages/common/ConfirmDialog';
import MessageDialog from '@/pages/common/MessageDialog';
import ErrorDialog from '@/pages/common/ErrorDialog';
import { debounce } from 'lodash';
import ConfigService from '@/services/ConfigService';
import ReactTooltip from 'react-tooltip';
import { getOption, setOption } from '@/utils/storageUtil';
import { useLocation } from 'react-router-dom';
import { CloseIcon, SocketClient, Tag } from '@/components';
import { observer } from 'mobx-react';
import i18n from 'i18next';
import './Common.scss';
import { useTranslation } from 'react-i18next';

function Common() {
  const {
    userStore,
    userStore: { user },
    configStore: { setVersion },
    socketStore: { topics, messageHandlers, addTopic, removeTopic, addMessageHandler, removeMessageHandler, setSocketClient },
    controlStore: { requestLoading, confirm, message, error, requestMessages },
    contextStore: { spaceCode, projectId, setSpaceCode, setProjectId },
  } = useStores();

  const { t } = useTranslation();

  const location = useLocation();

  useEffect(() => {
    let nextSpaceCode = null;
    let nextProjectId = null;
    if (/^\/spaces\/.*\/projects\/.*$/.test(location.pathname)) {
      const paths = location.pathname.split('/');
      // eslint-disable-next-line prefer-destructuring
      nextSpaceCode = paths[2];
      // eslint-disable-next-line prefer-destructuring
      nextProjectId = paths[4];
      if (Number.isInteger(nextProjectId)) {
        nextProjectId = Number(nextProjectId);
      }
    } else if (/^\/spaces\/.*$/.test(location.pathname)) {
      const paths = location.pathname.split('/');
      // eslint-disable-next-line prefer-destructuring
      nextSpaceCode = paths[2];
    }

    if (spaceCode !== nextSpaceCode) {
      setSpaceCode(nextSpaceCode);
    }

    if (projectId !== nextProjectId) {
      setProjectId(nextProjectId);
    }
  }, [location.pathname]);

  const [loading, setLoading] = useState(false);

  const [latestRelease, setLatestRelease] = useState({
    released: false,
  });

  const getUserNotificationCount = () => {
    UserService.getUserNotificationCount(count => {
      userStore.setNotificationCount(count);
    });
  };

  const getUserProfile = () => {
    UserService.getMyInfo(
      info => {
        userStore.setUser(info);
        userStore.setTried(true);
        i18n.changeLanguage(info.language);
        getUserNotificationCount();
      },
      () => {
        userStore.setTried(true);
        return true;
      },
    );
  };

  const getRelease = version => {
    const url = 'https://api.github.com/repositories/532306732/releases/latest';
    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        try {
          const data = JSON.parse(request.responseText);
          const latestVersion = getOption('casebook', 'version', 'latest');

          if (data.tag_name > version && (latestVersion === null || data.tag_name > latestVersion)) {
            const lines = data.body.split('\n');
            const text = {
              title: lines[0],
              category: [],
            };

            let current;
            for (let i = 1; i < lines.length; i += 1) {
              const line = lines[i];
              if (!line || line.trim() === '') {
                //
              } else if (line[0] === '<') {
                text.category.push({
                  title: line.substring(1, line.length - 2),
                  lines: [],
                });
                current = text.category[text.category.length - 1];
              } else {
                if (!current) {
                  text.category.push({
                    title: 'MISC',
                    lines: [],
                  });
                  current = text.category[text.category.length - 1];
                }

                if (line[0] === '-') {
                  current.lines.push(line.substring(1, line.length - 1));
                } else {
                  current.lines.push(line);
                }
              }
            }

            setLatestRelease({
              released: true,
              version: data.name,
              url: data.html_url,
              _text: data.body,
              text,
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    // URL에 데이터 추가해서 요청 보내기
    request.open('GET', url, true);
    request.send();
  };

  const getSystemInfo = () => {
    ConfigService.selectSystemInfo(version => {
      setVersion(version);
      getRelease(version.version);
    });
  };

  const setAutoLogin = () => {
    const autoLogin = getOption('user', 'info', 'autoLogin');
    if (autoLogin) {
      UserService.setAutoLogin(info => {
        setOption('user', 'info', 'uuid', info.uuid);
        setOption('user', 'info', 'autoLogin', '');
      });
    }
  };

  useEffect(() => {
    getUserProfile();
    getSystemInfo();
    setAutoLogin();
  }, []);

  const setLoadingDebounce = React.useMemo(
    () =>
      debounce(val => {
        setLoading(val);
      }, 200),
    [setLoading],
  );

  useEffect(() => {
    if (requestLoading === null) {
      return;
    }

    if (requestLoading) {
      setLoading(true);
    } else {
      setLoadingDebounce(false);
      setLoading(false);
    }
  }, [requestLoading]);

  const onCommonMessage = info => {
    const {
      data: { type /* , data */ },
    } = info;

    switch (type) {
      case 'NEW-NOTIFICATION': {
        userStore.setNotificationCount(userStore.notificationCount + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  useEffect(() => {
    if (user?.id && projectId) {
      addTopic(`/sub/users/${user?.id}`);
      addMessageHandler('Common', onCommonMessage);
    }

    return () => {
      removeTopic(`/sub/users/${user?.id}`);
      removeMessageHandler('Common');
    };
  }, [user?.id]);

  const onMessage = info => {
    messageHandlers.forEach(messageHandler => {
      if (messageHandler.handler && typeof messageHandler.handler === 'function') {
        messageHandler.handler(info);
      }
    });
  };

  return (
    <div>
      {user?.id && (
        <SocketClient
          topics={topics}
          headers={{
            'X-AUTH-TOKEN': window.localStorage.getItem('token'),
          }}
          onMessage={onMessage}
          onConnect={() => {
            console.log('onConnect');
            // setConnectTried(true);
          }}
          onDisconnect={() => {
            console.log('onDisconnect');
            // setConnectTried(true);
          }}
          setRef={client => {
            if (client) {
              setSocketClient(client);
            }
          }}
        />
      )}
      {!loading && confirm?.message && (
        <ConfirmDialog
          category={confirm?.category || ''}
          title={confirm?.title || ''}
          message={confirm?.message || ''}
          okHandler={confirm?.okHandler}
          noHandler={confirm?.noHandler}
          okText={confirm?.okText || ''}
          noText={confirm?.noText || ''}
          okColor={confirm?.okColor}
        />
      )}
      {!loading && message?.message && (
        <MessageDialog category={message?.category || ''} title={message?.title || ''} message={message?.message || ''} okHandler={message?.okHandler} okText={message?.okText || ''} />
      )}
      {!loading && error?.message && <ErrorDialog category={MESSAGE_CATEGORY.ERROR} title={error?.code || '요청 실패'} message={error?.message || ''} handler={error?.okHandler} />}
      {loading && (
        <div className="request-loading">
          <div className="loader">
            <div />
            <div />
            <div />
          </div>
          {requestMessages?.length > 0 && (
            <div className="request-messages">
              {requestMessages.map(info => {
                return (
                  <div key={info.id}>
                    <span>
                      <i className="fa-solid fa-volume-high" />
                      {info.message}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <ReactTooltip effect="solid" />
      {latestRelease.released && (
        <div className="release-info">
          <div>
            <div className="note">
              <div>
                <div className="note-content">
                  <div className="release-title">
                    <h2>
                      <div>{latestRelease.text.title}</div>
                      <div className="version-tag">
                        <Tag>{latestRelease.version}</Tag>
                      </div>
                    </h2>
                    <div className="close-btn">
                      <CloseIcon
                        onClick={() => {
                          setOption('casebook', 'version', 'latest', latestRelease.version);
                          setLatestRelease({
                            released: false,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="release-note scrollbar">
                    {latestRelease.text.category.map((d, jnx) => {
                      return (
                        <div className="category" key={jnx}>
                          {d.title !== 'MISC' && (
                            <div className="category-title">
                              <span>{d.title}</span>
                            </div>
                          )}
                          <div className="category-content">
                            {d.lines.map((line, inx) => {
                              return (
                                <div className={line[0] === ' ' ? 'list' : ''} key={inx}>
                                  {line}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="btns">
                    <a target="_blank" href={latestRelease.url} rel="noreferrer">
                      <span>{t('다운로드 바로가기')}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(Common);
