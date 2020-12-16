import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

GrammarReview.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function GrammarReview({ mission, onSetMissionState, style }) {
  const { grammarReviewTab: activeTab = 'gotWrong' } = mission;
  return (
    <ErrorBoundary style={style}>
      <FilterBar
        className={css`
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.5rem;
          }
        `}
        style={{ marginTop: '1rem' }}
        bordered
      >
        <nav
          className={activeTab === 'gotWrong' ? 'active' : ''}
          onClick={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: { grammarReviewTab: 'gotWrong' }
            })
          }
        >
          Questions You Got Wrong
        </nav>
        <nav
          className={activeTab === 'gotRight' ? 'active' : ''}
          onClick={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: { grammarReviewTab: 'gotRight' }
            })
          }
        >
          Questions You Got Right
        </nav>
      </FilterBar>
      <div
        className={css`
          background: #fff;
          border-radius: ${borderRadius};
          border: 1px solid ${Color.borderGray()};
          padding: 1rem;
        `}
      >
        <div>this is grammar review</div>
      </div>
    </ErrorBoundary>
  );
}
