import React from 'react';
import { Page, PageContent, Version } from '@/components';
import { observer } from 'mobx-react';
import './MainPage.scss';

function MainPage() {
  return (
    <Page className="space-list-page-wrapper" pure>
      <PageContent className="page-content">
        <Version className="version" />
      </PageContent>
    </Page>
  );
}

export default observer(MainPage);
