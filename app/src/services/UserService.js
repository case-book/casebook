import * as request from '@/utils/request';
import i18n from 'i18next';
import { convertUser } from '@/utils/userUtil';

const UserService = {};

UserService.getMyInfo = (successHandler, failHandler) => {
  return request.get(
    '/api/users/my',
    {},
    res => {
      successHandler(convertUser(res));
    },
    failHandler,
    null,
    null,
    true,
    i18n.t('사용자 정보를 조회하고 있습니다.'),
  );
};

UserService.setAutoLogin = (successHandler, failHandler) => {
  return request.put(
    '/api/users/login/auto',
    {},
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.getMyDetailInfo = (successHandler, failHandler) => {
  return request.get(
    '/api/users/my/detail',
    {},
    res => {
      successHandler(convertUser(res));
    },
    failHandler,
  );
};

UserService.updateMyInfo = (info, successHandler, failHandler) => {
  return request.put(
    '/api/users/my',
    info,
    res => {
      successHandler(convertUser(res));
    },
    failHandler,
  );
};

UserService.updateUserPassword = (info, successHandler, failHandler) => {
  return request.put(
    '/api/users/my/changePassword',
    info,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.updateOAuthUserInfo = (userId, user, successHandler, failHandler) => {
  return request.put(
    `/api/users/${userId}/oauth`,
    user,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.updateSkipOAuthUserInfo = (userId, successHandler, failHandler) => {
  return request.put(
    `/api/users/${userId}/oauth/skip`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.logout = (successHandler, failHandler) => {
  return request.del(
    '/api/users/logout',
    {},
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.login = (info, successHandler, failHandler) => {
  return request.post(
    '/api/users/login',
    info,
    res => {
      successHandler(convertUser(res));
    },
    failHandler,
    null,
    null,
    true,
    null,
    i18n.t('사용자 정보를 확인하고 있습니다.'),
  );
};

UserService.join = (info, successHandler, failHandler) => {
  return request.post(
    '/api/users/join',
    info,
    res => {
      successHandler(convertUser(res));
    },
    failHandler,
  );
};

UserService.getUserList = (type, successHandler, failHandler) => {
  return request.get(
    '/api/configs/users',
    { type },
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.getAdminUserInfo = (userId, successHandler, failHandler) => {
  return request.get(
    '/api/configs/users/{userId}',
    { userId },
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.getDeleteUserInfo = (userId, successHandler, failHandler) => {
  return request.del(
    '/api/configs/users/{userId}',
    { userId },
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.updateAdminUserInfo = (userId, user, successHandler, failHandler) => {
  return request.put(
    `/api/configs/users/${userId}`,
    user,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.LeaveUserInfo = (successHandler, failHandler) => {
  return request.del(
    '/api/users/leave',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.updateMySetting = (setting, successHandler, failHandler) => {
  return request.put(
    '/api/users/my/setting',
    { setting: JSON.stringify(setting) },
    res => {
      if (successHandler) {
        successHandler(res);
      }
    },
    failHandler,
  );
};

UserService.getUserNotificationCount = (successHandler, failHandler) => {
  return request.get(
    '/api/users/my/notifications/count',
    {},
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

UserService.getUserNotificationList = (pageNo, successHandler, failHandler) => {
  return request.get(
    '/api/users/my/notifications',
    { pageNo },
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

UserService.getUserTokenList = (successHandler, failHandler) => {
  return request.get(
    '/api/users/my/tokens',
    {},
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.createUserToken = (userToken, successHandler, failHandler) => {
  return request.post(
    '/api/users/my/tokens',
    userToken,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.updateUserToken = (userTokenId, userToken, successHandler, failHandler) => {
  return request.put(
    `/api/users/my/tokens/${userTokenId}`,
    userToken,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.deleteUserToken = (userTokenId, successHandler, failHandler) => {
  return request.del(
    `/api/users/my/tokens/${userTokenId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default UserService;
