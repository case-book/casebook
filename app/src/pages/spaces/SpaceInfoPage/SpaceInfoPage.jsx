import React, { useEffect, useState } from 'react';
import { Page } from '@/components';
import SpaceService from '@/services/SpaceService';
import { useParams } from 'react-router';
import InaccessibleContent from '@/pages/spaces/SpaceInfoPage/InaccessibleContent';
import SpaceContent from '@/pages/spaces/SpaceInfoPage/SpaceContent';
import ConfigService from '@/services/ConfigService';
import useStores from '@/hooks/useStores';

function SpaceInfoPage() {
  const { spaceCode } = useParams();
  const [space, setSpace] = useState(null);
  const [accessible, setAccessible] = useState(null);
  const {
    userStore: { language },
  } = useStores();

  const getSpaceInfo = () => {
    ConfigService.selectTimeZoneList(language || 'ko', list => {
      const zoneList = list.map(timeZone => {
        return {
          value: timeZone.zoneId,
          label: `${timeZone.zoneId} (${timeZone.name})`,
        };
      });

      SpaceService.selectSpaceInfo(
        spaceCode,
        info => {
          console.log(info);
          setAccessible(true);
          setSpace({ ...info, timeZone: zoneList.find(d => d.value === info.timeZone)?.label });
        },
        status => {
          setAccessible(false);

          if (status === 403) {
            SpaceService.selectSpaceAccessibleInfo(spaceCode, data => {
              setSpace(data);
            });
            return true;
          }
          return false;
        },
      );
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getSpaceInfo();
  }, [spaceCode]);

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
