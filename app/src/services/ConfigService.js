import * as request from '@/utils/request';

const ConfigService = {};

ConfigService.selectSystemInfo = (successHandler, failHandler) => {
  return request.get(
    '/api/configs/systems/info',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.selectTestcaseConfigs = (successHandler, failHandler) => {
  return request.get(
    '/api/configs/systems/testcase/configs',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.createSetUpInfo = (setupInfo, successHandler, failHandler) => {
  return request.post(
    '/api/configs/systems/setup',
    setupInfo,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.sendTestMessageToSlack = (slackUrl, successHandler, failHandler) => {
  return request.post(
    '/api/configs/systems/slack',
    { slackUrl },
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.sendTestMessageByWebhook = (messageChannel, successHandler, failHandler) => {
  return request.post(
    '/api/configs/systems/webhook',
    messageChannel,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.createArithmeticException = (successHandler, failHandler) => {
  return request.get(
    '/api/configs/systems/errors/arithmetic',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.createServiceException = (successHandler, failHandler) => {
  return request.get(
    '/api/configs/systems/errors/service',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.selectTimeZoneList = (language, successHandler, failHandler) => {
  return request.get(
    `/api/configs/systems/timezones?language=${language}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

ConfigService.selectMessageTypeList = (successHandler, failHandler) => {
  return request.get(
    '/api/configs/systems/channels',
    null,
    res => {
      successHandler(res);
    },
    failHandler,
  );
};

export default ConfigService;
