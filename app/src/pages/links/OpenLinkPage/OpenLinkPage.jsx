import React, { useState } from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { OpenLinkReport } from '@/assets';
import classNames from 'classnames';
import useStores from '@/hooks/useStores';
import './OpenLinkPage.scss';

function OpenLinkPage() {
  const { t } = useTranslation();

  const { token } = useParams();
  const [name, setName] = useState(null);

  const {
    userStore: { isLogin },
  } = useStores();

  return (
    <Page className={classNames('open-link-page-wrapper', { 'is-login': isLogin })} border={!isLogin} rounded={!isLogin} marginBottom={!isLogin}>
      <PageTitle name={t('오픈 링크')}>{name || t('오픈 링크')}</PageTitle>
      <PageContent flex>
        <OpenLinkReport token={token} setName={setName} />
      </PageContent>
    </Page>
  );
}

OpenLinkPage.defaultProps = {};

OpenLinkPage.propTypes = {};

export default OpenLinkPage;
