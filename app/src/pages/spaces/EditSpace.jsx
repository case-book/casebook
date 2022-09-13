import React, { useEffect, useState } from 'react';
import './EditSpace.scss';
import { Block, Button, CheckBox, Form, Input, Label, Page, PageButtons, PageContent, PageTitle, Text, TextArea } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SpaceService from '@/services/SpaceService';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import moment from 'moment';

import BlockRow from '@/components/BlockRow/BlockRow';
import useStores from '@/hooks/useStores';

const labelMinWidth = '100px';

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
    activated: '',
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

  return (
    <Page className="edit-space-wrapper">
      <PageTitle>{t('새 스페이스')}</PageTitle>
      <PageContent>
        <Form onSubmit={onSubmit}>
          <Block className="pt-0">
            <BlockRow>
              <Label minWidth={labelMinWidth} size="sm" required>
                {t('이름')}
              </Label>
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
              <Label size="sm" minWidth={labelMinWidth} required>
                {t('코드')}
              </Label>
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
              <Label size="sm" minWidth={labelMinWidth}>
                {t('설명')}
              </Label>
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
              <Label size="sm" minWidth={labelMinWidth}>
                {t('활성화')}
              </Label>
              <CheckBox
                size="sm"
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
              <Label size="sm" minWidth={labelMinWidth}>
                {t('토큰')}
              </Label>
              <Text>{space.token}</Text>
              <Button
                outline
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
            onCancel={() => {
              navigate('/spaces');
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
