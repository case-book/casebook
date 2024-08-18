import React, { useEffect } from 'react';
import { Page, PageContent, PageTitle } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ADMIN_MENUS } from '@/constants/menu';
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
      <PageContent className="page-content" flex>
        <ul>
          {ADMIN_MENUS.map(d => {
            return (
              <li key={d.to}>
                <Link to={`/admin${d.to}`}>
                  <div>
                    <span className="icon">{d.icon}</span>
                    <div className="link">
                      <span className="name">{d.name}</span>
                    </div>
                    <div className="description">{d.description}</div>
                  </div>
                </Link>
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
