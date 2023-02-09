import React, { useEffect, useState } from 'react';
import { Block, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import BlockRow from '@/components/BlockRow/BlockRow';
import UserService from '@/services/UserService';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const labelMinWidth = '140px';

function PasswordChangePage() {
  const { t } = useTranslation();
  const { spaceCode, projectId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    currentPassword: '',
    nextPassword: '',
    nextPasswordConfirm: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const onSubmit = e => {
    e.preventDefault();
    UserService.updateUserPassword(user, () => {
      dialogUtil.setMessage(MESSAGE_CATEGORY.INFO, '비밀번호 변경 완료', '비밀번호가 정상적으로 변경되었습니다.', () => {
        navigate('/users/my');
      });
    });
  };

  return (
    <Page>
      <PageTitle links={user?.admin ? [<Link to={`/spaces/${spaceCode}/projects/${user.id}/edit`}>{t('프로젝트 변경')}</Link>] : null}>{t('프로젝트')}</PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Title>{t('비밀번호 변경')}</Title>
          <Block>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('현재 비밀번호')}</Label>
              <Input
                type="password"
                value={user?.currentPassword}
                onChange={val =>
                  setUser({
                    ...user,
                    currentPassword: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('새 비밀번호')}</Label>
              <Input
                type="password"
                value={user?.nextPassword}
                onChange={val =>
                  setUser({
                    ...user,
                    nextPassword: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label minWidth={labelMinWidth}>{t('새 비밀번호 확인')}</Label>
              <Input
                type="password"
                value={user?.nextPasswordConfirm}
                onChange={val =>
                  setUser({
                    ...user,
                    nextPasswordConfirm: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
          </Block>
          <PageButtons
            onBack={() => {
              navigate(-1);
            }}
            onSubmit={() => {}}
            onSubmitText={t('저장')}
          />
        </Form>
      </PageContent>
    </Page>
  );
}

PasswordChangePage.defaultProps = {};

PasswordChangePage.propTypes = {};

export default PasswordChangePage;
