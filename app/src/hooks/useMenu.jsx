import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MENUS } from '@/constants/menu';
import useStores from '@/hooks/useStores';

const useQueryString = () => {
  const location = useLocation();

  const {
    userStore: {
      isLogin,
      user: { activeSystemRole },
    },
    contextStore: { isProjectSelected },
  } = useStores();

  const pathInfo = useMemo(() => {
    const pattern = /\/spaces\/([a-zA-Z0-9_]+)\/projects\/(\d+)(?:\/([a-zA-Z0-9_]+))?/;
    const match = location.pathname.match(pattern);

    if (match) {
      return {
        spaceCode: match[1],
        projectId: match[2],
        menu: match[3] || '',
      };
    }
    return null; // 패턴이 일치하지 않는 경우 null 반환
  }, [location.pathname]);

  const menus = useMemo(() => {
    return MENUS.filter(d => d.pc)
      .filter(d => {
        if (d.admin) {
          return activeSystemRole === 'ROLE_ADMIN';
        }
        return true;
      })
      .filter(d => d.login === undefined || d.login === isLogin);
  }, [activeSystemRole, isLogin]);

  console.log(location.pathname);
  console.log(pathInfo);

  let menu;
  if (isProjectSelected) {
    menu = menus?.find(d => d.project && d.to === `/${pathInfo?.menu}`);
  }

  return menu;
};

export default useQueryString;
