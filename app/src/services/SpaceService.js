import * as request from '@/utils/request';

const SpaceService = {};

SpaceService.createSpace = (space, successHandler, failHandler) => {
  return request.post(
    '/api/spaces',
    space,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.selectSpaceList = (successHandler, failHandler) => {
  return request.get(
    '/api/spaces',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.selectSpaceInfo = (spaceId, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.updateSpace = (space, successHandler, failHandler) => {
  return request.put(
    `/api/spaces/${space.id}`,
    space,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.deleteSpace = (spaceId, successHandler, failHandler) => {
  return request.del(
    `/api/spaces/${spaceId}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default SpaceService;
