import React, { useState } from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { OpenLinkReport } from '@/assets';
import './OpenLinkPage.scss';

function OpenLinkPage() {
  const { t } = useTranslation();

  const { token } = useParams();
  const [name, setName] = useState(null);

  return (
    <Page className="open-link-page-wrapper" border rounded marginBottom>
      <PageTitle name={t('오픈 링크')}>{name || t('오픈 링크')}</PageTitle>
      <PageContent>
        <OpenLinkReport token={token} setName={setName} />
      </PageContent>
    </Page>
  );
}

OpenLinkPage.defaultProps = {};

OpenLinkPage.propTypes = {};

export default OpenLinkPage;
