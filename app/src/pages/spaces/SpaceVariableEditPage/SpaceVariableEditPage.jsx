import React, { useEffect, useState } from 'react';
import { Block, Button, EmptyContent, Page, PageContent, PageTitle, Table, Tbody, Td, Th, THead, Title, Tr } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import './SpaceVariableEditPage.scss';
import SpaceVariableService from '@/services/SpaceVariableService';
import SpaceService from '@/services/SpaceService';
import VariableEditPopup from '@/pages/spaces/SpaceVariableEditPage/VariableEditPopup';
import dateUtil from '@/utils/dateUtil';
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
            to: `/spaces/${spaceCode}/edit`,
            text: t('편집'),
          },
        ]}
        onListClick={() => {
          navigate('/spaces');
        }}
      >
        {t('스페이스 변수 관리')}
      </PageTitle>
      <PageContent>
        <Title
          control={
            <div className="buttons">
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
        >
          {t('변수 및 프로파일')}
        </Title>
        <Block>
          <div className="variable-content">
            {spaceProfileList?.length > 0 && (
              <Table border>
                <THead>
                  <Tr>
                    <Th className="variable" align="left">
                      {t('변수')}
                    </Th>
                    {spaceProfileList.map(d => {
                      return (
                        <Th className="profile" align="left">
                          <Link
                            to="/"
                            onClick={e => {
                              e.preventDefault();
                              console.log(d);
                              setProfileEditPopup({
                                opened: true,
                                data: d,
                              });
                            }}
                          >
                            {d.name}
                          </Link>
                        </Th>
                      );
                    })}
                  </Tr>
                </THead>
                <Tbody>
                  {spaceVariableList.map(d => {
                    const variableProfiles = spaceProfileVariableList.filter(info => info.spaceVariable.id === d.id);

                    return (
                      <Tr key={d.id}>
                        <Td className="variable" align="left">
                          <Link
                            className="comment-delete-link"
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
                        </Td>
                        {spaceProfileList.map(profile => {
                          const value = variableProfiles.find(info => info.spaceProfile.id === profile.id);

                          return (
                            <Td className="profile" align="left">
                              {value?.value && (
                                <Link
                                  className="comment-delete-link"
                                  to="/"
                                  onClick={e => {
                                    e.preventDefault();
                                    setProfileVariableEditPopup({
                                      opened: true,
                                      data: value,
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
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </div>
        </Block>
        {false && (
          <>
            <Title
              control={
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
              }
            >
              {t('변수')}
            </Title>
            <Block>
              {spaceVariableList?.length > 0 && (
                <Table cols={['', '220px']} border>
                  <THead>
                    <Tr>
                      <Th align="left">{t('이름')}</Th>
                      <Th align="center">{t('생성 일시')}</Th>
                    </Tr>
                  </THead>
                  <Tbody>
                    {spaceVariableList.map(d => {
                      return (
                        <Tr key={d.id}>
                          <Td align="left">{d.name}</Td>
                          <Td align="center">{dateUtil.getDateString(d.creationDate)}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
              {spaceVariableList?.length < 1 && (
                <EmptyContent className="empty-content">
                  <div>{t('등록된 변수가 없습니다.')}</div>
                </EmptyContent>
              )}
            </Block>
            <Title
              control={
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
              }
            >
              {t('프로파일')}
            </Title>
            <Block>
              {spaceProfileList?.length > 0 && (
                <Table cols={['', '120px', '220px']} border>
                  <THead>
                    <Tr>
                      <Th align="left">{t('이름')}</Th>
                      <Th align="center">{t('기본 프로파일')}</Th>
                      <Th align="center">{t('생성 일시')}</Th>
                    </Tr>
                  </THead>
                  <Tbody>
                    {spaceProfileList.map(d => {
                      return (
                        <Tr key={d.id}>
                          <Td align="left">{d.name}</Td>
                          <Td align="center">{d.default ? 'Y' : 'N'}</Td>
                          <Td align="center">{dateUtil.getDateString(d.creationDate)}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
              {spaceProfileList?.length < 1 && (
                <EmptyContent className="empty-content">
                  <div>{t('등록된 프로파일이 없습니다.')}</div>
                </EmptyContent>
              )}
            </Block>
          </>
        )}
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
