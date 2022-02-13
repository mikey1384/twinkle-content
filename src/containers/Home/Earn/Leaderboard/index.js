import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import localize from 'constants/localize';
import CurrentMonth from './CurrentMonth';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import moment from 'moment';
import { useHomeContext } from 'contexts';
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
  const leaderboardsObj = useHomeContext((v) => v.state.leaderboardsObj);
  useEffect(() => {
    const currentYear = moment().format('YYYY');
    if (!leaderboardsObj?.[currentYear]?.loaded) {
      console.log('year not loaded');
    }
  }, [leaderboardsObj]);

  const showAllButtonShown = useMemo(() => {
    return (
      leaderboardsObj?.[year]?.loaded && !leaderboardsObj?.[year]?.expanded
    );
  }, [leaderboardsObj]);

  return (
    <ErrorBoundary>
      <div style={style} className={panel}>
        <p>
          {year} {leaderboardLabel}
        </p>
        <div style={{ marginTop: '2rem' }}>
          <CurrentMonth />
          {showAllButtonShown && (
            <LoadMoreButton
              style={{ fontSize: '2rem', marginTop: '1rem' }}
              label="Show All"
              transparent
              onClick={() => console.log('clicked')}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
