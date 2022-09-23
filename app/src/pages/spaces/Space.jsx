import React, { useEffect, useState } from 'react';
import './Space.scss';
import { Block, Label, Page, PageButtons, PageContent, PageTitle, Tag, Text, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SpaceService from '@/services/SpaceService';
import { useParams } from 'react-router';

import BlockRow from '@/components/BlockRow/BlockRow';

function Space() {
  const { t } = useTranslation();
  const { id } = useParams();

  const navigate = useNavigate();

  const [space, setSpace] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    SpaceService.selectSpaceInfo(id, info => {
      setSpace(info);
    });
  }, [id]);

  return (
    <Page className="space-wrapper">
      <PageTitle>{t('스페이스')}</PageTitle>
      <PageContent>
        <Title>스페이스 정보</Title>
        <Block>
          <BlockRow>
            <Label>{t('이름')}</Label>
            <Text>{space?.name}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('코드')}</Label>
            <Text>{space?.code}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('설명')}</Label>
            <Text>{space?.description}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('활성화')}</Label>
            <Text>{space?.activated ? 'Y' : 'N'}</Text>
          </BlockRow>
          <BlockRow>
            <Label>{t('토큰')}</Label>
            <Text>{space?.token}</Text>
          </BlockRow>
        </Block>
        <Title>사용자</Title>
        <div className="user-list">
          <ul>
            {space?.users?.map(user => {
              return (
                <li key={user.id}>
                  <div className="user-item-wrapper">
                    <div className="name">
                      <div>{user.name}</div>
                      <div>
                        <Tag>{user.role || 'MEMBER'}</Tag>
                      </div>
                    </div>
                    <div className="email">{user.email}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <PageButtons
          onBack={() => {
            navigate('/');
          }}
          onEdit={() => {
            navigate(`/spaces/${space.code}/edit`);
          }}
          onCancelIcon=""
        />
      </PageContent>
    </Page>
  );
}

Space.defaultProps = {};

Space.propTypes = {};

export default Space;
