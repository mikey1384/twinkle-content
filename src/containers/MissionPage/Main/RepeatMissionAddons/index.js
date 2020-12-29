import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import GrammarReview from './GrammarReview';
import FilterBar from 'components/FilterBar';
import ErrorBoundary from 'components/ErrorBoundary';

RepeatMissionAddon.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function RepeatMissionAddon({ mission, onSetMissionState }) {
  const activeTab = useMemo(() => {
    return mission.selectedAddonTab || 'grammarReview';
  }, [mission.selectedAddonTab]);

  return (
    <div style={{ width: '100%' }}>
      {(!mission.started || mission.failed) && (
        <ErrorBoundary>
          <FilterBar style={{ marginTop: '1.5rem' }} bordered>
            <nav
              className={activeTab === 'grammarReview' ? 'active' : ''}
              onClick={() =>
                onSetMissionState({
                  missionId: mission.id,
                  newState: { selectedAddonTab: 'grammarReview' }
                })
              }
            >
              Review
            </nav>
            <nav
              className={activeTab === 'rankings' ? 'active' : ''}
              onClick={() =>
                onSetMissionState({
                  missionId: mission.id,
                  newState: { selectedAddonTab: 'rankings' }
                })
              }
            >
              Rankings
            </nav>
          </FilterBar>
          {activeTab === 'grammarReview' && (
            <GrammarReview
              mission={mission}
              onSetMissionState={onSetMissionState}
              style={{ marginTop: '1rem' }}
            />
          )}
        </ErrorBoundary>
      )}
    </div>
  );
}
