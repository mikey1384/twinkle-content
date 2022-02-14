import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import localize from 'constants/localize';
import CurrentMonth from './CurrentMonth';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import moment from 'moment';
import { useAppContext, useHomeContext } from 'contexts';
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
  const loadMonthlyLeaderboards = useAppContext(
    (v) => v.requestHelpers.loadMonthlyLeaderboards
  );
  const onLoadMonthlyLeaderboards = useHomeContext(
    (v) => v.actions.onLoadMonthlyLeaderboards
  );
  const leaderboardsObj = useHomeContext((v) => v.state.leaderboardsObj);
  useEffect(() => {
    const currentYear = moment().format('YYYY');
    if (!leaderboardsObj?.[currentYear]?.loaded) {
      handleLoadMonthlyLeaderboards();
    }

    async function handleLoadMonthlyLeaderboards() {
      const leaderboards = await loadMonthlyLeaderboards();
      onLoadMonthlyLeaderboards({ leaderboards, year });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
