import React, { useEffect, useState } from 'react';
import './Space.scss';
import { Block, Label, Page, PageButtons, PageContent, PageTitle, Text, Title } from '@/components';
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
        <Title type="h2">스페이스 정보</Title>
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
        <Title type="h2">사용자</Title>
        <div className="user-list">
          <table>
            <tbody>
              {space?.users?.map(user => {
                return (
                  <tr key={user.id} className="user-item-wrapper">
                    <td className="name">{user.name}</td>
                    <td className="email">{user.email}</td>
                    <td className="role">{user.role || 'MEMBER'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
