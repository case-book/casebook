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
  const [variableEditPopup, setVariableEditPopup] = useState(false);
  const [profileEditPopup, setProfileEditPopup] = useState(false);
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
    SpaceVariableService.createSpaceVariableInfo(spaceCode, data, info => {
      const nextSpaceVariableList = spaceVariableList.slice(0);
      nextSpaceVariableList.push(info);
      setSpaceVariableList(nextSpaceVariableList);
      setVariableEditPopup(false);
    });
  };

  const createSpaceProfileInfo = data => {
    SpaceProfileService.createSpaceProfileInfo(spaceCode, data, info => {
      const nextSpaceProfileList = spaceProfileList.slice(0);
      nextSpaceProfileList.push(info);
      setSpaceProfileList(nextSpaceProfileList);
      setProfileEditPopup(false);
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
            <Button
              size="xs"
              color="primary"
              onClick={() => {
                setProfileEditPopup(true);
              }}
            >
              {t('프로파일 별 변수 서정')}
            </Button>
          }
        >
          {t('프로파일 별 변수 설정')}
        </Title>
        <Block>
          {spaceProfileList?.length > 0 && (
            <Table cols={['160px']} border>
              <THead>
                <Tr>
                  <Th align="left">{t('변수')}</Th>
                  {spaceProfileList.map(d => {
                    return <Th align="left">{d.name}</Th>;
                  })}
                </Tr>
              </THead>
              <Tbody>
                {spaceVariableList.map(d => {
                  const variableProfiles = spaceProfileVariableList.filter(info => info.spaceVariable.id === d.id);

                  return (
                    <Tr key={d.id}>
                      <Td align="left">{d.name}</Td>
                      {spaceProfileList.map(profile => {
                        const value = variableProfiles.find(info => info.spaceProfile.id === profile.id);

                        return (
                          <Td align="left">
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
        </Block>

        <Title
          control={
            <Button
              size="xs"
              color="primary"
              onClick={() => {
                setVariableEditPopup(true);
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
                setProfileEditPopup(true);
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
      </PageContent>
      {variableEditPopup && <VariableEditPopup setOpened={setVariableEditPopup} onApply={createSpaceVariableInfo} />}
      {profileEditPopup && <ProfileEditPopup setOpened={setProfileEditPopup} onApply={createSpaceProfileInfo} />}
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
