import React from 'react';
import { Button, Table, Tbody, Td, Th, THead, Tr } from '@/components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function TestcaseSelectorSummary({ className, selectedTestcaseGroupSummary, onDeleteGroup }) {
  const { t } = useTranslation();

  return (
    <Table className={`testcase-selector-summary ${className}`} cols={['', '200px', '100px']} sticky>
      <THead>
        <Tr>
          <Th align="left">{t('테스트케이스 그룹')}</Th>
          <Th align="right">{t('선택 테스트케이스')}</Th>
          {onDeleteGroup && <Th />}
        </Tr>
      </THead>
      <Tbody>
        {selectedTestcaseGroupSummary.map(summary => {
          return (
            <Tr key={summary.testcaseGroupId}>
              <Td>{summary.name}</Td>
              <Td align="right">{t('@ 테스트케이스', { count: summary.count })}</Td>
              {onDeleteGroup && (
                <Td align="center">
                  <Button outline color="danger" size="xs" onClick={() => onDeleteGroup(summary.testcaseGroupId)}>
                    {t('삭제')}
                  </Button>
                </Td>
              )}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

TestcaseSelectorSummary.defaultProps = {
  className: '',
  onDeleteGroup: null,
};

TestcaseSelectorSummary.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  selectedTestcaseGroupSummary: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleteGroup: PropTypes.func,
};

export default TestcaseSelectorSummary;
