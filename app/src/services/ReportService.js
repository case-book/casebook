import * as request from '@/utils/request';
import i18n from 'i18next';

const ReportService = {};

ReportService.selectReportList = (spaceCode, projectId, start, end, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/closed?start=${start}&end=${end}`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('프로젝트의 테스트런 목록을 불러오고 있습니다.'),
  );
};

ReportService.selectLatestReportList = (spaceCode, projectId, successHandler, failHandler, loading = true) => {
  return request.get(
    `/api/${spaceCode}/projects/${projectId}/testruns/closed/latest`,
    null,
    res => {
      successHandler(res);
    },
    failHandler,
    null,
    null,
    loading,
    i18n.t('최근 종료된 테스트런 목록을 불러오고 있습니다.'),
  );
};

export default ReportService;
