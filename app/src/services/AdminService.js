import * as request from '@/utils/request';

const AdminService = {};
AdminService.selectSpaceList = (successHandler, failHandler) => {
  return request.get(
    '/api/admin/spaces',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.selectSpaceInfo = (spaceId, successHandler, failHandler) => {
  return request.get(
    `/api/admin/spaces/${spaceId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.selectUserList = (successHandler, failHandler) => {
  return request.get(
    '/api/admin/users',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.deleteUserInfo = (userId, successHandler, failHandler) => {
  return request.del(
    `/api/admin/users/${userId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.selectUserInfo = (userId, successHandler, failHandler) => {
  return request.get(
    `/api/admin/users/${userId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.updateUserInfo = (userId, userInfo, successHandler, failHandler) => {
  return request.put(
    `/api/admin/users/${userId}`,
    userInfo,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.updateUserPasswordInfo = (userId, userInfo, successHandler, failHandler) => {
  return request.put(
    `/api/admin/users/${userId}/password`,
    userInfo,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.selectSystemInfo = (successHandler, failHandler) => {
  return request.get(
    '/api/admin/system/info',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.flushRedis = (successHandler, failHandler) => {
  return request.del(
    '/api/admin/system/caches/flush',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.deleteRedis = (successHandler, failHandler) => {
  return request.del(
    '/api/admin/system/caches/delete',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

AdminService.updateSystemInfo = (configRequests, successHandler, failHandler) => {
  return request.put(
    '/api/admin/llm/config',
    { configRequests },
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default AdminService;
