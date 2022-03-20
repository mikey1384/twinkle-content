import React from 'react';
import PropTypes from 'prop-types';
import Progress from './Progress';

Histogram.propTypes = {
  gameStats: PropTypes.object,
  numberOfGuessesMade: PropTypes.number
};
export default function Histogram({ gameStats, numberOfGuessesMade }) {
  const winDistribution = gameStats.winDistribution;
  const maxValue = Math.max(...winDistribution);

  return (
    <div style={{ width: '100%' }}>
      {winDistribution.map((value, i) => (
        <Progress
          key={i}
          index={i}
          currentDayStatRow={numberOfGuessesMade === i + 1}
          size={90 * (value / maxValue)}
          label={String(value)}
        />
      ))}
    </div>
  );
}
