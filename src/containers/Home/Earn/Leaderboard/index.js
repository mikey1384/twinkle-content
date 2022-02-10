import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import localize from 'constants/localize';
import { panel } from '../Styles';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';

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
      </div>
    </ErrorBoundary>
  );
}
