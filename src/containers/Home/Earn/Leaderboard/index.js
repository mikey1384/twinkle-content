import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import localize from 'constants/localize';
import CurrentMonth from './CurrentMonth';
import { panel } from '../Styles';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';

Leaderboard.propTypes = {
  style: PropTypes.object
};

const leaderboardLabel = localize('leaderboard');
const year = (() => {
  const dt = new Date();
  const yr = dt.getFullYear();
  if (SELECTED_LANGUAGE === 'kr') {
    return `${yr}년`;
  }
  return yr;
})();

export default function Leaderboard({ style }) {
  return (
    <ErrorBoundary>
      <div style={style} className={panel}>
        <p>
          {year} {leaderboardLabel}
        </p>
        <div style={{ marginTop: '2rem' }}>
          <CurrentMonth />
          <LoadMoreButton
            style={{ fontSize: '2rem', marginTop: '1rem' }}
            label="Show All"
            transparent
            loading={false}
            onClick={() => console.log('clicked')}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
