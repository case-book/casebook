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

SpaceService.selectSpaceList = (query, successHandler, failHandler) => {
  return request.get(
    '/api/spaces',
    { query },
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    false,
  );
};

SpaceService.selectMySpaceList = (successHandler, failHandler) => {
  return request.get(
    '/api/spaces/my',
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

SpaceService.selectSpaceAccessibleInfo = (spaceId, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceId}/accessible`,
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

SpaceService.selectSpaceUserList = (spaceId, query, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceId}/users`,
    { query },
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.createSpaceApplicant = (spaceCode, spaceApplicant, successHandler, failHandler) => {
  return request.post(
    `/api/spaces/${spaceCode}/applicants`,
    spaceApplicant,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.deleteSpaceApplicant = (spaceCode, successHandler, failHandler) => {
  return request.del(
    `/api/spaces/${spaceCode}/applicants`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.approveSpaceJoinRequest = (spaceCode, applicantId, successHandler, failHandler) => {
  return request.put(
    `/api/spaces/${spaceCode}/applicants/${applicantId}/approve`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.rejectSpaceJoinRequest = (spaceCode, applicantId, successHandler, failHandler) => {
  return request.put(
    `/api/spaces/${spaceCode}/applicants/${applicantId}/reject`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.withdrawSpace = (spaceCode, successHandler, failHandler) => {
  return request.del(
    `/api/spaces/${spaceCode}/users/my`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default SpaceService;
