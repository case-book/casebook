import React, { useEffect, useState } from 'react';
import { Button, Page, PageContent, PageTitle, Table, Tbody, Td, Th, THead, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import './SpaceVariableEditPage.scss';
import SpaceVariableService from '@/services/SpaceVariableService';
import SpaceService from '@/services/SpaceService';
import VariableEditPopup from '@/pages/spaces/SpaceVariableEditPage/VariableEditPopup';
import SpaceProfileService from '@/services/SpaceProfileService';
import ProfileEditPopup from '@/pages/spaces/SpaceVariableEditPage/ProfileEditPopup';
import SpaceProfileVariableService from '@/services/SpaceProfileVariableService';
import ProfileVariableEditPopup from '@/pages/spaces/SpaceVariableEditPage/ProfileVariableEditPopup';

function SpaceVariableEditPage() {
  const { t } = useTranslation();
  const { spaceCode } = useParams();

  const navigate = useNavigate();
  const [spaceVariableList, setSpaceVariableList] = useState([]);
  const [spaceProfileList, setSpaceProfileList] = useState([]);
  const [spaceProfileVariableList, setSpaceProfileVariableList] = useState([]);
  const [space, setSpace] = useState(null);
  const [variableEditPopup, setVariableEditPopup] = useState({ opened: false, data: null });
  const [profileEditPopup, setProfileEditPopup] = useState({ opened: false, data: null });
  const [profileVariableEditPopup, setProfileVariableEditPopup] = useState({
    opened: false,
    data: null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    SpaceService.selectSpaceInfo(spaceCode, info => {
      setSpace(info);
    });
    SpaceVariableService.selectSpaceVariableList(spaceCode, list => {
      setSpaceVariableList(list);
    });
    SpaceProfileService.selectSpaceProfileList(spaceCode, list => {
      setSpaceProfileList(list);
    });

    SpaceProfileVariableService.selectSpaceProfileVariableList(spaceCode, list => {
      setSpaceProfileVariableList(list);
    });
  }, [spaceCode]);

  const createSpaceVariableInfo = data => {
    if (data.id) {
      SpaceVariableService.updateSpaceVariableInfo(spaceCode, data, info => {
        const nextSpaceVariableList = spaceVariableList.slice(0);
        nextSpaceVariableList.find(d => d.id === info.id).name = info.name;
        setSpaceVariableList(nextSpaceVariableList);
      });
    } else {
      SpaceVariableService.createSpaceVariableInfo(spaceCode, data, info => {
        const nextSpaceVariableList = spaceVariableList.slice(0);
        nextSpaceVariableList.push(info);
        setSpaceVariableList(nextSpaceVariableList);
      });
    }

    setVariableEditPopup({
      opened: false,
    });
  };

  const deleteSpaceVariableInfo = spaceVariableId => {
    SpaceVariableService.deleteSpaceVariableInfo(spaceCode, spaceVariableId, () => {
      const nextSpaceVariableList = spaceVariableList.slice(0);
      const targetIndex = nextSpaceVariableList.findIndex(d => d.id === spaceVariableId);
      nextSpaceVariableList.splice(targetIndex, 1);
      setSpaceVariableList(nextSpaceVariableList);

      const nextSpaceProfileVariableList = spaceProfileVariableList.slice(0);
      setSpaceProfileVariableList(nextSpaceProfileVariableList.filter(d => d.spaceVariable.id !== spaceVariableId));

      setVariableEditPopup({
        opened: false,
      });
    });
  };

  const createSpaceProfileInfo = data => {
    if (data.id) {
      SpaceProfileService.updateSpaceProfileInfo(spaceCode, data, info => {
        const nextSpaceProfileList = spaceProfileList.slice(0);
        const targetIndex = nextSpaceProfileList.findIndex(d => d.id === info.id);
        nextSpaceProfileList.splice(targetIndex, 1, info);
        setSpaceProfileList(nextSpaceProfileList);
        SpaceProfileService.selectSpaceProfileList(spaceCode, list => {
          setSpaceProfileList(list);
        });
      });
    } else {
      SpaceProfileService.createSpaceProfileInfo(spaceCode, data, info => {
        const nextSpaceProfileList = spaceProfileList.slice(0);
        nextSpaceProfileList.push(info);
        setSpaceProfileList(nextSpaceProfileList);
        SpaceProfileService.selectSpaceProfileList(spaceCode, list => {
          setSpaceProfileList(list);
        });
      });
    }

    setProfileEditPopup({
      opened: false,
    });
  };

  const deleteSpaceProfileInfo = spaceProfileId => {
    SpaceProfileService.deleteSpaceProfileInfo(spaceCode, spaceProfileId, () => {
      const nextSpaceProfileList = spaceProfileList.slice(0);
      const targetIndex = nextSpaceProfileList.findIndex(d => d.id === spaceProfileId);
      nextSpaceProfileList.splice(targetIndex, 1);
      setSpaceProfileList(nextSpaceProfileList);
      setProfileEditPopup({
        opened: false,
      });
    });
  };

  const createOrUpdateSpaceProfileVariableInfo = (spaceVariableId, spaceProfileId, data) => {
    SpaceVariableService.createSpaceProfileVariableInfo(spaceCode, spaceVariableId, spaceProfileId, data, info => {
      const nextSpaceProfileVariableList = spaceProfileVariableList.slice(0);

      const existIndex = nextSpaceProfileVariableList.findIndex(d => d.id === data.id);
      if (existIndex > -1) {
        nextSpaceProfileVariableList[existIndex] = info;
      } else {
        nextSpaceProfileVariableList.push(info);
      }

      setSpaceProfileVariableList(nextSpaceProfileVariableList);
      setProfileVariableEditPopup({
        opened: false,
      });
    });
  };

  const deleteSpaceProfileVariableInfo = data => {
    SpaceVariableService.deleteSpaceProfileVariableInfo(spaceCode, data.spaceVariable.id, data.spaceProfile.id, () => {
      const nextSpaceProfileVariableList = spaceProfileVariableList.slice(0);
      const index = nextSpaceProfileVariableList.findIndex(d => d.id === data.id);
      if (index > -1) {
        nextSpaceProfileVariableList.splice(index, 1);
        setSpaceProfileVariableList(nextSpaceProfileVariableList);
      }

      setProfileVariableEditPopup({
        opened: false,
      });
    });
  };

  return (
    <Page className="space-variable-edit-page-wrapper">
      <PageTitle
        control={
          <div>
            <Button
              size="xs"
              color="primary"
              onClick={() => {
                setVariableEditPopup({
                  opened: true,
                });
              }}
            >
              {t('변수 추가')}
            </Button>
            <Button
              size="xs"
              color="primary"
              onClick={() => {
                setProfileEditPopup({
                  opened: true,
                });
              }}
            >
              {t('프로파일 추가')}
            </Button>
          </div>
        }
        name={t('스페이스 변수 관리')}
        breadcrumbs={[
          {
            to: '/',
            text: t('HOME'),
          },
          {
            to: '/',
            text: t('스페이스 목록'),
          },
          {
            to: `/spaces/${spaceCode}/info`,
            text: space?.name,
          },
          {
            to: `/spaces/${spaceCode}/variables`,
            text: t('스페이스 변수 관리'),
          },
        ]}
        onListClick={() => {
          navigate('/spaces');
        }}
      >
        {t('스페이스 변수 관리')}
      </PageTitle>
      <PageContent>
        <div className="variable-content">
          <Table border>
            <THead>
              <Tr>
                <Th className="description" align="left">
                  <div>
                    <div className="profile">{t('프로파일')}</div>
                    <div className="variable">{t('변수')}</div>
                    <div className="line" />
                  </div>
                </Th>
                {spaceProfileList.length < 1 && (
                  <Th align="center">
                    <Button
                      size="xs"
                      color="primary"
                      onClick={() => {
                        setProfileEditPopup({
                          opened: true,
                        });
                      }}
                    >
                      {t('프로파일 추가')}
                    </Button>
                  </Th>
                )}
                {spaceProfileList.map(d => {
                  return (
                    <Th key={d.id} className="profile" align="left">
                      <Link
                        to="/"
                        onClick={e => {
                          e.preventDefault();
                          setProfileEditPopup({
                            opened: true,
                            data: d,
                          });
                        }}
                      >
                        {d.name}
                      </Link>
                      {d.default && (
                        <div className="default">
                          <span>{t('디폴트')}</span>
                        </div>
                      )}
                    </Th>
                  );
                })}
                {spaceProfileList.length > 0 && <Th className="last" />}
              </Tr>
            </THead>
            <Tbody>
              {(spaceVariableList.length < 1 || spaceProfileList.length < 1) && (
                <Tr>
                  {spaceVariableList.length < 1 && (
                    <Th className="empty-variable">
                      <Button
                        size="xs"
                        color="primary"
                        onClick={() => {
                          setVariableEditPopup({
                            opened: true,
                          });
                        }}
                      >
                        {t('변수 추가')}
                      </Button>
                    </Th>
                  )}
                  {spaceVariableList.length < 1 && spaceProfileList.length < 1 && (
                    <Td className="intro" align="center">
                      {t('변수와 프로파일을 추가해주세요.')}
                    </Td>
                  )}
                  {spaceVariableList.length < 1 && spaceProfileList.length > 0 && (
                    <Td className="intro" align="center" colSpan={spaceProfileList.length}>
                      {t('변수를 추가해주세요.')}
                    </Td>
                  )}
                </Tr>
              )}

              {spaceVariableList.map(d => {
                const variableProfiles = spaceProfileVariableList.filter(info => info.spaceVariable.id === d.id);

                return (
                  <Tr key={d.id}>
                    <Th className="variable" align="left">
                      <Link
                        to="/"
                        onClick={e => {
                          e.preventDefault();
                          setVariableEditPopup({
                            opened: true,
                            data: d,
                          });
                        }}
                      >
                        {d.name}
                      </Link>
                    </Th>
                    {spaceProfileList.map(profile => {
                      const value = variableProfiles.find(info => info.spaceProfile.id === profile.id);

                      return (
                        <Td key={profile.id} className="profile" align={value?.value ? 'left' : 'center'}>
                          {value?.value && (
                            <Link
                              to="/"
                              onClick={e => {
                                e.preventDefault();
                                setProfileVariableEditPopup({
                                  opened: true,
                                  data: {
                                    ...value,
                                    profileName: profile.name,
                                    variableName: d.name,
                                  },
                                });
                              }}
                            >
                              {value.value}
                            </Link>
                          )}
                          {!value?.value && (
                            <Button
                              size="xs"
                              color="primary"
                              onClick={() => {
                                setProfileVariableEditPopup({
                                  opened: true,
                                  data: {
                                    value: '',
                                    spaceVariable: { id: d.id },
                                    spaceProfile: { id: profile.id },
                                    profileName: profile.name,
                                    variableName: d.name,
                                  },
                                });
                              }}
                            >
                              {t('추가')}
                            </Button>
                          )}
                        </Td>
                      );
                    })}
                    {spaceVariableList.length > 0 && spaceProfileList.length < 1 && (
                      <Td className="intro no-profile" align="center">
                        {t('프로파일을 추가해주세요.')}
                      </Td>
                    )}
                    {spaceProfileList.length > 0 && <Td className="last" />}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      </PageContent>
      {variableEditPopup.opened && (
        <VariableEditPopup
          data={variableEditPopup.data}
          setOpened={value => {
            setVariableEditPopup({
              opened: value,
            });
          }}
          onSave={createSpaceVariableInfo}
          onDelete={deleteSpaceVariableInfo}
        />
      )}
      {profileEditPopup.opened && (
        <ProfileEditPopup
          data={profileEditPopup.data}
          onSave={createSpaceProfileInfo}
          setOpened={value => {
            setProfileEditPopup({
              opened: value,
            });
          }}
          onDelete={deleteSpaceProfileInfo}
        />
      )}
      {profileVariableEditPopup.opened && (
        <ProfileVariableEditPopup
          data={profileVariableEditPopup.data}
          setOpened={value => {
            setProfileVariableEditPopup({
              opened: value,
            });
          }}
          onApply={createOrUpdateSpaceProfileVariableInfo}
          onDelete={deleteSpaceProfileVariableInfo}
        />
      )}
    </Page>
  );
}

SpaceVariableEditPage.defaultProps = {};

SpaceVariableEditPage.propTypes = {};

export default SpaceVariableEditPage;
