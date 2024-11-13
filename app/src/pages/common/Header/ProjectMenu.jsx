import React from 'react';
import { observer } from 'mobx-react';
import useStores from '@/hooks/useStores';
import PropTypes from 'prop-types';
import { MENUS } from '@/constants/menu';
import { useTranslation } from 'react-i18next';
import useMenu from '@/hooks/useMenu';
import './ProjectMenu.scss';
import './SideMenu.scss';
import SideLabel from '@/assets/SideBar/SideLabel';
import SideMenuItem from '@/assets/SideBar/SideMenuItem';
import classNames from 'classnames';

function ProjectMenu({ className }) {
  const {
    userStore: {
      isLogin,
      user: { activeSystemRole },
    },
    contextStore: { spaceCode },
  } = useStores();
  const { menu } = useMenu();

  const { t } = useTranslation();

  const list = MENUS.filter(d => d.pc)
    .filter(d => {
      if (d.admin) {
        return activeSystemRole === 'ROLE_ADMIN';
      }
      return true;
    })
    .filter(d => d.login === undefined || d.login === isLogin);

  return (
    <div className={classNames('project-menu-wrapper', className)}>
      <SideLabel label="MENU" />
      <SideMenuItem text={t('메뉴.대시보드')} icon={<i className="fa-solid fa-gauge" />} to={`/spaces/${spaceCode}/dashboard`} />
      {list.map((d, inx) => {
        return <SideMenuItem key={inx} selected={d?.key && menu?.key && d?.key === menu?.key} text={t(`메뉴.${d.name}`)} to={d.to} icon={d.icon} inx={inx} list={d.list} projectRequired={d.project} />;
      })}
    </div>
  );
}

ProjectMenu.defaultProps = {
  className: '',
};

ProjectMenu.propTypes = {
  className: PropTypes.string,
};

export default observer(ProjectMenu);
