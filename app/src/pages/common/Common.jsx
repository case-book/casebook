import React, { useEffect, useState } from 'react';
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

function Common() {
  const {
    userStore,
    configStore: { setVersion },
    controlStore,
    contextStore: { spaceCode, projectId, setSpaceCode, setProjectId },
  } = useStores();

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

  const getUserProfile = () => {
    UserService.getMyInfo(
      info => {
        userStore.setUser(info);
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

  return (
    <div>
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
      {!loading && controlStore.error?.message && <ErrorDialog category={MESSAGE_CATEGORY.ERROR} title={controlStore.error?.code || ''} message={controlStore.error?.message || ''} />}
      {loading && (
        <div className="request-loading">
          <div>
            <div className="logo">
              <div>
                <div className="circle">
                  <div className="line line-1">
                    <div />
                  </div>
                  <div className="line line-2">
                    <div />
                  </div>
                  <div className="line line-3">
                    <div />
                  </div>
                  <div className="line line-4">
                    <div />
                  </div>
                  <div className="line line-5">
                    <div />
                  </div>
                  <div className="line line-6">
                    <div />
                  </div>
                  <div className="line line-7">
                    <div />
                  </div>
                  <div className="line line-8">
                    <div />
                  </div>
                  <div className="dot dot-1" />
                  <div className="dot dot-2" />
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
