import * as request from '@/utils/request';

const UserService = {};

UserService.getMyInfo = (successHandler, failHandler) => {
  return request.get(
    '/api/users/my',
    {},
    res => {
      successHandler(res);
    },
    failHandler,
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

UserService.getUserInfo = (userId, successHandler, failHandler) => {
  return request.get(
    `/api/users/${userId}`,
    {},
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
      successHandler(res);
    },
    failHandler,
  );
};

UserService.join = (info, successHandler, failHandler) => {
  return request.post(
    '/api/users/join',
    info,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

UserService.updateMyInfo = (info, successHandler, failHandler) => {
  return request.put(
    '/api/users/my',
    info,
    res => {
      successHandler(res);
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

UserService.changePassword = (info, successHandler, failHandler) => {
  return request.put(
    '/api/users/my/changePassword',
    info,
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

export default UserService;
