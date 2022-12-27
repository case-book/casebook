import React, { useEffect, useState } from 'react';
import { Page } from '@/components';
import SpaceService from '@/services/SpaceService';
import { useParams } from 'react-router';
import InaccessibleContent from '@/pages/spaces/SpaceInfoPage/InaccessibleContent';
import SpaceContent from '@/pages/spaces/SpaceInfoPage/SpaceContent';

function SpaceInfoPage() {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [accessible, setAccessible] = useState(null);

  const getSpaceInfo = () => {
    SpaceService.selectSpaceInfo(
      id,
      info => {
        setAccessible(true);
        setSpace(info);
      },
      status => {
        setAccessible(false);

        if (status === 403) {
          SpaceService.selectSpaceAccessibleInfo(id, data => {
            setSpace(data);
          });
          return true;
        }
        return false;
      },
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getSpaceInfo();
  }, [id]);

  return (
    <Page className="space-info-page-wrapper">
      {accessible === false && <InaccessibleContent space={space} onRefresh={getSpaceInfo} />}
      {accessible && <SpaceContent space={space} onRefresh={getSpaceInfo} />}
    </Page>
  );
}

SpaceInfoPage.defaultProps = {};

SpaceInfoPage.propTypes = {};

export default SpaceInfoPage;
