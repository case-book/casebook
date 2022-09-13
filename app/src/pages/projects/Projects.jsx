import React, { useEffect, useState } from 'react';

import { Page, PageContent, PageTitle, Tabs } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Projects.scss';

const tabs = [
  {
    key: 'all',
    value: '전체',
  },
  {
    key: 'supported',
    value: '지원',
  },
  {
    key: 'unsupported',
    value: '미지원',
  },
  {
    key: 'unpermission',
    value: '허가일 미등록',
  },
];

function Projects() {
  const { t } = useTranslation();
  // const [projects, setProjects] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {}, [tab]);

  return (
    <Page className="club-list-wrapper">
      <PageTitle className="page-title" links={[<Link to="/projects/new">새 클럽</Link>]}>
        {t('클럽 리스트')}
      </PageTitle>
      <PageContent>
        <Tabs className="tab" tabs={tabs} value={tab} onSelect={setTab} />
      </PageContent>
    </Page>
  );
}

export default Projects;
