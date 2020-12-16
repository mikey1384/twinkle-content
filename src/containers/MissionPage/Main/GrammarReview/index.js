import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { useAppContext } from 'contexts';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

GrammarReview.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function GrammarReview({ mission, onSetMissionState, style }) {
  const {
    requestHelpers: { loadGrammarAttempts }
  } = useAppContext();
  const { grammarReviewTab: activeTab = 'gotWrong', loadMoreButton } = mission;
  const [loading, setLoading] = useState(false);
  const [loadingMore] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      setLoading(true);
      const {
        [`${activeTab}AttemptIds`]: attemptIds,
        loadMoreButton
      } = await loadGrammarAttempts({ activeTab });
      if (mounted.current) {
        onSetMissionState({
          missionId: mission.id,
          newState: {
            [`${activeTab}AttemptIds`]: attemptIds,
            loadMoreButton
          }
        });
      }
      if (mounted.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, mission.id]);

  useEffect(() => {
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

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
      {loading ? (
        <Loading />
      ) : mission[`${activeTab}AttemptIds`]?.length === 0 ? (
        <div
          style={{
            marginTop: '10rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {`There are no ${activeTab} questions`}
        </div>
      ) : (
        <>
          {mission[`${activeTab}AttemptIds`]?.map((attemptId) => {
            return <div key={attemptId}>list item</div>;
          })}
        </>
      )}
      {loadMoreButton && (
        <LoadMoreButton
          style={{ marginTop: '2rem', fontSize: '1.7rem' }}
          filled
          color="green"
          loading={loadingMore}
          onClick={() => console.log('load more')}
        />
      )}
    </ErrorBoundary>
  );
}
