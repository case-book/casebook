import React, { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import './PieChart.scss';

function PieChart({ data, showTopArcLabelCount, defs, onClick, legend, tooltip, activeOuterRadiusOffset, margin, fill, isInteractive, cornerRadius, borderWidth, innerRadius, getArcLabel }) {
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
      <ResponsivePie
        data={data}
        margin={margin}
        innerRadius={innerRadius}
        padAngle={2}
        cornerRadius={cornerRadius}
        activeOuterRadiusOffset={activeOuterRadiusOffset}
        borderWidth={borderWidth}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.7]],
        }}
        isInteractive={isInteractive}
        enableArcLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#000"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLinkLabel={e => {
          let name = e.id;
          if (getArcLabel) {
            name = getArcLabel(e.id);
          }
          if (showTopArcLabelCount === Infinity) {
            return `${name} (${e.value})`;
          }

          if (dataRankInfo[e.id] < showTopArcLabelCount) {
            return `${name} (${e.value})`;
          }

          return '';
        }}
        enableArcLinkLabels={tooltip}
        defs={defs}
        colors={d => {
          return d.data?.color;
        }}
        onClick={d => {
          if (onClick) {
            onClick(d);
          }
        }}
        fill={fill}
        legends={
          legend
            ? [
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
              ]
            : undefined
        }
      />
    </div>
  );
}

PieChart.defaultProps = {
  data: [],
  showTopArcLabelCount: Infinity,
  defs: [],
  onClick: null,
  legend: true,
  tooltip: true,
  activeOuterRadiusOffset: 8,
  margin: { top: 40, right: 80, bottom: 80, left: 80 },
  fill: [],
  isInteractive: true,
  cornerRadius: 10,
  borderWidth: 1,
  innerRadius: 0.5,
  getArcLabel: null,
};

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      color: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  showTopArcLabelCount: PropTypes.number,
  defs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  onClick: PropTypes.func,
  legend: PropTypes.bool,
  tooltip: PropTypes.bool,
  activeOuterRadiusOffset: PropTypes.number,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  fill: PropTypes.arrayOf(
    PropTypes.shape({
      match: PropTypes.shape({
        id: PropTypes.string,
      }),
      id: PropTypes.string,
    }),
  ),
  isInteractive: PropTypes.bool,
  cornerRadius: PropTypes.number,
  borderWidth: PropTypes.number,
  innerRadius: PropTypes.number,
  getArcLabel: PropTypes.func,
};

export default React.memo(PieChart);
