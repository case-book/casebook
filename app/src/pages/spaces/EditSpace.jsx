import React, { useEffect, useState } from 'react';
import './EditSpace.scss';
import { Block, Button, CheckBox, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Text, TextArea, Title } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SpaceService from '@/services/SpaceService';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import moment from 'moment';

import BlockRow from '@/components/BlockRow/BlockRow';
import useStores from '@/hooks/useStores';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

function EditSpace({ type }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    userStore: { addSpace },
  } = useStores();

  const navigate = useNavigate();

  const [space, setSpace] = useState({
    name: '',
    code: '',
    description: '',
    activated: true,
    token: uuidv4(),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && type === 'edit') {
      SpaceService.selectSpaceInfo(id, info => {
        const data = { ...info };
        if (data.permissionDate) {
          data.permissionDate = moment(data.permissionDate, 'YYYY-MM-DD').format('YYYYMMDD');
        }
        setSpace(data);
      });
    }
  }, [type, id]);

  const onSubmit = e => {
    e.preventDefault();

    if (type === 'new') {
      SpaceService.createSpace(space, result => {
        addSpace(result);
        navigate('/spaces');
      });
    } else if (type === 'edit') {
      SpaceService.updateSpace(space, () => {
        navigate('/spaces');
      });
    }
  };

  const onDelete = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('스페이스 삭제'),
      <div>{t(`${space.name} 스페이스의 모든 정보가 삭제됩니다. 삭제하시겠습니까?`)}</div>,
      () => {
        SpaceService.deleteSpace(space.id, result => {
          addSpace(result);
          navigate('/spaces');
        });
      },
      null,
      t('삭제'),
    );
  };

  return (
    <Page className="edit-space-wrapper">
      <PageTitle>{type === 'edit' ? t('스페이스') : t('새 스페이스')}</PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Title>기본 정보</Title>
          <Block className="pt-0">
            <BlockRow>
              <Label required>{t('이름')}</Label>
              <Input
                value={space.name}
                onChange={val =>
                  setSpace({
                    ...space,
                    name: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>

            <BlockRow>
              <Label required>{t('코드')}</Label>
              <Input
                value={space.code}
                onChange={val =>
                  setSpace({
                    ...space,
                    code: val,
                  })
                }
                required
                minLength={1}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('설명')}</Label>
              <TextArea
                value={space.description || ''}
                rows={4}
                onChange={val => {
                  setSpace({
                    ...space,
                    description: val,
                  });
                }}
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('활성화')}</Label>
              <CheckBox
                type="checkbox"
                value={space.activated}
                onChange={val =>
                  setSpace({
                    ...space,
                    activated: val,
                  })
                }
              />
            </BlockRow>
            <BlockRow>
              <Label>{t('토큰')}</Label>
              <Text inline>{space.token}</Text>
              <Button
                rounded
                onClick={() => {
                  setSpace({
                    ...space,
                    token: uuidv4(),
                  });
                }}
              >
                <i className="fa-solid fa-arrows-rotate" />
              </Button>
            </BlockRow>
          </Block>
          <PageButtons
            onDelete={type === 'edit' ? onDelete : null}
            onCancel={() => {
              if (type === 'edit') {
                navigate(`/spaces/${id}/info`);
              } else {
                navigate('/');
              }
            }}
            onSubmit={() => {}}
            onSubmitText="저장"
            onCancelIcon=""
          />
        </Form>
      </PageContent>
    </Page>
  );
}

EditSpace.defaultProps = {
  type: 'new',
};

EditSpace.propTypes = {
  type: PropTypes.string,
};

export default EditSpace;
