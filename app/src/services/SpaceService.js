import * as request from '@/utils/request';
import i18n from 'i18next';

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
    true,
    i18n.t('스페이스를 검색합니다.'),
  );
};

SpaceService.selectMySpaceList = (query, successHandler, failHandler) => {
  return request.get(
    '/api/spaces/my',
    { query },
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    true,
    i18n.t('사용자의 참여 중인 스페이스 목록을 불러오고 있습니다.'),
  );
};

SpaceService.selectSpaceInfo = (spaceCode, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceCode}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

SpaceService.selectSpaceName = (spaceCode, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceCode}/name`,
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

SpaceService.selectSpaceChannelList = (spaceCode, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceCode}/channels`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    true,
    i18n.t('스페이스에 등록된 채널을 가져오고 있습니다.'),
  );
};

SpaceService.selectSpaceLlmList = (spaceCode, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceCode}/llms`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    true,
    i18n.t('스페이스에 등록된 LLM 정보를 가져옵니다.'),
  );
};

SpaceService.selectSpaceTestrunDetailList = (spaceCode, successHandler, failHandler) => {
  return request.get(
    `/api/spaces/${spaceCode}/testruns/my`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    true,
    i18n.t('스페이스에서 진행 중인 테스트런 목록을 가져옵니다.'),
  );
};

export default SpaceService;
