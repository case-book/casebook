import React, { useEffect, useState } from 'react';
import UserService from '@/services/UserService';
import useStores from '@/hooks/useStores';
import { DATE_FORMATS, MESSAGE_CATEGORY } from '@/constants/constants';
import ConfirmDialog from '@/pages/common/ConfirmDialog';
import MessageDialog from '@/pages/common/MessageDialog';
import ErrorDialog from '@/pages/common/ErrorDialog';
import { debounce } from 'lodash';
import ConfigService from '@/services/ConfigService';
import ReactTooltip from 'react-tooltip';
import { getOption, setOption } from '@/utils/storageUtil';
import { Link, useLocation } from 'react-router-dom';
import { CloseIcon, Liner, SocketClient } from '@/components';
import { observer } from 'mobx-react';
import i18n from 'i18next';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import GitService from '@/services/GitService';
import moment from 'moment';
import dateUtil from '@/utils/dateUtil';
import './Common.scss';

function Common() {
  const {
    userStore,
    userStore: { user },
    configStore: { releasePopup, closeReleasePopup, version, setVersion },
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

  const [releases, setReleases] = useState([]);

  const [lastTagName] = useState(getOption('casebook', 'version', 'tag') || '');
  const [release, setRelease] = useState(null);

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

  const getReleaseList = () => {
    GitService.getReleaseList(
      list => {
        const filtered = list.filter(d => !d.prerelease);
        setReleases(filtered);
        if (filtered.length > 0) {
          if (filtered[0].tag_name > lastTagName) {
            setRelease(list[0]);
          }
        }
      },
      e => {
        console.log(e);
      },
    );
  };

  const getSystemInfo = () => {
    ConfigService.selectSystemInfo(info => {
      setVersion(info);
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
    getReleaseList();
  }, []);

  useEffect(() => {
    if (releasePopup) {
      if (releases.length > 0) {
        setRelease(releases[0]);
      }
    }
  }, [releasePopup, releases]);

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
      {((releasePopup && release) || release) && (
        <div className="git-release-list">
          <div>
            <div className="title">
              <div>CASEBOOK RELEASE NOTES</div>
              <div>
                <CloseIcon
                  size="xs"
                  onClick={() => {
                    setOption('casebook', 'version', 'tag', releases[0]?.tag_name);
                    setRelease(null);
                    closeReleasePopup();
                  }}
                />
              </div>
            </div>
            <div className="content">
              <div className="version-list">
                <ul>
                  {releases.map(d => {
                    return (
                      <li
                        key={d.node_id}
                        className={`g-no-select ${release === d ? 'selected' : ''}`}
                        onClick={() => {
                          setRelease(d);
                        }}
                      >
                        <div className="your-version">{version.version === d.tag_name ? 'YOUR VERSION' : ''}</div>
                        <div className="name">{d.name}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="release-content">
                <div className="version-and-publish">
                  <div className="version">{release.name}</div>
                  <div className="git-link">
                    <Link
                      to={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => {
                        e.preventDefault();
                        window.open(release.html_url, '_blank');
                      }}
                    >
                      <i className="fa-brands fa-github" /> GITHUB
                    </Link>
                  </div>
                  <div>
                    <Liner width="1px" height="10px" display="inline-block" color="gray" margin="0 0.75rem" />
                  </div>
                  <div className="published-at">
                    <i className="fa-regular fa-clock" /> {moment(release.published_at).format(DATE_FORMATS[dateUtil.getUserLocale()].full.moment)}
                  </div>
                </div>
                <div className="body">
                  <ReactMarkdown>{release.body}</ReactMarkdown>
                </div>
                <div className="issue">
                  <span>{t('기능의 제안이나, 사용중 발생하는 버그나 오류 등은')}</span>
                  <Link
                    to="https://github.com/case-book/casebook/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => {
                      e.preventDefault();
                      window.open('https://github.com/case-book/casebook/issues', '_blank');
                    }}
                  >
                    CASEBOOK GITHUB
                  </Link>
                  {t('을 통해 제보해주시면 감사하겠습니다.')}
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
