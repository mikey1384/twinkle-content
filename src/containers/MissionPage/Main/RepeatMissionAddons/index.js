import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import GrammarReview from './GrammarReview';
import FilterBar from 'components/FilterBar';
import ErrorBoundary from 'components/ErrorBoundary';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

RepeatMissionAddon.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function RepeatMissionAddon({ mission, onSetMissionState }) {
  const mounted = useRef(true);
  const { userId } = useMyState();
  const {
    requestHelpers: { loadGrammarAttempts }
  } = useAppContext();
  const [loadingReview, setLoadingReview] = useState(false);
  const {
    grammarReviewPrevUserId,
    grammarReviewLoaded,
    grammarReviewTab = 'gotWrong'
  } = mission;
  const activeTab = useMemo(() => {
    return mission.selectedAddonTab || 'grammarReview';
  }, [mission.selectedAddonTab]);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      setLoadingReview(true);
      const {
        questionObj,
        gotWrongAttempts,
        gotRightAttempts,
        gotWrongLoadMoreButton,
        gotRightLoadMoreButton
      } = await loadGrammarAttempts();
      if (
        mounted.current &&
        (!grammarReviewLoaded || userId !== grammarReviewPrevUserId)
      ) {
        onSetMissionState({
          missionId: mission.id,
          newState: {
            grammarReviewPrevUserId: userId,
            grammarReviewTab:
              gotWrongAttempts.length > 0 ? 'gotWrong' : 'gotRight',
            questionObj: {
              ...mission.questionObj,
              ...questionObj
            },
            gotWrongAttempts,
            gotRightAttempts,
            gotWrongLoadMoreButtonShown: gotWrongLoadMoreButton,
            gotRightLoadMoreButtonShown: gotRightLoadMoreButton,
            grammarReviewLoaded: true
          }
        });
      }
      if (mounted.current) {
        setLoadingReview(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.id, userId, grammarReviewPrevUserId]);

  const missionAttemptExist = useMemo(() => {
    return (
      (mission.gotWrongAttempts?.length || 0) +
        (mission.gotRightAttempts?.length || 0) >
      0
    );
  }, [mission]);

  useEffect(() => {
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {(!mission.started || mission.failed) && (
        <ErrorBoundary>
          {missionAttemptExist && (
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
          )}
          {activeTab === 'grammarReview' && missionAttemptExist && (
            <GrammarReview
              activeTab={grammarReviewTab}
              loadingReview={loadingReview}
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
