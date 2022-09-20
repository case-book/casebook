import * as request from '@/utils/request';

const ConfigService = {};

ConfigService.selectSystemVersion = (successHandler, failHandler) => {
  return request.get(
    '/api/configs/systems/version',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.selectTestcaseItemTypes = (successHandler, failHandler) => {
  return request.get(
    '/api/configs/systems/testcase/item-types',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default ConfigService;
