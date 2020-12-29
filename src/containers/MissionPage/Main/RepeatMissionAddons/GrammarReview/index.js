import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import QuestionListItem from './QuestionListItem';
import { useMyState } from 'helpers/hooks';
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
    requestHelpers: { loadGrammarAttempts, loadMoreGrammarAttempts }
  } = useAppContext();
  const {
    grammarReviewPrevUserId,
    grammarReviewLoaded,
    grammarReviewTab: activeTab = 'gotWrong',
    [`${activeTab}LoadMoreButtonShown`]: loadMoreButtonShown
  } = mission;
  const { userId } = useMyState();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      setLoading(true);
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
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.id, userId, grammarReviewPrevUserId]);

  useEffect(() => {
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {}, [userId]);

  return (
    <ErrorBoundary style={style}>
      {loading ? (
        <Loading />
      ) : (mission.gotWrongAttempts?.length || 0) +
          (mission.gotRightAttempts?.length || 0) ===
        0 ? null : (
        <>
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
          {mission[`${activeTab}Attempts`]?.length === 0 ? (
            <div
              style={{
                marginTop: '10rem',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                width: '100%',
                textAlign: 'center'
              }}
            >
              {activeTab === 'gotWrong'
                ? `You didn't get any question wrong`
                : `You didn't get any question right`}
            </div>
          ) : (
            <>
              {mission[`${activeTab}Attempts`]?.map((attempt, index) => {
                return (
                  <QuestionListItem
                    key={attempt.id}
                    question={mission.questionObj[attempt.rootId]}
                    style={{ marginTop: index === 0 ? 0 : '1rem' }}
                  />
                );
              })}
            </>
          )}
          {loadMoreButtonShown && (
            <LoadMoreButton
              style={{ marginTop: '2rem', fontSize: '1.7rem' }}
              filled
              color="green"
              loading={loadingMore}
              onClick={handleLoadMore}
            />
          )}
        </>
      )}
    </ErrorBoundary>
  );

  async function handleLoadMore() {
    setLoadingMore(true);
    const currentAttempts = mission[`${activeTab}Attempts`];
    const {
      questionObj,
      [`${activeTab}Attempts`]: attempts,
      loadMoreButton
    } = await loadMoreGrammarAttempts({
      activeTab,
      lastTimeStamp: currentAttempts[currentAttempts.length - 1].timeStamp
    });
    if (mounted.current) {
      onSetMissionState({
        missionId: mission.id,
        newState: {
          questionObj: {
            ...mission.questionObj,
            ...questionObj
          },
          [`${activeTab}Attempts`]: currentAttempts.concat(attempts),
          [`${activeTab}LoadMoreButtonShown`]: loadMoreButton
        }
      });
    }
    if (mounted.current) {
      setLoadingMore(false);
    }
  }
}
