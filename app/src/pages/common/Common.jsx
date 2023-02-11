import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { SocketClient } from '@/components';
import { observer } from 'mobx-react';
import i18n from 'i18next';
import './Common.scss';

function Common() {
  const {
    userStore,
    userStore: { user },
    configStore: { setVersion },
    controlStore: { requestLoading, confirm, message, error, requestMessages },
    contextStore: { spaceCode, projectId, setSpaceCode, setProjectId },
  } = useStores();

  const location = useLocation();

  const socket = useRef(null);

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

  const getSystemVersion = () => {
    ConfigService.selectSystemVersion(version => {
      setVersion(version);
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
    getSystemVersion();
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

  const onMessage = useCallback(info => {
    const {
      data: { type, data },
    } = info;

    console.log(type, data);

    switch (type) {
      case 'NEW-NOTIFICATION': {
        userStore.setNotificationCount(userStore.notificationCount + 1);
        break;
      }

      default: {
        break;
      }
    }
  }, []);

  return (
    <div>
      {user?.id && (
        <SocketClient
          topics={[`/sub/users/${user?.id}`]}
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
            socket.current = client;
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
    </div>
  );
}

export default observer(Common);
