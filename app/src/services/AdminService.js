import * as request from '@/utils/request';

const AdminService = {};

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

export default AdminService;
