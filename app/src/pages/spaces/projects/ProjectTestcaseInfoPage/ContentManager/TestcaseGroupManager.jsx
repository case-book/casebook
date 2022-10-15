import React from 'react';
import { useTranslation } from 'react-i18next';
import './TestcaseGroupManager.scss';

function TestcaseGroupManager() {
  const { t } = useTranslation();

  return <div>{t('테스트케이스 그룹 매니저')}</div>;
}

TestcaseGroupManager.defaultProps = {};

TestcaseGroupManager.propTypes = {};

export default TestcaseGroupManager;
