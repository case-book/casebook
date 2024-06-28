import React, { useEffect } from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { STATIC_MENUS } from '@/constants/menu';
import './AdminIndexInfoPage.scss';

function AdminIndexInfoPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Page className="admin-index-info-page-wrapper">
      <PageTitle
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: '/admin',
            text: t('시스템 관리'),
          },
        ]}
        onListClick={() => {
          navigate('/');
        }}
      >
        {t('시스템 관리')}
      </PageTitle>
      <PageContent className="page-content">
        <ul>
          {STATIC_MENUS.find(d => d.key === 'admin').list.map(d => {
            return (
              <li key={d.to}>
                <div className="link">
                  <Link to={`/admin${d.to}`}>
                    <span className="icon">{d.icon}</span>
                    <span className="name">{d.name}</span>
                  </Link>
                </div>
                <div className="description">{d.description}</div>
              </li>
            );
          })}
        </ul>
      </PageContent>
    </Page>
  );
}

AdminIndexInfoPage.defaultProps = {};

AdminIndexInfoPage.propTypes = {};

export default AdminIndexInfoPage;
