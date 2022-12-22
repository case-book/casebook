import React, { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import './PieChart.scss';

import { useTranslation } from 'react-i18next';
import { EmptyContent } from '@/components';

function PieChart({ data, showTopArcLabelCount, defs, onClick }) {
  const { t } = useTranslation();

  const dataRankInfo = useMemo(() => {
    const next = data.slice(0);
    next.sort((a, b) => {
      return b.value - a.value;
    });

    const rankInfo = {};
    next.forEach((d, inx) => {
      rankInfo[d.id] = inx;
    });

    return rankInfo;
  }, [data]);

  return (
    <div className="pie-chart-wrapper">
      {data?.length < 1 && <EmptyContent>{t('데이터가 없습니다.')}</EmptyContent>}
      {data?.length > 0 && (
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={2}
          cornerRadius={10}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.7]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#000"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          defs={defs}
          colors={d => {
            return d.data?.color;
          }}
          onClick={d => {
            if (onClick) {
              onClick(d);
            }
          }}
          fill={[
            {
              match: {
                id: 'PASSED',
              },
              id: 'PASSED',
            },
            {
              match: {
                id: 'FAILED',
              },
              id: 'FAILED',
            },
            {
              match: {
                id: 'UNTESTED',
              },
              id: 'UNTESTED',
            },
          ]}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#111',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'square',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
          enableArcLabels={false}
          arcLinkLabel={e => {
            if (showTopArcLabelCount === Infinity) {
              return `${e.id} (${e.value})`;
            }

            if (dataRankInfo[e.id] < showTopArcLabelCount) {
              return `${e.id} (${e.value})`;
            }

            return '';
          }}
        />
      )}
    </div>
  );
}

PieChart.defaultProps = {
  showTopArcLabelCount: Infinity,
  defs: [],
  onClick: null,
};

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      color: PropTypes.string,
      value: PropTypes.number,
    }),
  ).isRequired,
  showTopArcLabelCount: PropTypes.number,
  defs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  onClick: PropTypes.func,
};

export default React.memo(PieChart);
