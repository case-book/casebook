import React, { useEffect, useState } from 'react';

import { Page, PageContent, PageTitle, Tabs } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Spaces.scss';
import SpaceService from '@/services/SpaceService';

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

function Spaces() {
  const { t } = useTranslation();

  const [spaces, setSpaces] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    SpaceService.selectSpaceList(list => {
      setSpaces(list);
    });
  }, [tab]);

  console.log(spaces);

  return (
    <Page className="club-list-wrapper">
      <PageTitle className="page-title" links={[<Link to="/spaces/new">새 스페이스</Link>]}>
        {t('스페이스 리스트')}
      </PageTitle>
      <PageContent>
        <Tabs className="tab" tabs={tabs} value={tab} onSelect={setTab} />
      </PageContent>
    </Page>
  );
}

export default Spaces;
