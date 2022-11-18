import React, { useCallback, useEffect, useRef, useState } from 'react';
import UserService from '@/services/UserService';
import useStores from '@/hooks/useStores';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { observer } from 'mobx-react';
import ConfirmDialog from '@/pages/common/ConfirmDialog';
import MessageDialog from '@/pages/common/MessageDialog';
import ErrorDialog from '@/pages/common/ErrorDialog';
import { debounce } from 'lodash';
import ConfigService from '@/services/ConfigService';
import './Common.scss';

import { getOption, setOption } from '@/utils/storageUtil';
import { useLocation } from 'react-router-dom';
import { SocketClient } from '@/components';

function Common() {
  const {
    userStore,
    userStore: { user },
    configStore: { setVersion },
    controlStore,
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
    if (controlStore.requestLoading) {
      setLoading(true);
    } else {
      setLoadingDebounce(false);
    }
  }, [controlStore.requestLoading]);

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
      {!loading && controlStore.confirm?.message && (
        <ConfirmDialog
          category={controlStore.confirm?.category || ''}
          title={controlStore.confirm?.title || ''}
          message={controlStore.confirm?.message || ''}
          okHandler={controlStore.confirm?.okHandler}
          noHandler={controlStore.confirm?.noHandler}
          okText={controlStore.confirm?.okText || ''}
          noText={controlStore.confirm?.noText || ''}
        />
      )}
      {!loading && controlStore.message?.message && (
        <MessageDialog
          category={controlStore.message?.category || ''}
          title={controlStore.message?.title || ''}
          message={controlStore.message?.message || ''}
          okHandler={controlStore.message?.okHandler}
          okText={controlStore.message?.okText || ''}
        />
      )}
      {!loading && controlStore.error?.message && <ErrorDialog category={MESSAGE_CATEGORY.ERROR} title={controlStore.error?.code || '요청 실패'} message={controlStore.error?.message || ''} />}
      {loading && (
        <div className="request-loading">
          <div className="loader" />
        </div>
      )}
    </div>
  );
}

export default observer(Common);
